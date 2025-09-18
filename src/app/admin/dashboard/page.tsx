// This is a new file, renamed from /src/app/admin/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to your admin dashboard. Use the sidebar to navigate.</p>
        </CardContent>
      </Card>
    </div>
  );
}
