import { useEffect, useState } from "react";
import { useSettings } from "@/contexts/settings-context";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "68.233.115.139:2500";

export interface Reading {
  id: number;
  device_id: string;
  heart_bpm: number | null;
  spo2_pct: number | null;
  skin_temp_f: number | null;
  env_temp_c: number | null;
  flame: boolean | null;
  light_raw: number | null;
  distance_cm: number | null;
  aux_raw: number | null;
  timestamp: string;
}

export const THRESHOLDS = {
  heartRate: { min: 60, max: 100, critical: 120 },
  spo2: { min: 95, warning: 90, critical: 85 },
  bodyTemperature: { min: 97, max: 99, critical: 101 },
  ambientTemperature: { max: 35, critical: 40 },
};

export function useDeviceReadings(deviceId: string | null, sizeOverride?: number) {
  const { graphDataPoints } = useSettings();
  const size = sizeOverride ?? graphDataPoints;
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    if (!deviceId) {
      setIsLoading(false);
      return;
    }

    const fetchReadings = async (isInitial = false) => {
      try {
        if (isInitial) {
          setIsLoading(true);
        }
        setError(null);

        const response = await fetch(
          `http://${BASE_URL}/api/v1/readings?device_id=${deviceId}&size=${size}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch readings");
        }

        const result = await response.json();
        const newReadings = Array.isArray(result) ? result : [];
        
        if (isInitial) {
          // Initial load: set all readings
          setReadings(newReadings);
        } else {
          // Update: merge new readings with existing ones
          setReadings((prevReadings) => {
            // Get IDs of existing readings
            const existingIds = new Set(prevReadings.map(r => r.id));
            // Filter out readings we already have
            const uniqueNewReadings = newReadings.filter(r => !existingIds.has(r.id));
            // Combine and keep only the latest 'size' readings
            const combined = [...prevReadings, ...uniqueNewReadings];
            return combined.slice(-size);
          });
        }
        
        setLastUpdate(new Date());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch readings"
        );
      } finally {
        if (isInitial) {
          setIsLoading(false);
        }
      }
    };

    fetchReadings(true);

    const interval = setInterval(() => fetchReadings(false), 30000);

    return () => clearInterval(interval);
  }, [deviceId, size]);

  const currentReading = readings.length > 0 ? readings[readings.length - 1] : null;

  const getHealthStatus = (reading: Reading | null) => {
    if (!reading) return { status: "unknown", alerts: [] };

    const alerts: string[] = [];

    if (reading.heart_bpm && reading.heart_bpm > THRESHOLDS.heartRate.critical) {
      alerts.push("Critical: Heart rate dangerously high");
    } else if (
      reading.heart_bpm &&
      (reading.heart_bpm < THRESHOLDS.heartRate.min ||
        reading.heart_bpm > THRESHOLDS.heartRate.max)
    ) {
      alerts.push("Warning: Heart rate abnormal");
    }

    if (reading.spo2_pct && reading.spo2_pct < THRESHOLDS.spo2.critical) {
      alerts.push("Critical: Low oxygen saturation");
    } else if (reading.spo2_pct && reading.spo2_pct < THRESHOLDS.spo2.warning) {
      alerts.push("Warning: Oxygen saturation below normal");
    }

    if (
      reading.skin_temp_f &&
      reading.skin_temp_f > THRESHOLDS.bodyTemperature.critical
    ) {
      alerts.push("Critical: High fever detected");
    }

    if (
      reading.env_temp_c &&
      reading.env_temp_c > THRESHOLDS.ambientTemperature.critical
    ) {
      alerts.push("Critical: Dangerous ambient temperature");
    } else if (
      reading.env_temp_c &&
      reading.env_temp_c > THRESHOLDS.ambientTemperature.max
    ) {
      alerts.push("Warning: High ambient temperature");
    }

    if (reading.flame === true) {
      alerts.push("Alert: Flame detected");
    }

    const hasCritical = alerts.some((a) => a.startsWith("Critical"));
    const hasWarning = alerts.some((a) => a.startsWith("Warning"));

    return {
      status: hasCritical
        ? "critical"
        : hasWarning
        ? "warning"
        : alerts.length > 0
        ? "alert"
        : "normal",
      alerts,
    };
  };

  return {
    readings,
    isLoading,
    error,
    lastUpdate,
    currentReading,
    healthStatus: getHealthStatus(currentReading),
  };
}

