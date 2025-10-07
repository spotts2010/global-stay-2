'use client';

import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FileText, Save, Loader2, GitCommit } from '@/lib/icons';
import type { LegalPage } from '@/lib/data';
import { updateLegalPageAction } from '@/app/actions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import RichTextEditor from './RichTextEditor';

const legalPageSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty.'),
  versionNote: z.string().optional(),
});

type LegalPageFormValues = z.infer<typeof legalPageSchema>;

interface EditorProps {
  pageType: 'terms-and-conditions' | 'privacy-policy';
  title: string;
  initialPageData: LegalPage | null;
}

function LegalPageEditor({ pageType, title, initialPageData }: EditorProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<LegalPageFormValues>({
    resolver: zodResolver(legalPageSchema),
    defaultValues: {
      content: initialPageData?.content || '',
      versionNote: '',
    },
  });

  const handleSave = (formData: LegalPageFormValues) => {
    startTransition(async () => {
      const result = await updateLegalPageAction(pageType, formData);
      if (result.success) {
        toast({
          title: 'Page Updated',
          description: `The ${title} page has been saved.`,
        });
        form.reset(formData);
      } else {
        toast({
          variant: 'destructive',
          title: 'Update Failed',
          description: result.error,
        });
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="versionNote">Version Note (Optional)</Label>
                <Input
                  id="versionNote"
                  {...form.register('versionNote')}
                  placeholder="e.g., Updated section 3.1 for clarity"
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <div className="text-xs text-muted-foreground flex items-center gap-2 pt-2">
              <GitCommit className="h-4 w-4" />
              <span>Version: {initialPageData?.version ?? 1}</span>
            </div>
            <Button type="submit" disabled={isPending || !form.formState.isDirty}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </CardFooter>
      </form>
    </Form>
  );
}

interface LegalAdminClientProps {
  initialTermsData: LegalPage | null;
  initialPrivacyData: LegalPage | null;
}

export default function LegalAdminClient({
  initialTermsData,
  initialPrivacyData,
}: LegalAdminClientProps) {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Manage Legal Pages
          </CardTitle>
          <CardDescription>
            Edit the content for the Terms & Conditions and Privacy Policy pages.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="terms">
            <TabsList>
              <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
              <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="mt-4 border rounded-lg">
              <LegalPageEditor
                pageType="terms-and-conditions"
                title="Terms & Conditions"
                initialPageData={initialTermsData}
              />
            </TabsContent>

            <TabsContent value="privacy" className="mt-4 border rounded-lg">
              <LegalPageEditor
                pageType="privacy-policy"
                title="Privacy Policy"
                initialPageData={initialPrivacyData}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
