'use client';

import React from 'react';
import AccountSidebar from '@/components/AccountSidebar';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AccountSidebar
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsCollapsed(!isCollapsed)}
      />
      <div
        className={`flex flex-col sm:py-4 transition-all duration-300 ${isCollapsed ? 'sm:pl-20' : 'sm:pl-64'}`}
      >
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
