'use client'

import * as React from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

import { useTheme } from '@/lib/theme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const options = [
  { value: 'light' as const, label: 'Light', icon: Sun },
  { value: 'dark' as const, label: 'Dark', icon: Moon },
  { value: 'system' as const, label: 'System', icon: Monitor },
]

export function ThemeToggle() {
  const { theme, setTheme, resolved } = useTheme()
  const ActiveIcon = theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Change color theme">
            <ActiveIcon className="size-4" aria-hidden="true" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme · {theme === 'system' ? `System (${resolved})` : theme}</DropdownMenuLabel>
        {options.map((opt) => {
          const Icon = opt.icon
          return (
            <DropdownMenuItem key={opt.value} onClick={() => setTheme(opt.value)}>
              <Icon className="size-4" aria-hidden="true" />
              {opt.label}
              <span
                className={cn(
                  'ml-auto size-1.5 rounded-full bg-primary transition-opacity',
                  theme === opt.value ? 'opacity-100' : 'opacity-0',
                )}
                aria-hidden="true"
              />
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
