import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LegalPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Legal</CardTitle>
        <CardDescription>Read our legal information here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Legal information will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
