import clsx from 'clsx'
import { PropsWithChildren } from 'react'

export function Container({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <main
      className={clsx(
        'relative flex min-h-screen flex-col items-center',
        className
      )}
    >
      {children}
    </main>
  )
}
