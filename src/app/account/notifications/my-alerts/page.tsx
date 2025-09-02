'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, PlusCircle, FilePen, Trash2 } from 'lucide-react';

const alerts = [
  {
    id: '1',
    name: 'Hobart Hotel Hunt',
    criteria: [
      'Price Drop',
      'Hotels',
      'Hobart, TAS',
      'Under $200/night',
      '2 People',
      'Jan 2 - Jan 8',
      'Min 3 nights',
    ],
    status: 'Active',
  },
  {
    id: '2',
    name: 'Sydney Getaway Deal',
    criteria: ['Package Deals', 'Sydney, NSW', '5-star', 'Weekend'],
    status: 'Active',
  },
  {
    id: '3',
    name: 'Last-Minute Bali Villa',
    criteria: ['Cheap Accommodation', 'Villas', 'Canggu, Bali', 'Next 2 weeks'],
    status: 'Paused',
  },
];

export default function MyAlertsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            My Alerts
          </CardTitle>
          <CardDescription>
            Manage your custom alerts for price drops, special offers, and more.
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Feature Coming Soon</DialogTitle>
              <DialogDescription>
                The ability to add and configure new alerts is currently under development. Please
                check back later.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {alerts.length > 0 ? (
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold w-[20%]">Alert Name</TableHead>
                  <TableHead className="font-bold">Criteria</TableHead>
                  <TableHead className="font-bold hidden md:table-cell w-[10%]">Status</TableHead>
                  <TableHead className="text-right font-bold w-[15%]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell className="font-medium">{alert.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {alert.criteria.map((item, index) => (
                          <Badge key={index} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={alert.status === 'Active' ? 'default' : 'outline'}>
                        {alert.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <FilePen className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
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
        ) : (
          <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
            <p>You haven't set up any custom alerts yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
