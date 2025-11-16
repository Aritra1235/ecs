import { useEffect, useState } from "react";

export interface MetricData {
  timestamp: string;
  date: Date;
  heartRate: number | null;
  spo2: number | null;
  bodyTemperature: number | null;
  ambientTemperature: number | null;
  flameSensor: number | null;
  lightLevel: number | null;
  distance: number | null;
  redundantLightLevel: number | null;
  [key: string]: string | number | Date | null;
}

export const THRESHOLDS = {
  heartRate: { min: 60, max: 100, critical: 120 },
  spo2: { min: 95, warning: 90, critical: 85 },
  bodyTemperature: { min: 97, max: 99, critical: 101 },
  ambientTemperature: { max: 35, critical: 40 },
};

export function useMetrics() {
  const [data, setData] = useState<MetricData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/metrics");

        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }

        const result = await response.json();
        setData(result.feeds);
        setLastUpdate(new Date(result.lastUpdate));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch metrics"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();

    const interval = setInterval(fetchMetrics, 30000);

    return () => clearInterval(interval);
  }, []);

  const currentMetrics = data[data.length - 1];

  const getHealthStatus = () => {
    if (!currentMetrics) return { status: "unknown", alerts: [] };
    
    const alerts: string[] = [];
    
    if (currentMetrics.heartRate && currentMetrics.heartRate > THRESHOLDS.heartRate.critical) {
      alerts.push("Critical: Heart rate dangerously high");
    } else if (currentMetrics.heartRate && (currentMetrics.heartRate < THRESHOLDS.heartRate.min || currentMetrics.heartRate > THRESHOLDS.heartRate.max)) {
      alerts.push("Warning: Heart rate abnormal");
    }
    
    if (currentMetrics.spo2 && currentMetrics.spo2 < THRESHOLDS.spo2.critical) {
      alerts.push("Critical: Low oxygen saturation");
    } else if (currentMetrics.spo2 && currentMetrics.spo2 < THRESHOLDS.spo2.warning) {
      alerts.push("Warning: Oxygen saturation below normal");
    }
    
    if (currentMetrics.bodyTemperature && currentMetrics.bodyTemperature > THRESHOLDS.bodyTemperature.critical) {
      alerts.push("Critical: High fever detected");
    }
    
    if (currentMetrics.ambientTemperature && currentMetrics.ambientTemperature > THRESHOLDS.ambientTemperature.critical) {
      alerts.push("Critical: Dangerous ambient temperature");
    } else if (currentMetrics.ambientTemperature && currentMetrics.ambientTemperature > THRESHOLDS.ambientTemperature.max) {
      alerts.push("Warning: High ambient temperature");
    }

    if (currentMetrics.flameSensor === 0) {
      alerts.push("Alert: Flame detected");
    }
    
    const hasCritical = alerts.some(a => a.startsWith("Critical"));
    const hasWarning = alerts.some(a => a.startsWith("Warning"));
    
    return {
      status: hasCritical ? "critical" : hasWarning ? "warning" : alerts.length > 0 ? "alert" : "normal",
      alerts
    };
  };

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    currentMetrics,
    healthStatus: getHealthStatus(),
  };
}

