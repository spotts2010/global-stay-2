import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Terms & Conditions</CardTitle>
        <CardDescription>Read our terms and conditions here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Terms and conditions will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
