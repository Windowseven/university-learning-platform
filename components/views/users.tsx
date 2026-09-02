'use client'

import * as React from 'react'
import {
  ArrowUpDown,
  Download,
  MoreHorizontal,
  Search,
  UserPlus,
  Users as UsersIcon,
} from 'lucide-react'

import { admin, roles } from '@/lib/api'
import type { Role, User } from '@/lib/api-types'
import { useAudit } from '@/lib/audit'

const { users: allUsers } = admin
import { PageHeader } from '@/components/shared/page-header'
import { PageSkeleton } from '@/components/shared/page-skeleton'
import { EmptyState, ErrorState } from '@/components/shared/states'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { AvatarInitials } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

const roleTone: Record<Role, string> = {
  ADMIN: 'bg-destructive/10 text-destructive',
  LECTURER: 'bg-primary/10 text-primary',
  STUDENT: 'bg-muted text-muted-foreground',
}

const PAGE_SIZE = 6

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function UsersView() {
  const { log } = useAudit()
  const [query, setQuery] = React.useState('')
  const [status, setStatus] = React.useState<'all' | 'active' | 'inactive'>('all')
  const [role, setRole] = React.useState<'all' | Role>('all')
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc')
  const [page, setPage] = React.useState(1)
  const [selected, setSelected] = React.useState<Set<number>>(new Set())
  const [loading, setLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450)
    return () => clearTimeout(t)
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let result = allUsers.filter((u) => {
      const matchesQuery =
        !q ||
        u.full_name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
      const matchesStatus = status === 'all' || (status === 'active' ? u.is_active : !u.is_active)
      const matchesRole = role === 'all' || u.role === role
      return matchesQuery && matchesStatus && matchesRole
    })
    result = [...result].sort((a, b) =>
      sortDir === 'asc'
        ? a.full_name.localeCompare(b.full_name)
        : b.full_name.localeCompare(a.full_name),
    )
    return result
  }, [query, status, role, sortDir])

  if (loading) return <PageSkeleton variant="table" rows={6} />

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const activeCount = allUsers.filter((u) => u.is_active).length

  const allOnPageSelected = filtered.length > 0 && pageItems.every((u) => selected.has(u.id))

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (allOnPageSelected) pageItems.forEach((u) => next.delete(u.id))
      else pageItems.forEach((u) => next.add(u.id))
      return next
    })
  }
  const toggleOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearFilters = () => {
    setQuery('')
    setStatus('all')
    setRole('all')
  }

  if (hasError) {
    return <ErrorState onRetry={() => { setHasError(false); setLoading(true); setTimeout(() => setLoading(false), 400) }} />
  }

  const actionMenu = (u: User) => (
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>{u.full_name}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Edit user</DropdownMenuItem>
      <DropdownMenuItem disabled={u.role === 'ADMIN'}>Change role</DropdownMenuItem>
      <DropdownMenuItem>Reset password</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem disabled={u.role === 'ADMIN'} className="text-destructive data-[highlighted]:text-destructive">
        {u.is_active ? 'Deactivate' : 'Activate'}
      </DropdownMenuItem>
    </DropdownMenuContent>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={UsersIcon}
        title="Users"
        description={`${allUsers.length} users · ${activeCount} active`}
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => log({ action: 'export', resource: 'user', category: 'Access', detail: `Exported user directory (${allUsers.length} users) for download` })}
            >
              <Download className="size-4" aria-hidden="true" />
              Export
            </Button>
            <Button
              onClick={() => log({ action: 'create', resource: 'user', category: 'Access', detail: 'Opened the new-user form (create user)' })}
            >
              <UserPlus className="size-4" aria-hidden="true" />
              Add user
            </Button>
          </>
        }
      />

      <section className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 p-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="Search by name, username, or email..."
              className="pl-9"
              aria-label="Search users"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onValueChange={(v) => { setStatus(v as 'all' | 'active' | 'inactive'); setPage(1) }}>
              <SelectTrigger className="w-36" aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={role} onValueChange={(v) => { setRole(v as 'all' | Role); setPage(1) }}>
              <SelectTrigger className="w-36" aria-label="Filter by role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-3 border-t border-border bg-muted/40 px-4 py-2.5 text-sm">
            <span className="font-medium">{selected.size} selected</span>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="outline">Deactivate</Button>
              <Button size="sm" variant="outline">Change role</Button>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={UsersIcon}
            title="No users match your filters"
            description="Try adjusting your search or filter criteria."
            actionLabel="Clear filters"
            onAction={clearFilters}
            className="border-0"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="w-10 px-4 py-3">
                    <Checkbox
                      aria-label="Select all users on this page"
                      checked={allOnPageSelected}
                      onCheckedChange={toggleAll}
                    />
                  </th>
                  <th className="px-2 py-3">
                    <button
                      className="inline-flex items-center gap-1 uppercase tracking-wide hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                      onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
                    >
                      User
                      <ArrowUpDown className="size-3" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="px-2 py-3">Role</th>
                  <th className="px-2 py-3">Status</th>
                  <th className="px-2 py-3">Joined</th>
                  <th className="w-12 px-2 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageItems.map((u) => (
                  <tr
                    key={u.id}
                    className={cn('border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30', selected.has(u.id) && 'bg-muted/40')}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        aria-label={`Select ${u.full_name}`}
                        checked={selected.has(u.id)}
                        onCheckedChange={() => toggleOne(u.id)}
                      />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-3">
                        <AvatarInitials name={u.full_name} />
                        <span className="min-w-0">
                          <span className="block truncate font-medium">{u.full_name}</span>
                          <span className="block truncate text-xs text-muted-foreground">@{u.username} · {u.email}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <Badge variant="outline" className={roleTone[u.role]}>{u.role}</Badge>
                    </td>
                    <td className="px-2 py-3">
                      <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', u.is_active ? 'text-success' : 'text-muted-foreground')}>
                        <span className={cn('size-1.5 rounded-full', u.is_active ? 'bg-success' : 'bg-muted-foreground/50')} aria-hidden="true" />
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
                    <td className="px-2 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${u.full_name}`}>
                              <MoreHorizontal className="size-4" aria-hidden="true" />
                            </Button>
                          }
                        />
                        {actionMenu(u)}
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm text-muted-foreground sm:flex-row">
          <p className="text-xs">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–
            {Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1.5">
            <Button size="sm" variant="outline" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>
              Previous
            </Button>
            <span className="px-2 text-xs">Page {safePage} of {pageCount}</span>
            <Button size="sm" variant="outline" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>
              Next
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
