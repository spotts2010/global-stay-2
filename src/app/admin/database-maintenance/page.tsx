import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DatabaseMaintenancePage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Maintenance</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Perform database maintenance tasks here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
