'use client';

import { useAuth } from '@/lib/auth';
import { getActivities } from '@/lib/firestore';
import type { Activity, DietActivity, EnergyActivity, TransportActivity } from '@/lib/types';
import { useEffect, useState, useTransition } from 'react';
import { suggestPersonalizedTipsAction } from '@/actions/suggest-personalized-tips';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

export function TipsDisplay() {
  const { user } = useAuth();
  const [tips, setTips] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, startTransition] = useTransition();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getActivities(user.uid)
        .then(setActivities)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const generateTips = () => {
    startTransition(async () => {
      if (activities.length === 0) return;

      const summary = formatActivitiesForAI(activities);
      const result = await suggestPersonalizedTipsAction({ activitySummary: summary });
      if (result?.tips) {
        setTips(result.tips);
      }
    });
  };

  useEffect(() => {
    if(activities.length > 0) {
        generateTips();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  if (isLoading) {
    return <TipsSkeleton />;
  }

  if (activities.length === 0 && !isGenerating) {
    return (
       <Card className="mt-4">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <h3 className="text-xl font-semibold">Not Enough Data</h3>
            <p className="text-muted-foreground mt-2">Log some activities first to get personalized tips.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div>
        <div className="flex justify-end mb-4">
            <Button onClick={generateTips} disabled={isGenerating}>
                {isGenerating ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Regenerating...
                    </>
                ) : (
                    'Regenerate Tips'
                )}
            </Button>
        </div>
        {isGenerating && tips.length === 0 ? (
            <TipsSkeleton />
        ) : (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                {tips.map((tip, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <div className="flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <Lightbulb className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <CardTitle>Tip #{index + 1}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground">{tip}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
    </div>
  );
}

function TipsSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 mt-10">
            {[...Array(3)].map((_, i) => (
                 <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-1/4" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

function formatActivitiesForAI(activities: Activity[]): string {
  const recentActivities = activities.slice(0, 15); // Limit to most recent 15
  if(recentActivities.length === 0) return "No activities logged recently.";

  const summaryLines = recentActivities.map(activity => {
    switch(activity.category) {
      case 'transport':
        const ta = activity as TransportActivity;
        return `- Transport: Traveled ${ta.distance} km by ${ta.mode}. CO2e: ${ta.co2e.toFixed(2)} kg.`;
      case 'energy':
        const ea = activity as EnergyActivity;
        return `- Energy: Used ${ea.electricity} kWh of electricity and ${ea.naturalGas || 0} m³ of natural gas. CO2e: ${ea.co2e.toFixed(2)} kg.`;
      case 'diet':
        const da = activity as DietActivity;
        return `- Diet: Ate ${da.beef || 0} servings of beef, ${da.chicken || 0} of chicken, and ${da.vegetarian || 0} vegetarian. CO2e: ${da.co2e.toFixed(2)} kg.`;
      default:
        return '';
    }
  });

  return `User's recent activities:\n${summaryLines.join('\n')}`;
}
