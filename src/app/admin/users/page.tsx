import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your users here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
