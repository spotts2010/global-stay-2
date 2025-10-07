'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Languages } from '@/lib/icons';
import { useUserPreferences } from '@/context/UserPreferencesContext';

const settingsSchema = z.object({
  language: z.string(),
  currency: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function CurrencyLanguagePage() {
  const { toast } = useToast();
  const { preferences, setPreferences, isEditing, setIsEditing } = useUserPreferences();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: preferences,
  });

  const {
    formState: { isDirty },
    reset,
  } = form;

  // Sync form with context state
  useEffect(() => {
    reset(preferences);
  }, [preferences, reset]);

  const onSubmit = (data: SettingsFormValues) => {
    setPreferences(data);
    toast({
      title: 'Preferences Updated',
      description: 'Your changes have been saved successfully.',
    });
    setIsEditing(false);
    reset(data); // Resets the form's dirty state
  };

  const handleCancel = () => {
    reset(preferences); // Reverts to the last saved state from context
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Languages className="h-6 w-6 text-primary" />
            Currency & Language
          </CardTitle>
          <CardDescription>Manage your currency and language preferences here.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Currency</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        <SelectItem value="USD">USD - United States Dollar</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      This sets your default currency for browsing.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!isEditing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="en-US">English (United States)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                      Language translation is a future feature.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-start gap-2 pt-4">
              {isEditing ? (
                <>
                  <Button variant="outline" type="button" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={!isDirty}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="outline" type="button" onClick={() => setIsEditing(true)}>
                  Edit Preferences
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
