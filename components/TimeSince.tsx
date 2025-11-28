'use client'

import { formatDistanceToNow, fromUnixTime } from 'date-fns'
import { enUS } from 'date-fns/locale'

export function TimeSince({ since }: { since: number }) {
  return (
    <>
      {formatDistanceToNow(fromUnixTime(since), {
        includeSeconds: true,
        addSuffix: true,
        locale: enUS,
      })}
    </>
  )
}
