'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Database, Download, FilePen, Trash2, Settings, ChevronRight } from '@/lib/icons';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';

export default function DataManagementPage() {
  const user = {
    name: 'Sam Potts',
    email: 'sam.expression@gmail.com',
    phone: '+61 0403688874',
    address: '2403/100 Duporth Avenue, Maroochydore QLD, Australia',
  };

  const bookings = [
    { id: 1, property: 'The Oceanfront Pearl', dates: '15/10/2024 - 20/10/2024' },
    { id: 2, property: 'Downtown Artist Loft', dates: '12/11/2024 - 15/11/2024' },
  ];

  const paymentMethods = [{ id: 1, method: 'VISA **** 4242' }];

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Data Management
          </CardTitle>
          <CardDescription>
            This page lets you view, update, and manage the personal information collected by Global
            Stay. You can control your data and manage your consent preferences in accordance with
            the Australian Privacy Principles.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full space-y-4">
          <AccordionItem
            value="access"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Access & Review Your Data
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <Separator className="mb-4" />
              <div className="space-y-2">
                <h4 className="font-semibold">Personal Details</h4>
                <p className="text-sm text-muted-foreground">Name: {user.name}</p>
                <p className="text-sm text-muted-foreground">Email: {user.email}</p>
                <p className="text-sm text-muted-foreground">Phone: {user.phone}</p>
                <p className="text-sm text-muted-foreground">Address: {user.address}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Booking History</h4>
                {bookings.map((booking) => (
                  <p key={booking.id} className="text-sm text-muted-foreground">
                    - {booking.property} ({booking.dates})
                  </p>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-semibold">Payment Information</h4>
                {paymentMethods.map((method) => (
                  <p key={method.id} className="text-sm text-muted-foreground">
                    - {method.method}
                  </p>
                ))}
              </div>
              <Button disabled className="mt-4">
                <Download className="mr-2 h-4 w-4" />
                Download My Data (Coming Soon)
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="update"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Update & Correct Your Data
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <Separator className="mb-4" />
              <p className="text-sm text-muted-foreground">
                You can update your personal information and communication preferences in the
                following sections:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline">
                  <Link href="/account/profile">
                    <FilePen className="mr-2 h-4 w-4" />
                    Update Personal Details
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/account/notifications/manage">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Preferences
                  </Link>
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="consent"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Manage Consent & Marketing
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <Separator className="mb-4" />
              <p className="text-sm text-muted-foreground">
                Control which communications you receive from us. You can opt-out of marketing and
                promotional content at any time.
              </p>
              <Button asChild>
                <Link href="/account/notifications/manage">
                  Manage Notification Settings
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem
            value="delete"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline text-destructive">
              Request Data Deletion
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              <Separator className="mb-4" />
              <p className="text-sm text-muted-foreground">
                You can request the permanent deletion of your account and personal data. Please be
                aware that this action cannot be undone. For legal and operational reasons, some
                anonymized data (like transaction history) may be retained.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Request Account Deletion
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is permanent and cannot be undone. Your account, personal details,
                      and booking history will be permanently deleted from our systems.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Yes, Delete My Account</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          All data requests are reviewed and responded to within 30 days. For any privacy-specific
          concerns, please contact our Privacy Officer at privacy@globalstay.com.
        </p>
      </CardFooter>
    </Card>
  );
}
