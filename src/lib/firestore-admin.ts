'use server'

import { getFirestore } from 'firebase-admin/firestore';
import { emissionFactors as defaultEmissionFactors } from './calculator';
import type { EmissionFactors, Activity } from './types';

async function getDb() {
    return getFirestore();
}

// In a real app, this would fetch from Firestore: `doc(db, 'emission_factors', 'v1')`
export async function getEmissionFactors(version = 'v1'): Promise<EmissionFactors> {
  // For now, we return the hardcoded values.
  return Promise.resolve(defaultEmissionFactors);
}

export async function addActivity(activityData: Omit<Activity, 'id'>) {
    const db = await getDb();
    const activitiesRef = db.collection('activities');
    const docRef = await activitiesRef.add(activityData);
    return docRef.id;
}
