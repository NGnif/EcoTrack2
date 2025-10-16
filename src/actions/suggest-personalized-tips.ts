'use server';

import type { SuggestPersonalizedTipsInput, SuggestPersonalizedTipsOutput } from '@/ai/flows/suggest-personalized-tips';

// Server Action wrapper callable from Client Components
export async function suggestPersonalizedTipsAction(
  input: SuggestPersonalizedTipsInput
): Promise<SuggestPersonalizedTipsOutput> {
  'use server';
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
      tips: [
        'Consider using public transit, biking, or carpooling to cut transportation emissions.',
        'Reduce electricity usage by turning off unused devices and using energy-efficient lighting.',
        'Add more plant-based meals this week to lower diet-related emissions.',
      ],
    };
  }
}
