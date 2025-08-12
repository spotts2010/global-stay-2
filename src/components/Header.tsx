'use client';

import Link from 'next/link';
import { Heart, Hotel } from 'lucide-react';
import { Button } from './ui/button';
import { useFavorites } from '@/context/FavoritesContext';
import { Badge } from './ui/badge';

const Header = () => {
  const { favorites } = useFavorites();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold tracking-tight">Global Stay 2.0</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/favorites" className="relative">
              <Heart className="mr-2 h-4 w-4" />
              Favorites
              {favorites.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-5 w-5 justify-center p-0"
                >
                  {favorites.length}
                </Badge>
              )}
            </Link>
          </Button>
          <Button>Book Now</Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
