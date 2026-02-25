// src/components/account/account-layout-client.tsx

'use client';

import React, { useState } from 'react';
import AccountSidebar from '@/components/AccountSidebar';
import MobileAccountSheet from '@/components/account/mobile-account-sheet';

export default function AccountLayoutClient({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AccountSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />
      <div
        className={`flex flex-col sm:py-4 transition-all duration-300 ${
          isCollapsed ? 'sm:pl-20' : 'sm:pl-64'
        }`}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:hidden">
          <MobileAccountSheet />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
