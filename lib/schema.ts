import {
  pgTable,
  serial,
  text,
  index,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { account, session, user, verification } from "../auth-schema";

export const favorites = pgTable(
  "favorites",
  {
    id: serial("id").primaryKey(),
    user_id: text("user_id").references(() => user.id),
    item_id: integer("item_id").notNull(),
  },
  (table) => [index("user_idx").on(table.user_id)],
);

export const internal = pgTable("internal", {
  id: serial("id").primaryKey(),
  latest: jsonb("latest").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export { account, session, user, verification } from "../auth-schema";
