'use client';

import { Suspense } from 'react';
// import { DashboardStats } from '@/components/admin/dashboard-stats';
// import { AnalyticsChart } from '@/components/admin/analytics-chart';
// import { RecentActivity } from '@/components/admin/recent-activity';
// import { VisitorStats } from '@/components/admin/visitor-stats';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your news platform.
        </p>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        {/* <DashboardStats /> */}
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<LoadingSpinner />}>
          {/* <AnalyticsChart /> */}
        </Suspense>
        
        <Suspense fallback={<LoadingSpinner />}>
          {/* <VisitorStats /> */}
        </Suspense>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        {/* <RecentActivity /> */}
      </Suspense>
    </div>
  );
}