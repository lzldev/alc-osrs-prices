import { TimeStep, TimeSteps } from '@/lib/osrs/types'
import { Button } from './ui/button'
import { ButtonGroup } from './ui/button-group'
import Link from 'next/link'
import { ComponentProps } from 'react'
import { clsx } from 'clsx'

export function TimeStepGroup({
  timeStep,
  className,
  ...props
}: { timeStep: TimeStep } & ComponentProps<'div'>) {
  return (
    <ButtonGroup className={clsx(className)} {...props}>
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
  )
}
