import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: ElementType;
}

export default function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{change}</p>
      </CardContent>
    </Card>
  );
}
