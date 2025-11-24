'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

function inverseTheme(t: string) {
  return t === 'dark' ? 'light' : 'dark'
}

export function ThemeSwitcher() {
  const { setTheme, theme, systemTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() =>
        theme === 'system'
          ? setTheme(inverseTheme(systemTheme!))
          : setTheme(inverseTheme(theme!))
      }
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
