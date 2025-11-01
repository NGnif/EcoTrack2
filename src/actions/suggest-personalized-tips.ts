'use server';

import type { SuggestPersonalizedTipsInput, SuggestPersonalizedTipsOutput } from '@/ai/flows/suggest-personalized-tips';

type TipsOutput = SuggestPersonalizedTipsOutput & { fromFallback?: boolean };

const GENERAL_TIPS_POOL = [
  'Consider using public transit, biking, or carpooling to cut transportation emissions.',
  'Reduce electricity usage by turning off unused devices and using energy-efficient lighting.',
  'Add more plant-based meals this week to lower diet-related emissions.',
  'Lower your thermostat by 1-2°C and wear a sweater to save energy.',
  'Wash clothes on cold and line-dry when possible to reduce drying energy.',
  'Combine errands into one trip to reduce total driving distance.',
  'Unplug chargers and electronics when not in use to prevent standby power draw.',
  'Plan a meat-free day once or twice a week to cut diet emissions.',
];

function randomFallbackTips(count = 3): string[] {
  const shuffled = [...GENERAL_TIPS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Server Action wrapper callable from Client Components
export async function suggestPersonalizedTipsAction(
  input: SuggestPersonalizedTipsInput
): Promise<TipsOutput> {
  const aiKey = process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!aiKey) {
    return {
      tips: randomFallbackTips(),
      fromFallback: true,
    };
  }
  try {
    const { suggestPersonalizedTips: runFlow } = await import('@/ai/flows/suggest-personalized-tips');
    const res = await runFlow(input);
    if (!res || !Array.isArray(res.tips)) {
      throw new Error('Invalid response from AI flow');
    }
    return res;
  } catch (err) {
    // Fallback tips if AI call fails (e.g., missing GOOGLE_AI_API_KEY)
    return {
      tips: randomFallbackTips(),
      fromFallback: true,
    };
  }
}
