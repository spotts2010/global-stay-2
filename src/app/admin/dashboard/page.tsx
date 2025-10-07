// This is a new file, renamed from /src/app/admin/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dashboard } from '@/lib/icons';

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dashboard className="h-5 w-5 text-primary" />
            Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your admin dashboard. Use the sidebar to navigate.</p>
        </CardContent>
      </Card>
    </div>
  );
}
