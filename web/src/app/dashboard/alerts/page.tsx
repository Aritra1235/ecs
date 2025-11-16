"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAllAlerts, DeviceAlert } from "@/hooks/use-all-alerts";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function AlertCard({ alert, index }: { alert: DeviceAlert; index: number }) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-red-500/50 bg-red-500/5";
      case "warning":
        return "border-yellow-500/50 bg-yellow-500/5";
      case "alert":
        return "border-orange-500/50 bg-orange-500/5";
      default:
        return "border-gray-500/50 bg-gray-500/5";
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive";
      case "warning":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "Heart Rate":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case "SpO2":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case "Body Temperature":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case "Ambient Temperature":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
        );
      case "Flame Sensor":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  const formatValue = (metric: string, value: number | boolean | null) => {
    if (value === null) return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    
    switch (metric) {
      case "Heart Rate":
        return `${value.toFixed(0)} BPM`;
      case "SpO2":
        return `${value.toFixed(0)}%`;
      case "Body Temperature":
        return `${value.toFixed(1)}°F`;
      case "Ambient Temperature":
        return `${value.toFixed(1)}°C`;
      default:
        return value.toString();
    }
  };

  return (
    <Card
      className={`p-6 border-2 ${getSeverityColor(alert.severity)} transition-all duration-500 hover:scale-[1.02]`}
      style={{
        animation: `fade-in-up 0.5s ease-out ${index * 50}ms both`,
      }}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${alert.severity === "critical" ? "bg-red-500/20" : alert.severity === "warning" ? "bg-yellow-500/20" : "bg-orange-500/20"}`}>
          {getMetricIcon(alert.metric)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <Link 
                href={`/dashboard/device/${alert.deviceId}`}
                className="text-lg font-semibold hover:underline"
              >
                {alert.deviceId}
              </Link>
              <p className="text-sm opacity-70">{alert.metric}</p>
            </div>
            <Badge variant={getSeverityBadgeVariant(alert.severity) as any}>
              {alert.severity.toUpperCase()}
            </Badge>
          </div>
          
          <p className="text-base mb-3">{alert.message}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="opacity-70">Value:</span>
              <span className="font-semibold">{formatValue(alert.metric, alert.value)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="opacity-70">Time:</span>
              <span className="font-medium">{new Date(alert.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        <Link href={`/dashboard/device/${alert.deviceId}`}>
          <Button variant="outline" size="sm">
            View Device
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default function AlertsPage() {
  const { alerts, isLoading, criticalCount, warningCount, totalCount, lastUpdate } = useAllAlerts();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      <div
        className={`mb-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">System Alerts</h1>
            <p className="opacity-80">Real-time monitoring of all device alerts and warnings</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <div className="text-sm opacity-70">
                Updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card className="p-5 backdrop-blur-sm" style={{ animation: "fade-in-up 0.5s ease-out 0ms both" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Critical</div>
                <div className="text-3xl font-bold">{criticalCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-red-500/20">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-5 backdrop-blur-sm" style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Warnings</div>
                <div className="text-3xl font-bold">{warningCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-5 backdrop-blur-sm" style={{ animation: "fade-in-up 0.5s ease-out 200ms both" }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs opacity-70 uppercase tracking-wider mb-1">Total Alerts</div>
                <div className="text-3xl font-bold">{totalCount}</div>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/20">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="size-12" />
        </div>
      ) : alerts.length === 0 ? (
        <Card className="p-12 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold mb-2">All Systems Normal</h3>
          <p className="opacity-70">
            No active alerts. All devices are operating within normal parameters.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <AlertCard key={`${alert.deviceId}-${alert.metric}-${alert.timestamp}`} alert={alert} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}

