'use client'

import * as React from 'react'
import { CornerDownLeft, Monitor, Moon, Search, Sun } from 'lucide-react'
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { navGroups, type SectionId } from '@/lib/navigation'
import { useTheme } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface Action {
  label: string
  hint?: string
  icon: React.ComponentType<{ className?: string }>
  run: () => void
  keywords: string
}

interface Result extends Action {
  category: 'Pages' | 'Actions'
}

export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (id: SectionId) => void
}) {
  const [query, setQuery] = React.useState('')
  const { setTheme } = useTheme()

  const pages: Action[] = navGroups.flatMap((group) =>
    group.items.map((item) => ({
      label: item.label,
      hint: group.label,
      icon: item.icon,
      run: () => onNavigate(item.id),
      keywords: `${item.label} ${group.label}`,
    })),
  )

  const actions: Action[] = [
    { label: 'Switch to light theme', hint: 'Appearance', icon: Sun, run: () => setTheme('light'), keywords: 'theme light appearance' },
    { label: 'Switch to dark theme', hint: 'Appearance', icon: Moon, run: () => setTheme('dark'), keywords: 'theme dark appearance' },
    { label: 'Use system theme', hint: 'Appearance', icon: Monitor, run: () => setTheme('system'), keywords: 'theme system appearance' },
  ]

  const results: Result[] = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    const all: Result[] = [
      ...pages.map((a) => ({ ...a, category: 'Pages' as const })),
      ...actions.map((a) => ({ ...a, category: 'Actions' as const })),
    ]
    if (!q) return all
    return all.filter((a) => a.keywords.toLowerCase().includes(q) || a.label.toLowerCase().includes(q))
  }, [query, pages, actions])

  const [activeIndex, setActiveIndex] = React.useState(0)

  React.useEffect(() => {
    setActiveIndex(0)
  }, [query, open])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault()
        results[activeIndex].run()
        setQuery('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, activeIndex])

  const run = (action: Action) => {
    action.run()
    setQuery('')
    onOpenChange(false)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setQuery('') }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm" />
        <DialogPrimitive.Popup
          className="fixed top-[16vh] left-1/2 z-50 w-[min(40rem,calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          aria-label="Command menu"
        >
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages, actions..."
              aria-label="Search"
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>
          <div className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {(['Pages', 'Actions'] as const).map((category) => {
                  const groupItems = results.filter((r) => r.category === category)
                  if (groupItems.length === 0) return null
                  const startIdx = results.findIndex((r) => r.category === category)
                  return (
                    <div key={category}>
                      <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {category}
                      </p>
                      <div className="flex flex-col gap-0.5">
                        {groupItems.map((item, offset) => {
                          const index = startIdx + offset
                          const Icon = item.icon
                          const isActive = index === activeIndex
                          return (
                            <button
                              key={category + item.label}
                              onClick={() => run(item)}
                              onMouseEnter={() => setActiveIndex(index)}
                              className={cn(
                                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
                                isActive ? 'bg-accent text-accent-foreground' : 'text-foreground',
                              )}
                            >
                              <Icon
                                className="size-4 shrink-0 text-brand"
                                aria-hidden="true"
                              />
                              <span className="min-w-0 flex-1 truncate">{item.label}</span>
                              {item.hint && (
                                <span className="truncate text-xs text-muted-foreground">
                                  {item.hint}
                                </span>
                              )}
                              {isActive && (
                                <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
