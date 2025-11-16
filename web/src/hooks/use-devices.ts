import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "68.233.115.139:2500";

export type Device = string;

export function useDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`http://${BASE_URL}/api/v1/devices`);

        if (!response.ok) {
          throw new Error("Failed to fetch devices");
        }

        const result = await response.json();
        // API returns array of device IDs directly: ["helmet-001", ...]
        setDevices(Array.isArray(result) ? result : []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch devices"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevices();

    const interval = setInterval(fetchDevices, 60000);

    return () => clearInterval(interval);
  }, []);

  return {
    devices,
    isLoading,
    error,
  };
}

