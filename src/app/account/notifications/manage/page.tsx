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
import { ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const NotificationSettingRow = ({
  id,
  title,
  description,
  defaultChecked = false,
  disabled = false,
}: {
  id: string;
  title: string;
  description: string;
  defaultChecked?: boolean;
  disabled?: boolean;
}) => (
  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
    <div className="space-y-0.5">
      <Label htmlFor={id} className="text-base font-medium">
        {title}
      </Label>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <Switch id={id} defaultChecked={defaultChecked} disabled={disabled} />
  </div>
);

export default function ManageNotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <ListChecks className="h-6 w-6 text-primary" />
          Manage Notifications
        </CardTitle>
        <CardDescription>
          Choose what you want to be notified about and how you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* --- Push Notifications Section --- */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Push Notifications</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Receive updates directly on your device.
          </p>
          <div className="space-y-4">
            <NotificationSettingRow
              id="push-system"
              title="System & Account Alerts"
              description="Required security and account status notifications."
              defaultChecked
              disabled
            />
            <NotificationSettingRow
              id="push-bookings"
              title="Booking Updates"
              description="Get alerts for confirmations, changes, and reminders."
              defaultChecked
            />
            <NotificationSettingRow
              id="push-promos"
              title="Promotions & Offers"
              description="Receive notifications about special deals and discounts."
            />
            <NotificationSettingRow
              id="push-suggestions"
              title="Smart Suggestions"
              description="Get personalized stay recommendations."
              defaultChecked
            />
          </div>
        </div>

        <Separator />

        {/* --- Email Marketing Section --- */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Email Marketing</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Receive emails about news, offers, and more from Global Stay 2.0.
          </p>
          <div className="space-y-4">
            <NotificationSettingRow
              id="email-promos"
              title="Promotional Emails"
              description="Stay up-to-date with our latest offers and sales."
              defaultChecked
            />
            <NotificationSettingRow
              id="email-partners"
              title="Partner Offers"
              description="Receive exclusive offers from our trusted partners."
            />
            <NotificationSettingRow
              id="email-newsletter"
              title="Newsletters"
              description="Get our monthly newsletter with travel tips and inspiration."
              defaultChecked
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
}
