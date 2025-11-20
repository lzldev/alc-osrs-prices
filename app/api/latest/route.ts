import { latestPriceData } from '@/lib/api/latest'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(await latestPriceData())
}
