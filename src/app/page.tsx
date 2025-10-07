// src/app/page.tsx
import 'server-only';
import HomeContent from '@/components/HomeContent';

// This is now a SERVER component responsible for data fetching.
export default async function Home() {
  // The actual data fetching will now be handled inside the Client Component
  // to avoid context errors during Server-Side Rendering.
  return <HomeContent />;
}
