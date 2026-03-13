import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { IconUsers, IconPrescription, IconKey, IconPlus, IconArrowRight, IconFiles, IconActivity } from '@tabler/icons-react'
import { cn } from "@workspace/ui/lib/utils"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch stats
  const { data: profiles } = await supabase
    .from('family_profiles')
    .select('id')
    .is('deleted_at', null)
  
  const { data: prescriptions } = await supabase
    .from('prescriptions')
    .select('id, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: activeKeys } = await supabase
    .from('doctor_access_keys')
    .select('id')
    .eq('revoked', false)
    .gte('expires_at', new Date().toISOString())

  const profileCount = profiles?.length ?? 0
  const prescriptionCount = prescriptions?.length ?? 0
  const activeKeyCount = activeKeys?.length ?? 0

  return (
    <div className="p-8 md:p-12 space-y-16 max-w-7xl mx-auto selection:bg-blue-50">
      <div className="flex flex-col gap-6 mt-2">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/50 backdrop-blur-md border border-blue-100/50 w-fit text-blue-600">
            <span className="text-[12px] font-bold tracking-widest uppercase">Overview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight leading-none">
            Clinical <span className="font-serif italic font-medium">Overview</span>
          </h1>
          {/* Clean Gradient Divider */}
          <div className="w-16 h-1 rounded-full bg-linear-to-r from-blue-500 to-indigo-500 opacity-80" />
        </div>
        <p className="text-[13px] font-medium text-slate-400 max-w-2xl leading-relaxed">
          Integrated health management interface for clinical precision and patient data integrity.
        </p>
      </div>

      {/* Stats Grid - Apple Style Widgets */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Profiles", value: profileCount, label: profileCount === 1 ? 'Authorized Profile' : 'Authorized Profiles', icon: IconUsers, accent: "text-blue-600", bg: "bg-blue-50/50" },
          { title: "Archives", value: prescriptionCount, label: "Digital Artifacts", icon: IconFiles, accent: "text-indigo-600", bg: "bg-indigo-50/50" },
          { title: "Active Keys", value: activeKeyCount, label: "Temporary Access", icon: IconKey, accent: "text-sky-600", bg: "bg-sky-50/50" }
        ].map((stat, i) => (
          <div key={i} className="group relative">
            <Card className="relative bg-white border-slate-200/40 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/20 hover:-translate-y-1 transition-all duration-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-7">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  {stat.title}
                </span>
                <div className={cn("p-2.5 rounded-2xl backdrop-blur-md border border-slate-100/50", stat.bg)}>
                   <stat.icon className={cn("h-4.5 w-4.5", stat.accent)} />
                </div>
              </CardHeader>
              <CardContent className="pb-8 pt-4 px-7">
                <div className="text-5xl font-bold text-slate-900 tracking-tighter">{stat.value}</div>
                <p className="text-[11px] font-bold text-slate-400 mt-2 uppercase tracking-widest leading-none">
                  {stat.label}
                </p>
              </CardContent>
              {/* Subtle accent glow */}
              <div className={cn("absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity", 
                stat.accent.replace('text-', 'bg-'))} />
            </Card>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-12 items-start">
        {/* Quick Actions - Left side */}
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
             <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">
               Direct Actions
             </h3>
          </div>
          
          <div className="grid gap-4">
            {[
              { label: "New Family Profile", href: "/dashboard/profiles/new", icon: IconPlus, desc: "Add family members or dependents" },
              { label: "Upload Archive", href: "/dashboard/prescriptions/upload", icon: IconPrescription, desc: "Scan and digitize prescriptions" },
              { label: "Medical Access Keys", href: "/dashboard/access", icon: IconKey, desc: "Grant temporary doctor access" }
            ].map((action, i) => (
              <Button 
                key={i}
                asChild 
                variant="ghost" 
                className="w-full justify-start h-auto p-5 rounded-2xl bg-slate-50/50 hover:bg-slate-100/80 border border-transparent hover:border-slate-200/50 transition-all group"
              >
                <Link href={action.href}>
                  <div className="flex items-center gap-4 w-full">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform">
                      <action.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex flex-col items-start gap-0.5 text-left grow">
                      <span className="font-bold text-sm text-slate-900">{action.label}</span>
                      <span className="text-[11px] text-slate-400 font-medium">{action.desc}</span>
                    </div>
                    <IconArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                  </div>
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Recent Archives - Right side */}
        <div className="lg:col-span-7 space-y-8">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-900">
                  Recent Artifacts
                </h3>
             </div>
             {prescriptionCount > 0 && (
               <Link href="/dashboard/prescriptions" className="text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 transition-colors">
                 Full Archive →
               </Link>
             )}
          </div>

          <Card className="bg-white/40 border-slate-200/40 rounded-[2rem] overflow-hidden backdrop-blur-md shadow-sm">
            <CardContent className="p-0">
              {prescriptionCount === 0 ? (
                <div className="p-16 text-center flex flex-col items-center gap-5">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-blue-50/50 flex items-center justify-center border border-dashed border-blue-200/50 relative overflow-hidden group">
                    <IconPrescription className="w-12 h-12 text-blue-300 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-transparent" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-slate-900">No artifacts found</h4>
                    <p className="text-[11px] text-slate-400 mt-2 font-bold uppercase tracking-[0.15em] max-w-[200px] mx-auto leading-relaxed">Your digital medical vault is currently empty</p>
                  </div>
                  <Button asChild className="mt-4 rounded-full px-12 h-12 bg-black hover:bg-zinc-900 text-white font-bold shadow-xl shadow-slate-200 transition-all hover:scale-105 active:scale-95">
                    <Link href="/dashboard/prescriptions/upload">Index Archive</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100/50">
                  {prescriptions?.map((prescription) => (
                    <Link
                      key={prescription.id}
                      href={`/dashboard/prescriptions/${prescription.id}`}
                      className="flex items-center justify-between p-6 hover:bg-white transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                          <IconFiles className="h-6 w-6 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Digital Medical Record</p>
                          <div className="flex items-center gap-2 mt-1">
                             <div className="w-1 h-1 rounded-full bg-slate-300" />
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {new Date(prescription.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                             </p>
                          </div>
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all shadow-sm">
                        <IconArrowRight className="h-4 w-4 text-slate-300 group-hover:text-white" />
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
