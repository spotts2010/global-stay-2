// src/app/admin/(listings)/listings/[id]/page.tsx -> src/app/admin/listings/[id]/page.tsx
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function EditListingPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">Edit Listing: 1849 Backpackers</h1>
          <p className="text-sm text-muted-foreground">
            Update the details for this accommodation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Status: Published
          </Badge>
          <Button asChild variant="outline">
            <Link href="/admin/listings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Link>
          </Button>
        </div>
      </div>
      <PropertyForm />
    </div>
  );
}
