'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import {
  CreditCard,
  Flag,
  Gift,
  MailWarning,
  Search,
  TriangleAlert,
  UserPlus,
  CalendarCheck,
  Mail,
  MailOpen,
  Trash2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  useNotifications,
  type Notification,
  type NotificationType,
} from '@/context/NotificationsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const icons: Record<NotificationType, React.ElementType> = {
    payment: CreditCard,
    holiday: CalendarCheck,
    partner: UserPlus,
    offer: Gift,
    alert: MailWarning,
    system: TriangleAlert,
  };
  const Icon = icons[type] || MailWarning;
  return <Icon className="h-5 w-5 text-muted-foreground" />;
};

export default function ViewNotificationsPage() {
  const { notifications, setNotifications } = useNotifications();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const toggleImportant = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isImportant: !n.isImportant } : n))
    );
  };

  const toggleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n)));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications
    .filter((n) => {
      if (filter === 'read') return n.isRead;
      if (filter === 'unread') return !n.isRead;
      return true;
    })
    .filter((n) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        n.title.toLowerCase().includes(searchLower) ||
        n.summary.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (a.type === 'system' && !a.isRead && b.type !== 'system') return -1;
      if (b.type !== 'system' && !b.isRead && a.type === 'system') return 1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const counts = {
    all: notifications.length,
    read: notifications.filter((n) => n.isRead).length,
    unread: notifications.filter((n) => !n.isRead).length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <MailWarning className="h-6 w-6" />
          My Notifications
        </CardTitle>
        <CardDescription>
          Notifications are archived after 90 days unless flagged as important.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <Tabs value={filter} onValueChange={setFilter} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">
                All <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread <Badge variant="destructive" className="ml-2">{counts.unread}</Badge>
              </TabsTrigger>
              <TabsTrigger value="read">
                Read <Badge variant="secondary" className="ml-2">{counts.read}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Filter by keyword..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Type</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="hidden md:table-cell w-[180px]">Timestamp</TableHead>
                <TableHead className="text-right w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <TableRow
                    key={notification.id}
                    className={cn(
                      !notification.isRead ? 'bg-blue-500/5' : 'bg-card',
                      'cursor-pointer'
                    )}
                  >
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <NotificationIcon type={notification.type} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="capitalize">{notification.type} Notification</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/account/notifications/${notification.id}`}
                        className="block"
                        onClick={() => toggleRead(notification.id)}
                      >
                        <p className="font-bold">{notification.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.summary}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 md:hidden">
                          {notification.timestamp}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {notification.timestamp}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleImportant(notification.id);
                                }}
                              >
                                <Flag
                                  className={cn(
                                    'h-4 w-4',
                                    notification.isImportant
                                      ? 'fill-amber-400 text-amber-500'
                                      : 'text-muted-foreground'
                                  )}
                                />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as Important</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRead(notification.id);
                                }}
                              >
                                {notification.isRead ? (
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <MailOpen className="h-4 w-4 text-muted-foreground" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as {notification.isRead ? 'Unread' : 'Read'}</p>
                            </TooltipContent>
                          </Tooltip>

                          <AlertDialog>
                            <Tooltip>
                              <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <AlertDialogTrigger asChild disabled={notification.type === 'system'}>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Notification</p>
                              </TooltipContent>
                            </Tooltip>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this
                                  notification.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No notifications match your current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
