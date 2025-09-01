import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CurrencyLanguagePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Currency & Language</CardTitle>
        <CardDescription>Manage your currency and language preferences here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Currency and language preferences will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
