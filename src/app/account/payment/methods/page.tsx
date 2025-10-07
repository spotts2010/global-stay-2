'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, CreditCard, FaPaypal } from '@/lib/icons';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const paymentMethods = [
  {
    id: 'visa',
    type: 'Credit Card',
    details: 'VISA **** 4242',
    icon: CreditCard,
  },
  {
    id: 'mastercard',
    type: 'Credit Card',
    details: 'Mastercard **** 5588',
    icon: CreditCard,
  },
  {
    id: 'paypal',
    type: 'PayPal',
    details: 'sam.expression@gmail.com',
    icon: FaPaypal,
  },
];

export default function PaymentMethodsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl">Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods for faster checkout.</CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Feature Coming Soon</DialogTitle>
              <DialogDescription>
                This functionality is currently under development. Please check back later.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div className="flex items-center gap-4">
              <method.icon className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-semibold">{method.type}</p>
                <p className="text-sm text-muted-foreground">{method.details}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
