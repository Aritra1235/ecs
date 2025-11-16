"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeviceReadings, THRESHOLDS, Reading } from "@/hooks/use-device-readings";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  timestamp: string;
  value: number | null;
}

function MetricChart({
  title,
  data,
  dataKey,
  unit,
  color,
  index,
}: {
  title: string;
  data: Reading[];
  dataKey: keyof Reading;
  unit: string;
  color: string;
  index: number;
}) {
  const chartData: ChartData[] = data
    .filter((reading) => reading[dataKey] !== null && reading[dataKey] !== undefined && typeof reading[dataKey] === 'number')
    .map((reading) => ({
      timestamp: new Date(reading.timestamp).toLocaleTimeString(),
      value: reading[dataKey] as number,
    }));

  const currentValue = chartData.length > 0 ? chartData[chartData.length - 1]?.value : null;
  const minValue =
    chartData.length > 0 ? Math.min(...chartData.map((d) => d.value || 0)) : 0;
  const maxValue =
    chartData.length > 0 ? Math.max(...chartData.map((d) => d.value || 0)) : 0;

  return (
    <Card
      className="p-6 backdrop-blur-sm hover:scale-[1.02] transition-all duration-500"
      style={{
        animation: `fade-in-up 0.5s ease-out ${index * 100}ms both`,
      }}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex gap-4 text-sm">
          <div>
            <span className="opacity-70">Current: </span>
            <span className="font-semibold">
              {currentValue !== null ? currentValue.toFixed(2) : "N/A"} {unit}
            </span>
          </div>
          <div>
            <span className="opacity-70">Min: </span>
            <span className="font-semibold">
              {minValue.toFixed(2)} {unit}
            </span>
          </div>
          <div>
            <span className="opacity-70">Max: </span>
            <span className="font-semibold">
              {maxValue.toFixed(2)} {unit}
            </span>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center opacity-70">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 11 }}
              angle={-45}
              textAnchor="end"
              height={70}
            />
            <YAxis label={{ value: unit, angle: -90, position: "insideLeft" }} />
            <Tooltip
              formatter={(value) => [`${(value as number).toFixed(2)} ${unit}`, title]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

export default function DevicePage() {
  const params = useParams();
  const deviceId = params.deviceId as string;
  const { readings, currentReading, healthStatus, isLoading, lastUpdate } =
    useDeviceReadings(deviceId);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
    <main className="flex-1 overflow-y-auto p-6 md:p-8">
      {/* Header */}
      <div
        className={`mb-8 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{deviceId}</h1>
            <p className="opacity-80">Real-time device monitoring and analytics</p>
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

        {/* Status Banner */}
        {healthStatus.alerts.length > 0 && (
          <Card
            className={`p-4 ${getStatusColor(healthStatus.status)} animate-fade-in`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold mb-1">
                  {healthStatus.status === "critical"
                    ? "⚠️ Critical Status"
                    : healthStatus.status === "warning"
                    ? "⚠️ Warning Status"
                    : "ℹ️ Alert Status"}
                </div>
                <div className="text-sm opacity-90">
                  {healthStatus.alerts.join(" • ")}
                </div>
              </div>
              <Badge variant="secondary">
                {healthStatus.alerts.length} Alert
                {healthStatus.alerts.length > 1 ? "s" : ""}
              </Badge>
            </div>
          </Card>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner className="size-12" />
        </div>
      ) : !currentReading ? (
        <Card className="p-12 text-center backdrop-blur-sm">
          <div className="text-6xl mb-4 opacity-50">📊</div>
          <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
          <p className="opacity-70">
            This device has not sent any readings yet.
          </p>
        </Card>
      ) : (
        <>
          {/* Current Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card
              className="p-5 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              style={{ animation: "fade-in-up 0.5s ease-out 0ms both" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs opacity-70 uppercase tracking-wider">
                  Heart Rate
                </div>
                <svg
                  className="w-5 h-5 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-1">
                {currentReading.heart_bpm?.toFixed(0) ?? "--"}
              </div>
              <div className="text-sm opacity-70">BPM</div>
              <div className="mt-3 flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentReading.heart_bpm &&
                    currentReading.heart_bpm > THRESHOLDS.heartRate.critical
                      ? "bg-red-500 animate-pulse"
                      : currentReading.heart_bpm &&
                        (currentReading.heart_bpm < THRESHOLDS.heartRate.min ||
                          currentReading.heart_bpm > THRESHOLDS.heartRate.max)
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="text-xs opacity-70">
                  Normal: {THRESHOLDS.heartRate.min}-{THRESHOLDS.heartRate.max}
                </span>
              </div>
            </Card>

            <Card
              className="p-5 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              style={{ animation: "fade-in-up 0.5s ease-out 100ms both" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs opacity-70 uppercase tracking-wider">SpO2</div>
                <svg
                  className="w-5 h-5 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-1">
                {currentReading.spo2_pct?.toFixed(0) ?? "--"}
              </div>
              <div className="text-sm opacity-70">%</div>
              <div className="mt-3 flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentReading.spo2_pct &&
                    currentReading.spo2_pct < THRESHOLDS.spo2.critical
                      ? "bg-red-500 animate-pulse"
                      : currentReading.spo2_pct &&
                        currentReading.spo2_pct < THRESHOLDS.spo2.warning
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="text-xs opacity-70">Normal: &gt;95%</span>
              </div>
            </Card>

            <Card
              className="p-5 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              style={{ animation: "fade-in-up 0.5s ease-out 200ms both" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs opacity-70 uppercase tracking-wider">
                  Body Temp
                </div>
                <svg
                  className="w-5 h-5 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-1">
                {currentReading.skin_temp_f?.toFixed(1) ?? "--"}
              </div>
              <div className="text-sm opacity-70">°F</div>
              <div className="mt-3 flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentReading.skin_temp_f &&
                    currentReading.skin_temp_f > THRESHOLDS.bodyTemperature.critical
                      ? "bg-red-500 animate-pulse"
                      : currentReading.skin_temp_f &&
                        (currentReading.skin_temp_f <
                          THRESHOLDS.bodyTemperature.min ||
                          currentReading.skin_temp_f >
                            THRESHOLDS.bodyTemperature.max)
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="text-xs opacity-70">
                  Normal: {THRESHOLDS.bodyTemperature.min}-
                  {THRESHOLDS.bodyTemperature.max}°F
                </span>
              </div>
            </Card>

            <Card
              className="p-5 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              style={{ animation: "fade-in-up 0.5s ease-out 300ms both" }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs opacity-70 uppercase tracking-wider">
                  Ambient Temp
                </div>
                <svg
                  className="w-5 h-5 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-1">
                {currentReading.env_temp_c?.toFixed(1) ?? "--"}
              </div>
              <div className="text-sm opacity-70">°C</div>
              <div className="mt-3 flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    currentReading.env_temp_c &&
                    currentReading.env_temp_c > THRESHOLDS.ambientTemperature.critical
                      ? "bg-red-500 animate-pulse"
                      : currentReading.env_temp_c &&
                        currentReading.env_temp_c > THRESHOLDS.ambientTemperature.max
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                />
                <span className="text-xs opacity-70">
                  Max: {THRESHOLDS.ambientTemperature.max}°C
                </span>
              </div>
            </Card>
          </div>

          {/* Additional Sensors */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card
              className="p-5 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              style={{ animation: "fade-in-up 0.5s ease-out 400ms both" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs opacity-70 mb-1">Flame Sensor</div>
                  <div className="text-xl font-bold">
                    {currentReading.flame ? "FLAME DETECTED" : "No Flame"}
                  </div>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    currentReading.flame ? "bg-red-500 animate-pulse" : "bg-green-500"
                  }`}
                />
              </div>
            </Card>

            <Card
              className="p-5 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              style={{ animation: "fade-in-up 0.5s ease-out 500ms both" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs opacity-70 mb-1">Light Level</div>
                  <div className="text-xl font-bold">
                    {currentReading.light_raw ?? "--"}
                  </div>
                </div>
                <svg
                  className="w-6 h-6 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </Card>

            <Card
              className="p-5 backdrop-blur-sm hover:scale-105 transition-all duration-300"
              style={{ animation: "fade-in-up 0.5s ease-out 600ms both" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs opacity-70 mb-1">Distance</div>
                  <div className="text-xl font-bold">
                    {currentReading.distance_cm !== null &&
                    currentReading.distance_cm !== undefined
                      ? `${currentReading.distance_cm.toFixed(0)} cm`
                      : "--"}
                  </div>
                </div>
                <svg
                  className="w-6 h-6 opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <MetricChart
              title="Heart Rate"
              data={readings}
              dataKey="heart_bpm"
              unit="BPM"
              color="#ff6b6b"
              index={0}
            />

            <MetricChart
              title="SpO2"
              data={readings}
              dataKey="spo2_pct"
              unit="%"
              color="#4ecdc4"
              index={1}
            />

            <MetricChart
              title="Body Temperature"
              data={readings}
              dataKey="skin_temp_f"
              unit="°F"
              color="#45b7d1"
              index={2}
            />

            <MetricChart
              title="Ambient Temperature"
              data={readings}
              dataKey="env_temp_c"
              unit="°C"
              color="#96ceb4"
              index={3}
            />

            <MetricChart
              title="Light Level"
              data={readings}
              dataKey="light_raw"
              unit=""
              color="#dfe6e9"
              index={4}
            />

            <MetricChart
              title="Distance"
              data={readings}
              dataKey="distance_cm"
              unit="cm"
              color="#a29bfe"
              index={5}
            />
          </div>
        </>
      )}
    </main>
  );
}

