import Image from 'next/image'
import Link from 'next/link'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from './ui/button'
import { SiGithub } from 'react-icons/si'

export function Footer() {
  return (
    <div className="flex w-full justify-end gap-x-2 px-4 py-4">
      <ThemeSwitcher />
      <Button variant="ghost" size="icon" asChild>
        <Link
          href="https://github.com/lzldev/alc-osrs-prices"
          className="flex items-center"
        >
          <SiGithub className="h-[1.2rem] w-[1.2rem] fill-foreground" />
        </Link>
      </Button>
    </div>
  )
}
