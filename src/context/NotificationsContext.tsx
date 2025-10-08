'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type NotificationType = 'payment' | 'holiday' | 'partner' | 'offer' | 'alert' | 'system';

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  summary: string;
  fullMessage: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
};

// This initial state will be used across the app
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'system',
    title: 'System Maintenance',
    summary:
      'Routine maintenance will be conducted between 00:00 and 01:00 on 28/07/2024. We apologise in advance for any inconvenience...',
    fullMessage:
      'Routine maintenance will be conducted between 00:00 and 01:00 on 28/07/2024. We apologise in advance for any inconvenience while our systems are updated. Please contact us for any immediate queries.',
    timestamp: '25/07/2024 18:00',
    isRead: false,
    isImportant: false,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Method Expiring',
    summary: 'Your VISA card ending in 4242 is expiring soon. Please update your payment details.',
    fullMessage:
      'Your VISA card ending in 4242 is set to expire at the end of this month. To avoid any disruption to your future bookings, please update your payment method at your earliest convenience.',
    timestamp: '25/07/2024 09:30',
    isRead: false,
    isImportant: false,
  },
  {
    id: '3',
    type: 'partner',
    title: 'New Travel Partner Request',
    summary: 'Jane Doe has sent you a request to become a travel partner.',
    fullMessage:
      'Jane Doe (jane.doe@example.com) has invited you to connect as a travel partner. Adding them will allow you to quickly add them to future bookings.',
    timestamp: '24/07/2024 15:45',
    isRead: true,
    isImportant: true,
  },
  {
    id: '4',
    type: 'holiday',
    title: 'Upcoming Trip to Malibu',
    summary:
      "Your trip is just around the corner! Here's a quick checklist to make sure you're all set.",
    fullMessage:
      "Your trip to 'The Oceanfront Pearl' in Malibu is just one week away! \n\nHere's a quick checklist: \n- Confirm flight details \n- Pack swimwear and sunscreen \n- Check local weather forecast \n- Arrange airport transport. \n\nWe can't wait to host you!",
    timestamp: '23/07/2024 11:00',
    isRead: true,
    isImportant: false,
  },
  {
    id: '5',
    type: 'offer',
    title: 'Exclusive 25% Discount!',
    summary:
      'For a limited time, get 25% off your next booking. Use code: SUMMER25. This is a special offer just for you!',
    fullMessage:
      "As a valued customer, we are offering you an exclusive 25% discount on your next booking made within the next 24 hours. Apply the code SUMMER25 at checkout to redeem this offer. Don't miss out!",
    timestamp: '22/07/2024 14:00',
    isRead: false,
    isImportant: true,
  },
  {
    id: '6',
    type: 'alert',
    title: 'Noosa Hostel Alert',
    summary: 'A hostel matching your criteria for "Cheap Hostels in Noosa" is now available.',
    fullMessage:
      'Good news! A bed has become available at "Noosa Flashpackers" which matches your saved alert criteria. Book now before it gets snapped up!',
    timestamp: '21/07/2024 20:15',
    isRead: true,
    isImportant: false,
  },
];

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // In a real app, you would fetch notifications from an API here
    // For now, we just use the initial mock data
    const count = notifications.filter((n) => !n.isRead).length;
    setUnreadCount(count);
  }, [notifications]);

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, setNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
