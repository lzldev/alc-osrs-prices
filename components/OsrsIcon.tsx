import clsx from 'clsx'
import { LucideBan } from 'lucide-react'
import { ComponentProps } from 'react'

export function OsrsIcon({
  icon,
  name,
  className,
  imgProps,
}: {
  icon?: string
  name?: string
  imgProps?: ComponentProps<'img'>
} & ComponentProps<'div'>) {
  return (
    <div
      className={clsx(
        'flex h-[30px] max-h-[30px] min-h-[30px] w-[30px] items-center justify-center',
        className
      )}
    >
      {icon ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          {...imgProps}
          className={clsx('flex', imgProps?.className)}
          src={`https://oldschool.runescape.wiki/images/${icon?.replaceAll(' ', '_')}`}
          alt={`icon for ${name ?? 'item'}`}
        />
      ) : (
        <LucideBan />
      )}
    </div>
  )
}
