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
    <div className="p-6 md:p-10 space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-1.5 mt-2">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Clinical Overview
        </h1>
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400">
          Integrated Health Management
        </p>
      </div>

      {/* Stats Grid - Apple Style Widgets */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Profiles", value: profileCount, label: profileCount === 1 ? 'Active Profile' : 'Active Profiles', icon: IconUsers, accent: "text-blue-600", bg: "bg-blue-50/40" },
          { title: "Archives", value: prescriptionCount, label: "Medical Artifacts", icon: IconFiles, accent: "text-indigo-600", bg: "bg-indigo-50/40" },
          { title: "Active Keys", value: activeKeyCount, label: "Temporary Access", icon: IconKey, accent: "text-sky-600", bg: "bg-sky-50/40" }
        ].map((stat, i) => (
          <div key={i} className="group relative">
            <Card className="relative bg-white border-slate-200/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {stat.title}
                </span>
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                   <stat.icon className={cn("h-4 w-4", stat.accent)} />
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="text-4xl font-bold text-slate-900 tracking-tight">{stat.value}</div>
                <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-tight">
                  {stat.label}
                </p>
              </CardContent>
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
                  <div className="w-20 h-20 rounded-[2rem] bg-blue-50/50 flex items-center justify-center border border-dashed border-blue-200/50 relative overflow-hidden group">
                    <IconPrescription className="w-10 h-10 text-blue-300 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 to-transparent" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-slate-900">No records found</p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium max-w-[200px] mx-auto uppercase tracking-tight">Your digital medical vault is empty</p>
                  </div>
                  <Button asChild className="mt-4 rounded-full px-10 h-11 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
                    <Link href="/dashboard/prescriptions/upload">Start Archive</Link>
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
