import { OsrsIcon } from '@/components/OsrsIcon'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
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
import { TimeSteps, type TimeStep } from '@/lib/osrs/types'
import { favorites } from '@/lib/schema'
import { formatPrice } from '@/lib/utils'
import clsx from 'clsx'
import { format, fromUnixTime } from 'date-fns'
import { and, eq } from 'drizzle-orm'
import {
  Heart,
  LucideArrowDown,
  LucideArrowUp,
  LucideMinus,
  LucideProps,
} from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { OsrsItemPriceChart } from './OsrsItemPriceChart'
import { serverFavorite } from './actions'
import { refresh } from 'next/cache'

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

  const timingMessage: Record<TimeStep, string> = {
    '5m': 'Last 24 Hours in 5 minutes intervals',
    '1h': 'Last 7 days in 1 Hour Intervals',
    '6h': 'Last 30 days in 6 Hour intervals',
    '24h': 'Last year in 24 hour intervals',
  }

  const firstEntry = timeSeries.data.at(0)
  const lastEntry = timeSeries.data.at(-1)

  return (
    <>
      <div className="flex items-center justify-between px-1 pb-1 pt-2">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          {timingMessage[timeStep]} from{' '}
          {firstEntry && format(fromUnixTime(firstEntry.timestamp), 'Pp')}
          {' to '}
          {lastEntry && format(fromUnixTime(lastEntry.timestamp), 'Pp')}
        </div>
        <ButtonGroup>
          {TimeSteps.map((step, idx) => {
            return (
              <Button
                key={idx}
                variant={'outline'}
                disabled={timeStep === step}
                asChild={timeStep !== step}
              >
                <Link
                  href={{
                    query: {
                      s: step,
                    },
                  }}
                >
                  {step}
                </Link>
              </Button>
            )
          })}
        </ButtonGroup>
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
  const query = await pageProps.searchParams

  const mapping = (await mappingGET())[itemId]

  if (!mapping) {
    return notFound()
  }

  const timeStep: TimeStep = TimeSteps.includes(query['s'] as TimeStep)
    ? (query['s'] as TimeStep)
    : '5m'

  const timeSeries = await priceTimeSeriesGET(itemId, timeStep)
  const lastSold = timeSeries.data.findLast(v => !!v.avgLowPrice)
  const firstSold = timeSeries.data.find(v => !!v.avgLowPrice)

  const diff =
    -((firstSold?.avgLowPrice ?? 1) / (lastSold?.avgLowPrice ?? 1) - 1) * 100

  return (
    <div className="flex items-center py-2">
      <div className="flex items-center pl-1 text-2xl font-bold">
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
            <span>{mapping?.name}</span>
          </TooltipTrigger>
          <TooltipContent className="bg-foreground text-background">
            <p>ID: {mapping?.id}</p>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-4 h-8 self-center" />
        <div className="flex items-center justify-center">
          <span className="min-w-[200px] font-normal">
            {formatPrice(lastSold!.avgLowPrice)}
            {' gp'}
          </span>
          <div className="flex h-full items-center">
            <DiffIcon diff={diff} />
            {/*<DynamicIcon
              className={clsx(
                diff === 0
                  ? 'stroke-muted-foreground pt-1'
                  : diff < 0
                    ? 'stroke-red-500'
                    : 'stroke-green-500',
                '-mr-1 ml-2 font-normal'
              )}
              name={diff === 0 ? 'minus' : diff < 0 ? 'arrow-down' : 'arrow-up'}
            />*/}
            <span
              className={clsx(
                diff === 0
                  ? 'text-muted-foreground'
                  : diff < 0
                    ? 'text-red-500'
                    : 'text-green-500',
                'ml-2 font-normal'
              )}
            >
              {diff.toFixed(2)} %
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-end">
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

function DiffIcon({
  diff,
  className,
  ...props
}: { diff: number } & LucideProps) {
  return diff === 0 ? (
    <LucideMinus
      className={clsx('pt-1 text-muted-foreground', className)}
      {...props}
    />
  ) : diff < 0 ? (
    <LucideArrowDown className={clsx('text-red-500', className)} {...props} />
  ) : (
    <LucideArrowUp className={clsx('text-green-500', className)} {...props} />
  )
}
