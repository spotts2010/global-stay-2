// src/app/actions/ai-actions.ts
'use server';

import {
  getAccommodationRecommendations,
  type AccommodationRecommendationsInput,
  type AccommodationRecommendationsOutput,
} from '@/ai/flows/accommodation-recommendations';
import { logger } from '@/lib/logger';

// This server action is now in its own file to create a clear boundary for the Next.js bundler.
// It can be safely imported into client components.
export async function handleGetRecommendations(
  input: AccommodationRecommendationsInput
): Promise<AccommodationRecommendationsOutput | { error: string }> {
  try {
    const result = await getAccommodationRecommendations(input);
    return result;
  } catch (error) {
    logger.error('Error getting recommendations:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}
