'use client'

import * as React from 'react'
import {
  Bell,
  BellRing,
  BellOff,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock,
  Command,
  FileText,
  FlaskConical,
  Menu,
  Search,
  Sparkles,
  Users,
} from 'lucide-react'
import { Popover as PopoverPrimitive } from '@base-ui/react/popover'

import type { Persona } from '@/components/layout/sidebar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface HeaderNotification {
  id: string
  kind: 'submission' | 'delivery' | 'deadline' | 'student' | 'graded' | 'lab'
  course: string
  title: string
  time: string
}

export function Header({
  activeLabel,
  breadcrumbs,
  persona,
  adminMode,
  mobileLabel,
  showCommand = true,
  notifications,
  notificationCount = true,
  onOpenCommand,
  onOpenMobileNav,
  onNavigate,
}: {
  activeLabel: string
  breadcrumbs?: { label: string; onClick?: () => void }[]
  persona: Persona
  adminMode: boolean
  mobileLabel: string
  showCommand?: boolean
  notifications?: HeaderNotification[]
  notificationCount?: boolean
  onOpenCommand: () => void
  onOpenMobileNav: () => void
  onNavigate: (id: string) => void
}) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-xl md:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
          className="lg:hidden"
          onClick={onOpenMobileNav}
        >
          <Menu className="size-5" aria-hidden="true" />
        </Button>
        <div className="hidden min-w-0 items-center gap-2 text-sm text-muted-foreground md:flex">
          <span>University Platform</span>
          {(breadcrumbs ?? [{ label: activeLabel }]).map((crumb, i, all) => {
            const isLast = i === all.length - 1
            return (
              <React.Fragment key={`${crumb.label}-${i}`}>
                <span aria-hidden="true">/</span>
                {isLast || !crumb.onClick ? (
                  <span className="truncate font-medium text-foreground">{crumb.label}</span>
                ) : (
                  <button
                    onClick={crumb.onClick}
                    className="rounded font-medium transition hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                  >
                    {crumb.label}
                  </button>
                )}
              </React.Fragment>
            )
          })}
        </div>
        <div className="flex items-center gap-2 text-sm font-medium md:hidden">
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
          {mobileLabel}
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        {showCommand && (
          <>
            <div className="relative hidden md:block">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                readOnly
                value=""
                placeholder="Search..."
                onFocus={() => onOpenCommand()}
                aria-label="Search (command menu)"
                className="h-9 w-52 cursor-pointer rounded-lg border border-input bg-muted/40 pr-3 pl-9 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open command menu"
              className="hidden md:inline-flex"
              onClick={onOpenCommand}
            >
              <Command className="size-4" aria-hidden="true" />
            </Button>
          </>
        )}

        <ThemeToggle />

        <PopoverPrimitive.Root>
          <PopoverPrimitive.Trigger
            render={
              <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                <Bell className="size-4" aria-hidden="true" />
                {notificationCount && notifications && notifications.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                    {notifications.length}
                  </span>
                )}
              </Button>
            }
          />
          <PopoverPrimitive.Portal>
            <PopoverPrimitive.Positioner side="bottom" align="end" sideOffset={8} className="z-50 w-[min(22rem,calc(100vw-2rem))]">
              <PopoverPrimitive.Popup className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <h2 className="text-sm font-semibold">Notifications</h2>
                  {notificationCount && notifications && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <BellRing className="size-3.5" aria-hidden="true" />
                      {notifications.length} new
                    </span>
                  )}
                </div>
                {!notifications ? (
                  <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                    The platform notification system is not available yet.
                  </p>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 px-5 py-10 text-center text-sm text-muted-foreground">
                    <BellOff className="size-5" aria-hidden="true" />
                    You&apos;re all caught up.
                  </div>
                ) : (
                  <ul className="max-h-80 divide-y divide-border overflow-y-auto">
                    {notifications.map((n) => (
                      <li key={n.id} className="flex items-start gap-3 px-4 py-3">
                        <NotificationIcon kind={n.kind} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-snug">{n.title}</p>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            {n.course} · <Clock className="size-3" aria-hidden="true" /> {n.time}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </PopoverPrimitive.Popup>
            </PopoverPrimitive.Positioner>
          </PopoverPrimitive.Portal>
        </PopoverPrimitive.Root>

        {adminMode && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Help"
            onClick={() => onNavigate('analytics')}
          >
            <CircleHelp className="size-4" aria-hidden="true" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                data-slot="dropdown-menu-trigger"
                className="flex items-center gap-2 rounded-lg p-1 transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                aria-label="Account menu"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {persona.initials}
                </span>
                <ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" aria-hidden="true" />
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{persona.name} · {persona.role}</DropdownMenuLabel>
            {adminMode && <DropdownMenuSeparator />}
            {adminMode && (
              <DropdownMenuItem onClick={() => onNavigate('users')}>Profile</DropdownMenuItem>
            )}
            {adminMode && (
              <DropdownMenuItem onClick={() => onNavigate('settings')}>Settings</DropdownMenuItem>
            )}
            {adminMode && (
              <DropdownMenuItem onClick={() => onNavigate('analytics')}>Analytics</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function NotificationIcon({ kind }: { kind: HeaderNotification['kind'] }) {
  if (kind === 'submission') {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FileText className="size-4" aria-hidden="true" />
      </span>
    )
  }
  if (kind === 'delivery') {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
        <CheckCircle2 className="size-4" aria-hidden="true" />
      </span>
    )
  }
  if (kind === 'deadline') {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
        <Clock className="size-4" aria-hidden="true" />
      </span>
    )
  }
  if (kind === 'graded') {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
        <CheckCircle2 className="size-4" aria-hidden="true" />
      </span>
    )
  }
  if (kind === 'lab') {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FlaskConical className="size-4" aria-hidden="true" />
      </span>
    )
  }
  if (kind === 'student') {
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600">
        <Users className="size-4" aria-hidden="true" />
      </span>
    )
  }
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <BookOpen className="size-4" aria-hidden="true" />
    </span>
  )
}
