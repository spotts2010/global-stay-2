// src/components/admin/DashboardChartsClient.tsx

'use client';

import UserGrowthChart from '@/components/admin/UserGrowthChart';
import RevenueChart from '@/components/admin/RevenueChart';

export default function DashboardChartsClient() {
  return (
    <>
      <UserGrowthChart />
      <RevenueChart />
    </>
  );
}
