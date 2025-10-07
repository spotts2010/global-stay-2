import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Forum } from '@/lib/icons';

export default function DisputeResolutionPage() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Forum className="h-6 w-6 text-primary" />
            Dispute Resolution
          </CardTitle>
          <CardDescription>Manage your dispute resolutions here.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Dispute resolutions will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
