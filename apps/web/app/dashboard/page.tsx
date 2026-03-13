import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { IconUsers, IconPrescription, IconKey, IconPlus, IconArrowRight, IconFiles } from '@tabler/icons-react'
import { cn } from '@workspace/ui/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: profiles } = await supabase
    .from('family_profiles').select('id').is('deleted_at', null)

  const { data: prescriptions } = await supabase
    .from('prescriptions').select('id, created_at').is('deleted_at', null)
    .order('created_at', { ascending: false }).limit(5)

  const { data: activeKeys } = await supabase
    .from('doctor_access_keys').select('id')
    .eq('revoked', false).gte('expires_at', new Date().toISOString())

  const profileCount = profiles?.length ?? 0
  const prescriptionCount = prescriptions?.length ?? 0
  const activeKeyCount = activeKeys?.length ?? 0

  const stats = [
    { title: 'Profiles', value: profileCount, label: profileCount === 1 ? 'Authorized Profile' : 'Authorized Profiles', icon: IconUsers, accent: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Archives', value: prescriptionCount, label: 'Digital Artifacts', icon: IconFiles, accent: 'text-indigo-600', bg: 'bg-indigo-50' },
    { title: 'Active Keys', value: activeKeyCount, label: 'Temporary Access', icon: IconKey, accent: 'text-sky-600', bg: 'bg-sky-50' },
  ]

  const actions = [
    { label: 'New Family Profile', href: '/dashboard/profiles/new', icon: IconPlus, desc: 'Add family members or dependents' },
    { label: 'Upload Archive', href: '/dashboard/prescriptions/upload', icon: IconPrescription, desc: 'Scan and digitize prescriptions' },
    { label: 'Medical Access Keys', href: '/dashboard/access', icon: IconKey, desc: 'Grant temporary doctor access' },
  ]

  return (
    <div className="p-8 md:p-12 space-y-12 max-w-7xl mx-auto">
      {/* ── Page Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
          <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600">Overview</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-none">
          Clinical <span className="font-serif italic font-medium">Overview</span>
        </h1>
        <div className="w-12 h-0.5 rounded-full bg-blue-500 opacity-70" />
        <p className="text-[13px] font-medium text-slate-400 max-w-xl leading-relaxed">
          Integrated health management interface for clinical precision and patient data integrity.
        </p>
      </div>

      {/* ── Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={i} className="group relative">
            <Card className="relative bg-white border-slate-200/40 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-7">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{stat.title}</span>
                <div className={cn('p-2.5 rounded-2xl border border-slate-100', stat.bg)}>
                  <stat.icon className={cn('h-4 w-4', stat.accent)} />
                </div>
              </CardHeader>
              <CardContent className="pb-8 pt-3 px-7">
                <div className="text-5xl font-bold text-slate-900 tracking-tighter">{stat.value}</div>
                <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{stat.label}</p>
              </CardContent>
              <div className={cn('absolute bottom-0 left-0 w-full h-0.5 opacity-0 group-hover:opacity-100 transition-opacity', stat.accent.replace('text-', 'bg-'))} />
            </Card>
          </div>
        ))}
      </div>

      {/* ── Actions + Recent */}
      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Quick Actions */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Direct Actions</h3>
          </div>
          <div className="grid gap-3">
            {actions.map((action, i) => (
              <Button key={i} asChild variant="ghost"
                className="w-full justify-start h-auto p-4 rounded-2xl bg-slate-50/60 hover:bg-slate-100/80 border border-transparent hover:border-slate-200/50 transition-all group">
                <Link href={action.href}>
                  <div className="flex items-center gap-4 w-full">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                      <action.icon className="w-4.5 h-4.5 text-blue-600" />
                    </div>
                    <div className="flex flex-col items-start gap-0.5 text-left grow">
                      <span className="font-semibold text-sm text-slate-900">{action.label}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{action.desc}</span>
                    </div>
                    <IconArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-800 transition-colors" />
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Archives */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Recent Artifacts</h3>
            </div>
            {prescriptionCount > 0 && (
              <Link href="/dashboard/prescriptions" className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700">
                Full Archive →
              </Link>
            )}
          </div>

          <Card className="bg-white/60 border-slate-200/40 rounded-[2rem] overflow-hidden shadow-sm">
            <CardContent className="p-0">
              {prescriptionCount === 0 ? (
                <div className="p-14 text-center flex flex-col items-center gap-5">
                  <div className="w-20 h-20 rounded-[2rem] bg-blue-50 flex items-center justify-center border border-dashed border-blue-200">
                    <IconPrescription className="w-10 h-10 text-blue-300" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-slate-900">No artifacts found</h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-medium uppercase tracking-wider max-w-[180px] mx-auto">Your digital medical vault is empty</p>
                  </div>
                  <Button asChild className="rounded-full px-10 h-11 bg-black hover:bg-zinc-900 text-white text-sm font-semibold shadow-lg">
                    <Link href="/dashboard/prescriptions/upload">Index Archive</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {prescriptions?.map((prescription) => (
                    <Link key={prescription.id} href={`/dashboard/prescriptions/${prescription.id}`}
                      className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/60 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                          <IconFiles className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">Digital Medical Record</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
                            {new Date(prescription.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                        <IconArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
