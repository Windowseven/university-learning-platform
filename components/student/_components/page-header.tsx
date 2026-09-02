export function PageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string
  subtitle: string
  badge?: string
}) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {badge && (
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}

export function SectionHeading({
  id,
  children,
  actionLabel,
  onAction,
}: {
  id?: string
  children: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-4">
      <h2 id={id} className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {children}
      </h2>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-sm font-medium text-primary transition hover:underline focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}