import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local' });

// This now imports all flows and sets up Genkit
import '@/ai/flows/accommodation-recommendations';
