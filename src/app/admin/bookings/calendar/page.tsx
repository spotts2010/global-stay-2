import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export default function BookingsCalendarPage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Bookings Calendar
          </CardTitle>
          <CardDescription>
            View and manage all property bookings from a central calendar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg">
            <p>The bookings management calendar will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
