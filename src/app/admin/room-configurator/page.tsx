import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RoomConfiguratorPage() {
  return (
    <div className="flex-1 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Room Configurator</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Configure room types and settings here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
