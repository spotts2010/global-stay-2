'use server';

/**
 * @fileOverview A personalized accommodation recommendation AI agent.
 *
 * - getAccommodationRecommendations - A function that handles the accommodation recommendation process.
 * - AccommodationRecommendationsInput - The input type for the getAccommodationRecommendations function.
 * - AccommodationRecommendationsOutput - The return type for the getAccommodationRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AccommodationRecommendationsInputSchema = z.object({
  searchHistory: z
    .string()
    .describe('The user search history.'),
  preferences: z.string().describe('The user preferences.'),
});
export type AccommodationRecommendationsInput = z.infer<
  typeof AccommodationRecommendationsInputSchema
>;

const AccommodationRecommendationsOutputSchema = z.object({
  recommendations: z
    .string()
    .describe('The list of recommended accommodations.'),
});
export type AccommodationRecommendationsOutput = z.infer<
  typeof AccommodationRecommendationsOutputSchema
>;

export async function getAccommodationRecommendations(
  input: AccommodationRecommendationsInput
): Promise<AccommodationRecommendationsOutput> {
  return accommodationRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'accommodationRecommendationsPrompt',
  input: {schema: AccommodationRecommendationsInputSchema},
  output: {schema: AccommodationRecommendationsOutputSchema},
  prompt: `You are an AI expert in recommending accommodations based on user search history and preferences.

  Based on the user's search history and preferences, provide a list of recommended accommodations.

  Search History: {{{searchHistory}}}
  Preferences: {{{preferences}}}

  Return the recommendations in a clear, concise format.
  `,
});

const accommodationRecommendationsFlow = ai.defineFlow(
  {
    name: 'accommodationRecommendationsFlow',
    inputSchema: AccommodationRecommendationsInputSchema,
    outputSchema: AccommodationRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
