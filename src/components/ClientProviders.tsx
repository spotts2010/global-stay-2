'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={['places']}>
      <UserPreferencesProvider>
        <NotificationsProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </NotificationsProvider>
      </UserPreferencesProvider>
    </APIProvider>
  );
}
