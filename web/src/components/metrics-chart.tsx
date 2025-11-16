"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricData {
  timestamp: string;
  date: Date;
  [key: string]: string | number | Date | null;
}

interface MetricsChartProps {
  title: string;
  description?: string;
  data: MetricData[];
  dataKey: string;
  unit: string;
  color: string;
  isLoading?: boolean;
}

export function MetricsChart({
  title,
  description,
  data,
  dataKey,
  unit,
  color,
  isLoading,
}: MetricsChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter((item) => item[dataKey] !== null && item[dataKey] !== undefined)
      .map((item) => ({
        ...item,
        displayValue: item[dataKey],
      }));
  }, [data, dataKey]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const minValue = Math.min(
    ...chartData
      .map((item) => (item.displayValue as number) || 0)
      .filter((v) => !isNaN(v))
  );
  const maxValue = Math.max(
    ...chartData
      .map((item) => (item.displayValue as number) || 0)
      .filter((v) => !isNaN(v))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
        <div className="flex gap-4 text-sm pt-2">
          <div>
            <span className="text-muted-foreground">Current: </span>
            <span className="font-semibold">
              {typeof chartData[chartData.length - 1]?.displayValue === 'number'
                ? (chartData[chartData.length - 1]?.displayValue as number).toFixed(2)
                : 'N/A'} {unit}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Min: </span>
            <span className="font-semibold">{minValue.toFixed(2)} {unit}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Max: </span>
            <span className="font-semibold">{maxValue.toFixed(2)} {unit}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              label={{ value: unit, angle: -90, position: "insideLeft" }}
            />
            <Tooltip
              formatter={(value) =>
                [`${(value as number).toFixed(2)} ${unit}`, "Value"]
              }
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line
              type="monotone"
              dataKey="displayValue"
              stroke={color}
              dot={false}
              isAnimationActive={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

