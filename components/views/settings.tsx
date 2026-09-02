'use client'

import * as React from 'react'
import { Monitor, Moon, Settings2, Sun } from 'lucide-react'

import { useTheme, type Theme } from '@/lib/theme'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Tabs,
  TabsList,
  TabsPanel,
  TabsTrigger,
} from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const themeOptions: { value: Theme; label: string; icon: typeof Sun; desc: string }[] = [
  { value: 'light', label: 'Light', icon: Sun, desc: 'Use the light color theme' },
  { value: 'dark', label: 'Dark', icon: Moon, desc: 'Use the dark color theme' },
  { value: 'system', label: 'System', icon: Monitor, desc: 'Match operating system preference' },
]

export function SettingsView() {
  const { theme, setTheme } = useTheme()
  const [reducedMotion, setReducedMotion] = React.useState(false)

  const updateReducedMotion = (enabled: boolean) => {
    setReducedMotion(enabled)
    document.documentElement.classList.toggle('reduced-motion', enabled)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Settings2}
        title="Settings"
        description="Manage your workspace preferences and appearance."
      />

      <Tabs defaultValue="appearance" className="max-w-3xl">
        <TabsList className="w-full justify-start sm:w-auto">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        <TabsPanel value="appearance">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">Color theme</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose how the University Platform appears to you. Preferences are saved on this device.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {themeOptions.map((opt) => {
                const Icon = opt.icon
                const selected = theme === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setTheme(opt.value)}
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
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">Reduced motion</h2>
            <div className="mt-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Minimize non-essential animations and transitions.
                </p>
              </div>
              <Switch
                aria-label="Reduced motion"
                checked={reducedMotion}
                onCheckedChange={(v) => updateReducedMotion(Boolean(v))}
              />
            </div>
          </div>
        </TabsPanel>

        <TabsPanel value="general">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold">Workspace profile</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-muted-foreground">Workspace name</span>
                <input
                  defaultValue="University Platform"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium text-muted-foreground">Default language</span>
                <input
                  defaultValue="English (US)"
                  className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/20"
                />
              </label>
            </div>
            <div className="mt-6 flex justify-end">
              <Button>Save changes</Button>
            </div>
          </div>
        </TabsPanel>
      </Tabs>
    </div>
  )
}
