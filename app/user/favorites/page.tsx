import { OsrsItemPriceChart } from '@/app/item/[itemId]/OsrsItemPriceChart'
import { DiffIcon } from '@/components/DiffIcon'
import { DiffText } from '@/components/DiffText'
import { OsrsIcon } from '@/components/OsrsIcon'
import { TimeStepGroup } from '@/components/TimeStepGroup'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mappingGET, priceTimeSeriesGET } from '@/lib/osrs/osrs'
import { TimeSteps, type TimeStep, TimingStepMessages } from '@/lib/osrs/types'
import { favorites } from '@/lib/schema'
import { calculateDiffPercent, formatPrice } from '@/lib/utils'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

export default async function FavoritesPage(
  pageProps: PageProps<'/user/favorites'>
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect('/')
  }

  const mapping = await mappingGET()

  const query = await pageProps.searchParams

  const timeStep: TimeStep = TimeSteps.includes(query['s'] as TimeStep)
    ? (query['s'] as TimeStep)
    : '5m'

  const items = await db
    .select()
    .from(favorites)
    .where(table => eq(table.user_id, session.user.id))

  return (
    <div className="flex w-full max-w-5xl flex-col items-center py-2">
      <div className="mb-4 flex w-full items-center justify-between border-b border-border py-4">
        <span className="self-end text-sm text-muted-foreground">
          {TimingStepMessages[timeStep]}
        </span>
        <TimeStepGroup timeStep={timeStep} />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-4">
        {items.length === 0 && <div> no items to display</div>}
        {items.map(item => {
          const m = mapping[item.item_id] ?? {
            id: 0,
            examine: 'invalid item',
            name: 'invalid item',
            icon: undefined,
            highalch: 0,
            lowalch: 0,
            limit: 0,
            value: 0,
            members: false,
          }

          return (
            <div
              key={item.item_id}
              className="flex w-full flex-col gap-1 rounded-md border border-border p-2"
            >
              <div className="flex w-full justify-between">
                <div className="flex items-center gap-1">
                  <OsrsIcon icon={m.icon} name={m.name} />
                  <Link href={`/item/${item.item_id}`}>
                    {m.name ?? 'No Name'}
                  </Link>
                </div>
                <div className="flex">
                  <Suspense>
                    <PriceWrapper
                      itemId={item.item_id.toString()}
                      timeStep={timeStep}
                    />
                  </Suspense>
                </div>
              </div>
              <Separator />
              <Suspense
                fallback={<Skeleton className="min-h-48 h-48 w-full" />}
              >
                <ChartWrapper
                  itemId={item.item_id.toString()}
                  timeStep={timeStep}
                />
              </Suspense>
            </div>
          )
        })}
      </div>
    </div>
  )
}

async function PriceWrapper({
  itemId,
  timeStep,
}: {
  itemId: string
  timeStep: TimeStep
}) {
  const timeSeries = await priceTimeSeriesGET(itemId, timeStep)

  const lastSold = timeSeries.data.findLast(v => !!v.avgLowPrice)!
  const firstSold = timeSeries.data.find(v => !!v.avgLowPrice)!

  const diff = calculateDiffPercent(firstSold!, lastSold!)

  const price = formatPrice(lastSold.avgLowPrice) + ' GP'

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex">
            <DiffIcon className={'-mr-1.5'} diff={diff} />
            <DiffText diff={diff} />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-foreground text-background">
          <p>
            <span className="text-muted-foreground">from </span>
            {formatPrice(firstSold.avgLowPrice)} gp
          </p>
          <p>
            <span className="text-muted-foreground">to</span>{' '}
            {formatPrice(lastSold.avgLowPrice)} gp
          </p>
          <p>
            <span className="text-muted-foreground">diff</span>{' '}
            {formatPrice(-(firstSold.avgLowPrice - lastSold.avgLowPrice))} gp
          </p>
        </TooltipContent>
      </Tooltip>
      <span className="text-md mr-2 w-36 text-end">{price}</span>
    </>
  )
}

async function ChartWrapper({
  itemId,
  timeStep,
}: {
  itemId: string
  timeStep: TimeStep
}) {
  const timeSeries = await priceTimeSeriesGET(itemId, timeStep)

  return (
    <>
      <OsrsItemPriceChart
        animate={false}
        className="min-h-48 h-48 w-full"
        data={timeSeries}
      />
    </>
  )
}
