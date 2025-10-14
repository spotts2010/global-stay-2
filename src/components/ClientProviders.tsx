'use client';

import { APIProvider } from '@vis.gl/react-google-maps';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { NotificationsProvider } from '@/context/NotificationsContext';
import { UserPreferencesProvider } from '@/context/UserPreferencesContext';
import React, { useEffect } from 'react';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Manually trigger Next.js Dev Tools if they exist on the window object.
    if (process.env.NODE_ENV === 'development') {
      const devTools = (window as { __NEXT_DEVTOOLS_GLOBAL_HOOK__?: { open?: () => void } })
        .__NEXT_DEVTOOLS_GLOBAL_HOOK__;
      devTools?.open?.();
    }
  }, []);

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
