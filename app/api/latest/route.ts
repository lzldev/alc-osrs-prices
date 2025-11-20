import { latestPriceData } from "@/lib/api/latest";
import { cacheLife } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  "use cache";
  cacheLife("minutes");

  return NextResponse.json(await latestPriceData());
}
