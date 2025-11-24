import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mappingGET } from '@/lib/osrs/osrs'
import { favorites } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function FavoritesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect('/')
  }

  const mapping = await mappingGET()

  const items = await db
    .select()
    .from(favorites)
    .where(table => eq(table.user_id, session.user.id))

  return (
    <div className="flex flex-col items-center justify-center">
      <div>Hello {session?.user.name}</div>
      <div>
        {items.length === 0 && <div> no items to display</div>}
        {items.map(item => (
          <div key={item.item_id}>
            <Link href={`/item/${item.item_id}`}>
              {mapping[item.item_id]?.name ?? 'No Name'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
