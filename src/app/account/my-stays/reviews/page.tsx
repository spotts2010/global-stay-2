import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReviewsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Reviews & Ratings</CardTitle>
        <CardDescription>Manage your reviews and ratings here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Reviews and ratings will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
