"use client";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { MetricsChart } from "@/components/metrics-chart";
import { useMetrics, THRESHOLDS } from "@/hooks/use-metrics";

export default function OverviewPage() {
  const { data, isLoading, error, currentMetrics } = useMetrics();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
      {error && (
        <Card className="mb-6 border-red-500/50 bg-red-950/30 p-4">
          <p className="text-red-300">
            Error: {error}
          </p>
          <p className="text-sm text-red-200/70 mt-2">
            Make sure you have set THINGS_SPEAK_CHANNEL_ID in your .env.local file
          </p>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-slate-700 bg-slate-800/50 p-4">
                <div className="h-20 flex items-center justify-center">
                  <Spinner className="size-6" />
                </div>
              </Card>
            ))}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-slate-700 bg-slate-800/50">
                <div className="p-6">
                  <div className="h-96 flex items-center justify-center">
                    <Spinner className="size-8" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : error ? (
        <Card className="border-slate-700 bg-slate-800/50 p-8">
          <div className="flex items-center justify-center">
            <div className="text-slate-300">
              Unable to load metrics. Please check your configuration and try again.
            </div>
          </div>
        </Card>
      ) : data.length === 0 ? (
        <Card className="border-slate-700 bg-slate-800/50 p-8">
          <div className="flex items-center justify-center">
            <div className="text-slate-300">
              No data available. Please check your configuration.
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Status Overview Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-800/30 hover:shadow-lg hover:shadow-blue-500/10 transition-all">
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

            <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-800/30 hover:shadow-lg hover:shadow-green-500/10 transition-all">
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

            <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-800/30 hover:shadow-lg hover:shadow-amber-500/10 transition-all">
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

            <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-800/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Ambient Temp</p>
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {currentMetrics?.ambientTemperature !== null && currentMetrics?.ambientTemperature !== undefined
                    ? currentMetrics?.ambientTemperature?.toFixed(1)
                    : "--"}
                </p>
                <p className="text-sm text-cyan-400">°C</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    currentMetrics?.ambientTemperature && currentMetrics.ambientTemperature > THRESHOLDS.ambientTemperature.critical
                      ? "bg-red-500 animate-pulse"
                      : currentMetrics?.ambientTemperature && currentMetrics.ambientTemperature > THRESHOLDS.ambientTemperature.max
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`} />
                  <span className="text-xs text-slate-400">
                    Max: {THRESHOLDS.ambientTemperature.max}°C
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Additional Sensors */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card className="border-slate-700 bg-slate-800/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Flame Sensor</p>
                  <p className="text-xl font-bold text-white">
                    {currentMetrics?.flameSensor === 1 ? "No Flame" : currentMetrics?.flameSensor === 0 ? "FLAME DETECTED" : "--"}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  currentMetrics?.flameSensor === 0 ? "bg-red-500 animate-pulse" : "bg-green-500"
                }`} />
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Light Level</p>
                  <p className="text-xl font-bold text-white">
                    {currentMetrics?.lightLevel ?? "--"}
                  </p>
                </div>
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </Card>

            <Card className="border-slate-700 bg-slate-800/30 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Distance</p>
                  <p className="text-xl font-bold text-white">
                    {currentMetrics?.distance !== null && currentMetrics?.distance !== undefined
                      ? `${currentMetrics.distance.toFixed(0)} cm`
                      : "--"}
                  </p>
                </div>
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </Card>
          </div>

          {/* Charts */}
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

            <MetricsChart
              title="Ambient Temperature"
              description="Mine ambient temperature"
              data={data}
              dataKey="ambientTemperature"
              unit="°C"
              color="#96ceb4"
              isLoading={isLoading}
            />

            <MetricsChart
              title="Light Level"
              description="Ambient light level"
              data={data}
              dataKey="lightLevel"
              unit=""
              color="#dfe6e9"
              isLoading={isLoading}
            />

            <MetricsChart
              title="Distance"
              description="Distance measurement"
              data={data}
              dataKey="distance"
              unit="cm"
              color="#a29bfe"
              isLoading={isLoading}
            />
          </div>
        </>
      )}
    </main>
  );
}

