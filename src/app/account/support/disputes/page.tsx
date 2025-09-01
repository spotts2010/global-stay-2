import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DisputeResolutionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Dispute Resolution</CardTitle>
        <CardDescription>Manage your dispute resolutions here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Dispute resolutions will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
