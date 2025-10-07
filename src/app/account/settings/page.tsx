'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MessageSquareWarning,
  CheckCircle2,
  ChevronRight,
  Laptop,
  LinkIcon,
  Lock,
  Mail,
  Smartphone,
  Shield,
  Tablet,
  FaGoogle,
  FaApple,
  FaFacebook,
} from '@/lib/icons';
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type Provider = {
  name: string;
  icon: React.ElementType;
  connected: boolean;
};

const providers: Provider[] = [
  { name: 'Email & Password', icon: Mail, connected: true },
  { name: 'Google', icon: FaGoogle, connected: true },
  { name: 'Apple', icon: FaApple, connected: false },
  { name: 'Facebook', icon: FaFacebook, connected: false },
];

type Device = {
  id: string;
  type: 'laptop' | 'phone' | 'tablet';
  name: string;
  location: string;
  lastSeen: string;
};
const devices: Device[] = [
  {
    id: '1',
    type: 'laptop',
    name: 'Chrome on macOS',
    location: 'Maroochydore, QLD',
    lastSeen: 'Active now',
  },
  {
    id: '2',
    type: 'phone',
    name: 'iPhone 15 Pro',
    location: 'Sydney, NSW',
    lastSeen: '2 days ago',
  },
];

type LoginEvent = {
  id: string;
  date: string;
  ip: string;
  location: string;
  device: string;
};
const loginHistory: LoginEvent[] = [
  {
    id: '1',
    date: '24/05/2024 10:30 AM',
    ip: '192.168.1.1',
    location: 'Maroochydore, QLD',
    device: 'Chrome on macOS',
  },
  {
    id: '2',
    date: '22/05/2024 08:15 PM',
    ip: '203.0.113.25',
    location: 'Sydney, NSW',
    device: 'iPhone 15 Pro',
  },
];

const ProviderRow = ({ provider }: { provider: Provider }) => (
  <div className="flex items-center justify-between rounded-lg border bg-card p-4">
    <div className="flex items-center gap-4">
      <provider.icon className="h-6 w-6 text-muted-foreground" />
      <div>
        <p className="font-semibold">{provider.name}</p>
        {provider.connected ? (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Connected</span>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Not Connected</p>
        )}
      </div>
    </div>
    {provider.connected ? (
      <Button variant="outline">
        <LinkIcon className="mr-2 h-4 w-4" />
        Disconnect
      </Button>
    ) : (
      <Button>
        <LinkIcon className="mr-2 h-4 w-4" />
        Connect
      </Button>
    )}
  </div>
);

const DeviceRow = ({ device }: { device: Device }) => {
  const DeviceIcon =
    device.type === 'laptop' ? Laptop : device.type === 'phone' ? Smartphone : Tablet;
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4">
      <div className="flex items-center gap-4">
        <DeviceIcon className="h-6 w-6 text-muted-foreground" />
        <div>
          <p className="font-semibold">{device.name}</p>
          <p className="text-sm text-muted-foreground">
            {device.location} &middot; {device.lastSeen}
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm">
        Log out
      </Button>
    </div>
  );
};

export default function SecuritySettingsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage your password, sign-in methods, and other security features.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {/* Change Password */}
          <AccordionItem
            value="item-1"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Change Password
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" className="bg-card" />
                </div>
                <div />
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" className="bg-card" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" className="bg-card" />
                </div>
              </div>
              <Button>
                <Lock className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Sign-in Methods */}
          <AccordionItem
            value="item-2"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Sign-in Methods
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground -mt-2">
                Manage the accounts you use to sign in. You must have at least one sign-in method.
              </p>
              {providers.map((p) => (
                <ProviderRow key={p.name} provider={p} />
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Two-Factor Authentication */}
          <AccordionItem
            value="item-3"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Two-Factor Authentication (2FA)
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div>
                  <p className="font-semibold">Enable Authenticator App</p>
                  <p className="text-sm text-muted-foreground">
                    Use an app like Google Authenticator to generate a code.
                  </p>
                </div>
                <Switch disabled />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div>
                  <p className="font-semibold">Enable SMS Verification</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security using text message codes.
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                <div>
                  <p className="font-semibold">Enable Email Verification</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a code to your email to verify it's you.
                  </p>
                </div>
                <Switch />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Connected Devices */}
          <AccordionItem
            value="item-4"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Connected Devices
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
              {devices.map((d) => (
                <DeviceRow key={d.id} device={d} />
              ))}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button>
                    Log out of all devices <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will log you out of all other active sessions on all devices. You
                      will need to sign in again on each device.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Confirm</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </AccordionContent>
          </AccordionItem>

          {/* Login History */}
          <AccordionItem
            value="item-5"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              Login History
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="border rounded-lg bg-card">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Date</TableHead>
                      <TableHead className="font-bold">IP Address</TableHead>
                      <TableHead className="hidden md:table-cell font-bold">Location</TableHead>
                      <TableHead className="font-bold">Device</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginHistory.map((login) => (
                      <TableRow key={login.id}>
                        <TableCell>{login.date}</TableCell>
                        <TableCell>{login.ip}</TableCell>
                        <TableCell className="hidden md:table-cell">{login.location}</TableCell>
                        <TableCell>{login.device}</TableCell>
                        <TableCell className="text-right">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                  <MessageSquareWarning className="h-4 w-4" />
                                  <span className="sr-only">Report</span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Report Login Activity</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
