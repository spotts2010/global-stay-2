'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from '@/lib/icons';
import type { LegalPage } from '@/lib/data';

interface ViewerProps {
  pageType: 'terms-and-conditions' | 'privacy-policy';
  title: string;
  initialPageData: LegalPage | null;
}

export default function LegalPageClient({ title, initialPageData }: ViewerProps) {
  if (!initialPageData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Could not load page content. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  const contentHtml = initialPageData.content || '<p>Could not load content.</p>';

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1.5 mb-4 sm:mb-0">
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              {title}
            </CardTitle>
            <CardDescription>
              Last updated:{' '}
              {initialPageData
                ? new Date(initialPageData.lastModified).toLocaleDateString()
                : 'N/A'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Apply Prose styling to render HTML content with headings, lists, and line breaks */}
        <div
          className="prose max-w-none text-foreground dark:prose-invert prose-p:leading-relaxed prose-h1:font-bold prose-h1:text-3xl prose-h2:font-bold prose-h2:text-2xl prose-h3:font-bold prose-h3:text-xl prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </CardContent>
    </Card>
  );
}
