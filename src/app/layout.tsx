import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Quicksand } from 'next/font/google';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Global Stay 2.0',
  description: 'Find your next stay, anywhere in the world.',
};

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${quicksand.variable}`}>
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker&loading=async`}
          strategy="beforeInteractive"
        />
      </head>
      <body className={cn('font-body antialiased bg-background text-foreground')}>
        <UserPreferencesProvider>
          <NotificationsProvider>
            <FavoritesProvider>
              <div className="relative flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </FavoritesProvider>
          </NotificationsProvider>
        </UserPreferencesProvider>
      </body>
    </html>
  );
}
