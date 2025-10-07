'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flag, Trash2, CheckCircle, ArrowLeft } from '@/lib/icons';
import { Separator } from '@/components/ui/separator';

export default function ViewNotificationDetailPage() {
  return (
    <Card>
      <CardHeader>
        <Button asChild variant="ghost" className="mb-4 w-fit p-0 h-auto">
          <Link href="/account/notifications/view">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </Link>
        </Button>
        <CardTitle className="font-headline text-2xl">Subject</CardTitle>
        <CardDescription>Timestamp</CardDescription>
      </CardHeader>
      <CardContent className="prose prose-sm max-w-none text-foreground dark:prose-invert">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </p>
        <p>
          Best Regards,
          <br />
          <strong>Sample Signature</strong>
        </p>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex-col sm:flex-row gap-2">
        <Button variant="outline">
          <CheckCircle className="mr-2 h-4 w-4" />
          Mark As Read
        </Button>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
        <Button variant="secondary">
          <Flag className="mr-2 h-4 w-4" />
          Flag As Important
        </Button>
      </CardFooter>
    </Card>
  );
}
