'use client';

import { useAuth } from '@/lib/auth';
import { getActivities } from '@/lib/firestore';
import type { Activity, DietActivity, EnergyActivity, TransportActivity } from '@/lib/types';
import { useEffect, useState } from 'react';
import { suggestPersonalizedTipsAction } from '@/actions/suggest-personalized-tips';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export function TipsDisplay() {
  const { user } = useAuth();
  const [tips, setTips] = useState<string[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [didAutoGenerate, setDidAutoGenerate] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getActivities(user.uid)
        .then(setActivities)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const generateTips = async () => {
    setIsGenerating(true);
    try {
      const summary = formatActivitiesForAI(activities);
      const result = await withTimeout(
        suggestPersonalizedTipsAction({ activitySummary: summary, randomizer: Math.random() }),
        10000
      );
      const fromFallback = (result as any)?.fromFallback === true;
      if (result?.tips && result.tips.length > 0) {
        const candidateBase = fromFallback ? shuffle(result.tips) : result.tips;
        const candidate = ensurePerceivedChange(tips, candidateBase);
        setTips(candidate);
        toast({ title: fromFallback ? 'Using general suggestions' : 'Tips updated' });
      } else {
        setTips([
          'Consider using public transit, biking, or carpooling to cut transportation emissions.',
          'Reduce electricity usage by turning off unused devices and using energy-efficient lighting.',
          'Add more plant-based meals this week to lower diet-related emissions.',
        ]);
        toast({ title: 'Using general suggestions' });
      }
    } catch (e) {
      setTips([
        'Consider using public transit, biking, or carpooling to cut transportation emissions.',
        'Reduce electricity usage by turning off unused devices and using energy-efficient lighting.',
        'Add more plant-based meals this week to lower diet-related emissions.',
      ]);
      toast({ title: 'Could not generate AI tips', description: 'Showing general suggestions.' });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!didAutoGenerate && !isLoading) {
      setDidAutoGenerate(true);
      generateTips();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities, isLoading, didAutoGenerate]);

  if (isLoading) {
    return <TipsSkeleton />;
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
        ) : tips.length === 0 ? (
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <h3 className="text-xl font-semibold">Not Enough Data</h3>
                  <p className="text-muted-foreground mt-2">Log some activities to get personalized tips, or tap Regenerate to see general suggestions.</p>
                </div>
              </CardContent>
            </Card>
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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms)),
  ]);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function areStringArraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function ensurePerceivedChange(prev: string[], next: string[]): string[] {
  if (next.length === 0) return next;
  const prevNorm = prev.map(normalize);
  const nextNorm = next.map(normalize);
  const equalOrder = areStringArraysEqual(nextNorm, prevNorm);
  const sameSet = prevNorm.length === nextNorm.length && prevNorm.every(v => nextNorm.includes(v));
  if (!equalOrder && !sameSet) return next;
  const pool = getGeneralPool().filter(s => !nextNorm.includes(normalize(s)));
  if (pool.length > 0) {
    const replaced = [...next];
    replaced[replaced.length - 1] = pool[Math.floor(Math.random() * pool.length)];
    return replaced;
  }
  return shuffle(next);
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function getGeneralPool(): string[] {
  return [
    'Consider using public transit, biking, or carpooling to cut transportation emissions.',
    'Reduce electricity usage by turning off unused devices and using energy-efficient lighting.',
    'Add more plant-based meals this week to lower diet-related emissions.',
    'Lower your thermostat by 1-2°C and wear a sweater to save energy.',
    'Wash clothes on cold and line-dry when possible to reduce drying energy.',
    'Combine errands into one trip to reduce total driving distance.',
    'Unplug chargers and electronics when not in use to prevent standby power draw.',
    'Plan a meat-free day once or twice a week to cut diet emissions.',
  ];
}
