import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
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
import { mappingGET, priceTimeSeriesGET } from '@/lib/osrs/osrs'
import { TimeSteps, type TimeStep } from '@/lib/osrs/types'
import { formatPrice } from '@/lib/utils'
import clsx from 'clsx'
import { format, fromUnixTime } from 'date-fns'
import { DynamicIcon } from 'lucide-react/dynamic'
import Link from 'next/link'
import { Suspense } from 'react'
import { OsrsItemPriceChart } from './OsrsItemPriceChart'

export default async function ItemDetails(props: PageProps<'/item/[itemId]'>) {
  return (
    <Container>
      <Header />
      <div className="flex w-full flex-col p-16">
        <Suspense fallback={<Skeleton className="h-6 w-full" />}>
          <ItemInfo pageProps={props} />
        </Suspense>
        <Separator />
        <Suspense fallback={<Skeleton className="h-[26.25rem] w-full" />}>
          <ChartWrapper pageProps={props} />
        </Suspense>
      </div>
      <Footer />
    </Container>
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

  const timeStep: TimeStep = TimeSteps.includes(query['s'] as TimeStep)
    ? (query['s'] as TimeStep)
    : '5m'

  const timeSeries = await priceTimeSeriesGET(itemId, timeStep)
  const lastSold = timeSeries.data.findLast(v => !!v.avgLowPrice)
  const firstSold = timeSeries.data.find(v => !!v.avgLowPrice)

  console.log('first', firstSold?.avgLowPrice)
  console.log('last', lastSold?.avgLowPrice)
  console.log(
    'diff',
    ((firstSold?.avgLowPrice ?? 0) - (lastSold?.avgLowPrice ?? 0)) * -1
  )

  const diff =
    -((firstSold?.avgLowPrice ?? 1) / (lastSold?.avgLowPrice ?? 1) - 1) * 100

  return (
    <div className="flex items-center py-2">
      <OsrsIcon
        className="max-h-[30px] min-h-[30px] w-[30px] overflow-clip"
        imgProps={{
          className: 'flex object-cover',
        }}
        name={mapping.name}
        icon={mapping.icon}
      />
      <div className="flex items-center pl-1 text-2xl font-bold">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{mapping?.name}</span>
          </TooltipTrigger>
          <TooltipContent className="bg-foreground text-background">
            <p>ID: {mapping?.id}</p>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="mx-4 h-8 self-center" />
        <span className="font-normal">
          {formatPrice(lastSold!.avgLowPrice)}
          {' gp'}
        </span>
        <DynamicIcon
          className={clsx(
            diff === 0 && 'pt-1',
            diff === 0
              ? 'stroke-muted-foreground'
              : diff < 0
                ? 'stroke-red-500'
                : 'stroke-green-500',
            '-mr-1 ml-2 font-normal'
          )}
          name={diff === 0 ? 'minus' : diff < 0 ? 'arrow-down' : 'arrow-up'}
        />
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
  )
}
