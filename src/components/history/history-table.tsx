'use client';

import { useAuth } from '@/lib/auth';
import { getActivities } from '@/lib/firestore';
import type { Activity, TransportActivity, EnergyActivity, DietActivity } from '@/lib/types';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { format } from 'date-fns';
import { Badge } from '../ui/badge';
import { Car, Zap, Leaf } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

const categoryDetails = {
  transport: {
    icon: Car,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  energy: {
    icon: Zap,
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  diet: {
    icon: Leaf,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  }
}

// Helper function to convert Firestore Timestamp to Date
const toDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export function HistoryTable() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const fetchActivities = async () => {
          const acts = await getActivities(user.uid);
          setActivities(acts);
          setIsLoading(false);
      }
      fetchActivities();
    }
  }, [user]);

  const renderActivityDetails = (activity: Activity) => {
    switch (activity.category) {
      case 'transport':
        return `${(activity as TransportActivity).mode} - ${(activity as TransportActivity).distance} km`;
      case 'energy':
        const energyActivity = activity as EnergyActivity;
        return `${energyActivity.electricity} kWh Elec. ${energyActivity.naturalGas ? ` / ${energyActivity.naturalGas} m³ Gas` : ''}`;
      case 'diet':
        const dietActivity = activity as DietActivity;
        const details = [];
        if (dietActivity.beef > 0) details.push(`Beef: ${dietActivity.beef}`);
        if (dietActivity.chicken > 0) details.push(`Chicken: ${dietActivity.chicken}`);
        if (dietActivity.vegetarian > 0) details.push(`Veg: ${dietActivity.vegetarian}`);
        return details.join(', ') || 'No servings logged';
      default:
        return 'N/A';
    }
  };

  if (isLoading) {
    return (
        <Card>
            <CardContent className='pt-6'>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <h3 className="text-xl font-semibold">No Activities Logged Yet</h3>
            <p className="text-muted-foreground mt-2">Start by logging an activity to see your history here.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
        <CardContent className="pt-0">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">CO₂e (kg)</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {activities.map((activity) => {
                    const details = categoryDetails[activity.category];
                    const Icon = details.icon;
                    return (
                        <TableRow key={activity.id}>
                            <TableCell>
                                <Badge variant="outline" className={`capitalize ${details.color} border-0`}>
                                    <Icon className="mr-2 h-4 w-4" />
                                    {activity.category}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{renderActivityDetails(activity)}</TableCell>
                            <TableCell>{format(toDate(activity.date), 'PPP')}</TableCell>
                            <TableCell className="text-right font-medium">{activity.co2e.toFixed(2)}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
