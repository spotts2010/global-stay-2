'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Dashboard,
  Cog,
  Package2,
  ListingsIcon,
  ChevronDown,
  ChevronRight,
  CalendarDays,
  Bed,
  ListChecks,
  Database,
  MapPin,
  Home,
  FileText,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
  Accessibility,
} from '@/lib/icons';
import React, { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type NavItem = {
  href?: string;
  label: string;
  icon: React.ElementType;
  children?: NavItem[];
};

export const menuItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Dashboard },
  { href: '/admin/bookings/calendar', label: 'Bookings', icon: CalendarDays },
  { href: '/admin/listings', label: 'Listings', icon: ListingsIcon },
  { href: '/admin/users', label: 'Users', icon: Users },
  {
    label: 'System Admin',
    icon: Cog,
    children: [
      { href: '/admin/amenities', label: 'Amenities & Inclusions', icon: ListChecks },
      { href: '/admin/accessibility-features', label: 'Accessibility', icon: Accessibility },
      { href: '/admin/bed-types', label: 'Bed Types', icon: Bed },
      { href: '/admin/property-types', label: 'Property Types', icon: Home },
      { href: '/admin/poi-categories', label: 'POI Categories', icon: MapPin },
      { href: '/admin/database', label: 'Database Maintenance', icon: Database },
      { href: '/admin/settings/site', label: 'Site Settings', icon: Cog },
      { href: '/admin/settings/legal', label: 'Legal Pages', icon: FileText },
    ],
  },
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
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm',
                isCollapsed && 'justify-center',
                hasActiveChild && 'bg-accent text-primary'
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
              {!isCollapsed &&
                (isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                ))}
            </button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">
              <p>{item.label}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

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
            <TooltipProvider delayDuration={0} key={item.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href || '#'}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm',
                      pathname.startsWith(item.href || '---') && 'bg-accent text-primary',
                      isCollapsed && 'justify-center'
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          )
        )}
      </nav>
      <div className="mt-auto p-4">
        <div
          onClick={toggleSidebar}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all"
        >
          {isCollapsed ? (
            <TbLayoutSidebarRightCollapse className="h-5 w-5" />
          ) : (
            <TbLayoutSidebarLeftCollapse className="h-5 w-5" />
          )}
          {!isCollapsed && <span className="text-sm">Collapse</span>}
        </div>
      </div>
    </aside>
  );
}

export { AdminSidebar };
