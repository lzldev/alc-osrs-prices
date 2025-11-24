import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export default async function FavoritesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return <div>Hello {session?.user.name}</div>
}
