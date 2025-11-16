"use client";

interface DashboardHeaderProps {
  healthStatus: {
    status: string;
    alerts: string[];
  };
  lastUpdate: Date | null;
}

export function DashboardHeader({ healthStatus, lastUpdate }: DashboardHeaderProps) {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Coal Mine Monitoring</h1>
          <p className="text-sm text-slate-400">Real-time health and environmental monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              healthStatus.status === "critical" ? "bg-red-500 animate-pulse" :
              healthStatus.status === "warning" ? "bg-yellow-500 animate-pulse" :
              healthStatus.status === "alert" ? "bg-orange-500" :
              "bg-green-500"
            }`} />
            <span className={`text-sm font-medium ${
              healthStatus.status === "critical" ? "text-red-400" :
              healthStatus.status === "warning" ? "text-yellow-400" :
              healthStatus.status === "alert" ? "text-orange-400" :
              "text-green-400"
            }`}>
              {healthStatus.status === "critical" ? "Critical" :
               healthStatus.status === "warning" ? "Warning" :
               healthStatus.status === "alert" ? "Alert" :
               "All Systems Normal"}
            </span>
          </div>
          {lastUpdate && (
            <div className="text-sm text-slate-400 border-l border-slate-700 pl-4">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
          <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              M
            </div>
            <div className="text-sm">
              <div className="text-white font-medium">Miner #001</div>
              <div className="text-slate-400 text-xs">Active</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

