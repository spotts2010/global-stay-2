import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SuggestionsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Smart Suggestions</CardTitle>
        <CardDescription>Manage your smart suggestion preferences here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Smart suggestion preferences will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
