import clsx from 'clsx'
import type { ComponentProps } from 'react'

export function DiffText({
  diff,
  className,
  ...props
}: { diff: number } & ComponentProps<'span'>) {
  return (
    <span
      className={clsx(
        diff === 0
          ? 'text-muted-foreground'
          : diff < 0
            ? 'text-red-500'
            : 'text-green-500',
        'ml-2 font-normal',
        className
      )}
      {...props}
    >
      {diff.toFixed(2)} %
    </span>
  )
}
