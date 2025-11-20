import { fromUnixTime } from "date-fns";
import { db } from "../db";
import { latestGET, timedPricesGET } from "../osrs/osrs";
import { mostRecentPriceInfoView, recentPriceInfo } from "../schema";

async function apiPrices() {
  return await Promise.all([
    timedPricesGET("5m"),
    timedPricesGET("1h"),
    latestGET(),
  ]).then((arr) => ({ "5m": arr[0], "1h": arr[1], latest: arr[2] }));
}

async function mostRecentDB() {
  return await db
    .select()
    .from(mostRecentPriceInfoView)
    .execute()
    .then((v) => v.at(0));
}

export async function mostRecentPriceData() {
  const [api, mostRecent] = await Promise.all([apiPrices(), mostRecentDB()]);

  const apiTime = fromUnixTime(api["5m"].timestamp);

  if (api["5m"].timestamp !== api["1h"].timestamp) {
    console.warn(
      `[update.ts] API Timestamps not matching | 5m:[${api["5m"].timestamp}] 1h:[${api["1h"].timestamp}]`,
    );
  }

  if (mostRecent && apiTime.getTime() < mostRecent.created_at.getTime()) {
    return mostRecent;
  }

  console.info(`Updating DB Price Data`);

  const insert = await db
    .insert(recentPriceInfo)
    .values({
      fiveMinutes: api["5m"],
      oneHour: api["1h"],
      latest: api["latest"],
      created_at: apiTime,
    })
    .returning();

  if (!insert.at(0)) {
    throw new Error("[update.ts] Insert didn't return data");
  }

  return insert.at(0)!;
}
