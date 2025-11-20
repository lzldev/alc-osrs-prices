import {
  pgView,
  pgTable,
  serial,
  text,
  index,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core'
import { user } from '../auth-schema'
import { desc } from 'drizzle-orm'

export const favorites = pgTable(
  'favorites',
  {
    id: serial('id').primaryKey(),
    user_id: text('user_id').references(() => user.id),
    item_id: integer('item_id').unique().notNull(),
  },
  table => [index('user_idx').on(table.user_id)]
)

export const recentPriceInfo = pgTable('recent_price_info', {
  id: serial('id').primaryKey(),
  latest: jsonb('latest').notNull(),
  fiveMinutes: jsonb('five_minutes').notNull(),
  oneHour: jsonb('one_hour').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
})

export const mostRecentPriceInfoView = pgView('most_recent_price_info').as(
  qb => {
    return qb
      .select()
      .from(recentPriceInfo)
      .orderBy(desc(recentPriceInfo.id))
      .limit(1)
  }
)

export { account, session, user, verification } from '../auth-schema'
