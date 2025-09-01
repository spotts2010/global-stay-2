import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TravelPartnersPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Travel Partners</CardTitle>
        <CardDescription>Manage your travel partners here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Travel partners will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
