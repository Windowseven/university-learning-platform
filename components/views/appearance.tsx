'use client'

import * as React from 'react'
import { Monitor, Moon, Palette, Sun } from 'lucide-react'

import { useTheme, type Theme } from '@/lib/theme'
import { useAudit } from '@/lib/audit'
import { PageHeader } from '@/components/shared/page-header'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const themeOptions: { value: Theme; label: string; icon: typeof Sun; desc: string }[] = [
  { value: 'light', label: 'Light', icon: Sun, desc: 'Use the light color theme' },
  { value: 'dark', label: 'Dark', icon: Moon, desc: 'Use the dark color theme' },
  { value: 'system', label: 'System', icon: Monitor, desc: 'Match operating system preference' },
]

export function AppearanceView() {
  const { theme, setTheme } = useTheme()
  const { log } = useAudit()
  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [density, setDensity] = React.useState<'comfortable' | 'compact'>('comfortable')

  const updateReducedMotion = (enabled: boolean) => {
    setReducedMotion(enabled)
    document.documentElement.classList.toggle('reduced-motion', enabled)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Palette}
        title="Appearance"
        description="Personalize the look and feel of the admin console."
      />

      <div className="max-w-3xl">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Color theme</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose how the platform appears to you. Preferences are saved on this device.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {themeOptions.map((opt) => {
              const Icon = opt.icon
              const selected = theme === opt.value
              return (
                <button
                  key={opt.value}
                  onClick={() => {
                    setTheme(opt.value)
                    log({ action: 'toggle', resource: 'system', category: 'Settings', detail: `Changed color theme to ${opt.label.toLowerCase()}` })
                  }}
                  aria-pressed={selected}
                  className={cn(
                    'flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
                    selected
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border hover:bg-muted',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-9 items-center justify-center rounded-lg',
                      selected ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground',
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{opt.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{opt.desc}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Density</h2>
          <div className="mt-4 flex gap-3">
            {(['comfortable', 'compact'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                aria-pressed={density === d}
                className={cn(
                  'flex-1 rounded-xl border p-4 text-left text-sm font-medium capitalize transition focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none',
                  density === d ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:bg-muted',
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-semibold">Reduced motion</h2>
          <div className="mt-3 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Minimize non-essential animations and transitions.
            </p>
            <Switch
              aria-label="Reduced motion"
              checked={reducedMotion}
              onCheckedChange={(v) => updateReducedMotion(Boolean(v))}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
