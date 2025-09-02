
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function MyAlertsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Bell className="h-6 w-6 text-primary" />
          My Alerts
        </CardTitle>
        <CardDescription>
          Manage your custom alerts for price drops, special offers, and more.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>You haven't set up any custom alerts yet.</p>
        </div>
      </CardContent>
    </Card>
  );
}
