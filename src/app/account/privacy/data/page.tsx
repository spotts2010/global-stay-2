import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DataManagementPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Data Management</CardTitle>
        <CardDescription>Manage your data here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Data management will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
