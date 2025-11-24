'use client'

import { MappingData } from '@/lib/osrs/osrs'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { OsrsIcon } from './OsrsIcon'
import { Button } from './ui/button'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command'
import { Input } from './ui/input'
import { Search } from 'lucide-react'

export function SearchInput({ mapping }: { mapping: MappingData }) {
  const [search, setSearch] = useState('')
  const { push } = useRouter()
  const items = useMemo(() => Object.entries(mapping), [mapping])
  const filteredItems = useMemo(
    () =>
      items.filter(([i, v]) =>
        v.name.toLowerCase().includes(search.toLowerCase())
      ),
    [items, search]
  )

  const [open, setOpen] = useState(false)

  return (
    <div>
      <Input
        placeholder="Search for a item"
        onMouseDown={() => {
          setOpen(v => !v)
        }}
      />
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        commandProps={{ shouldFilter: false }}
      >
        <Input
          placeholder="Search for a item"
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
