// src/components/account/profile/profile-page-client.tsx

'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useUserPreferences } from '@/context/UserPreferencesContext';
import type { ChangeEvent } from 'react';

const ProfileHeaderCard = dynamic(
  () => import('@/components/account/profile/profile-header-card'),
  { ssr: false }
);

// IMPORTANT:
// Your global Currency union likely includes "EUR" etc.
// This profile form only supports these three right now.
type ProfileCurrency = 'USD' | 'AUD' | 'GBP';
const PROFILE_CURRENCIES = ['USD', 'AUD', 'GBP'] as const satisfies readonly ProfileCurrency[];

const LANGUAGES = ['en-US'] as const;

function isProfileCurrency(v: unknown): v is ProfileCurrency {
  return typeof v === 'string' && (PROFILE_CURRENCIES as readonly string[]).includes(v);
}

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Mobile number is required'),
  address: z.string().min(1, 'Street address is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  currency: z.enum(PROFILE_CURRENCIES),
  language: z.enum(LANGUAGES),
  distanceUnit: z.enum(['km', 'miles']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const { preferences, setPreferences } = useUserPreferences();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialData: ProfileFormValues = useMemo(
    () => ({
      fullName: 'Sam Potts',
      email: 'sam.expression@gmail.com',
      phone: '+61 0403688874',
      address: '2403/100 Duporth Avenue, Maroochydore, Queensland, Australia',
      timezone: 'Australia/Brisbane',
      currency: isProfileCurrency(preferences.currency) ? preferences.currency : 'AUD',
      language: LANGUAGES.includes(preferences.language as any)
        ? (preferences.language as 'en-US')
        : 'en-US',
      distanceUnit: preferences.distanceUnit === 'miles' ? 'miles' : 'km',
    }),
    [preferences]
  );

  const user = {
    ...initialData,
    userId: 'iUzA6cq1FXUrpi4b1B6q9vYYXjT2',
    role: 'Super Admin',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const { isDirty } = form.formState;

  // Re-sync form with context when preferences change
  useEffect(() => {
    form.reset(initialData);
  }, [initialData, form]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(user.userId);
    toast({
      title: 'Copied to Clipboard',
      description: 'User ID has been copied.',
    });
  };

  const handleAvatarClick = () => {
    if (isEditing) fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    // Only update the preferences slice in context (prevents shape mismatch)
    setPreferences({
      ...preferences,
      currency: data.currency,
      language: data.language,
      distanceUnit: data.distanceUnit,
    });

    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.',
    });

    setIsEditing(false);
    form.reset(data);
  };

  const handleCancel = () => {
    form.reset();
    setAvatarPreview(undefined);
    setIsEditing(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ProfileHeaderCard
          form={form}
          user={user}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          avatarPreview={avatarPreview}
          fileInputRef={fileInputRef}
          getInitials={getInitials}
          onCopyToClipboard={handleCopyToClipboard}
          onAvatarClick={handleAvatarClick}
          onFileChange={handleFileChange}
          onCancel={handleCancel}
          isDirty={isDirty}
        />
      </form>
    </Form>
  );
}
