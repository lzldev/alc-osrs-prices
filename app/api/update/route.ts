import { db } from "@/lib/db";
import { latestGET, timedPricesGET } from "@/lib/osrs/osrs";
import { latest } from "@/lib/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const prices = await Promise.all([
    timedPricesGET("5m"),
    timedPricesGET("1h"),
    latestGET(),
  ]).then((arr) => ({ "5m": arr[0], "1h": arr[1], latest: arr[2] }));

  void (await db.insert(latest).values({
    fiveMinutes: prices["5m"],
    oneHour: prices["1h"],
    latest: prices["latest"],
  }));

  return new NextResponse();
}
