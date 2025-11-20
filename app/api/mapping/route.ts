import { mappingGET } from '@/lib/osrs/osrs'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(await mappingGET())
}
