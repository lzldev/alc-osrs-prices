import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { mappingGET, priceTimeSeriesGET } from '@/lib/osrs/osrs'
import { OsrsItemChart } from './OsrsItemChart'
import { Separator } from '@/components/ui/separator'

export default async function ItemDetails({
  params,
}: PageProps<'/item/[itemId]'>) {
  //TODO: move this inside a SUSPENSE Boundary
  const { itemId } = await params

  const mapping = await mappingGET()

  const timeSeries = await priceTimeSeriesGET(itemId, '5m')

  return (
    <Container>
      <Header />

      <div className="flex w-full flex-col p-16">
        <span>
          <span className="font-bold">ID:</span> {itemId}{' '}
          <span className="font-bold">Name:</span> {mapping[itemId]?.name}
        </span>
        <Separator className="my-2" />
        <OsrsItemChart data={timeSeries} />
      </div>

      <Footer />
    </Container>
  )
}
