import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SecuritySettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Security Settings</CardTitle>
        <CardDescription>Manage your password and account security.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4 max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Leave blank to keep current password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button type="submit">Update Password</Button>
        </form>
      </CardContent>
    </Card>
  );
}
