import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PaymentMethodsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Payment Methods</CardTitle>
        <CardDescription>Manage your payment methods here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Payment methods will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
