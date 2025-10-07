'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Shield,
  Users,
  CreditCard,
  Gift,
  Ticket,
  Languages,
  Bell,
  Wand,
  Briefcase,
  Star,
  Heart,
  HelpCircle,
  FileText,
  Home,
  LifeBuoy,
  GlobeLock,
  SlidersHorizontal,
  MailWarning,
  ListChecks,
  ChevronDown,
  ChevronRight,
  Package2,
  Database,
  ClipboardList,
  Mail,
  Plane,
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
  Forum,
} from '@/lib/icons';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type NavItem = {
  href?: string;
  label: string;
  icon?: React.ElementType;
  children?: NavItem[];
  hidden?: boolean;
};

export const menuItems: NavItem[] = [
  {
    label: 'My Account',
    icon: User,
    children: [
      { href: '/account/profile', label: 'Personal Details', icon: User },
      { href: '/account/settings', label: 'Security Settings', icon: Shield },
      {
        href: '/account/travel-partners',
        label: 'Travel Partners',
        icon: Users,
      },
      {
        href: '/account/my-travel-documents',
        label: 'Travel Documents',
        icon: ClipboardList,
      },
    ],
  },
  {
    label: 'My Stays',
    icon: Home,
    children: [
      { href: '/account/my-stays/upcoming', label: 'Upcoming Stays', icon: Briefcase },
      { href: '/account/my-stays/past', label: 'Past Stays', icon: Briefcase },
      { href: '/account/my-stays/favorites', label: 'Saved Places', icon: Heart },
      { href: '/account/my-stays/reviews', label: 'Reviews & Ratings', icon: Star },
    ],
  },
  {
    label: 'Notifications & Alerts',
    icon: Bell,
    children: [
      {
        href: '/account/notifications/view',
        label: 'My Notifications',
        icon: MailWarning,
      },
      { href: '/account/notifications/my-alerts', label: 'My Alerts', icon: Bell },
      { href: '/account/notifications/manage', label: 'Manage Notifications', icon: ListChecks },
      { href: '/account/notifications/1', label: 'View Notification', hidden: true },
    ],
  },
  {
    label: 'Payments',
    icon: CreditCard,
    children: [
      { href: '/account/payment/methods', label: 'Payment Methods', icon: CreditCard },
      { href: '/account/payment/rewards', label: 'Rewards', icon: Gift },
      { href: '/account/payment/coupons', label: 'Coupons & Credits', icon: Ticket },
    ],
  },
  {
    label: 'Preferences',
    icon: SlidersHorizontal,
    children: [
      {
        href: '/account/preferences/currency-language',
        label: 'Currency & Language',
        icon: Languages,
      },
      { href: '/account/preferences/suggestions', label: 'Smart Suggestions', icon: Wand },
      { href: '/account/preferences/email', label: 'Email Preferences', icon: Mail },
      { href: '/account/preferences/holiday', label: 'Holiday Preferences', icon: Plane },
    ],
  },
  {
    label: 'Support',
    icon: LifeBuoy,
    children: [
      { href: '/account/support/faq', label: 'FAQs & Resources', icon: HelpCircle },
      { href: '/account/support/tickets', label: 'My Support Tickets', icon: FileText },
      { href: '/account/support/disputes', label: 'Dispute Resolution', icon: Forum },
    ],
  },
  {
    label: 'Privacy & Data',
    icon: GlobeLock,
    children: [
      { href: '/account/privacy/data', label: 'Data Management', icon: Database },
      { href: '/account/privacy/policy', label: 'Privacy Policy', icon: FileText },
      { href: '/account/privacy/terms', label: 'Terms & Conditions', icon: FileText },
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
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm relative',
                isCollapsed && 'justify-center',
                hasActiveChild && 'bg-accent text-primary'
              )}
            >
              {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
              {!isCollapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
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
          {item.children?.map(
            (child) =>
              !child.hidden && (
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
                  {child.icon && <child.icon className="h-4 w-4" />}
                  <span className="text-xs truncate">{child.label}</span>
                </Link>
              )
          )}
        </div>
      )}
    </div>
  );
}

export default function AccountSidebar({
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
        {menuItems.map((item) => {
          return item.children ? (
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
                      item.href && pathname.startsWith(item.href) && 'bg-accent text-primary',
                      isCollapsed && 'justify-center'
                    )}
                  >
                    {item.icon && <item.icon className="h-5 w-5" />}
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
          );
        })}
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
