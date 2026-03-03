// src/components/account/profile/profile-header-card.tsx

'use client';

import type { Dispatch, SetStateAction, RefObject, ChangeEvent } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FormField, FormItem, FormMessage, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

type ProfileHeaderCardProps = {
  form: UseFormReturn<any>;
  user: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    timezone: string;
    currency: string;
    language: string;
    distanceUnit: string;
    userId: string;
    role: string;
  };
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  avatarPreview: string | undefined;
  fileInputRef: RefObject<HTMLInputElement>;
  getInitials: (name: string) => string;
  onCopyToClipboard: () => void;
  onAvatarClick: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  isDirty: boolean;
};

export default function ProfileHeaderCard({
  form,
  user,
  isEditing,
  setIsEditing,
  avatarPreview,
  fileInputRef,
  getInitials,
  onCopyToClipboard,
  onAvatarClick,
  onFileChange,
  onCancel,
  isDirty,
}: ProfileHeaderCardProps) {
  return (
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
                  onClick={onAvatarClick}
                >
                  <Camera className="h-8 w-8 text-white" />
                </div>
              )}

              <input
                type="file"
                ref={fileInputRef}
                onChange={onFileChange}
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
                  <Badge variant="default" className="cursor-pointer" onClick={onCopyToClipboard}>
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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
                  <Select onValueChange={field.onChange} value={field.value} disabled={!isEditing}>
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
            <Button variant="outline" type="button" onClick={onCancel}>
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
  );
}
