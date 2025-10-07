import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText } from '@/lib/icons';

export default function SupportTicketsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            My Support Tickets
          </CardTitle>
          <CardDescription>Manage your support tickets here.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Support tickets will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
