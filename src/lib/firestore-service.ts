'use client';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Activity } from '@/lib/types';
import { calculateCo2e, emissionFactors } from '@/lib/calculator';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { seedData } from '@/lib/seed-data';

type ClientTransport = { category: 'transport'; mode: 'car' | 'bus' | 'train' | 'bike' | 'walk'; distance: number };
type ClientEnergy = { category: 'energy'; electricity: number; naturalGas?: number };
type ClientDiet = { category: 'diet'; beef: number; chicken: number; vegetarian: number };
type ClientActivity = ClientTransport | ClientEnergy | ClientDiet;

export async function addActivity(
  userId: string,
  activityData: ClientActivity
) {
  const activityDataForCalc = { ...activityData } as any;

  if (activityData.category === 'energy' && !activityData.naturalGas) {
    activityDataForCalc.naturalGas = 0;
  }
  if (activityData.category === 'diet') {
    const { beef, chicken, vegetarian, category } = activityData;
    const servings = {
      beef: beef || 0,
      chicken: chicken || 0,
      vegetarian: vegetarian || 0,
    };
    activityDataForCalc.servings = servings;
  }

  const co2e = calculateCo2e(activityDataForCalc, emissionFactors);

  const finalData: any = {
    userId,
    co2e,
    date: serverTimestamp(),
    ...activityData,
  };

  const activitiesRef = collection(db, 'activities');
  try {
    const docRef = await addDoc(activitiesRef, finalData);
    return docRef.id;
  } catch (serverError) {
    const permissionError = new FirestorePermissionError({
      path: activitiesRef.path,
      operation: 'create',
      requestResourceData: finalData,
    });
    errorEmitter.emit('permission-error', permissionError);
    throw serverError;
  }
}

export async function seedActivities(userId: string) {
    const activitiesCollection = collection(db, "activities");

    const promises = seedData.map((activity) => {
        const activityDataForCalc = { ...activity } as any;
        if (activity.category === 'diet') {
            const { beef, chicken, vegetarian, category } = activity;
            activityDataForCalc.servings = { beef, chicken, vegetarian };
        }
        
        const co2e = calculateCo2e(activityDataForCalc, emissionFactors);

        const finalData = {
            ...activity,
            userId,
            co2e,
            date: Timestamp.fromDate(activity.date), // Use the date from seed data
        };
        
        return addDoc(activitiesCollection, finalData);
    });

    try {
        await Promise.all(promises);
    } catch(serverError) {
        const permissionError = new FirestorePermissionError({
            path: 'activities',
            operation: 'create',
            requestResourceData: "Seeding data failed during write operations.",
        });
        errorEmitter.emit('permission-error', permissionError);
    }
}
