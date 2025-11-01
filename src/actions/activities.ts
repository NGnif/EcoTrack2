'use server';

import { z } from 'zod';
import { auth } from 'firebase-admin';
import { addActivity, getEmissionFactors } from '@/lib/firestore-admin'; // Use admin version
import { calculateCo2e } from '@/lib/calculator';
import { Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import {getApps, initializeApp} from "firebase-admin/app";
import { credential } from 'firebase-admin';

// Create a separate file for admin firestore operations if it doesn't exist
// to avoid 'use client'/'use server' conflicts.
// For now, we assume getEmissionFactors can be server-side.
// We will create a firestore-admin.ts for addActivity.

const transportSchema = z.object({
  category: z.literal('transport'),
  mode: z.enum(['car', 'bus', 'train', 'bike', 'walk']),
  distance: z.coerce.number().min(0.1, 'Distance must be positive'),
});

const energySchema = z.object({
  category: z.literal('energy'),
  electricity: z.coerce.number().min(0, 'Electricity usage cannot be negative'),
  naturalGas: z.coerce.number().min(0, 'Natural gas usage cannot be negative').optional(),
});

const dietSchema = z.object({
  category: z.literal('diet'),
  beef: z.coerce.number().min(0, 'Beef servings cannot be negative'),
  chicken: z.coerce.number().min(0, 'Chicken servings cannot be negative'),
  vegetarian: z.coerce.number().min(0, 'Vegetarian servings cannot be negative'),
});

const activitySchema = z.discriminatedUnion('category', [
  transportSchema,
  energySchema,
  dietSchema,
]);

const actionSchema = z.object({
    activity: activitySchema,
    idToken: z.string(),
});

export async function logActivityAction(data: z.infer<typeof actionSchema>) {
    if (getApps().length === 0) {
       initializeApp({
            credential: credential.applicationDefault(),
       });
    }

    try {
        const decodedToken = await auth().verifyIdToken(data.idToken);
        const userId = decodedToken.uid;
        
        if (!userId) {
             return { success: false, error: 'You must be logged in to perform this action.' };
        }

        const validation = activitySchema.safeParse(data.activity);
        if (!validation.success) {
            return { success: false, error: 'Invalid data provided.' };
        }

        const validatedData = validation.data;
        const factors = await getEmissionFactors();

        let activityDataForDb: any;
        let activityDataForCalc: any;

        switch(validatedData.category) {
            case 'transport':
                activityDataForCalc = validatedData;
                activityDataForDb = validatedData;
                break;
            case 'energy':
                 activityDataForCalc = {
                    ...validatedData,
                    naturalGas: validatedData.naturalGas || 0
                };
                activityDataForDb = activityDataForCalc;
                break;
            case 'diet':
                const { beef, chicken, vegetarian, category } = validatedData;
                const servings = { beef: beef || 0, chicken: chicken || 0, vegetarian: vegetarian || 0 };
                // The calculator expects servings nested
                activityDataForCalc = { category, servings }; 
                // The database stores it flat
                activityDataForDb = { category, ...servings };
                break;
        }

        const co2e = calculateCo2e(activityDataForCalc, factors);

        if (isNaN(co2e)) {
            console.error("CO2e calculation resulted in NaN", { activityDataForCalc, factors });
            return { success: false, error: 'Failed to calculate CO2e. Invalid data.' };
        }

        const finalData = {
            userId,
            date: Timestamp.now(),
            co2e,
            ...activityDataForDb,
        };
        
        await addActivity(finalData);
        
        revalidatePath('/dashboard');
        revalidatePath('/history');
        
        return { success: true };
    } catch(error) {
        console.error("Error logging activity:", error);
        if ((error as any).code === 'auth/id-token-expired') {
            return { success: false, error: 'Your session has expired. Please log in again.' };
        }
        return { success: false, error: 'Failed to log activity.' };
    }
}
