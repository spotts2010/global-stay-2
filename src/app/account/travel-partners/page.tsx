'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users,
  PlusCircle,
  UserPlus,
  Hourglass,
  FilePen,
  Trash2,
  UserCheck,
  UserX,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Partner = {
  id: string;
  name: string;
  relationship: 'Family Member' | 'Work Colleague' | 'Friend';
  email: boolean;
  mobile: boolean;
};

const partners: Partner[] = [
  {
    id: '1',
    name: 'Julia Nolte',
    relationship: 'Family Member',
    email: true,
    mobile: false,
  },
  {
    id: '2',
    name: 'Jane Doe',
    relationship: 'Work Colleague',
    email: true,
    mobile: true,
  },
  {
    id: '3',
    name: 'Bob Hope',
    relationship: 'Friend',
    email: true,
    mobile: false,
  },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

export default function TravelPartnersPage() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            My Travel Partners
          </CardTitle>
          <CardDescription>
            Manage family members and invite partners to speed up bookings.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Family Member
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

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite a Partner
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
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {/* Approved Partners Section */}
          <AccordionItem
            value="item-1"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-500" />
                Approved Partners
                <span className="text-sm font-normal text-muted-foreground">
                  ({partners.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              {/* Desktop Table View */}
              <div className="border rounded-lg bg-card hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-bold">Name</TableHead>
                      <TableHead className="font-bold">Relationship</TableHead>
                      <TableHead className="font-bold">Email</TableHead>
                      <TableHead className="font-bold">Mobile</TableHead>
                      <TableHead className="font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={undefined} />
                              <AvatarFallback>{getInitials(partner.name)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{partner.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {partner.relationship}
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={partner.email} disabled />
                        </TableCell>
                        <TableCell>
                          <Checkbox checked={partner.mobile} disabled />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FilePen className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* Mobile Card View */}
              <div className="space-y-4 md:hidden">
                {partners.map((partner) => (
                  <div key={partner.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={undefined} />
                          <AvatarFallback>{getInitials(partner.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{partner.name}</p>
                          <p className="text-sm text-muted-foreground">{partner.relationship}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FilePen className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-around">
                      <div className="flex flex-col items-center gap-2">
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <Checkbox checked={partner.email} disabled />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                        <Checkbox checked={partner.mobile} disabled />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Pending Invitations Section */}
          <AccordionItem
            value="item-2"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <Hourglass className="h-5 w-5 text-amber-500" />
                Pending Invitations
                <span className="text-sm font-normal text-muted-foreground">(0)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                <p>You have no pending invitations.</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Request Denied Section */}
          <AccordionItem
            value="item-3"
            className="p-4 bg-background border rounded-lg hover:bg-accent/50"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline">
              <div className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-destructive" />
                Request Denied
                <span className="text-sm font-normal text-muted-foreground">(0)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
                <p>You have no denied requests.</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
