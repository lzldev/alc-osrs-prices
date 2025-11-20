import { updatePriceData } from '@/lib/api/update'
import { db } from '@/lib/db'
import { ItemId, ItemPriceInfo, LatestPriceInfo } from '@/lib/osrs/types'
import { sql } from 'drizzle-orm'

const latest_with_ids = db.execute(sql<
  Record<ItemId, LatestPriceInfo>
>`WITH latest_with_ids AS (
    select (jsonb_each(latest->'data')).* from most_recent_price_info
  )
  SELECT
    key as itemId,
    value
  FROM latest_with_ids
  ORDER BY GREATEST(value->'lowTime',value->'highTime') DESC LIMIT 10;`)

const five_minutes_with_ids = db.execute(sql<
  Record<ItemId, ItemPriceInfo>
>`WITH fivem_with_ids AS (
    select (jsonb_each(five_minutes->'data')).* from most_recent_price_info
  ) SELECT
    key as itemId,
    value
  FROM fivem_with_ids
  ORDER BY (value -> 'lowPriceVolume')::integer + (value -> 'highPriceVolume')::integer DESC LIMIT 10;`)
//ORDER BY GREATEST(value -> 'lowPriceVolume' ,value -> 'highPriceVolume') DESC LIMIT 10;`)

const hour_with_ids = db.execute(sql<
  Record<ItemId, ItemPriceInfo>
>`WITH fivem_with_ids AS (
    select (jsonb_each(one_hour->'data')).* from most_recent_price_info
  )
  SELECT
    key as itemId,
    value
  FROM fivem_with_ids
  ORDER BY (value -> 'lowPriceVolume')::integer + (value -> 'highPriceVolume')::integer DESC LIMIT 10;`)

//ORDER BY GREATEST(value -> 'lowPriceVolume' ,value -> 'highPriceVolume') DESC LIMIT 10;`)

export type LatestPriceData = { itemid: string; value: LatestPriceInfo }[]
export type TimedVolumeData = { itemid: string; value: ItemPriceInfo }[]

export async function latestPriceData() {
  await updatePriceData()

  return await Promise.all([
    await latest_with_ids.execute(),
    await five_minutes_with_ids.execute(),
    await hour_with_ids.execute(),
  ]).then(v => ({
    latest: v[0] as unknown as LatestPriceData,
    '5m': v[1] as unknown as TimedVolumeData,
    '1h': v[2] as unknown as TimedVolumeData,
  }))
}
