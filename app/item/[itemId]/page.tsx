import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { OsrsIcon } from '@/components/OsrsIcon'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { mappingGET, priceTimeSeriesGET } from '@/lib/osrs/osrs'
import { TimeSteps, type TimeStep } from '@/lib/osrs/types'
import Link from 'next/link'
import { Suspense } from 'react'
import { OsrsItemChart } from './OsrsItemChart'
import { format, fromUnixTime } from 'date-fns'

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
      <OsrsItemChart
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

  return (
    <div className="flex items-center py-2">
      <OsrsIcon className="mr-1" name={mapping.name} icon={mapping.icon} />
      <span>
        <span className="font-bold">ID:</span> {itemId}
        <span className="font-bold">Name:</span> {mapping?.name}
      </span>
    </div>
  )
}
