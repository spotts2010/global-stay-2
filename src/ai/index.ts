// src/ai/index.ts
/**
 * @fileOverview Barrel file for AI flows, providing a safe entry point for client components.
 */
import '@/ai/genkit';
// Export types for client-side use, but not the functions themselves.
export type {
  AccommodationRecommendationsInput,
  AccommodationRecommendationsOutput,
} from './flows/accommodation-recommendations';
