// This is a new file, renamed from /src/app/admin/database/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database } from 'lucide-react';

export default function DatabaseMaintenancePage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Database Maintenance
          </CardTitle>
          <CardDescription>
            View system information and perform database maintenance tasks here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg">
            <p>Database maintenance tools will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
