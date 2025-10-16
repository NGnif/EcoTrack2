import type { Activity, EmissionFactors } from './types';

// Hardcoded emission factors as a fallback/default.
// In a real application, these would be fetched from Firestore.
export const emissionFactors: EmissionFactors = {
  version: 'v1',
  transport: {
    car: 0.17, // kg CO2e per km (petrol car)
    bus: 0.08,
    train: 0.04,
    bike: 0,
    walk: 0,
  },
  energy: {
    electricity: 0.233, // kg CO2e per kWh (example: UK grid)
    naturalGas: 2.05, // kg CO2e per m³
  },
  diet: {
    beef: 14, // kg CO2e per serving (approx. 100g)
    chicken: 3.5,
    vegetarian: 1,
  },
};

export function calculateCo2e(
  activity: Omit<Activity, 'id' | 'co2e' | 'date'>,
  factors: EmissionFactors
): number {
  let co2e = 0;

  switch (activity.category) {
    case 'transport':
      co2e = activity.distance * (factors.transport[activity.mode] || 0);
      break;
    case 'energy':
      co2e += activity.electricity * factors.energy.electricity;
      if (activity.naturalGas) {
        co2e += activity.naturalGas * factors.energy.naturalGas;
      }
      break;
    case 'diet':
      co2e += activity.servings.beef * factors.diet.beef;
      co2e += activity.servings.chicken * factors.diet.chicken;
      co2e += activity.servings.vegetarian * factors.diet.vegetarian;
      break;
  }

  // Return rounded to 3 decimal places
  return Math.round(co2e * 1000) / 1000;
}
