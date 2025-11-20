import { Avatar } from '@/components/Avatar'
import { SigninDiscord, Signout } from '@/components/signin-discord'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center">
      <div className="border-b-border flex w-full items-center justify-between border-b-2 px-4 py-1">
        <div className="flex gap-x-2 text-xl font-bold">
          OSRS Prices
          <span className="bg-transparent text-black">📈</span>
        </div>
        <Suspense>
          <Username />
        </Suspense>
      </div>
      <h1 className="bg-gradient-to-br from-black via-[#171717] to-[#4b4b4b] bg-clip-text pb-8 pt-4 text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        OSRS Prices <span className="bg-transparent text-black">📈</span>
      </h1>

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

async function UsernameTest() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-2">
        Not logged in!
        <SigninDiscord />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      Logged in as {session.user.name}
      <SigninDiscord className="h-12 w-72" />
      <div className="border-border flex h-12 w-72 items-center justify-center gap-2 rounded-md border-2 p-1">
        <Avatar user={session.user} />
        <span className="line-clamp-1 min-w-[14rem] max-w-[14rem]">
          {session.user.name}
        </span>
        U
      </div>
      <Avatar user={session.user} ignoreImage={true} />
      <Signout />
    </div>
  )
}
async function Username() {
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
    <div className="flex flex-col items-center gap-2">
      <div className="flex h-12 w-72 items-center justify-center gap-2 rounded-md">
        <Avatar user={session.user} />
        <span className="line-clamp-1 min-w-[12rem] max-w-[12rem] select-none">
          {session.user.name}
        </span>
        <Signout />
      </div>
    </div>
  )
}
