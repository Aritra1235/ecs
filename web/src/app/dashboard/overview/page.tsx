"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { useDevices } from "@/hooks/use-devices";
import { useDeviceReadings, THRESHOLDS } from "@/hooks/use-device-readings";
import Link from "next/link";

function DeviceCard({ deviceId, index }: { deviceId: string; index: number }) {
  const { currentReading, healthStatus, isLoading } = useDeviceReadings(deviceId, 1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      case "warning":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "alert":
        return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "normal":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  return (
    <Link href={`/dashboard/device/${deviceId}`}>
      <Card
        className="p-6 hover:scale-105 transition-all duration-500 cursor-pointer backdrop-blur-sm border-2 hover:shadow-2xl group"
        style={{
          animation: `fade-in-up 0.5s ease-out ${index * 100}ms both`,
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8" />
          </div>
        ) : !currentReading ? (
          <div className="text-center py-12 opacity-70">
            <p className="text-sm">No data available</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm opacity-70 mb-1">Device</div>
                <div className="text-xl font-bold group-hover:scale-105 transition-transform">
                  {deviceId}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      healthStatus.status === "critical" ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      healthStatus.status === "critical" ? "bg-red-500" : "bg-green-500"
                    }`}
                  ></span>
                </span>
                <span className="text-xs opacity-70">Live</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Heart Rate */}
              <div className="p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-105">
                <div className="text-xs opacity-70 mb-2">Heart Rate</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold">
                    {currentReading.heart_bpm?.toFixed(0) ?? "--"}
                  </span>
                  <span className="text-xs opacity-70">BPM</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: currentReading.heart_bpm
                        ? `${Math.min((currentReading.heart_bpm / 120) * 100, 100)}%`
                        : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* SpO2 */}
              <div className="p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-105">
                <div className="text-xs opacity-70 mb-2">SpO2</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold">
                    {currentReading.spo2_pct?.toFixed(0) ?? "--"}
                  </span>
                  <span className="text-xs opacity-70">%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: currentReading.spo2_pct ? `${currentReading.spo2_pct}%` : "0%",
                    }}
                  ></div>
                </div>
              </div>

              {/* Skin Temp */}
              <div className="p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-105">
                <div className="text-xs opacity-70 mb-2">Skin Temp</div>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-2xl font-bold">
                    {currentReading.skin_temp_f?.toFixed(1) ?? "--"}
                  </span>
                  <span className="text-xs opacity-70">°F</span>
                </div>
                <div className="text-xs opacity-70">
                  {currentReading.skin_temp_f &&
                  currentReading.skin_temp_f >= THRESHOLDS.bodyTemperature.min &&
                  currentReading.skin_temp_f <= THRESHOLDS.bodyTemperature.max
                    ? "Normal range"
                    : "Out of range"}
                </div>
              </div>

              {/* Gas & Flame */}
              <div className="p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-105">
                <div className="text-xs opacity-70 mb-2">Gas & Flame</div>
                <div className="flex items-baseline gap-2 mb-3">
                  <Badge
                    variant={currentReading.flame ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {currentReading.flame ? "FLAME" : "Normal"}
                  </Badge>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      currentReading.flame ? "w-full bg-red-500" : "w-1/4"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className={`p-4 rounded-xl border ${getStatusColor(healthStatus.status)}`}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  {healthStatus.status === "critical"
                    ? "Critical Status"
                    : healthStatus.status === "warning"
                    ? "Warning"
                    : healthStatus.status === "alert"
                    ? "Alert"
                    : healthStatus.status === "normal"
                    ? "All Systems Normal"
                    : "Unknown Status"}
                </span>
                <span className="opacity-70">
                  {healthStatus.alerts.length > 0
                    ? `${healthStatus.alerts.length} alert${
                        healthStatus.alerts.length > 1 ? "s" : ""
                      }`
                    : "No alerts"}
                </span>
              </div>
            </div>
          </>
        )}
      </Card>
    </Link>
  );
}

export default function OverviewPage() {
  const { devices, isLoading: devicesLoading, error } = useDevices();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      {/* Header */}
      <div
        className={`mb-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h1 className="text-4xl font-bold mb-2">Overview</h1>
        <p className="opacity-80">
          Real-time monitoring of all mining helmet devices
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-red-500/50 bg-red-950/30 p-6">
          <p className="text-red-300">Error: {error}</p>
        </Card>
      )}

      {devicesLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-center py-20">
                <Spinner className="size-8" />
              </div>
            </Card>
          ))}
        </div>
      ) : devices.length === 0 ? (
        <Card className="p-12 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4 opacity-50">📡</div>
          <h3 className="text-xl font-semibold mb-2">No Devices Found</h3>
          <p className="opacity-70">
            No mining helmet devices are currently registered in the system.
          </p>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((deviceId, index) => (
            <DeviceCard key={deviceId} deviceId={deviceId} index={index} />
          ))}
        </div>
      )}
    </main>
  );
}
