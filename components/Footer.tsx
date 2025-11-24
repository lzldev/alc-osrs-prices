import Link from 'next/link'
import { SiGithub } from 'react-icons/si'
import { ThemeSwitcher } from './ThemeSwitcher'
import { Button } from './ui/button'

export function Footer() {
  return (
    <div className="fixed bottom-0 right-0 flex justify-end gap-x-2 px-4 py-4">
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
