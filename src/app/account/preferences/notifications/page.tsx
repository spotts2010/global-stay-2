import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function NotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Notifications & Alerts</CardTitle>
        <CardDescription>Manage your notification and alert preferences here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Notification and alert preferences will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
