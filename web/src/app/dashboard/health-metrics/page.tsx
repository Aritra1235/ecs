"use client";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { MetricsChart } from "@/components/metrics-chart";
import { useMetrics, THRESHOLDS } from "@/hooks/use-metrics";

export default function HealthMetricsPage() {
  const { data, isLoading, error, currentMetrics } = useMetrics();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Health Metrics</h2>
        <p className="text-slate-400">Monitor miner's vital signs and health indicators</p>
      </div>

      {error && (
        <Card className="mb-6 border-red-500/50 bg-red-950/30 p-4">
          <p className="text-red-300">Error: {error}</p>
        </Card>
      )}

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-slate-700 bg-slate-800/50">
              <div className="p-6">
                <div className="h-96 flex items-center justify-center">
                  <Spinner className="size-8" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : data.length === 0 ? (
        <Card className="border-slate-700 bg-slate-800/50 p-8">
          <div className="flex items-center justify-center">
            <div className="text-slate-300">No data available.</div>
          </div>
        </Card>
      ) : (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-800/30">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Heart Rate</p>
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {currentMetrics?.heartRate !== null && currentMetrics?.heartRate !== undefined
                    ? currentMetrics?.heartRate?.toFixed(0)
                    : "--"}
                </p>
                <p className="text-sm text-blue-400">BPM</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    currentMetrics?.heartRate && currentMetrics.heartRate > THRESHOLDS.heartRate.critical
                      ? "bg-red-500 animate-pulse"
                      : currentMetrics?.heartRate && (currentMetrics.heartRate < THRESHOLDS.heartRate.min || currentMetrics.heartRate > THRESHOLDS.heartRate.max)
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`} />
                  <span className="text-xs text-slate-400">
                    Normal: {THRESHOLDS.heartRate.min}-{THRESHOLDS.heartRate.max}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-800/30">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">SpO2</p>
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {currentMetrics?.spo2 !== null && currentMetrics?.spo2 !== undefined
                    ? currentMetrics?.spo2?.toFixed(0)
                    : "--"}
                </p>
                <p className="text-sm text-green-400">%</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    currentMetrics?.spo2 && currentMetrics.spo2 < THRESHOLDS.spo2.critical
                      ? "bg-red-500 animate-pulse"
                      : currentMetrics?.spo2 && currentMetrics.spo2 < THRESHOLDS.spo2.warning
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`} />
                  <span className="text-xs text-slate-400">
                    Normal: {">"}95%
                  </span>
                </div>
              </div>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-800/30">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Body Temp</p>
                  <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {currentMetrics?.bodyTemperature !== null && currentMetrics?.bodyTemperature !== undefined
                    ? currentMetrics?.bodyTemperature?.toFixed(1)
                    : "--"}
                </p>
                <p className="text-sm text-amber-400">°F</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    currentMetrics?.bodyTemperature && currentMetrics.bodyTemperature > THRESHOLDS.bodyTemperature.critical
                      ? "bg-red-500 animate-pulse"
                      : currentMetrics?.bodyTemperature && (currentMetrics.bodyTemperature < THRESHOLDS.bodyTemperature.min || currentMetrics.bodyTemperature > THRESHOLDS.bodyTemperature.max)
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`} />
                  <span className="text-xs text-slate-400">
                    Normal: {THRESHOLDS.bodyTemperature.min}-{THRESHOLDS.bodyTemperature.max}°F
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <MetricsChart
              title="Heart Rate"
              description="Miner's heart rate over time"
              data={data}
              dataKey="heartRate"
              unit="BPM"
              color="#ff6b6b"
              isLoading={isLoading}
            />

            <MetricsChart
              title="SpO2"
              description="Blood oxygen saturation"
              data={data}
              dataKey="spo2"
              unit="%"
              color="#4ecdc4"
              isLoading={isLoading}
            />

            <MetricsChart
              title="Body Temperature"
              description="Miner's body temperature"
              data={data}
              dataKey="bodyTemperature"
              unit="°F"
              color="#45b7d1"
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </main>
  );
}

