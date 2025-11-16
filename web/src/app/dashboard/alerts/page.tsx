"use client";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useMetrics } from "@/hooks/use-metrics";

export default function AlertsPage() {
  const { isLoading, error, healthStatus } = useMetrics();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Alerts & Notifications</h2>
        <p className="text-slate-400">View all active alerts and system notifications</p>
      </div>

      {error && (
        <Card className="mb-6 border-red-500/50 bg-red-950/30 p-4">
          <p className="text-red-300">Error: {error}</p>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-700 bg-slate-800/50 p-4">
              <div className="h-20 flex items-center justify-center">
                <Spinner className="size-6" />
              </div>
            </Card>
          ))}
        </div>
      ) : healthStatus.alerts.length === 0 ? (
        <Card className="border-slate-700 bg-slate-800/50 p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <svg className="w-16 h-16 text-green-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">All Systems Normal</h3>
            <p className="text-slate-400">No active alerts at this time. All metrics are within normal ranges.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {healthStatus.alerts.map((alert, index) => (
            <Card
              key={index}
              className={`p-4 border ${
                alert.startsWith("Critical")
                  ? "border-red-500/50 bg-red-950/30"
                  : alert.startsWith("Warning")
                  ? "border-yellow-500/50 bg-yellow-950/30"
                  : "border-orange-500/50 bg-orange-950/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <svg className={`w-6 h-6 mt-0.5 ${
                  alert.startsWith("Critical") ? "text-red-400" :
                  alert.startsWith("Warning") ? "text-yellow-400" :
                  "text-orange-400"
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className={`font-semibold ${
                      alert.startsWith("Critical") ? "text-red-300" :
                      alert.startsWith("Warning") ? "text-yellow-300" :
                      "text-orange-300"
                    }`}>
                      {alert.split(":")[0]}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.startsWith("Critical") ? "bg-red-500/20 text-red-300" :
                      alert.startsWith("Warning") ? "bg-yellow-500/20 text-yellow-300" :
                      "bg-orange-500/20 text-orange-300"
                    }`}>
                      Active
                    </span>
                  </div>
                  <p className={`${
                    alert.startsWith("Critical") ? "text-red-200" :
                    alert.startsWith("Warning") ? "text-yellow-200" :
                    "text-orange-200"
                  }`}>
                    {alert.split(":")[1]?.trim() || alert}
                  </p>
                  <p className="text-xs text-slate-400 mt-2">
                    Detected at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}

