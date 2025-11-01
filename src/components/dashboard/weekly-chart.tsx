'use client';

import { useAuth } from '@/lib/auth';
import { getActivities } from '@/lib/firestore';
import type { Activity } from '@/lib/types';
import { useEffect, useState, useMemo } from 'react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, subDays, isAfter, startOfToday, endOfToday } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import type { Timestamp } from 'firebase/firestore';

// Helper function to convert Firestore Timestamp to Date
const toDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};

export function WeeklyChart() {
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

  const chartData = useMemo(() => {
    const dataByDay: { [key: string]: { name: string; transport: number; energy: number; diet: number } } = {};
    const today = startOfToday();
    
    for (let i = 6; i >= 0; i--) {
      const day = subDays(today, i);
      const dayKey = format(day, 'yyyy-MM-dd');
      dataByDay[dayKey] = {
        name: format(day, 'EEE'),
        transport: 0,
        energy: 0,
        diet: 0,
      };
    }
    
    const sevenDaysAgo = subDays(today, 6);

    activities.forEach(activity => {
      const activityDate = toDate(activity.date);
      if (isAfter(activityDate, sevenDaysAgo) || format(activityDate, 'yyyy-MM-dd') === format(sevenDaysAgo, 'yyyy-MM-dd')) {
        const dayKey = format(activityDate, 'yyyy-MM-dd');
        if (dayKey in dataByDay) {
          dataByDay[dayKey][activity.category] += activity.co2e;
        }
      }
    });

    return Object.values(dataByDay).map(day => ({
      ...day,
      transport: parseFloat(day.transport.toFixed(2)),
      energy: parseFloat(day.energy.toFixed(2)),
      diet: parseFloat(day.diet.toFixed(2)),
    }));
  }, [activities]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Emissions</CardTitle>
        <CardDescription>Your carbon footprint over the last 7 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kg`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              cursor={{ fill: "hsl(var(--muted))" }}
            />
            <Legend />
            <Bar dataKey="transport" stackId="a" fill="hsl(var(--chart-1))" name="Transport" radius={[4, 4, 0, 0]} />
            <Bar dataKey="energy" stackId="a" fill="hsl(var(--chart-2))" name="Energy" />
            <Bar dataKey="diet" stackId="a" fill="hsl(var(--chart-3))" name="Diet" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
