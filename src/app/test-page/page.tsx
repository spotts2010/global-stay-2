import TestSearchWrapper from '@/components/TestSearchWrapper';

export default function TestPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-16">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-8 text-center">Test Page</h1>
      {/* Render the client-only dynamic component safely */}
      <TestSearchWrapper />
    </div>
  );
}
