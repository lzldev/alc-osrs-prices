import { Avatar } from '@/components/Avatar'
import { SigninDiscord, Signout } from '@/components/signin-discord'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'
import { PriceInfo } from '@/components/latest'
import { Separator } from '@/components/ui/separator'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center">
      <div className="border-b-border flex w-full items-center justify-between border-b-2 px-4 py-1">
        <div className="flex gap-x-2 text-xl font-bold">
          OSRS Prices
          <span className="bg-transparent text-black">📈</span>
        </div>
        <Suspense>
          <UserArea />
        </Suspense>
      </div>

      <div className="grid w-full grid-flow-row gap-24 p-16 min-[873px]:grid-cols-2 min-[1323px]:grid-cols-3">
        <Suspense
          fallback={
            <>
              <Skeleton className="h-[40rem] w-full" />
              <Skeleton className="h-[40rem] w-full" />
              <Skeleton className="h-[40rem] w-full" />
            </>
          }
        >
          <PriceInfo />
        </Suspense>
      </div>

      <div className="flex w-full items-end justify-between px-20 py-10 sm:absolute sm:bottom-0">
        <div></div>
        <Link
          href="https://github.com/lzldev/alc-osrs-prices"
          className="flex items-center space-x-2"
        >
          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={24}
            height={24}
            priority
          />
        </Link>
      </div>
    </main>
  )
}

async function UserArea() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-2">
        <SigninDiscord className="h-12 w-72" />
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full items-center">
        <Separator className="mx-1 h-6" orientation="vertical" />
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-72 items-center justify-center gap-2 rounded-md">
            <Avatar user={session.user} />
            <span className="line-clamp-1 min-w-[12rem] max-w-[12rem] select-none">
              {session.user.name}
            </span>
            <Signout />
          </div>
        </div>
      </div>
    </>
  )
}
