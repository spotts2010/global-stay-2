'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  User,
  ShieldCheck,
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
  Package2,
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

type NavItem = {
  href?: string;
  label: string;
  icon?: React.ElementType;
  children?: NavItem[];
};

const menuItems: NavItem[] = [
  {
    label: 'Manage Account',
    children: [
      { href: '/account/profile', label: 'Personal Details', icon: User },
      { href: '/account/settings', label: 'Security Settings', icon: ShieldCheck },
      { href: '/account/travel-partners', label: 'My Travel Partners', icon: Users },
    ],
  },
  {
    label: 'Payment Information',
    children: [
      { href: '/account/payment/methods', label: 'Payment Methods', icon: CreditCard },
      { href: '/account/payment/rewards', label: 'Rewards', icon: Gift },
      { href: '/account/payment/coupons', label: 'Coupons & Credits', icon: Ticket },
    ],
  },
  {
    label: 'Preferences',
    children: [
      {
        href: '/account/preferences/currency-language',
        label: 'Currency & Language',
        icon: Languages,
      },
      { href: '/account/preferences/notifications', label: 'Notifications & Alerts', icon: Bell },
      { href: '/account/preferences/suggestions', label: 'Smart Suggestions', icon: Wand },
    ],
  },
  {
    label: 'My Stays',
    children: [
      { href: '/account/my-stays', label: 'Upcoming & Past Stays', icon: Briefcase },
      { href: '/account/favorites', label: 'Saved Places', icon: Heart },
      { href: '/account/reviews', label: 'My Reviews & Ratings', icon: Star },
    ],
  },
  {
    label: 'Support',
    children: [
      { href: '/account/support/faq', label: 'FAQs & Resources', icon: HelpCircle },
      { href: '/account/support/tickets', label: 'My Support Tickets', icon: FileText },
      { href: '/account/support/disputes', label: 'Dispute Resolution', icon: ShieldCheck },
    ],
  },
  {
    label: 'Privacy & Data',
    children: [
      { href: '/account/privacy/data', label: 'Data Management', icon: ShieldCheck },
      { href: '/account/privacy/statement', label: 'Privacy Statement', icon: FileText },
      { href: '/account/privacy/terms', label: 'Terms & Conditions', icon: FileText },
      { href: '/account/privacy/legal', label: 'Legal', icon: FileText },
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
      <button
        onClick={onToggle}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm',
          isCollapsed && 'justify-center',
          hasActiveChild && 'bg-accent text-primary'
        )}
      >
        {!isCollapsed && <span className="flex-1 text-left text-sm">{item.label}</span>}
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
              {child.icon && <child.icon className="h-4 w-4" />}
              <span className="text-xs">{child.label}</span>
            </Link>
          ))}
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
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-black text-sm',
                item.href && pathname.startsWith(item.href) && 'bg-accent text-primary',
                isCollapsed && 'justify-center'
              )}
            >
              {item.icon && <item.icon className="h-5 w-5" />}
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
