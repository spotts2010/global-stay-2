// src/app/api/ai/recommendations/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import {
  getAccommodationRecommendations,
  type AccommodationRecommendationsInput,
} from '@/ai/flows/accommodation-recommendations';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AccommodationRecommendationsInput;
    const result = await getAccommodationRecommendations(body);
    return NextResponse.json(result);
  } catch (error) {
    logger.error('Error in AI recommendations API route:', error);
    // Ensure a valid JSON response is sent for errors
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
