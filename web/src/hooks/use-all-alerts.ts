import { useEffect, useState } from "react";
import { Reading, THRESHOLDS } from "./use-device-readings";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "68.233.115.139:2500";

export interface DeviceAlert {
  deviceId: string;
  severity: "critical" | "warning" | "alert";
  message: string;
  timestamp: string;
  metric: string;
  value: number | boolean | null;
}

function checkReading(reading: Reading): DeviceAlert[] {
  const alerts: DeviceAlert[] = [];

  if (reading.heart_bpm && reading.heart_bpm > THRESHOLDS.heartRate.critical) {
    alerts.push({
      deviceId: reading.device_id,
      severity: "critical",
      message: "Heart rate dangerously high",
      timestamp: reading.timestamp,
      metric: "Heart Rate",
      value: reading.heart_bpm,
    });
  } else if (
    reading.heart_bpm &&
    (reading.heart_bpm < THRESHOLDS.heartRate.min ||
      reading.heart_bpm > THRESHOLDS.heartRate.max)
  ) {
    alerts.push({
      deviceId: reading.device_id,
      severity: "warning",
      message: "Heart rate abnormal",
      timestamp: reading.timestamp,
      metric: "Heart Rate",
      value: reading.heart_bpm,
    });
  }

  if (reading.spo2_pct && reading.spo2_pct < THRESHOLDS.spo2.critical) {
    alerts.push({
      deviceId: reading.device_id,
      severity: "critical",
      message: "Low oxygen saturation",
      timestamp: reading.timestamp,
      metric: "SpO2",
      value: reading.spo2_pct,
    });
  } else if (reading.spo2_pct && reading.spo2_pct < THRESHOLDS.spo2.warning) {
    alerts.push({
      deviceId: reading.device_id,
      severity: "warning",
      message: "Oxygen saturation below normal",
      timestamp: reading.timestamp,
      metric: "SpO2",
      value: reading.spo2_pct,
    });
  }

  if (
    reading.skin_temp_f &&
    reading.skin_temp_f > THRESHOLDS.bodyTemperature.critical
  ) {
    alerts.push({
      deviceId: reading.device_id,
      severity: "critical",
      message: "High fever detected",
      timestamp: reading.timestamp,
      metric: "Body Temperature",
      value: reading.skin_temp_f,
    });
  } else if (
    reading.skin_temp_f &&
    (reading.skin_temp_f < THRESHOLDS.bodyTemperature.min ||
      reading.skin_temp_f > THRESHOLDS.bodyTemperature.max)
  ) {
    alerts.push({
      deviceId: reading.device_id,
      severity: "warning",
      message: "Body temperature abnormal",
      timestamp: reading.timestamp,
      metric: "Body Temperature",
      value: reading.skin_temp_f,
    });
  }

  if (
    reading.env_temp_c &&
    reading.env_temp_c > THRESHOLDS.ambientTemperature.critical
  ) {
    alerts.push({
      deviceId: reading.device_id,
      severity: "critical",
      message: "Dangerous ambient temperature",
      timestamp: reading.timestamp,
      metric: "Ambient Temperature",
      value: reading.env_temp_c,
    });
  } else if (
    reading.env_temp_c &&
    reading.env_temp_c > THRESHOLDS.ambientTemperature.max
  ) {
    alerts.push({
      deviceId: reading.device_id,
      severity: "warning",
      message: "High ambient temperature",
      timestamp: reading.timestamp,
      metric: "Ambient Temperature",
      value: reading.env_temp_c,
    });
  }

  if (reading.flame === true) {
    alerts.push({
      deviceId: reading.device_id,
      severity: "critical",
      message: "Flame detected",
      timestamp: reading.timestamp,
      metric: "Flame Sensor",
      value: true,
    });
  }

  return alerts;
}

export function useAllAlerts() {
  const [alerts, setAlerts] = useState<DeviceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchAllAlerts = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsLoading(true);
        }
        setError(null);

        const devicesResponse = await fetch(`http://${BASE_URL}/api/v1/devices`);
        if (!devicesResponse.ok) {
          throw new Error("Failed to fetch devices");
        }

        const devices = await devicesResponse.json();
        if (!Array.isArray(devices)) {
          throw new Error("Invalid devices response");
        }

        const allAlerts: DeviceAlert[] = [];

        await Promise.all(
          devices.map(async (deviceId) => {
            try {
              const readingsResponse = await fetch(
                `http://${BASE_URL}/api/v1/readings?device_id=${deviceId}&size=1`
              );

              if (readingsResponse.ok) {
                const readings = await readingsResponse.json();
                if (Array.isArray(readings) && readings.length > 0) {
                  const latestReading = readings[readings.length - 1];
                  const deviceAlerts = checkReading(latestReading);
                  allAlerts.push(...deviceAlerts);
                }
              }
            } catch (err) {
              console.error(`Failed to fetch readings for ${deviceId}:`, err);
            }
          })
        );

        allAlerts.sort((a, b) => {
          const severityOrder = { critical: 0, warning: 1, alert: 2 };
          const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
          if (severityDiff !== 0) return severityDiff;
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });

        setAlerts(allAlerts);
        setLastUpdate(new Date());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch alerts"
        );
      } finally {
        if (isInitial) {
          setIsLoading(false);
        }
      }
    };

    fetchAllAlerts(true);

    const interval = setInterval(() => fetchAllAlerts(false), 30000);

    return () => clearInterval(interval);
  }, []);

  const criticalCount = alerts.filter((a) => a.severity === "critical").length;
  const warningCount = alerts.filter((a) => a.severity === "warning").length;

  return {
    alerts,
    isLoading,
    error,
    lastUpdate,
    criticalCount,
    warningCount,
    totalCount: alerts.length,
  };
}

