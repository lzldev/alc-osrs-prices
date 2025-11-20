import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      <h1 className="bg-gradient-to-br from-black via-[#171717] to-[#4b4b4b] bg-clip-text pb-8 pt-4 text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
        OSRS Prices <span className="bg-transparent text-black">📈</span>
      </h1>
      <Suspense fallback={<h1>...loading....</h1>}>
        <Username />
      </Suspense>

      <div className="flex w-full justify-between px-20 py-10 sm:absolute sm:bottom-0">
        <Link href="https://vercel.com">
          <Image
            src="/vercel.svg"
            alt="Vercel Logo"
            width={100}
            height={24}
            priority
          />
        </Link>
        <Link
          href="https://github.com/vercel/examples/tree/main/storage/postgres-drizzle"
          className="flex items-center space-x-2"
        >
          <Image
            src="/github.svg"
            alt="GitHub Logo"
            width={24}
            height={24}
            priority
          />
          <p className="font-light">Source</p>
        </Link>
      </div>
    </main>
  )
}

import { SigninDiscord, Signout } from '@/components/signin-discord'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

async function Username() {
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
      <Signout />
    </div>
  )
}
