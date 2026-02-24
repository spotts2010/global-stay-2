// src/components/Header.tsx
'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

import {
  ArrowLeft,
  Briefcase,
  Dashboard,
  Heart,
  Home,
  Hotel,
  ListingsIcon,
  LogOut,
  Settings,
  Ticket,
  User,
} from '@/lib/icons';

import { useFavorites } from '@/context/FavoritesContext';
import { useNotifications } from '@/context/NotificationsContext';
import { useUserPreferences } from '@/context/UserPreferencesContext';

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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

  // ✅ Keep currency in sync with context
  const [tempCurrency, setTempCurrency] = useState(preferences.currency);

  useEffect(() => {
    setTempCurrency(preferences.currency);
  }, [preferences.currency]);

  // ✅ Keep Header aligned with app currency union (AUD/USD/GBP)
  const HEADER_CURRENCIES = useMemo(() => ['AUD', 'USD', 'GBP'] as const, []);
  type HeaderCurrency = (typeof HEADER_CURRENCIES)[number];

  const isHeaderCurrency = (v: string): v is HeaderCurrency =>
    (HEADER_CURRENCIES as readonly string[]).includes(v);

  const handleSettingsUpdate = () => {
    setPreferences({ currency: tempCurrency });
    setIsModalOpen(false);
  };

  // Mocked support ticket count for demonstration
  const supportTicketCount = 2;
  const totalUnreadCount = unreadCount + supportTicketCount;

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('');

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
          <div className="sm:hidden">{/* Mobile menu injected by layout */}</div>
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
            <div className="flex items-center gap-3">
              {!isHomePage && !isAdminPage && !isAccountPage && (
                <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </Link>
                </Button>
              )}

              {(isAdminPage || isAccountPage) && (
                <Button asChild variant="outline" size="sm" className="hidden sm:flex">
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
                            <SelectItem value="en-US">English - United States</SelectItem>
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
                          onValueChange={(v) => {
                            if (isHeaderCurrency(v)) setTempCurrency(v);
                          }}
                          name="currency"
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AUD">AUD - Australia</SelectItem>
                            <SelectItem value="USD">USD - United States</SelectItem>
                            <SelectItem value="GBP">GBP - Great Britain</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="sm:justify-start">
                    <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="button" onClick={handleSettingsUpdate}>
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Favorites */}
              <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                <Link href="/favorites" className="relative">
                  <Heart className="mr-2 h-4 w-4" />
                  Favorites
                  {favorites?.length > 0 ? (
                    <Badge className="ml-2" variant="secondary">
                      {favorites.length}
                    </Badge>
                  ) : null}
                </Link>
              </Button>

              {/* Notifications / Support */}
              <Button asChild variant="outline" size="sm" className="hidden sm:flex">
                <Link href="/account/notifications" className="relative">
                  <Ticket className="mr-2 h-4 w-4" />
                  Inbox
                  {totalUnreadCount > 0 ? (
                    <Badge className="ml-2" variant="secondary">
                      {totalUnreadCount}
                    </Badge>
                  ) : null}
                </Link>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="space-y-1">
                    <div className="text-sm font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/account/profile">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account/preferences/currency-language">
                      <Settings className="mr-2 h-4 w-4" />
                      Preferences
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <Dashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/admin/listings">
                      <ListingsIcon className="mr-2 h-4 w-4" />
                      Listings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="outline">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
