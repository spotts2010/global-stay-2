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
  Link as LinkIcon,
  Lock,
  Mail,
  Smartphone,
  ShieldCheck,
  Tablet,
} from 'lucide-react';
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.99,35.508,44,30.016,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 22.773 22.773"
    enableBackground="new 0 0 22.773 22.773"
    xmlSpace="preserve"
    width="24"
    height="24"
    fill="currentColor"
    {...props}
  >
    <g>
      <g>
        <path d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z" />
        <path d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z" />
      </g>
    </g>
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-1.5 C14.22,9,14,9.22,14,9.5V12h2.5l-0.5,3H14v6.8C18.56,20.87,22,16.84,22,12z" />
  </svg>
);

type Provider = {
  name: string;
  icon: React.ElementType;
  connected: boolean;
};
const providers: Provider[] = [
  { name: 'Email & Password', icon: Mail, connected: true },
  { name: 'Google', icon: GoogleIcon, connected: true },
  { name: 'Apple', icon: AppleIcon, connected: false },
  { name: 'Facebook', icon: FacebookIcon, connected: false },
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
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Security Settings
        </CardTitle>
        <CardDescription>
          Manage your password, sign-in methods, and other security features.
        </CardDescription>
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
