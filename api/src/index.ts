import { Elysia } from "elysia";
import { initDb, pool } from "./db";
import { authenticateDevice, AuthError, ValidationError } from "./auth";

type ReadingInput = {
  device_id?: string;
  heart_bpm?: string | number;
  spo2_pct?: string | number;
  skin_temp_f?: string | number;
  env_temp_c?: string | number;
  flame?: string | number | boolean;
  light_raw?: string | number;
  distance_cm?: string | number;
  aux_raw?: string | number;
  timestamp?: string | number;
};

function parseNumber(
  value: unknown,
  field: string,
  opts?: { integer?: boolean }
): number {
  if (value === undefined || value === null || value === "") {
    throw new ValidationError(`${field} is required`);
  }

  const num = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(num)) {
    throw new ValidationError(`${field} must be a number`);
  }

  if (opts?.integer && !Number.isInteger(num)) {
    throw new ValidationError(`${field} must be an integer`);
  }

  return num;
}

function parseFlame(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  const num = Number(value);
  if (!Number.isFinite(num) || (num !== 0 && num !== 1)) {
    throw new ValidationError("flame must be 0 or 1");
  }
  return num === 1;
}

function parseTimestamp(value: unknown): Date | null {
  if (value === undefined || value === null || value === "") return null;

  if (typeof value === "number") {
    return new Date(value);
  }

  const num = Number(value);
  if (Number.isFinite(num)) {
    return new Date(num);
  }

  const date = new Date(String(value));
  if (isNaN(date.getTime())) {
    throw new ValidationError("timestamp must be a valid ISO string or epoch");
  }

  return date;
}

const app = new Elysia()
  .onError(({ error, set }) => {
    // Let normal 404s be quiet and just respond with not found
    if ((error as any)?.code === "NOT_FOUND") {
      set.status = 404;
      return { error: "Not Found" };
    }

    if (error instanceof ValidationError || error instanceof AuthError) {
      set.status = (error as ValidationError | AuthError).status;
      return { error: error.message };
    }

    console.error("Unhandled error", error);
    set.status = 500;
    return { error: "Internal Server Error" };
  })
  .get("/", () => "ECS IoT API")
  // ThingSpeak-compatible ingestion endpoint so the existing Arduino GET code keeps working.
  // Example: GET /update?api_key=...&field1=...&field2=...&...&field8=...
  .get("/update", async ({ query }) => {
    const q = query as Record<string, string | string[] | undefined>;

    // For now, use a fixed device id. You can change this later if you want multiple devices.
    const deviceId = "helmet-001";

    const heartBpm = parseNumber(q.field1, "field1", { integer: true });
    const spo2 = parseNumber(q.field2, "field2", { integer: true });
    const skinTempF = parseNumber(q.field3, "field3");
    const envTempC = parseNumber(q.field4, "field4");
    const flame = parseFlame(q.field5);
    const lightRaw = parseNumber(q.field6, "field6", { integer: true });
    const distanceCm = parseNumber(q.field7, "field7", { integer: true });
    const auxRaw = parseNumber(q.field8, "field8", { integer: true });

    console.log("Incoming /update payload:", {
      heartBpm,
      spo2,
      skinTempF,
      envTempC,
      flame,
      lightRaw,
      distanceCm,
      auxRaw,
    });

    // Ensure device exists (api_key_hash isn't used anymore, so store empty string)
    await pool.query(
      `
      INSERT INTO devices (id, api_key_hash)
      VALUES ($1, '')
      ON CONFLICT (id) DO NOTHING;
    `,
      [deviceId]
    );

    await pool.query(
      `
      INSERT INTO readings (
        device_id,
        heart_bpm,
        spo2_pct,
        skin_temp_f,
        env_temp_c,
        flame,
        light_raw,
        distance_cm,
        aux_raw
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
      [
        deviceId,
        heartBpm,
        spo2,
        skinTempF,
        envTempC,
        flame,
        lightRaw,
        distanceCm,
        auxRaw,
      ]
    );

    await pool.query(
      `UPDATE devices SET last_seen_at = NOW() WHERE id = $1`,
      [deviceId]
    );

    // Return a simple body similar to ThingSpeak (non-zero = success)
    return "1";
  })
  .post("/api/v1/readings", async ({ body, request, set }) => {
    const input = (body || {}) as ReadingInput;

    // Basic logging so you can confirm data is arriving
    console.log("Incoming /api/v1/readings payload:", input);

    const deviceId = input.device_id;
    const device = await authenticateDevice(deviceId || "");

    const heartBpm = parseNumber(input.heart_bpm, "heart_bpm", {
      integer: true,
    });
    const spo2 = parseNumber(input.spo2_pct, "spo2_pct", { integer: true });
    const skinTempF = parseNumber(input.skin_temp_f, "skin_temp_f");
    const envTempC = parseNumber(input.env_temp_c, "env_temp_c");
    const flame = parseFlame(input.flame);
    const lightRaw = parseNumber(input.light_raw, "light_raw", {
      integer: true,
    });
    const distanceCm = parseNumber(input.distance_cm, "distance_cm", {
      integer: true,
    });
    const auxRaw = parseNumber(input.aux_raw, "aux_raw", { integer: true });
    const ts = parseTimestamp(input.timestamp);

    await pool.query(
      `
      INSERT INTO readings (
        device_id,
        timestamp,
        heart_bpm,
        spo2_pct,
        skin_temp_f,
        env_temp_c,
        flame,
        light_raw,
        distance_cm,
        aux_raw
      )
      VALUES ($1, COALESCE($2, NOW()), $3, $4, $5, $6, $7, $8, $9, $10)
    `,
      [
        device.id,
        ts,
        heartBpm,
        spo2,
        skinTempF,
        envTempC,
        flame,
        lightRaw,
        distanceCm,
        auxRaw,
      ]
    );

    await pool.query(
      `UPDATE devices SET last_seen_at = NOW() WHERE id = $1`,
      [device.id]
    );

    set.status = 204;
    return;
  })
  .get("/api/v1/readings", async ({ query, request }) => {
    const q = query as Record<string, string | string[] | undefined>;
    const deviceId = (q.device_id as string) || "";
    const sizeRaw = (q.size as string) || "";

    await authenticateDevice(deviceId);

    const sizeNum = Number(sizeRaw);
    if (!Number.isFinite(sizeNum) || sizeNum <= 0) {
      throw new ValidationError("size must be a positive integer");
    }

    const limit = Math.min(500, Math.floor(sizeNum));

    const result = await pool.query(
      `
      SELECT
        id,
        device_id,
        timestamp,
        heart_bpm,
        spo2_pct,
        skin_temp_f,
        env_temp_c,
        flame,
        light_raw,
        distance_cm,
        aux_raw
      FROM readings
      WHERE device_id = $1
      ORDER BY timestamp DESC
      LIMIT $2
    `,
      [deviceId, limit]
    );

    return result.rows;
  });

(async () => {
  await initDb();
  const server = app.listen(3000);

console.log(
    `Elysia is running at ${server.server?.hostname}:${server.server?.port}`
);
})();
