import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { TimeseriesPoint } from './osrs/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  return price.toLocaleString('en-US', {
    maximumFractionDigits: 0,
  })
}

export function calculateDiffPercent(
  first: TimeseriesPoint,
  last: TimeseriesPoint
) {
  return -((first?.avgLowPrice ?? 1) / (last?.avgLowPrice ?? 1) - 1) * 100
}
