import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database } from '@/lib/icons';

export default function DataManagementPage() {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Data Management
          </CardTitle>
          <CardDescription>Manage your data here.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
          <p>Data management will be available here soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
