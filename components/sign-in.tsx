'use client'

import * as React from 'react'
import {
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  PencilRuler,
  ShieldCheck,
  User,
} from 'lucide-react'

import { useAuth, demoAccounts, gmailTypoSuggestion, type AuthRole } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsPanel } from '@/components/ui/tabs'

const roleMeta: Record<AuthRole, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  ADMIN: { label: 'Admin', icon: ShieldCheck },
  LECTURER: { label: 'Lecturer', icon: BookOpen },
  STUDENT: { label: 'Student', icon: PencilRuler },
}

const iconInputClass = 'pl-9'

function FieldHeading({ id, label }: { id: string; label: string }) {
  return (
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
      {label}
    </label>
  )
}

function Field({
  id,
  label,
  icon: Icon,
  children,
  hint,
}: {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div>
      <FieldHeading id={id} label={label} />
      <div className="relative">
        <Icon
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        {children}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

function PasswordField({
  id,
  label,
  autoComplete,
  value,
  onChange,
  show,
  onToggle,
}: {
  id: string
  label: string
  autoComplete: string
  value: string
  onChange: (value: string) => void
  show: boolean
  onToggle: () => void
}) {
  return (
    <div>
      <FieldHeading id={id} label={label} />
      <div className="relative">
        <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          placeholder={autoComplete === 'new-password' ? 'At least 8 characters' : '••••••••'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={iconInputClass}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition hover:text-foreground focus-visible:outline-none"
        >
          {show ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  )
}

export function SignIn() {
  const { login, signup, signInAsRole } = useAuth()

  const [tab, setTab] = React.useState<'signin' | 'signup'>('signin')

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const [name, setName] = React.useState('')
  const [signupEmail, setSignupEmail] = React.useState('')
  const [signupPassword, setSignupPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [showSignupPassword, setShowSignupPassword] = React.useState(false)
  const [signupError, setSignupError] = React.useState<string | null>(null)
  const [signupBusy, setSignupBusy] = React.useState(false)

  const gmailHint = React.useMemo(() => {
    if (!signupEmail.trim()) return null
    if (gmailTypoSuggestion(signupEmail)) return null
    const host = signupEmail.split('@')[1]?.trim().toLowerCase()
    if (host && host !== 'gmail.com') return 'Tip: we recommend using a @gmail.com address.'
    return null
  }, [signupEmail])

  const useDemo = (role: AuthRole) => {
    signInAsRole(role)
  }

  const submitSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const err = login(email, password)
    if (err) setError(err)
  }

  const submitSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setSignupError(null)
    if (!name.trim()) {
      setSignupError('Enter your name.')
      return
    }
    if (signupPassword !== confirmPassword) {
      setSignupError('Passwords do not match.')
      return
    }
    setSignupBusy(true)
    // Microtask delay so the button state is visible before the shell swaps in.
    setTimeout(() => {
      const err = signup({ fullName: name, email: signupEmail, password: signupPassword })
      setSignupBusy(false)
      if (err) setSignupError(err)
    }, 300)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <GraduationCap className="size-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">University Platform</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to open your workspace.</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              setTab(v as 'signin' | 'signup')
              setError(null)
              setSignupError(null)
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsPanel value="signin">
              <form className="space-y-4" onSubmit={submitSignIn} noValidate>
                <Field id="signin-email" label="Email" icon={Mail}>
                  <Input
                    id="signin-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={iconInputClass}
                  />
                </Field>

                <PasswordField
                  id="signin-password"
                  label="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword((s) => !s)}
                />

                {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}

                <Button type="submit" className="w-full">Sign in</Button>
              </form>

              <div className="mt-6 border-t border-border pt-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Or continue with a demo role
                </p>
                <div className="flex flex-col gap-2">
                  {demoAccounts.map((account) => {
                    const Icon = roleMeta[account.role].icon
                    return (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => useDemo(account.role)}
                        className="group flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3 text-left transition hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
                      >
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">{roleMeta[account.role].label} workspace</span>
                          <span className="block truncate font-mono text-xs text-muted-foreground">
                            {account.email}
                          </span>
                        </span>
                        <span className="text-xs font-medium text-primary opacity-0 transition group-hover:opacity-100">
                          Sign in →
                        </span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Each role opens its own dashboard. New signups are always created as students.
                </p>
              </div>
            </TabsPanel>

            <TabsPanel value="signup">
              <form className="space-y-4" onSubmit={submitSignup} noValidate>
                <Field id="signup-name" label="Full name" icon={User}>
                  <Input
                    id="signup-name"
                    autoComplete="name"
                    placeholder="Jordan Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={iconInputClass}
                  />
                </Field>

                <Field id="signup-email" label="Email" icon={Mail} hint={gmailHint ?? undefined}>
                  <Input
                    id="signup-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@gmail.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className={iconInputClass}
                  />
                </Field>

                <PasswordField
                  id="signup-password"
                  label="Password"
                  autoComplete="new-password"
                  value={signupPassword}
                  onChange={setSignupPassword}
                  show={showSignupPassword}
                  onToggle={() => setShowSignupPassword((s) => !s)}
                />

                <PasswordField
                  id="signup-confirm"
                  label="Confirm password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showSignupPassword}
                  onToggle={() => setShowSignupPassword((s) => !s)}
                />

                <div className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <p className="text-xs text-muted-foreground">
                    New accounts are created as <span className="font-medium text-foreground">students</span>. If
                    you&apos;re a lecturer, sign up and your administrator will change your role.
                  </p>
                </div>

                {signupError && (
                  <p className="text-sm font-medium text-destructive" role="alert">{signupError}</p>
                )}

                <Button type="submit" className="w-full gap-2" disabled={signupBusy}>
                  {signupBusy && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                  Create account
                </Button>
              </form>
            </TabsPanel>
          </Tabs>
        </div>
      </div>
    </div>
  )
}