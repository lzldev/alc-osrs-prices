import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Separator } from '@radix-ui/react-separator'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Avatar } from './Avatar'
import { SigninDiscord, Signout } from './signin-discord'

export function Header() {
  return (
    <div className="border-b-border flex w-full items-center justify-between border-b-2 px-4 py-1">
      <div className="flex gap-x-2 text-xl font-bold">
        <Link href="/">OSRS Prices</Link>
        <span className="bg-transparent text-black">📈</span>
      </div>
      <Suspense>
        <UserArea />
      </Suspense>
    </div>
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
