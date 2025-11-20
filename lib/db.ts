import { drizzle } from 'drizzle-orm/postgres-js'
import postgres, { type Sql } from 'postgres'

import * as auth_schema from '../auth-schema'

let connection: Sql<any>

if (process.env.NODE_ENV === 'production') {
  connection = postgres(process.env.POSTGRES_URL!)
} else {
  const globalConnection = global as typeof globalThis & {
    connection: Sql<any>
  }
  if (!globalConnection.connection)
    globalConnection.connection = postgres(process.env.POSTGRES_URL!)

  connection = globalConnection.connection
}

// Connect to  Postgres
export const db = drizzle(connection, {
  schema: { ...auth_schema },
})
