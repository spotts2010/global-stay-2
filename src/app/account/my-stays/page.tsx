import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function MyStaysPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Stays</CardTitle>
        <CardDescription>View your upcoming and past bookings here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Please select a category from the sidebar.</p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/account/my-stays/upcoming" className="text-primary underline">
              Upcoming Stays
            </Link>
            <Link href="/account/my-stays/past" className="text-primary underline">
              Past Stays
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
