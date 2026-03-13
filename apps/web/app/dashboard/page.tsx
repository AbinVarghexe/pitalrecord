import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  IconUsers,
  IconKey,
  IconFiles,
  IconUpload,
  IconArrowRight,
  IconStethoscope,
  IconShieldCheck,
  IconAlertTriangle,
  IconPrescription,
  IconClock,
  IconCalendar,
  IconActivity,
  IconUserPlus,
  IconBell,
  IconX,
} from '@tabler/icons-react'
import { cn } from '@workspace/ui/lib/utils'
import { SeedDemoButton } from '@/components/seed-demo-button'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting() {
  // Use a fixed time derived from server render (IST offset = +05:30 = +330min)
  const now = new Date()
  const h = now.getUTCHours() + 5 // approximate IST hour (good enough for greeting)
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ── Data fetching ──────────────────────────────────────────────────────────
  const [
    { data: profiles },
    { data: prescriptions },
    { data: activeKeys },
  ] = await Promise.all([
    supabase.from('family_profiles').select('id, name, created_at').is('deleted_at', null),
    supabase
      .from('prescriptions')
      .select('id, created_at, notes')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('doctor_access_keys')
      .select('id, created_at, expires_at')
      .eq('revoked', false)
      .gte('expires_at', new Date().toISOString()),
  ])

  const profileCount = profiles?.length ?? 0
  const prescriptionCount = prescriptions?.length ?? 0
  const activeKeyCount = activeKeys?.length ?? 0

  const firstName =
    user?.user_metadata?.full_name?.split(' ')[0] ??
    user?.email?.split('@')[0] ??
    'there'

  const recentRecords = prescriptions?.slice(0, 3) ?? []
  const recentActivity = [
    ...(prescriptions?.slice(0, 3).map((p) => ({
      label: 'Prescription uploaded',
      sub: formatShortDate(p.created_at),
      icon: IconFiles,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    })) ?? []),
    ...(profiles?.slice(0, 2).map((p) => ({
      label: `Profile "${p.name}" updated`,
      sub: formatShortDate(p.created_at),
      icon: IconUserPlus,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    })) ?? []),
  ].slice(0, 5)

  const stats = [
    {
      label: 'Prescriptions',
      value: prescriptionCount,
      sub: 'Total uploaded',
      icon: IconFiles,
      accent: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      label: 'Access Keys',
      value: activeKeyCount,
      sub: 'Currently active',
      icon: IconKey,
      accent: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-100',
    },
    {
      label: 'Family Profiles',
      value: profileCount,
      sub: 'Under management',
      icon: IconUsers,
      accent: 'text-violet-600',
      bg: 'bg-violet-50',
      border: 'border-violet-100',
    },
    {
      label: 'Medicines',
      value: 0,
      sub: 'Currently active',
      icon: IconBell,
      accent: 'text-rose-500',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
  ]

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* ── Bento Grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 auto-rows-auto gap-4">

        {/* ╔══════════════════════════════════╗
            ║  WELCOME BANNER  (col 1–5, row 1)║
            ╚══════════════════════════════════╝ */}
        <div className="col-span-12 lg:col-span-5 row-span-1 relative overflow-hidden rounded-[2rem] border border-slate-200/50 bg-linear-to-br from-slate-900 via-slate-800 to-blue-950 p-8 flex flex-col justify-between min-h-[200px] shadow-lg">
          {/* Paper noise */}
          <div
            className="absolute inset-0 opacity-[0.03] mix-blend-screen pointer-events-none"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
          />
          {/* Glow orb */}
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-blue-300/80">
                Patient Dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
                {getGreeting()},
                <br />
                <span className="font-serif italic font-normal capitalize">{firstName}</span>
              </h1>
            </div>
            <SeedDemoButton />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-400/20 border border-blue-400/30 flex items-center justify-center">
                <IconCalendar className="w-3 h-3 text-blue-300" />
              </div>
              <p className="text-[12px] font-medium text-slate-300">
                {formatDate(new Date())}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/20">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-widest uppercase text-blue-300">
                Secure Session
              </span>
            </div>
          </div>
        </div>

        {/* ╔══════════════════════════════════╗
            ║  QUICK STATS (col 6–12, row 1)   ║
            ╚══════════════════════════════════╝ */}
        <div className="col-span-12 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-[1.5rem] bg-white border border-slate-200/50 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between min-h-[120px]"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
                style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
              />
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {stat.label}
                </p>
                <div className={cn('p-2 rounded-xl border', stat.bg, stat.border)}>
                  <stat.icon className={cn('w-3.5 h-3.5', stat.accent)} />
                </div>
              </div>
              <div>
                <p className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] font-medium text-slate-400 mt-1.5 uppercase tracking-wider">
                  {stat.sub}
                </p>
              </div>
              <div className={cn('absolute bottom-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300', stat.bg.replace('bg-', 'bg-linear-to-r from-') + '/0 via-' + stat.accent.replace('text-', '') + '/60 to-' + stat.bg.replace('bg-', '') + '/0')} />
            </div>
          ))}
        </div>

        {/* ╔══════════════════════════════════╗
            ║  QUICK UPLOAD CTA  (col 1–4)     ║
            ╚══════════════════════════════════╝ */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 relative overflow-hidden rounded-[2rem] border-2 border-dashed border-blue-200 bg-white/60 hover:bg-blue-50/30 hover:border-blue-300 transition-all duration-300 p-7 flex flex-col gap-5 group cursor-pointer shadow-sm min-h-[200px]">
          <Link href="/dashboard/prescriptions/upload" className="absolute inset-0 z-20" />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
          />
          <div className="w-14 h-14 rounded-2xl bg-blue-100/70 border border-blue-200/60 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-sm">
            <IconUpload className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-slate-900 leading-tight">
              Upload Prescription
            </h3>
            <p className="text-[12px] text-slate-400 font-medium mt-1 leading-relaxed">
              Drag & drop or tap to scan and digitize your medical records securely.
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-auto">
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
              Upload now
            </span>
            <IconArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ╔══════════════════════════════════════╗
            ║  ACTIVE DOCTOR SESSIONS  (col 5–8)  ║
            ╚══════════════════════════════════════╝ */}
        <div className={cn(
          'col-span-12 md:col-span-6 lg:col-span-4 relative overflow-hidden rounded-[2rem] border p-7 flex flex-col gap-4 shadow-sm min-h-[200px]',
          activeKeyCount > 0
            ? 'border-amber-200 bg-amber-50/60'
            : 'border-slate-200/50 bg-white/60'
        )}>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
          />
          <div className="flex items-start justify-between">
            <div className={cn('p-2.5 rounded-xl border', activeKeyCount > 0 ? 'bg-amber-100 border-amber-200' : 'bg-slate-50 border-slate-200')}>
              {activeKeyCount > 0
                ? <IconAlertTriangle className="w-5 h-5 text-amber-600" />
                : <IconShieldCheck className="w-5 h-5 text-slate-400" />
              }
            </div>
            <span className={cn(
              'text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border',
              activeKeyCount > 0
                ? 'text-amber-700 bg-amber-100/80 border-amber-200'
                : 'text-slate-400 bg-slate-50 border-slate-200'
            )}>
              {activeKeyCount > 0 ? `${activeKeyCount} Live` : 'All Clear'}
            </span>
          </div>

          <div>
            <h3 className={cn('font-semibold text-base leading-tight', activeKeyCount > 0 ? 'text-amber-900' : 'text-slate-700')}>
              {activeKeyCount > 0 ? 'Active Doctor Sessions' : 'No Active Sessions'}
            </h3>
            <p className="text-[12px] text-slate-400 font-medium mt-1 leading-relaxed">
              {activeKeyCount > 0
                ? `${activeKeyCount} doctor access key${activeKeyCount > 1 ? 's' : ''} currently live. Review and revoke if needed.`
                : 'No doctor access keys are currently active. Your records are private.'}
            </p>
          </div>

          {activeKeyCount > 0 && (
            <Link
              href="/dashboard/access"
              className="inline-flex items-center gap-2 mt-auto text-[12px] font-bold uppercase tracking-widest text-amber-700 hover:text-amber-800 transition-colors group"
            >
              <IconStethoscope className="w-4 h-4" />
              Manage Access Keys
              <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* ╔══════════════════════════════════════╗
            ║  UPCOMING REMINDERS  (col 9–12)     ║
            ╚══════════════════════════════════════╝ */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 relative overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white p-7 flex flex-col gap-4 shadow-sm min-h-[200px]">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Upcoming</p>
              <h3 className="font-semibold text-base text-slate-900 leading-tight mt-0.5">Reminders</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100">
              <IconClock className="w-4.5 h-4.5 text-indigo-500" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {recentRecords.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center py-4">
                <IconBell className="w-8 h-8 text-slate-200" />
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">No upcoming reminders</p>
              </div>
            ) : (
              recentRecords.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/dashboard/prescriptions/${p.id}`}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-9 h-9 shrink-0 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-slate-800 truncate">
                      {p.notes ? p.notes.slice(0, 28) + (p.notes.length > 28 ? '…' : '') : 'Medical Record'}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{formatShortDate(p.created_at)}</p>
                  </div>
                  <IconArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* ╔══════════════════════════════════════╗
            ║  RECENT ACTIVITY  (col 1–4)         ║
            ╚══════════════════════════════════════╝ */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 relative overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white p-7 flex flex-col gap-4 shadow-sm">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">History</p>
              <h3 className="font-semibold text-base text-slate-900 leading-tight mt-0.5">Recent Activity</h3>
            </div>
            <div className="p-2.5 rounded-xl bg-violet-50 border border-violet-100">
              <IconActivity className="w-4.5 h-4.5 text-violet-500" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-6 text-center">
                <IconActivity className="w-8 h-8 text-slate-200" />
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">No activity yet</p>
              </div>
            ) : (
              recentActivity.map((item, i) => (
                <div key={i} className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={cn('w-8 h-8 shrink-0 rounded-xl border flex items-center justify-center', item.bg, 'border-slate-100')}>
                    <item.icon className={cn('w-4 h-4', item.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-slate-800 truncate">{item.label}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{item.sub}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ╔═════════════════════════════════════════════╗
            ║  RECENTLY VIEWED RECORDS  (col 5–12)       ║
            ╚═════════════════════════════════════════════╝ */}
        <div className="col-span-12 lg:col-span-8 relative overflow-hidden rounded-[2rem] border border-slate-200/50 bg-white p-7 flex flex-col gap-5 shadow-sm">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Vault</p>
              <h3 className="font-semibold text-base text-slate-900 leading-tight mt-0.5">Recently Viewed Records</h3>
            </div>
            {prescriptionCount > 0 && (
              <Link
                href="/dashboard/prescriptions"
                className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors"
              >
                Full Archive
                <IconArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {recentRecords.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 border-2 border-dashed border-blue-200 flex items-center justify-center">
                <IconPrescription className="w-8 h-8 text-blue-300" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-800">No records yet</p>
                <p className="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                  Your medical vault is empty
                </p>
              </div>
              <Link
                href="/dashboard/prescriptions/upload"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-[12px] font-bold tracking-wide hover:bg-slate-700 transition-colors shadow"
              >
                <IconUpload className="w-3.5 h-3.5" />
                Upload First Record
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentRecords.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/dashboard/prescriptions/${p.id}`}
                  className="group relative overflow-hidden rounded-[1.5rem] border border-slate-100 bg-slate-50/50 p-5 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-md transition-all duration-200 flex flex-col gap-3"
                >
                  {/* Record thumbnail placeholder */}
                  <div className="w-full h-20 rounded-xl bg-linear-to-br from-slate-100 to-slate-200/50 flex items-center justify-center border border-slate-200/60">
                    <IconFiles className="w-8 h-8 text-slate-300 group-hover:text-blue-400 transition-colors" />
                  </div>

                  <div>
                    <p className="text-[12px] font-semibold text-slate-800 leading-tight truncate">
                      {p.notes ? p.notes.slice(0, 30) + (p.notes.length > 30 ? '…' : '') : `Medical Record #${i + 1}`}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mt-1">
                      {formatShortDate(p.created_at)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 mt-auto">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600 group-hover:text-blue-700">
                      View record
                    </span>
                    <IconArrowRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
