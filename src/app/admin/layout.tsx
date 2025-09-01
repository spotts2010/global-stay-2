'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  PanelLeft,
  LayoutGrid,
  Cog,
  Package2,
  PanelRight,
  Building,
  ClipboardCheck,
  Bed,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type NavItem = {
  href?: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
};

const menuItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutGrid },
  {
    label: 'Listings Management',
    icon: Building,
    children: [
      { href: '/admin/listings', label: 'Listings', icon: Building },
      { href: '/admin/amenities', label: 'Amenities & Inclusions', icon: ClipboardCheck },
      { href: '/admin/rooms', label: 'Room Configurations', icon: Bed },
    ],
  },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/database', label: 'System Maintenance', icon: Cog },
];

function CollapsibleMenu({
  item,
  isCollapsed,
  currentPath,
  isOpen,
  onToggle,
}: {
  item: NavItem;
  isCollapsed: boolean;
  currentPath: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const hasActiveChild =
    item.children?.some((child) => child.href && currentPath.startsWith(child.href)) || false;

  useEffect(() => {
    if (hasActiveChild && !isOpen) {
      onToggle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasActiveChild, currentPath]);

  return (
    <div>
      <button
        onClick={onToggle}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm',
          isCollapsed && 'justify-center',
          hasActiveChild && 'bg-accent text-primary'
        )}
      >
        <item.icon className="h-5 w-5" />
        {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
        {!isCollapsed &&
          (isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
      </button>
      {!isCollapsed && isOpen && (
        <div className="ml-4 mt-2 flex flex-col gap-1 border-l pl-4">
          {item.children?.map((child) => (
            <Link
              key={child.label}
              href={child.href || '#'}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-xs',
                child.href &&
                  currentPath.startsWith(child.href) &&
                  'bg-accent text-primary font-semibold'
              )}
            >
              <child.icon className="h-4 w-4" />
              <span>{child.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminSidebar({
  isCollapsed,
  toggleSidebar,
}: {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleMenuToggle = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  useEffect(() => {
    const activeParent = menuItems.find(
      (item) =>
        item.children &&
        item.children.some((child) => child.href && pathname.startsWith(child.href))
    );
    if (activeParent) {
      setOpenMenu(activeParent.label);
    } else {
      setOpenMenu(null);
    }
  }, [pathname]);

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background transition-all duration-300 sm:flex',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Package2 className="h-6 w-6 text-primary" />
          {!isCollapsed && <span className="font-bold">Global Stay</span>}
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {menuItems.map((item) =>
          item.children ? (
            <CollapsibleMenu
              key={item.label}
              item={item}
              isCollapsed={isCollapsed}
              currentPath={pathname}
              isOpen={openMenu === item.label}
              onToggle={() => handleMenuToggle(item.label)}
            />
          ) : (
            <Link
              key={item.label}
              href={item.href || '#'}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-primary text-sm',
                pathname.startsWith(item.href || '---') && 'bg-accent text-primary',
                isCollapsed && 'justify-center'
              )}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        )}
      </nav>
      <div className="mt-auto p-4">
        <div
          onClick={toggleSidebar}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
        >
          {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          {!isCollapsed && <span className="text-sm">Collapse</span>}
        </div>
      </div>
    </aside>
  );
}

function MobileAdminSheet() {
  const pathname = usePathname();
  // Note: Mobile sheet doesn't support collapsible menus in this version for simplicity.
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="#"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Global Stay</span>
          </Link>
          {menuItems.flatMap((item) =>
            item.children
              ? item.children.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href || '#'}
                    className={cn(
                      'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                      pathname.startsWith(child.href || '---') && 'text-foreground'
                    )}
                  >
                    <child.icon className="h-5 w-5" />
                    {child.label}
                  </Link>
                ))
              : [
                  <Link
                    key={item.label}
                    href={item.href || '#'}
                    className={cn(
                      'flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground',
                      pathname.startsWith(item.href || '---') && 'text-foreground'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>,
                ]
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function AdminLayoutContent({
  children,
  isCollapsed,
  toggleSidebar,
}: {
  children: React.ReactNode;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={cn(
          'flex flex-col sm:py-4 transition-all duration-300',
          isCollapsed ? 'sm:pl-20' : 'sm:pl-64'
        )}
      >
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
          <MobileAdminSheet />
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <AdminLayoutContent
      isCollapsed={isCollapsed}
      toggleSidebar={() => setIsCollapsed(!isCollapsed)}
    >
      {children}
    </AdminLayoutContent>
  );
}
