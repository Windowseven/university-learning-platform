'use client'

import * as React from 'react'
import { GraduationCap, LogOut, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface SidebarItem {
  id: string
  label: string
  icon: LucideIcon
  variant?: 'default' | 'launcher'
}

export interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

export interface Persona {
  name: string
  role: string
  initials: string
}

export function Sidebar({
  groups,
  active,
  badges,
  onSelect,
  onLaunch,
  collapsed,
  mobileOpen,
  onClose,
  brandSubtitle,
  persona,
  onLogout,
}: {
  groups: SidebarGroup[]
  active: string
  badges?: Record<string, string>
  onSelect: (id: string) => void
  onLaunch?: () => void
  collapsed: boolean
  mobileOpen: boolean
  onClose: () => void
  brandSubtitle: string
  persona: Persona
  onLogout: () => void
}) {
  const handleSelect = (id: string, variant?: SidebarItem['variant']) => {
    if (variant === 'launcher') {
      onClose()
      onLaunch?.()
      return
    }
    onSelect(id)
    onClose()
  }

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar py-5 text-sidebar-foreground transition-transform duration-200 ease-out lg:translate-x-0',
          collapsed ? 'w-[72px] lg:w-[72px]' : 'w-64',
          mobileOpen
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Primary navigation"
      >
        <div className={cn('flex items-center px-3', collapsed ? 'justify-center' : 'justify-between')}>
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-black/20">
              <GraduationCap className="size-5" aria-hidden="true" />
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <p className="font-semibold tracking-tight">University Platform</p>
                <p className="text-xs text-sidebar-foreground/60">{brandSubtitle}</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button
              aria-label="Close navigation"
              onClick={onClose}
              className="rounded-lg p-2 text-sidebar-foreground/70 transition hover:bg-sidebar-accent lg:hidden"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <nav className="mt-7 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-3">
          {groups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/50">
                  {group.label}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon
                  const isLauncher = item.variant === 'launcher'
                  const isActive = !isLauncher && active === item.id
                  const link = (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id, item.variant)}
                      aria-current={isActive ? 'page' : undefined}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all focus-visible:ring-3 focus-visible:ring-sidebar-ring focus-visible:outline-none',
                        collapsed && 'justify-center px-0',
                        isLauncher
                          ? 'border border-dashed border-sidebar-primary/40 bg-sidebar-accent/40 text-sidebar-foreground hover:border-sidebar-primary hover:text-sidebar-primary'
                          : isActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent',
                      )}
                    >
                      <Icon className={cn('size-[18px] shrink-0', isLauncher && 'text-sidebar-primary')} aria-hidden="true" />
                      {!collapsed && (
                        <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                          <span className="truncate">{item.label}</span>
                          {badges && badges[item.id] != null && !isLauncher && (
                            <span className="rounded-full bg-sidebar-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-sidebar-primary tabular-nums">
                              {badges[item.id]}
                            </span>
                          )}
                          {isLauncher && (
                            <span className="rounded-full bg-sidebar-primary/10 px-2 py-0.5 text-[10px] font-semibold text-sidebar-primary">
                              Open
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  )
                  if (collapsed) {
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger render={<span className="relative block" />}>
                          {link}
                        </TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    )
                  }
                  return link
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-4 border-t border-sidebar-border px-3 pt-4">
          {collapsed ? (
            <div className="flex justify-center">
              <div
                role="button"
                tabIndex={0}
                onClick={onLogout}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground transition hover:opacity-90"
                title={`${persona.name} — sign out`}
              >
                {persona.initials}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-sidebar-accent"
              title="Sign out"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">
                {persona.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{persona.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/60">{persona.role}</p>
              </div>
              <LogOut className="size-4 shrink-0 text-sidebar-foreground/50" aria-hidden="true" />
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
