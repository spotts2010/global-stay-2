// This is a new file, renamed from /src/app/admin/users/page.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users } from '@/lib/icons';

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Users
          </CardTitle>
          <CardDescription>Manage your users here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg">
            <p>User management tools will be displayed here.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
