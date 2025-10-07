import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HelpCircle } from '@/lib/icons';

export default function FaqPage() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            FAQs & Resources
          </CardTitle>
          <CardDescription>Find answers to common questions here.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>FAQs and resources will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
