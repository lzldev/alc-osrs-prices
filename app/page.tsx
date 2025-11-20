import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { PriceInfo } from '@/components/PriceInfo'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'

export default function Home() {
  return (
    <Container>
      <Header />

      <div className="grid w-full grid-flow-row gap-24 p-16 min-[873px]:grid-cols-2 min-[1323px]:grid-cols-3">
        <Suspense
          fallback={
            <>
              <Skeleton className="h-[550px] w-full" />
              <Skeleton className="h-[550px] w-full" />
              <Skeleton className="h-[550px] w-full" />
            </>
          }
        >
          <PriceInfo />
        </Suspense>
      </div>

      <Footer />
    </Container>
  )
}
