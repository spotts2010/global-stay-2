'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Copy,
  Camera,
  User,
  Globe,
  Wallet,
  Languages,
  Milestone,
} from '@/lib/icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useUserPreferences } from '@/context/UserPreferencesContext';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Mobile number is required'),
  address: z.string().min(1, 'Street address is required'),
  timezone: z.string().min(1, 'Timezone is required'),
  currency: z.string(),
  language: z.string(),
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
      address: '2403/100 Duporth Avenue, Maroochydore QLD, Australia',
      timezone: 'Australia/Brisbane',
      currency: preferences.currency,
      language: preferences.language,
      distanceUnit: preferences.distanceUnit,
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    setPreferences(data); // Update the shared context
    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved successfully.',
    });
    setIsEditing(false);
    form.reset(data); // Resets the form's dirty state
  };

  const handleCancel = () => {
    form.reset();
    setAvatarPreview(undefined);
    setIsEditing(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <div className="space-y-1.5">
              <CardTitle className="font-headline text-2xl flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                My Profile
              </CardTitle>
              <CardDescription>
                View and manage your personal information and preferences.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* User Info Section */}
            <div className="flex items-start gap-6">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border">
                    <AvatarImage src={avatarPreview} alt={user.fullName} />
                    <AvatarFallback className="text-3xl font-bold">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div
                      className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer transition-opacity opacity-0 group-hover:opacity-100"
                      onClick={handleAvatarClick}
                    >
                      <Camera className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        {isEditing ? (
                          <Input {...field} className="h-8 text-sm" />
                        ) : (
                          <h2 className="text-2xl font-bold">{field.value}</h2>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!isEditing && <Badge variant="destructive">{user.role}</Badge>}
                </div>

                <div className="space-y-2 text-sm md:w-1/2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {isEditing ? (
                            <Input {...field} className="h-8 text-sm" />
                          ) : (
                            <span className="text-sm">{field.value}</span>
                          )}
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {isEditing ? (
                            <Input {...field} className="h-8 text-sm" />
                          ) : (
                            <span className="text-sm">{field.value}</span>
                          )}
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {isEditing ? (
                          <Input {...field} className="h-8 text-sm" />
                        ) : (
                          <span className="text-sm">{field.value}</span>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>User ID:</span>
                      <Badge
                        variant="default"
                        className="cursor-pointer"
                        onClick={handleCopyToClipboard}
                      >
                        {user.userId}
                        <Copy className="h-3 w-3 ml-2" />
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy ID</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Separator className="my-8" />

            {/* Default Settings Section */}
            <div className="space-y-4">
              <h3 className="font-headline text-xl font-semibold">Default Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        Default Timezone
                      </Label>
                      <Input {...field} disabled={!isEditing} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="flex items-center gap-2 mb-2">
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                        Default Currency
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD - United States Dollar</SelectItem>
                          <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="flex items-center gap-2 mb-2">
                        <Languages className="h-4 w-4 text-muted-foreground" />
                        Default Language
                      </Label>
                      <Select onValueChange={field.onChange} value={field.value} disabled>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en-US">English (United States)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="distanceUnit"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="flex items-center gap-2 mb-2">
                        <Milestone className="h-4 w-4 text-muted-foreground" />
                        Distance Unit
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!isEditing}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="km">Kilometers (km)</SelectItem>
                          <SelectItem value="miles">Miles (mi)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-start gap-2 pt-6">
            {isEditing ? (
              <>
                <Button variant="outline" type="button" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!isDirty && !avatarPreview}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" type="button" onClick={() => setIsEditing(true)}>
                Edit Details
              </Button>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
