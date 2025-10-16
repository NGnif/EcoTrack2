'use client';

import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp, addDoc } from 'firebase/firestore';
import type { Activity, EmissionFactors } from '@/lib/types';
import { emissionFactors } from './calculator';

// In a real app, this might fetch from Firestore: `doc(db, 'emission_factors', 'v1')`
export async function getEmissionFactors(version = 'v1'): Promise<EmissionFactors> {
  return Promise.resolve(emissionFactors);
}

export async function getActivities(userId: string): Promise<Activity[]> {
  const activitiesRef = collection(db, 'activities');
  const q = query(activitiesRef, where('userId', '==', userId), orderBy('date', 'desc'));
  
  const querySnapshot = await getDocs(q);
  const activities = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as Activity;
  });

  return activities;
}

export async function addActivity(activityData: Omit<Activity, 'id'>) {
    const activitiesRef = collection(db, 'activities');
    const docRef = await addDoc(activitiesRef, activityData);
    return docRef.id;
}
