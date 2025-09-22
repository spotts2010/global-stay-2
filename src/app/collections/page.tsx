'use client';

import { collections, type Collection } from '@/lib/data';
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

export default function CollectionsPage() {
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {collections.map((collection: Collection) => (
          <CuratedCollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </div>
  );
}
