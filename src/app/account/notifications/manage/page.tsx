'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ListChecks } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const notificationSettings = [
  {
    id: 'system',
    title: 'System & Account Alerts',
    description: 'Required security and account status notifications.',
    inApp: { checked: true, disabled: true },
    email: { checked: true, disabled: true },
    push: { checked: false, disabled: false },
    sms: { checked: false, disabled: false },
  },
  {
    id: 'bookings',
    title: 'Booking Updates',
    description: 'Alerts for confirmations, changes, and reminders.',
    inApp: { checked: true, disabled: false },
    email: { checked: true, disabled: false },
    push: { checked: true, disabled: false },
    sms: { checked: true, disabled: false },
  },
  {
    id: 'promos',
    title: 'Promotions & Offers',
    description: 'Special deals and discounts from us and our partners.',
    inApp: { checked: true, disabled: false },
    email: { checked: true, disabled: false },
    push: { checked: false, disabled: false },
    sms: { checked: false, disabled: false },
  },
  {
    id: 'suggestions',
    title: 'Smart Suggestions',
    description: 'Personalized stay recommendations and travel tips.',
    inApp: { checked: true, disabled: false },
    email: { checked: true, disabled: false },
    push: { checked: true, disabled: false },
    sms: { checked: false, disabled: false },
  },
  {
    id: 'partner',
    title: 'Travel Partner Requests',
    description: 'Notifications about travel partner invitations.',
    inApp: { checked: true, disabled: false },
    email: { checked: true, disabled: false },
    push: { checked: true, disabled: false },
    sms: { checked: false, disabled: false },
  },
];

export default function ManageNotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ListChecks className="h-6 w-6 text-primary" />
            Manage Notifications
          </CardTitle>
          <CardDescription>
            Choose what you want to be notified about and how you receive notifications.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold w-[40%]">Notification Type</TableHead>
                <TableHead className="font-bold text-center w-[15%]">In-App</TableHead>
                <TableHead className="font-bold text-center w-[15%]">Email</TableHead>
                <TableHead className="font-bold text-center w-[15%]">Push</TableHead>
                <TableHead className="font-bold text-center w-[15%]">SMS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notificationSettings.map((setting) => (
                <TableRow key={setting.id}>
                  <TableCell>
                    <p className="font-medium">{setting.title}</p>
                    <p className="text-xs text-muted-foreground">{setting.description}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      defaultChecked={setting.inApp.checked}
                      disabled={setting.inApp.disabled}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      defaultChecked={setting.email.checked}
                      disabled={setting.email.disabled}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      defaultChecked={setting.push.checked}
                      disabled={setting.push.disabled}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Checkbox
                      defaultChecked={setting.sms.checked}
                      disabled={setting.sms.disabled}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button>Save Preferences</Button>
        <Button variant="destructive">Unsubscribe from All Notifications</Button>
      </CardFooter>
    </Card>
  );
}
