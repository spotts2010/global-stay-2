// src/app/page.tsx
import 'server-only';
import HomeContent from '@/components/HomeContent';

// This is now a SERVER component that passes initial data to the client.
export default async function Home() {
  // All data fetching is now handled within HomeContent to ensure
  // it runs on the client-side, avoiding context-related hydration errors.
  return <HomeContent />;
}
