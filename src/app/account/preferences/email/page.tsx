import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail } from '@/lib/icons';

export default function EmailPreferencesPage() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Mail className="h-6 w-6 text-primary" />
            Email Preferences
          </CardTitle>
          <CardDescription>Manage your email communication settings.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Email preference settings will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
