import { auth } from '@/lib/auth'
import { mappingGET } from '@/lib/osrs/osrs'
import { Separator } from '@radix-ui/react-separator'
import { LucideHeart } from 'lucide-react'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Suspense } from 'react'
import { Avatar } from './Avatar'
import { SearchInput } from './SearchInput'
import { SigninDiscord, Signout } from './signin-discord'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export function Header() {
  return (
    <div className="flex w-full items-center justify-between border-b-2 border-b-border px-2 py-1">
      <div className="flex">
        <div className="flex text-xl font-bold">
          <Link className="mt-1.5 flex items-baseline gap-x-2 px-2" href="/">
            OSRS Prices
            <span className="bg-transparent text-black">📈</span>
          </Link>
          <Separator
            orientation="vertical"
            className="mr-2 h-8 w-[1px] bg-border"
          />
          <Suspense>
            <SearchInputWrapper />
          </Suspense>
        </div>
      </div>
      <Suspense fallback={<Skeleton className="h-12" />}>
        <UserArea />
      </Suspense>
    </div>
  )
}

async function SearchInputWrapper() {
  const mapping = await mappingGET()

  return (
    <>
      <SearchInput mapping={mapping} />
    </>
  )
}

async function UserArea() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return (
      <div className="flex items-center gap-1">
        <Separator className="h-8 w-[1px] bg-border" orientation="vertical" />
        <SigninDiscord className="h-12 w-72" />
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full items-center gap-1">
        <Button className="fill-rose-600 text-rose-600" variant="link" asChild>
          <Link href="/user/favorites">
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
