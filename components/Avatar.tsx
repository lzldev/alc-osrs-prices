import type { User } from 'better-auth/types'
import { User as UserIcon } from 'lucide-react'
import Image from 'next/image'
import clsx from 'clsx'

export function Avatar({
  user,
  ignoreImage,
  className,
}: {
  user: User
  ignoreImage?: boolean
  className?: string
}) {
  const showImage = user.image && !ignoreImage

  return (
    <div
      className={clsx(
        'flex min-h-[40px] w-[40px] items-center justify-center overflow-clip rounded-full',
        !showImage && 'bg-violet-500',
        className
      )}
    >
      {showImage ? (
        <Image
          width={40}
          height={40}
          alt={`profile image of ${user.name}`}
          src={user.image!}
        />
      ) : (
        <UserIcon size={32} color="white" />
      )}
    </div>
  )
}
