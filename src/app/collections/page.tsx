// src/app/collections/page.tsx
import 'server-only';
import type { Collection } from '@/lib/data';
import CuratedCollectionCard from '@/components/CuratedCollectionCard';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';

export default async function CollectionsPage() {
  const collections: Collection[] = placeholderImages.collections;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 pb-16">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Collections</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="text-center mb-10">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Explore Our Collections</h1>
        <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
          From tranquil beach getaways to bustling city stays, find a curated collection that
          inspires your next journey.
        </p>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {collections.map((collection: Collection) => (
            <CuratedCollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Loading Collections...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
