import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Separator } from '@/components/ui/separator'
import { mappingGET, priceTimeSeriesGET } from '@/lib/osrs/osrs'
import { Suspense } from 'react'
import { OsrsItemChart } from './OsrsItemChart'
import { Skeleton } from '@/components/ui/skeleton'
import { TimeSteps, type TimeStep } from '@/lib/osrs/types'
import { ButtonGroup } from '@/components/ui/button-group'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { clsx } from 'clsx'

export default async function ItemDetails(props: PageProps<'/item/[itemId]'>) {
  return (
    <Container>
      <Header />
      <div className="flex w-full flex-col p-16">
        <Suspense fallback={<Skeleton className="h-6 w-full" />}>
          <ItemInfo pageProps={props} />
        </Suspense>
        <Separator className="my-2" />
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

  console.log(query)

  const timeStep: TimeStep = TimeSteps.includes(query['s'] as TimeStep)
    ? (query['s'] as TimeStep)
    : '5m'

  const timeSeries = await priceTimeSeriesGET(itemId, timeStep)

  return (
    <>
      <div className="flex justify-end">
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
      <OsrsItemChart className="min-h-96 h-96" data={timeSeries} />
    </>
  )
}

async function ItemInfo({
  pageProps,
}: {
  pageProps: PageProps<'/item/[itemId]'>
}) {
  const { itemId } = await pageProps.params

  const mapping = await mappingGET()

  return (
    <span>
      <span className="font-bold">ID:</span> {itemId}{' '}
      <span className="font-bold">Name:</span> {mapping[itemId]?.name}
    </span>
  )
}
