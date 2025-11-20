import {
  type LatestPriceData,
  type TimedVolumeData,
  latestPriceData,
} from '@/lib/api/latest'
import { MappingData, mappingGET } from '@/lib/osrs/osrs'
import { LucideBan } from 'lucide-react'
import { Separator } from './ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { fromUnixTime, formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export async function PriceInfo() {
  const mapping = await mappingGET()

  const priceData = await latestPriceData()

  return (
    <>
      <Latest mapping={mapping} latest={priceData.latest} />
      <TimedVolume
        title="Highest Volume in the last 5 minutes"
        mapping={mapping}
        data={priceData['5m']}
      />
      <TimedVolume
        title="Highest Volume in the last hour"
        mapping={mapping}
        data={priceData['1h']}
      />
    </>
  )
}

function TimedVolume({
  title,
  data,
  mapping,
}: {
  title: string
  mapping: MappingData
  data: TimedVolumeData
}) {
  return (
    <div className="flex flex-col">
      <div className="flex pb-1 text-2xl">{title}</div>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Volume</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(item => {
            const m = mapping[item.itemid]

            const whichPrice =
              item.value.highPriceVolume > item.value.lowPriceVolume
                ? 'high'
                : 'low'

            const volume =
              item.value.highPriceVolume + item.value.lowPriceVolume

            const price =
              whichPrice === 'high'
                ? item.value.avgHighPrice
                : item.value.avgLowPrice

            return (
              <TableRow key={item.itemid}>
                <TableCell>
                  <div className="flex max-h-[30px] min-h-[30px] w-[30px] items-center justify-center">
                    {m?.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="flex"
                        src={`https://oldschool.runescape.wiki/images/${m?.icon?.replaceAll(' ', '_')}`}
                        alt={`icon for ${m?.name}`}
                      />
                    ) : (
                      <LucideBan />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/item/${item.itemid}`}>
                    {m?.name ?? `ID: ${item.itemid}`}
                  </Link>
                </TableCell>

                <TableCell>
                  {price?.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}
                </TableCell>

                <TableCell>
                  {volume?.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

function Latest({
  latest,
  mapping,
}: {
  mapping: MappingData
  latest: LatestPriceData
}) {
  return (
    <div className="flex flex-col">
      <div className="flex pb-1 text-2xl">Latest</div>
      <Separator />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Icon</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Last Trade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {latest.map(item => {
            const m = mapping[item.itemid]

            const whichPrice =
              item.value.highTime > item.value.lowTime ? 'high' : 'low'

            const price = item.value[whichPrice]

            return (
              <TableRow key={item.itemid}>
                <TableCell>
                  <div className="flex max-h-[30px] min-h-[30px] w-[30px] items-center justify-center">
                    {m?.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="flex"
                        src={`https://oldschool.runescape.wiki/images/${m?.icon?.replaceAll(' ', '_')}`}
                        alt={`icon for ${m?.name}`}
                      />
                    ) : (
                      <LucideBan />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/item/${item.itemid}`}>
                    {m?.name ?? `ID: ${item.itemid}`}
                  </Link>
                </TableCell>
                <TableCell>
                  {price?.toLocaleString('en-US', {
                    maximumFractionDigits: 0,
                  })}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(
                    fromUnixTime(
                      Math.max(item.value.highTime, item.value.lowTime)
                    ),
                    {
                      includeSeconds: true,
                    }
                  )}{' '}
                  ago
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
