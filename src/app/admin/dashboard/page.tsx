// src/app/admin/dashboard/page.tsx

'use client';

import dynamic from 'next/dynamic';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import StatCard from '@/components/admin/StatCard';
import RecentActivity from '@/components/admin/RecentActivity';
import TopPerformingTable from '@/components/admin/TopPerformingTable';
import SystemStatus from '@/components/admin/SystemStatus';
import {
  Dashboard,
  DollarSign,
  Users,
  ListingsIcon,
  Briefcase,
  Activity,
  BarChart,
} from '@/lib/icons';

const DashboardChartsClient = dynamic(() => import('@/components/admin/DashboardChartsClient'), {
  ssr: false,
});

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Dashboard className="h-6 w-6 text-primary" />
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            A high-level overview of all platform activity and metrics.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$45,231.89"
          change="+20.1% from last month"
          icon={DollarSign}
        />
        <StatCard
          title="Active Listings"
          value="2,350"
          change="+180 this month"
          icon={ListingsIcon}
        />
        <StatCard title="New Users" value="1,250" change="+12.5% from last month" icon={Users} />
        <StatCard title="Bookings (30d)" value="573" change="+5 since yesterday" icon={Briefcase} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              User Growth
            </CardTitle>
            <CardDescription>New user registrations over the past 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardChartsClient />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        <div className="lg:col-span-5">
          <TopPerformingTable />
        </div>
        <div className="lg:col-span-2">
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}
