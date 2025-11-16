export interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  field7?: string;
  field8?: string;
}

export interface ThingSpeakChannel {
  channel: {
    id: number;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    field3: string;
    field4: string;
    field5: string;
    field6: string;
    field7: string;
    field8: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: ThingSpeakFeed[];
}

const THINGSPEAK_BASE_URL = "https://api.thingspeak.com";

export async function fetchThingSpeakData(
  channelId: string,
  results: number = 100
): Promise<ThingSpeakChannel | null> {
  try {
    const url = `${THINGSPEAK_BASE_URL}/channels/${channelId}/feeds.json?results=${results}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("ThingSpeak API error:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch ThingSpeak data:", error);
    return null;
  }
}

export function parseThingSpeakFeeds(feeds: ThingSpeakFeed[]) {
  return feeds.map((feed) => ({
    timestamp: new Date(feed.created_at).toLocaleTimeString(),
    date: new Date(feed.created_at),
    heartRate: feed.field1 ? parseFloat(feed.field1) : null,
    spo2: feed.field2 ? parseFloat(feed.field2) : null,
    bodyTemperature: feed.field3 ? parseFloat(feed.field3) : null,
    ambientTemperature: feed.field4 ? parseFloat(feed.field4) : null,
    flameSensor: feed.field5 ? parseFloat(feed.field5) : null,
    lightLevel: feed.field6 ? parseFloat(feed.field6) : null,
    distance: feed.field7 ? parseFloat(feed.field7) : null,
    redundantLightLevel: feed.field8 ? parseFloat(feed.field8) : null,
  }));
}

export function getFieldLabels() {
  return {
    field1: { label: "Heart Rate", unit: "BPM", color: "#ff6b6b" },
    field2: { label: "SpO2", unit: "%", color: "#4ecdc4" },
    field3: { label: "Body Temperature", unit: "°F", color: "#45b7d1" },
    field4: { label: "Ambient Temperature", unit: "°C", color: "#96ceb4" },
    field5: { label: "Flame Sensor", unit: "", color: "#ffeaa7" },
    field6: { label: "Light Level", unit: "", color: "#dfe6e9" },
    field7: { label: "Distance", unit: "cm", color: "#a29bfe" },
    field8: { label: "Redundant Light Level", unit: "", color: "#fd79a8" },
  };
}

