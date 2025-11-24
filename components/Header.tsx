import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Separator } from '@radix-ui/react-separator'
import { headers } from 'next/headers'
import { Suspense } from 'react'
import { Avatar } from './Avatar'
import { SigninDiscord, Signout } from './signin-discord'
import { Skeleton } from './ui/skeleton'
import { Button } from './ui/button'
import { LucideHeart } from 'lucide-react'

export function Header() {
  return (
    <div className="flex w-full items-center justify-between border-b-2 border-b-border px-4 py-1">
      <div className="flex gap-x-2 text-xl font-bold">
        <Link href="/">OSRS Prices</Link>
        <span className="bg-transparent text-black">📈</span>
      </div>
      <Suspense fallback={<Skeleton className="h-12" />}>
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
      <div className="flex h-full items-center gap-1">
        <Button variant="link" asChild>
          <Link href="/user/favorite">
            <LucideHeart />
            Favorites
          </Link>
        </Button>
        <Separator className="h-8 w-[1px] bg-border" orientation="vertical" />
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
