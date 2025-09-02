import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bell } from 'lucide-react';

export default function MyAlertsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Bell className="h-6 w-6" />
          My Alerts
        </CardTitle>
        <CardDescription>Manage your alerts here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Alerts management will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
