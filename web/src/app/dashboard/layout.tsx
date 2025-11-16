"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { useMetrics } from "@/hooks/use-metrics";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { healthStatus, lastUpdate } = useMetrics();

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      <DashboardSidebar alertCount={healthStatus.alerts.length} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader healthStatus={healthStatus} lastUpdate={lastUpdate} />
        {children}
      </div>
    </div>
  );
}

