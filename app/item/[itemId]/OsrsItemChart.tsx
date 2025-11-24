'use client'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Timeseries } from '@/lib/osrs/types'
import { formatPrice } from '@/lib/utils'
import { clsx } from 'clsx'
import { format, fromUnixTime } from 'date-fns'
import { ComponentPropsWithoutRef } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

const chartConfig = {
  avgHighPrice: {
    label: 'High Price',
    color: 'hsl(var(--chart-2))',
  },
  avgLowPrice: {
    label: 'Low Price',
    color: 'hsl(var(--chart-1))',
  },
  timestamp: {
    label: 'Time',
    color: 'var(--color-primary)',
  },
} satisfies ChartConfig

export function OsrsItemChart({
  data,
  className,
  labelStep,
}: {
  data: Timeseries
  labelStep?: 'hours' | 'days'
} & ComponentPropsWithoutRef<'div'>) {
  return (
    <ChartContainer className={clsx(className)} config={chartConfig}>
      <LineChart accessibilityLayer data={data.data}>
        <CartesianGrid />
        <XAxis
          dataKey="timestamp"
          tickLine={false}
          tickMargin={10}
          tickFormatter={tick =>
            format(
              fromUnixTime(tick),
              labelStep === 'hours' ? 'HH:mm' : 'dd/MM'
            )
          }
          scale="time"
        />
        <YAxis
          type="number"
          tickFormatter={v => formatPrice(v)}
          domain={[
            (dataMin: number) => Math.round(dataMin - dataMin * 0.01),
            (dataMax: number) => Math.round(dataMax + dataMax * 0.01),
          ]}
        />
        <Line
          dataKey="avgLowPrice"
          stroke={'var(--color-avgLowPrice)'}
          connectNulls={true}
          dot={false}
        />
        <Line
          dataKey="avgHighPrice"
          connectNulls={true}
          stroke={'var(--color-avgHighPrice)'}
          dot={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(_label, value) =>
                format(
                  fromUnixTime(value.at(0)?.payload.timestamp),
                  'dd/MM/y p'
                )
              }
            />
          }
        />
      </LineChart>
    </ChartContainer>
  )
}
