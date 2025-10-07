'use client';

import Link from 'next/link';
import {
  Heart,
  Hotel,
  User,
  Settings,
  LayoutGrid,
  LogOut,
  Briefcase,
  ArrowLeft,
  MailWarning,
  Ticket,
  Building,
  Home,
} from '@/lib/icons';
import { Button } from './ui/button';
import { useFavorites } from '@/context/FavoritesContext';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePathname } from 'next/navigation';
import { useNotifications } from '@/context/NotificationsContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import React, { useState, useEffect } from 'react';

const Header = () => {
  const { favorites } = useFavorites();
  const { unreadCount } = useNotifications();
  const { preferences, setPreferences } = useUserPreferences();
  const pathname = usePathname();
  // Placeholder for auth state
  const isLoggedIn = true;
  const user = {
    name: 'Sam Potts',
    email: 'sam.expression@gmail.com',
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempCurrency, setTempCurrency] = useState(preferences.currency);

  // Sync tempCurrency with context preferences when they change
  useEffect(() => {
    setTempCurrency(preferences.currency);
  }, [preferences.currency]);

  const handleSettingsUpdate = () => {
    setPreferences({ currency: tempCurrency });
    setIsModalOpen(false);
  };

  // Mocked support ticket count for demonstration
  const supportTicketCount = 2;

  const totalUnreadCount = unreadCount + supportTicketCount;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  const isAdminPage = pathname.startsWith('/admin');
  const isAccountPage = pathname.startsWith('/account');
  const isHomePage = pathname === '/';

  const Logo = () => (
    <div className="flex items-center gap-2">
      <Hotel className="h-6 w-6 text-primary" />
      <span className="font-headline text-xl font-bold tracking-tight">Global Stay 2.0</span>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="sm:hidden">
            {/* Mobile menu trigger for account pages will be injected here by the layout */}
          </div>
          <Link href="/" className="hidden sm:flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        {/* Mobile-only Logo */}
        <div className="sm:hidden">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              {!isHomePage && !isAdminPage && !isAccountPage && (
                <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              )}
              {(isAdminPage || isAccountPage) && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="hover:bg-primary hover:text-black hidden sm:flex"
                >
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Site
                  </Link>
                </Button>
              )}

              {/* Language/Currency Indicator & Modal Trigger */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <div className="hidden sm:flex items-center gap-2 rounded-md border bg-secondary/50 px-3 py-1.5 text-sm font-medium text-muted-foreground cursor-pointer hover:bg-accent">
                    <span>{preferences.language}</span>
                    <span className="text-muted-foreground/50">/</span>
                    <span>{preferences.currency}</span>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Regional Settings</DialogTitle>
                    <DialogDescription>
                      Adjust your currency for this browsing session. Permanent changes can be made
                      in your profile settings.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-left col-span-1">
                        Location
                      </Label>
                      <div className="col-span-3">
                        <Select defaultValue="Australia/Brisbane" disabled>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Australia/Brisbane">
                              Brisbane, Australia (UTC +10)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="language" className="text-left col-span-1">
                        Language
                      </Label>
                      <div className="col-span-3">
                        <Select defaultValue="en-US" disabled>
                          <SelectTrigger className="flex items-center gap-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en-US">
                              <div className="flex items-center gap-2">English - United States</div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="currency" className="text-left col-span-1">
                        Currency
                      </Label>
                      <div className="col-span-3">
                        <Select
                          value={tempCurrency}
                          onValueChange={setTempCurrency}
                          name="currency"
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AUD">AUD - Australia</SelectItem>
                            <SelectItem value="USD">USD - United States</SelectItem>
                            <SelectItem value="GBP">GBP - Great Britain</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button type="button" onClick={handleSettingsUpdate}>
                      Update Settings
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <Avatar>
                      <AvatarImage src={undefined} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    {totalUnreadCount > 0 && (
                      <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span>
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/notifications/view">
                      <MailWarning className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                      {unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-auto flex h-5 w-5 items-center justify-center p-0"
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/my-stays/upcoming">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>My Stays</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/my-stays/favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Saved Places</span>
                      {favorites.length > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-auto flex h-5 w-5 items-center justify-center p-0"
                        >
                          {favorites.length}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/support/tickets">
                      <Ticket className="mr-2 h-4 w-4" />
                      <span>Support Tickets</span>
                      {supportTicketCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-auto flex h-5 w-5 items-center justify-center p-0"
                        >
                          {supportTicketCount}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Creator & Admin</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/dashboard">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/listings">
                      <Building className="mr-2 h-4 w-4" />
                      <span>Manage Listings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
