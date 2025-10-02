// src/app/admin/property-types/page.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';

export default function PropertyTypesPage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5 text-primary" />
            Property Types
          </CardTitle>
          <CardDescription>
            View and manage the available types of properties (e.g., Hotel, Villa).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg">
            <p>Property type management will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
