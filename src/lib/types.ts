import type { Timestamp } from 'firebase/firestore';

export type UserProfile = {
  uid: string;
  email: string | null;
  name: string | null;
};

export type ActivityCategory = 'transport' | 'energy' | 'diet';

export interface BaseActivity {
  id?: string;
  userId: string;
  date: Timestamp;
  category: ActivityCategory;
  co2e: number;
}

export interface TransportActivity extends BaseActivity {
  category: 'transport';
  mode: 'car' | 'bus' | 'train' | 'bike' | 'walk';
  distance: number; // in km
}

export interface EnergyActivity extends BaseActivity {
  category: 'energy';
  electricity: number; // in kWh
  naturalGas?: number; // in m³
}

export interface DietActivity extends BaseActivity {
  category: 'diet';
  beef: number;
  chicken: number;
  vegetarian: number;
}

export type Activity = TransportActivity | EnergyActivity | DietActivity;

export type EmissionFactors = {
  version: string;
  transport: {
    car: number; // kg CO2e per km
    bus: number;
    train: number;
    bike: number;
    walk: number;
  };
  energy: {
    electricity: number; // kg CO2e per kWh
    naturalGas: number; // kg CO2e per m³
  };
  diet: {
    beef: number; // kg CO2e per serving
    chicken: number;
    vegetarian: number;
  };
};
