import { fetchThingSpeakData, parseThingSpeakFeeds } from "@/lib/thingspeak";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const channelId = process.env.THINGS_SPEAK_CHANNEL_ID;

    if (!channelId) {
      return NextResponse.json(
        {
          error: "Missing ThingSpeak channel ID in environment variables",
        },
        { status: 400 }
      );
    }

    const data = await fetchThingSpeakData(channelId, 100);

    if (!data) {
      return NextResponse.json(
        { error: "Failed to fetch data from ThingSpeak" },
        { status: 500 }
      );
    }

    const parsedFeeds = parseThingSpeakFeeds(data.feeds);

    return NextResponse.json({
      channel: data.channel,
      feeds: parsedFeeds,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

