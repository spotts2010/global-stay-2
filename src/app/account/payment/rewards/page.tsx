import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function RewardsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Rewards</CardTitle>
        <CardDescription>View your rewards and points here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Rewards will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
