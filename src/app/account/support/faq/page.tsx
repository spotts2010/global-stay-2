import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FaqPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">FAQs & Resources</CardTitle>
        <CardDescription>Find answers to common questions here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>FAQs and resources will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
