import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Server, CheckCircle2, ShieldAlert } from '@/lib/icons';
import { Badge } from '../ui/badge';

export default function SystemStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          System Status
        </CardTitle>
        <CardDescription>Health and verification overview.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-medium">API Status</p>
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            All Systems Normal
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <p className="font-medium">Pending Host Verifications</p>
            <p>12 / 30</p>
          </div>
          <Progress value={(12 / 30) * 100} />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <p className="font-medium">Pending Property Approvals</p>
            <p>8 / 20</p>
          </div>
          <Progress value={(8 / 20) * 100} />
        </div>
        <div className="flex items-center text-sm">
          <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
          <p>Last check: Just now</p>
        </div>
        <div className="flex items-center text-sm">
          <ShieldAlert className="h-4 w-4 mr-2 text-amber-500" />
          <p>0 Security Alerts</p>
        </div>
      </CardContent>
    </Card>
  );
}
