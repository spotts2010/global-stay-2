'use client';

import { useState, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl as _FormControl,
  FormDescription as _FormDescription,
  FormLabel as _FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin, CheckCircle2, Copy, Camera, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const profileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Mobile number is required'),
  address: z.string().min(1, 'Street address is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialData: ProfileFormValues = useMemo(
    () => ({
      fullName: 'Sam Potts',
      email: 'sam.expression@gmail.com',
      phone: '+61 0403688874',
      address: '2403/100 Duporth Avenue, Maroochydore QLD, Australia',
    }),
    []
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
    console.log('Form Submitted', data);
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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <User className="h-6 w-6 text-primary" />
          Personal Details
        </CardTitle>
        <CardDescription>
          View and manage your personal information and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            <div className="flex justify-start gap-2">
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
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
