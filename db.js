import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: "YOUR_NEON_DATABASE_URL",
  ssl: { rejectUnauthorized: false }
});