import clsx from 'clsx'
import {
  LucideProps,
  LucideMinus,
  LucideArrowDown,
  LucideArrowUp,
} from 'lucide-react'

export function DiffIcon({
  diff,
  className,
  ...props
}: { diff: number } & LucideProps) {
  return diff === 0 ? (
    <LucideMinus
      className={clsx('text-muted-foreground', className)}
      {...props}
    />
  ) : diff < 0 ? (
    <LucideArrowDown className={clsx('text-red-500', className)} {...props} />
  ) : (
    <LucideArrowUp className={clsx('text-green-500', className)} {...props} />
  )
}
