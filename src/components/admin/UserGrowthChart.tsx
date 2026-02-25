// src/components/admin/UserGrowthChart.tsx

'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const data = [
  { month: 'Jan', total: Math.floor(Math.random() * 500) + 100 },
  { month: 'Feb', total: Math.floor(Math.random() * 500) + 100 },
  { month: 'Mar', total: Math.floor(Math.random() * 500) + 100 },
  { month: 'Apr', total: Math.floor(Math.random() * 500) + 100 },
  { month: 'May', total: Math.floor(Math.random() * 500) + 100 },
  { month: 'Jun', total: Math.floor(Math.random() * 500) + 100 },
];

export default function UserGrowthChart() {
  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
            }}
            cursor={{ fill: 'hsl(var(--accent))' }}
          />
          <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
