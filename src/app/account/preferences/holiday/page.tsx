import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plane } from '@/lib/icons';

export default function HolidayPreferencesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Plane className="h-6 w-6 text-primary" />
            Holiday Preferences
          </CardTitle>
          <CardDescription>Set your general holiday and travel style preferences.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Holiday preference settings will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
