'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M12.01,2.07c-2.3,0-4.04,1.4-5.26,3.46c-1.33,2.22-1.93,4.6-1.6,6.96c0.23,2.2,1.6,4.3,3.33,5.65 c0.84,0.65,1.93,1.35,3.27,1.35c1.31,0,2.12-0.6,3.2-1.29c1.73-1.13,2.94-3.14,3.2-5.55c0.06-0.6,0.1-1.18,0.1-1.75 c0-0.09,0-0.19,0-0.28c-0.01-0.21-0.03-0.42-0.06-0.63c-0.34-2.5-1.92-4.38-4.03-5.2c-1.07-0.41-2.26-0.42-3.26-0.42 M14.15,0.16c1.47,0.01,2.83,0.56,3.88,1.59c-1.22,0.77-2.14,2-2.45,3.45c-0.09,0.44-0.14,0.9-0.14,1.38 c0,0.41,0.03,0.8,0.1,1.17c0.41,2.15,2.2,3.58,4.36,3.58c0.06,0,0.12,0,0.18-0.01c-0.1,3.7-2.35,6.08-4.7,6.08 c-1.3,0-2.39-0.69-3.32-1.32c-1.5-1-2.65-2.65-3-4.78c-0.3-2.1,0.22-4.22,1.33-6.17C11,1.52,12.56,0.1,14.15,0.16" />
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
      <Button variant="ghost" size="sm">
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
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
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
              Two-Factor Authentication
            </AccordionTrigger>
            <AccordionContent className="space-y-4 pt-4">
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
              <Button variant="link" className="p-0 h-auto">
                Log out of all devices <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead>Device</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginHistory.map((login) => (
                    <TableRow key={login.id}>
                      <TableCell>{login.date}</TableCell>
                      <TableCell>{login.ip}</TableCell>
                      <TableCell className="hidden md:table-cell">{login.location}</TableCell>
                      <TableCell>{login.device}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
