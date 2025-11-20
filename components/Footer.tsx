import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
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
  )
}
