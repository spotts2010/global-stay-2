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
  _PanelLeft,
} from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { usePathname } from 'next/navigation';
import { _Sheet, _SheetTrigger, _SheetContent } from './ui/sheet';

const Header = () => {
  const { favorites } = useFavorites();
  const pathname = usePathname();
  // Placeholder for auth state
  const isLoggedIn = true;
  const user = {
    name: 'Sam Potts',
    email: 'sam.expression@gmail.com',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  const isAdminPage = pathname.startsWith('/admin');
  const isAccountPage = pathname.startsWith('/account');

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
                    <Link href="/account/my-stays">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <span>My Stays</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/favorites">
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
