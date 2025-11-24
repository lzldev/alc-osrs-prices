'use client'

import { MappingData } from '@/lib/osrs/osrs'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { OsrsIcon } from './OsrsIcon'
import {
  CommandDialog,
  CommandItem,
  CommandList,
  CommandShortcut,
} from './ui/command'
import { Input } from './ui/input'
import { Kbd } from './ui/kbd'

export function SearchInput({ mapping }: { mapping: MappingData }) {
  const [search, setSearch] = useState('')
  const { push } = useRouter()
  const items = useMemo(() => Object.entries(mapping), [mapping])
  const filteredItems = useMemo(
    () =>
      items.filter(([_, v]) =>
        v.name.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  )

  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div>
      <div className="relative flex">
        <Input
          placeholder="Search for items"
          onMouseDown={() => {
            setOpen(v => !v)
          }}
        />
        <div className="absolute bottom-0 right-0 top-0 flex items-center gap-x-2 pr-2">
          <Kbd>Ctrl + /</Kbd>
        </div>
      </div>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{ shouldFilter: false }}
      >
        <Input
          placeholder="Search for items"
          className="border-none py-5 outline-none focus-visible:ring-0"
          value={search}
          onChange={t => {
            setSearch(t.currentTarget.value)
          }}
        />
        <CommandList>
          <Virtuoso
            style={{ height: 400 }}
            totalCount={filteredItems.length}
            itemContent={index => {
              const item = filteredItems[index][1]

              return (
                <CommandItem
                  data-selected={index === 0}
                  className="min-h-4 flex flex-row"
                  onSelect={() => {
                    console.log('click')
                    setOpen(false)
                    push(`/item/${item.id}`)
                  }}
                >
                  <OsrsIcon name={item.name} icon={item.icon} />
                  {item.name ?? 'unknown'}
                </CommandItem>
              )
            }}
          />
        </CommandList>
      </CommandDialog>
    </div>
  )
}
