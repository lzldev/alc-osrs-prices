import { db } from "@/lib/db";
import { ItemId, LatestPriceInfo } from "@/lib/osrs/types";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

const latest_with_ids = db.execute(sql<
  Record<ItemId, LatestPriceInfo>
>`WITH latest_with_ids AS (
    select (jsonb_each(latest->'data')).* from most_recent_price_info
  )
  SELECT
    key as itemId,
    value
  FROM latest_with_ids
  ORDER BY value->'low' DESC LIMIT 10;`);

const five_minutes_with_ids = db.execute(sql<
  Record<ItemId, LatestPriceInfo>
>`WITH fivem_with_ids AS (
    select (jsonb_each(five_minutes->'data')).* from most_recent_price_info
  ) SELECT
    key as itemId,
    value
  FROM fivem_with_ids
  ORDER BY value->'avgLowPrice' DESC LIMIT 10;`);

const hour_with_ids = db.execute(sql<
  Record<ItemId, LatestPriceInfo>
>`WITH fivem_with_ids AS (
    select (jsonb_each(one_hour->'data')).* from most_recent_price_info
  )
  SELECT
    key as itemId,
    value
  FROM fivem_with_ids
  ORDER BY value->'avgLowPrice' DESC LIMIT 10;`);

export async function GET() {
  return NextResponse.json(
    await Promise.all([
      await latest_with_ids.execute(),
      await five_minutes_with_ids.execute(),
      await hour_with_ids.execute(),
    ]).then((v) => ({
      latest: v[0],
      "5m": v[1],
      "1h": v[2],
    })),
  );
}
