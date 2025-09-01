import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AmenitiesPage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Amenities & Inclusions</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Manage your property amenities and inclusions here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
