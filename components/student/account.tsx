'use client'

import * as React from 'react'
import { CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react'

import { student as studentApi } from '@/lib/api'
import { useAudit } from '@/lib/audit'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from './_components/page-header'

const { profile: studentProfile } = studentApi

export function StudentAccountView() {
  const { log } = useAudit()
  const [current, setCurrent] = React.useState('')
  const [next, setNext] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [message, setMessage] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  const submit = () => {
    setError(null)
    setMessage(null)
    if (!current.trim()) {
      setError('Enter your current password.')
      return
    }
    if (next.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }
    if (next !== confirm) {
      setError('New password and confirmation do not match.')
      return
    }
    setCurrent('')
    setNext('')
    setConfirm('')
    setMessage('Password updated.')
    log(
      { action: 'update', resource: 'system', category: 'Settings', detail: 'Changed account password' },
    )
    setTimeout(() => setMessage(null), 4000)
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <PageHeader title="My Account" subtitle="Manage your profile and security." />

      <section aria-labelledby="profile-heading">
        <h2 id="profile-heading" className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Profile
        </h2>
        <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card p-6 text-center shadow-sm md:flex-row md:items-start md:text-left">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-xl font-bold text-primary">
            SA
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold tracking-tight">{studentProfile.fullName}</p>
            <p className="text-sm text-muted-foreground">{studentProfile.title}</p>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-muted-foreground md:justify-start">
              <Mail className="size-3.5" aria-hidden="true" />
              {studentProfile.email}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-success md:justify-start">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              @{studentProfile.username} · Active account
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="security-heading">
        <h2 id="security-heading" className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <KeyRound className="size-4" aria-hidden="true" />
          Security
        </h2>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="space-y-4">
            <Field id="current-password" label="Current password">
              <Input id="current-password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
            </Field>
            <Field id="new-password" label="New password">
              <Input id="new-password" type="password" value={next} onChange={(e) => setNext(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
            </Field>
            <Field id="confirm-password" label="Confirm new password">
              <Input id="confirm-password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Re-enter your new password" autoComplete="new-password" />
            </Field>
          </div>

          {error && <p className="mt-4 text-sm font-medium text-destructive" role="alert">{error}</p>}
          {message && (
            <p
              role="status"
              className="mt-4 flex items-center gap-2 rounded-xl border border-success/30 bg-success/5 px-4 py-3 text-sm font-medium text-success"
            >
              <CheckCircle2 className="size-4" aria-hidden="true" />
              {message}
            </p>
          )}

          <div className="mt-5 flex justify-end">
            <Button className="w-full sm:w-auto" onClick={submit}>Change password</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}