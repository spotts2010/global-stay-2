import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function MyStaysPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          My Stays
        </CardTitle>
        <CardDescription>View your past and upcoming bookings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>You have no upcoming stays.</p>
        </div>
      </CardContent>
    </Card>
  );
}
