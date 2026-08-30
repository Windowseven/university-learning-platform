'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  Bell,
  Moon,
  Sun,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  CircleHelp,
  Clock3,
  Code2,
  Command,
  FileCheck2,
  GraduationCap,
  LayoutDashboard,
  LibraryBig,
  Menu,
  MoreHorizontal,
  Play,
  Search,
  Settings2,
  Sparkles,
  TerminalSquare,
  Users,
  X,
  Zap,
} from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Courses', icon: BookOpen },
  { label: 'Users', icon: Users },
  { label: 'Assignments', icon: FileCheck2 },
  { label: 'Labs & JupyterHub', icon: TerminalSquare },
]

const courses = [
  { name: 'Data Structures & Algorithms', code: 'CS 201', students: '428', progress: 78, color: 'bg-brand' },
  { name: 'Introduction to Python', code: 'CS 101', students: '612', progress: 64, color: 'bg-cyan' },
  { name: 'Machine Learning Foundations', code: 'CS 310', students: '286', progress: 52, color: 'bg-indigo' },
  { name: 'Web Development Studio', code: 'CS 240', students: '354', progress: 89, color: 'bg-amber' },
]

const activity = [
  { title: 'Assignment graded', detail: 'Alex Morgan · CS 201', time: '2 min ago', icon: FileCheck2, tone: 'text-brand bg-brand-soft' },
  { title: 'New lab session started', detail: 'Priya Shah · Python Lab', time: '18 min ago', icon: TerminalSquare, tone: 'text-cyan bg-cyan-soft' },
  { title: 'Course published', detail: 'Machine Learning Foundations', time: '42 min ago', icon: BookOpen, tone: 'text-indigo bg-indigo-soft' },
]

