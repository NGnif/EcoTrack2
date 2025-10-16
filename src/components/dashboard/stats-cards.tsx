'use client';

import { useAuth } from '@/lib/auth';
import { getActivities } from '@/lib/firestore';
import type { Activity } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Car, Leaf, Zap, TrendingUp, TrendingDown, Pencil } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

const categoryIcons = {
  transport: <Car className="h-6 w-6 text-muted-foreground" />,
  energy: <Zap className="h-6 w-6 text-muted-foreground" />,
  diet: <Leaf className="h-6 w-6 text-muted-foreground" />,
};

// Helper function to convert Firestore Timestamp to Date
const toDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export function StatsCards() {
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

  const stats = useMemo(() => {
    const now = new Date();
    const last7DaysActivities = activities.filter(
      (a) => differenceInDays(now, toDate(a.date)) < 7
    );
    const prev7DaysActivities = activities.filter(
      (a) => differenceInDays(now, toDate(a.date)) >= 7 && differenceInDays(now, toDate(a.date)) < 14
    );

    const totalLast7Days = last7DaysActivities.reduce((sum, a) => sum + a.co2e, 0);
    const totalPrev7Days = prev7DaysActivities.reduce((sum, a) => sum + a.co2e, 0);

    let weeklyChange = 0;
    if (totalPrev7Days > 0) {
      weeklyChange = ((totalLast7Days - totalPrev7Days) / totalPrev7Days) * 100;
    } else if (totalLast7Days > 0) {
      weeklyChange = 100;
    }

    const categoryTotals = last7DaysActivities.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] || 0) + a.co2e;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0];

    return {
      totalEmissions: totalLast7Days,
      weeklyChange,
      topCategory: topCategory ? { name: topCategory[0], value: topCategory[1] } : null,
      totalLogs: last7DaysActivities.length,
    };
  }, [activities]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
        <Skeleton className="h-36" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Emissions (Last 7 Days)</CardTitle>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M21.54 15H17l-2 2-4-4-4 4-2-2H2.46" /></svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEmissions.toFixed(2)} kg CO₂e</div>
          <p className="text-xs text-muted-foreground">Total emissions from your activities</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Weekly Change</CardTitle>
          {stats.weeklyChange >= 0 ? <TrendingUp className="h-4 w-4 text-destructive" /> : <TrendingDown className="h-4 w-4 text-primary" />}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.weeklyChange >= 0 ? 'text-destructive' : 'text-primary'}`}>
            {stats.weeklyChange >= 0 ? '+' : ''}{stats.weeklyChange.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">Compared to previous 7 days</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          {stats.topCategory && categoryIcons[stats.topCategory.name as keyof typeof categoryIcons]}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold capitalize">{stats.topCategory?.name || 'N/A'}</div>
          <p className="text-xs text-muted-foreground">
            {stats.topCategory ? `${stats.topCategory.value.toFixed(2)} kg CO₂e this week` : 'No activity logged'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Activities Logged</CardTitle>
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{stats.totalLogs}</div>
          <p className="text-xs text-muted-foreground">In the last 7 days</p>
        </CardContent>
      </Card>
    </div>
  );
}
