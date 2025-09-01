import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CouponsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Coupons & Credits</CardTitle>
        <CardDescription>Manage your coupons and credits here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Coupons and credits will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
