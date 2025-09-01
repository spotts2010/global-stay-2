import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SupportTicketsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Support Tickets</CardTitle>
        <CardDescription>Manage your support tickets here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Support tickets will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
