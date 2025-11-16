"use client";

import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { MetricsChart } from "@/components/metrics-chart";
import { useMetrics, THRESHOLDS } from "@/hooks/use-metrics";

export default function EnvironmentPage() {
  const { data, isLoading, error, currentMetrics } = useMetrics();

  return (
    <main className="flex-1 overflow-y-auto bg-slate-950 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Environment Monitoring</h2>
        <p className="text-slate-400">Track ambient conditions and environmental sensors</p>
      </div>

      {error && (
        <Card className="mb-6 border-red-500/50 bg-red-950/30 p-4">
          <p className="text-red-300">Error: {error}</p>
        </Card>
      )}

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
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
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className="border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-800/30">
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

          <div className="grid gap-6 lg:grid-cols-2">
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

