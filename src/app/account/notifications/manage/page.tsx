import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Cog } from 'lucide-react';

export default function ManageNotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Cog className="h-6 w-6" />
          Manage Notifications
        </CardTitle>
        <CardDescription>Manage your notification settings here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Notification management will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
