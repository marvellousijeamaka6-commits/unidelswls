import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: postgresql://neondb_owner:npg_e1mFW9YQlxqG@ep-sparkling-frost-a8lhvtdo-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require,
  ssl: { rejectUnauthorized: false }
});