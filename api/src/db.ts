import { Pool } from "pg";

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  throw new Error("DB_URL environment variable is not set");
}

export const pool = new Pool({
  connectionString: DB_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
});

export async function initDb() {
  // Devices table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      api_key_hash TEXT NOT NULL,
      name TEXT,
      location TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      last_seen_at TIMESTAMPTZ
    );
  `);

  // Readings table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS readings (
      id BIGSERIAL PRIMARY KEY,
      device_id TEXT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
      timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      heart_bpm INTEGER NOT NULL,
      spo2_pct INTEGER NOT NULL,
      skin_temp_f DOUBLE PRECISION NOT NULL,
      env_temp_c DOUBLE PRECISION NOT NULL,
      flame BOOLEAN NOT NULL,
      light_raw INTEGER NOT NULL,
      distance_cm INTEGER NOT NULL,
      aux_raw INTEGER NOT NULL
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_readings_device_timestamp
    ON readings (device_id, timestamp DESC);
  `);
}



