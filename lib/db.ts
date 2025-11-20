import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as auth_schema from "../auth-schema";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Connect to  Postgres
export const db = drizzle(sql, {
  schema: { ...auth_schema },
});
