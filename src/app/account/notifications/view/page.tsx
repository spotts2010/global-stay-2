import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageSquareWarning } from 'lucide-react';

export default function ViewNotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <MessageSquareWarning className="h-6 w-6" />
          View Notifications
        </CardTitle>
        <CardDescription>View your account notifications here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>You have no new notifications.</p>
        </div>
      </CardContent>
    </Card>
  );
}