export function Dashboard() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [range, setRange] = useState('Last 30 days')
  const [query, setQuery] = useState('')
  const [launched, setLaunched] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)

  const filteredCourses = useMemo(() => courses.filter((course) => course.name.toLowerCase().includes(query.toLowerCase()) || course.code.toLowerCase().includes(query.toLowerCase())), [query])

  const chooseNav = (label: string) => {
    setActiveNav(label)
    setMobileOpen(false)
    setCommandOpen(false)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {commandOpen && <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/20 px-4 pt-24 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Command menu" onClick={() => setCommandOpen(false)}><div className="w-full max-w-lg rounded-2xl border border-border bg-card p-3 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-2.5"><Search className="size-4 text-muted-foreground" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search pages and courses..." className="min-w-0 flex-1 bg-transparent text-sm outline-none" onKeyDown={(event) => { if (event.key === 'Escape') setCommandOpen(false) }} /><kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd></div><p className="px-2 pb-1 pt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Pages</p><div className="flex flex-col gap-1">{navItems.map((item) => <button key={item.label} onClick={() => chooseNav(item.label)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-muted"><item.icon className="size-4 text-brand" />{item.label}<span className="ml-auto text-xs text-muted-foreground">Go to page</span></button>)}</div></div></div>}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-sidebar px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-brand text-brand-foreground shadow-lg shadow-brand/20"><GraduationCap className="size-5" /></div>
            <div><p className="font-semibold tracking-tight">Atlas Labs</p><p className="text-xs text-muted-foreground">Learning platform</p></div>
          </div>
          <button aria-label="Close navigation" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent lg:hidden"><X className="size-4" /></button>
        </div>
        <div className="mt-10 flex flex-col gap-1">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
          {navItems.map((item) => { const Icon = item.icon; return <button key={item.label} onClick={() => chooseNav(item.label)} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${activeNav === item.label ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm' : 'text-sidebar-foreground hover:bg-sidebar-accent'}`}><Icon className="size-[18px]" /><span>{item.label}</span>{item.label === 'Labs & JupyterHub' && <span className="ml-auto size-2 rounded-full bg-cyan" />}</button> })}
        </div>
        <div className="mt-auto flex flex-col gap-1">
          <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"><Settings2 className="size-[18px]" />Settings</button>
          <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"><CircleHelp className="size-[18px]" />Help center</button>
          <div className="mt-4 border-t border-sidebar-border pt-4"><div className="flex items-center gap-3 px-3"><div className="flex size-9 items-center justify-center rounded-full bg-sidebar-primary text-xs font-bold text-sidebar-primary-foreground">JD</div><div className="min-w-0"><p className="truncate text-sm font-medium">Jordan Davis</p><p className="truncate text-xs text-muted-foreground">Administrator</p></div><ChevronDown className="ml-auto size-4 text-muted-foreground" /></div></div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/90 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3"><button aria-label="Open navigation" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 hover:bg-muted lg:hidden"><Menu className="size-5" /></button><div className="hidden items-center gap-2 text-sm text-muted-foreground md:flex"><span>Workspace</span><span>/</span><span className="font-medium text-foreground">{activeNav}</span></div><div className="flex items-center gap-2 text-sm font-medium md:hidden"><Sparkles className="size-4 text-brand" />Atlas Labs</div></div>
          <div className="flex items-center gap-3"><label className="relative hidden md:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses..." className="h-9 w-56 rounded-lg border border-input bg-muted/40 pl-9 pr-3 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20" /></label><button aria-label="Open command menu" onClick={() => setCommandOpen(true)} className="hidden rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted md:block"><Command className="size-4" /></button><button aria-label="Toggle theme" onClick={() => { const nextTheme = theme === 'light' ? 'dark' : 'light'; setTheme(nextTheme); document.documentElement.classList.toggle('dark', nextTheme === 'dark') }} className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted">{theme === 'light' ? <Moon className="size-4" /> : <Sun className="size-4" />}</button><button aria-label="View notifications" onClick={() => setNotificationsOpen(!notificationsOpen)} className="relative rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted"><Bell className="size-4" /><span className="absolute right-1 top-1 size-1.5 rounded-full bg-warning" /></button><div className="size-8 rounded-full bg-brand-soft p-0.5"><div className="flex size-full items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-foreground">JD</div></div></div>
        </header>

        {notificationsOpen && <section className="absolute right-5 top-16 z-40 w-[min(22rem,calc(100vw-2rem))] rounded-2xl border border-border bg-card p-4 shadow-xl" aria-label="Notifications"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Notifications</h2><p className="text-xs text-muted-foreground">3 items need review</p></div><button onClick={() => setNotificationsOpen(false)} className="text-xs font-medium text-brand hover:underline">Dismiss</button></div><div className="mt-4 flex flex-col gap-3"><div className="flex gap-3 rounded-xl bg-warning-soft p-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-warning" /><div><p className="text-sm font-medium">Assignment review queue</p><p className="mt-1 text-xs text-muted-foreground">18 submissions are ready for grading.</p></div></div><div className="flex gap-3 rounded-xl bg-cyan-soft p-3"><span className="mt-1 size-2 shrink-0 rounded-full bg-cyan" /><div><p className="text-sm font-medium">JupyterHub capacity</p><p className="mt-1 text-xs text-muted-foreground">Resource usage is currently at 68%.</p></div></div></div></section>}
        <main className="mx-auto max-w-[1500px] px-5 py-7 md:px-8 lg:py-9">
          <div className="animate-rise flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="mb-2 text-sm font-medium text-brand">Saturday, August 30, 2026</p><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Good morning, Jordan<span className="text-brand">.</span></h1><p className="mt-2 text-sm text-muted-foreground">Here&apos;s what&apos;s happening across your learning workspace.</p></div><button onClick={() => setLaunched(true)} className="group inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-brand-foreground shadow-lg shadow-brand/20 transition hover:-translate-y-0.5 hover:bg-brand/90"><Play className="size-4 fill-current transition group-hover:translate-x-0.5" />{launched ? 'Workspace opened' : 'Open JupyterHub'}</button></div>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[['Active learners','1,847','+12.8%','vs. last month',Users,'text-brand bg-brand-soft',true],['Course completion','76.4%','+4.2%','vs. last month',GraduationCap,'text-indigo bg-indigo-soft',true],['Assignments submitted','3,294','+18.6%','vs. last month',FileCheck2,'text-cyan bg-cyan-soft',true],['Avg. session time','42m 18s','-2.1%','vs. last month',Clock3,'text-amber bg-amber-soft',false]].map(([label,value,change,sub,Icon,tone,up]) => <div key={label as string} className="animate-rise rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><div className="flex items-start justify-between"><div className={`flex size-10 items-center justify-center rounded-xl ${tone}`}><Icon className="size-5" /></div><span className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-success' : 'text-warning'}`}>{up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}{change}</span></div><p className="mt-5 text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{sub}</p></div>)}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><div className="flex items-center gap-2"><Activity className="size-4 text-brand" /><h2 className="font-semibold">Learning activity</h2></div><p className="mt-1 text-sm text-muted-foreground">Learner engagement across all courses</p></div><select value={range} onChange={(e) => setRange(e.target.value)} className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-brand"><option>Last 30 days</option><option>Last 7 days</option><option>This year</option></select></div><div className="relative mt-7 h-52 overflow-hidden"><div className="absolute inset-0 flex flex-col justify-between text-[11px] text-muted-foreground"><span>2.4k</span><span>1.8k</span><span>1.2k</span><span>600</span><span>0</span></div><div className="absolute inset-0 ml-8 flex flex-col justify-between"><span className="border-t border-dashed border-border" /><span className="border-t border-dashed border-border" /><span className="border-t border-dashed border-border" /><span className="border-t border-dashed border-border" /><span className="border-t border-border" /></div><div className="absolute bottom-0 left-8 right-0 top-4 flex items-end gap-2 px-1 sm:gap-3"><div className="chart-area" /><div className="chart-line" />{[42,58,47,67,54,72,63,82,74,91,78,88,84,96].map((height, i) => <div key={i} className="relative flex h-full flex-1 items-end"><div className="w-full rounded-t-md bg-brand/10 transition-all hover:bg-brand/20" style={{ height: `${height}%` }} /><div className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-brand opacity-0 transition group-hover:opacity-100" /></div>)}</div></div><div className="mt-3 flex justify-between pl-8 text-[11px] text-muted-foreground"><span>Aug 01</span><span>Aug 08</span><span>Aug 15</span><span>Aug 22</span><span>Aug 30</span></div><div className="mt-6 flex gap-5 border-t border-border pt-4 text-xs text-muted-foreground"><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-brand" />Active learners</span><span className="flex items-center gap-2"><span className="size-2 rounded-full bg-cyan" />Completed labs</span></div></div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2"><Zap className="size-4 text-cyan" /><h2 className="font-semibold">JupyterHub status</h2></div><p className="mt-1 text-sm text-muted-foreground">Live workspace health</p></div><span className="flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success"><span className="size-1.5 animate-pulse rounded-full bg-success" />Operational</span></div><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">Active servers</p><p className="mt-2 text-2xl font-semibold">186</p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"><div className="h-full w-[68%] rounded-full bg-cyan" /></div><p className="mt-1.5 text-[11px] text-muted-foreground">of 240 capacity</p></div><div className="rounded-xl bg-muted/60 p-4"><p className="text-xs text-muted-foreground">Avg. startup</p><p className="mt-2 text-2xl font-semibold">8.4s</p><p className="mt-2 text-[11px] font-medium text-success">↓ 1.2s this week</p></div></div><div className="mt-4 rounded-xl border border-border p-4"><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">Resource usage</span><span className="text-xs font-semibold">68%</span></div><div className="mt-3 flex h-10 items-end gap-1">{[38,46,42,56,51,62,58,69,64,72,68,76,70,68,74,68,71,68,68,68].map((h, i) => <div key={i} className="flex-1 rounded-sm bg-cyan/70" style={{ height: `${h}%` }} />)}</div></div></div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex items-center justify-between"><div><div className="flex items-center gap-2"><LibraryBig className="size-4 text-indigo" /><h2 className="font-semibold">Course performance</h2></div><p className="mt-1 text-sm text-muted-foreground">Completion rate by active course</p></div><button className="text-sm font-medium text-brand hover:underline">View all</button></div><div className="mt-6 flex flex-col gap-5">{filteredCourses.map((course) => <div key={course.code} className="group"><div className="flex items-center justify-between gap-4"><div className="flex min-w-0 items-center gap-3"><div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${course.color}/10`}><Code2 className={`size-4 ${course.color.replace('bg-', 'text-')}`} /></div><div className="min-w-0"><p className="truncate text-sm font-medium">{course.name}</p><p className="text-xs text-muted-foreground">{course.code} · {course.students} learners</p></div></div><span className="text-sm font-semibold">{course.progress}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${course.color} transition-all duration-700 group-hover:brightness-110`} style={{ width: `${course.progress}%` }} /></div></div>)}</div></div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Recent activity</h2><p className="mt-1 text-sm text-muted-foreground">Across your workspace</p></div><button aria-label="More activity options" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted"><MoreHorizontal className="size-4" /></button></div><div className="mt-5 flex flex-col gap-5">{activity.map((item) => { const Icon = item.icon; return <div key={item.title} className="flex gap-3"><div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.tone}`}><Icon className="size-4" /></div><div className="min-w-0"><p className="text-sm font-medium">{item.title}</p><p className="truncate text-xs text-muted-foreground">{item.detail}</p><p className="mt-1 text-[11px] text-muted-foreground">{item.time}</p></div></div> })}</div><button className="mt-6 w-full rounded-lg border border-border py-2 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">View activity log</button></div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
