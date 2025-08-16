import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';

export default function PaymentPage() {
  // Placeholder for payment processing logic
  const handlePayment = (event: React.FormEvent) => {
    event.preventDefault();
    // Here you would integrate with a payment provider like Stripe
    // For example, by calling `processPayment` from `src/lib/processPayment.ts`
    alert('Payment submitted (placeholder). See console for details.');
    console.log('Processing payment...');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 max-w-lg pb-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Complete Your Payment</CardTitle>
          <CardDescription>
            Enter your payment information to finalize your booking.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <div className="relative">
                <Input id="card-number" placeholder="•••• •••• •••• ••••" required />
                <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input id="expiry-date" placeholder="MM / YY" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="•••" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name-on-card">Name on Card</Label>
              <Input id="name-on-card" placeholder="John Doe" required />
            </div>

            <Button type="submit" className="w-full text-lg" size="lg">
              Pay $XXX.XX
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Powered by Stripe. Your payment is secure.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
