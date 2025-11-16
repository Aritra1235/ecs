import { pool } from "./db";

export class AuthError extends Error {
  status: number;

  constructor(message = "Unauthorized", status = 401) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

export class ValidationError extends Error {
  status: number;

  constructor(message = "Bad Request", status = 400) {
    super(message);
    this.name = "ValidationError";
    this.status = status;
  }
}

export async function authenticateDevice(deviceId: string) {
  if (!deviceId) {
    throw new ValidationError("device_id is required");
  }

  const result = await pool.query<{
    id: string;
    name: string | null;
    location: string | null;
  }>("SELECT id, name, location FROM devices WHERE id = $1", [deviceId]);

  if (result.rows.length === 0) {
    throw new AuthError("Unknown device");
  }

  return result.rows[0];
}


