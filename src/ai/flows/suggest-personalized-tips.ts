'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting personalized tips to users on how to reduce their carbon footprint.
 *
 * - suggestPersonalizedTips - A function that generates personalized tips based on user activities and CO2e emissions.
 * - SuggestPersonalizedTipsInput - The input type for the suggestPersonalizedTips function.
 * - SuggestPersonalizedTipsOutput - The return type for the suggestPersonalizedTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPersonalizedTipsInputSchema = z.object({
  activitySummary: z
    .string()
    .describe(
      'A summary of the user\'s recent activities, including transport, energy consumption, and diet, with calculated CO2e emissions for each category.'
    ),
  randomizer: z.number().optional(),
});
export type SuggestPersonalizedTipsInput = z.infer<typeof SuggestPersonalizedTipsInputSchema>;

const SuggestPersonalizedTipsOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe(
      'An array of personalized tips for the user to reduce their carbon footprint, based on their recent activities.'
    ),
});
export type SuggestPersonalizedTipsOutput = z.infer<typeof SuggestPersonalizedTipsOutputSchema>;

export async function suggestPersonalizedTips(
  input: SuggestPersonalizedTipsInput
): Promise<SuggestPersonalizedTipsOutput> {
  return suggestPersonalizedTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPersonalizedTipsPrompt',
  input: {schema: SuggestPersonalizedTipsInputSchema},
  output: {schema: SuggestPersonalizedTipsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized tips to users on how to reduce their carbon footprint.

  Based on the following summary of the user's recent activities and their calculated CO2e emissions, provide 3 specific and actionable tips for the user to reduce their carbon footprint. Be specific, give concrete suggestions, and be encouraging.

  Activity Summary: {{{activitySummary}}}
  Regeneration Hint: {{{randomizer}}}

  Tips:
  `,
});

const suggestPersonalizedTipsFlow = ai.defineFlow(
  {
    name: 'suggestPersonalizedTipsFlow',
    inputSchema: SuggestPersonalizedTipsInputSchema,
    outputSchema: SuggestPersonalizedTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
