import { DiffIcon } from '@/components/DiffIcon'
import { DiffText } from '@/components/DiffText'
import { OsrsIcon } from '@/components/OsrsIcon'
import { TimeStepGroup } from '@/components/TimeStepGroup'
import { Button } from '@/components/ui/button'
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
import { TimeSteps, TimingStepMessages, type TimeStep } from '@/lib/osrs/types'
import { favorites } from '@/lib/schema'
import { calculateDiffPercent, formatPrice } from '@/lib/utils'
import { format, fromUnixTime } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import { Heart } from 'lucide-react'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { OsrsItemPriceChart } from './OsrsItemPriceChart'
import { serverFavorite } from './actions'
import Link from 'next/link'

export default async function ItemDetails(props: PageProps<'/item/[itemId]'>) {
  return (
    <div className="flex w-full flex-col p-16">
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <ItemInfo pageProps={props} />
      </Suspense>
      <Separator />
      <Suspense fallback={<Skeleton className="h-[27rem] w-full" />}>
        <ChartWrapper pageProps={props} />
      </Suspense>
    </div>
  )
}

async function ChartWrapper({
  pageProps,
}: {
  pageProps: PageProps<'/item/[itemId]'>
}) {
  const { itemId } = await pageProps.params
  const query = await pageProps.searchParams

  const timeStep: TimeStep = TimeSteps.includes(query['s'] as TimeStep)
    ? (query['s'] as TimeStep)
    : '5m'

  const timeSeries = await priceTimeSeriesGET(itemId, timeStep)

  const firstEntry = timeSeries.data.at(0)
  const lastEntry = timeSeries.data.at(-1)

  return (
    <>
      <div className="flex items-center justify-between px-1 pb-1 pt-2">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          {TimingStepMessages[timeStep]} from{' '}
          {firstEntry && format(fromUnixTime(firstEntry.timestamp), 'Pp')}
          {' to '}
          {lastEntry && format(fromUnixTime(lastEntry.timestamp), 'Pp')}
        </div>
        <TimeStepGroup timeStep={timeStep} />
      </div>
      <OsrsItemPriceChart
        className="min-h-96 h-96"
        data={timeSeries}
        labelStep={timeStep === '5m' ? 'hours' : 'days'}
      />
    </>
  )
}

async function ItemInfo({
  pageProps,
}: {
  pageProps: PageProps<'/item/[itemId]'>
}) {
  const { itemId } = await pageProps.params

  const mapping = (await mappingGET())[itemId]

  if (!mapping) {
    return notFound()
  }

  const query = await pageProps.searchParams

  const timeStep: TimeStep = TimeSteps.includes(query['s'] as TimeStep)
    ? (query['s'] as TimeStep)
    : '5m'

  const timeSeries = await priceTimeSeriesGET(itemId, timeStep)
  const lastSold = timeSeries.data.findLast(v => !!v.avgLowPrice)
  const firstSold = timeSeries.data.find(v => !!v.avgLowPrice)

  const diff = calculateDiffPercent(firstSold!, lastSold!)

  return (
    <div className="flex items-center py-2">
      <div className="flex items-center pl-1 text-2xl">
        <OsrsIcon
          className="max-h-[30px] min-h-[30px] w-[30px] overflow-clip"
          imgProps={{
            className: 'flex object-cover',
          }}
          name={mapping.name}
          icon={mapping.icon}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="ml-1 font-semibold">{mapping?.name}</span>
          </TooltipTrigger>
          <TooltipContent className="bg-foreground text-background">
            <p>Item ID: {mapping?.id}</p>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-4 h-8 self-center" />
        <div className="flex items-center justify-center">
          <span className="min-w-[200px]">
            {formatPrice(lastSold!.avgLowPrice)}
            {' gp'}
          </span>
          <div className="flex h-full items-center">
            <DiffIcon diff={diff} />
            <DiffText diff={diff} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end gap-x-2">
        <Button variant="outline" asChild>
          <Link
            href={`https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=${itemId}`}
          >
            Wiki
          </Link>
        </Button>
        <Suspense
          fallback={
            <Button size="icon" variant="outline" disabled>
              <Heart />
            </Button>
          }
        >
          <FavoriteButton itemId={itemId} />
        </Suspense>
      </div>
    </div>
  )
}

async function FavoriteButton({ itemId }: { itemId: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const isFavorite =
    session &&
    (
      await db
        .select()
        .from(favorites)
        .where(t =>
          and(eq(t.user_id, session.user.id), eq(t.item_id, parseInt(itemId)))
        )
    ).at(0)

  const favoriteItem = serverFavorite.bind(null, itemId)

  return (
    <Button
      variant={isFavorite ? 'default' : 'outline'}
      size="icon"
      onClick={favoriteItem}
      disabled={!session}
    >
      <Heart />
    </Button>
  )
}
