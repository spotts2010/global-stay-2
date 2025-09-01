import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function PrivacyStatementPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Privacy Statement</CardTitle>
        <CardDescription>Read our privacy statement here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>The privacy statement will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
