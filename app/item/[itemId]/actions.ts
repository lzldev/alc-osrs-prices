'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { favorites } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { refresh } from 'next/cache'
import { headers } from 'next/headers'
import { unauthorized } from 'next/navigation'
import { NextResponse } from 'next/server'

export async function serverFavorite(itemId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return unauthorized()
  }

  if (isNaN(parseInt(itemId))) {
    return NextResponse.json(
      { error: 'Invalid argument passed into itemId' },
      { status: 400 }
    )
  }

  const fav = await db.query.favorites.findFirst({
    where: (t, { eq, and }) =>
      and(eq(t.user_id, session.user.id), eq(t.item_id, parseInt(itemId))),
  })

  if (!fav) {
    const new_fav = await db.insert(favorites).values({
      user_id: session.user.id,
      item_id: parseInt(itemId),
    })

    console.log('new_fav', new_fav)
  } else {
    const s = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.user_id, session.user.id),
          eq(favorites.item_id, parseInt(itemId))
        )
      )

    console.log('row_deleted', s)
  }

  refresh()
}
