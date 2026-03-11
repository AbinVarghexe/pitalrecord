import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@workspace/ui/components/sidebar'
import { TooltipProvider } from '@workspace/ui/components/tooltip'
import { Separator } from '@workspace/ui/components/separator'
import { AppSidebar } from '@/components/app-sidebar'
import { IconLayoutDashboard } from '@tabler/icons-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset className="relative flex min-h-screen bg-[#fcfbf8] overflow-hidden font-sans">
          {/* Background Texture - Cream Paper */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-multiply z-0"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
          />

          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-200/40 px-6 bg-white/40 backdrop-blur-xl sticky top-0 z-30">
            <SidebarTrigger className="-ml-1 text-slate-400 hover:text-slate-900 transition-colors" />
            <Separator orientation="vertical" className="mx-2 h-4 bg-slate-200" />
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-1.5 shadow-sm shadow-blue-200">
                <IconLayoutDashboard className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400">
                Patient OS / Core
              </span>
            </div>
          </header>

          <main className="flex-1 relative z-10 overflow-hidden">
            <div className="h-full w-full p-4 md:p-6 lg:p-10">
              {/* Paper Card Wrap - Clean Rounded Corner Apple Style */}
              <div className="relative w-full h-full bg-white rounded-[24px] md:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-slate-200/50 overflow-hidden flex flex-col">
                {/* Subtle Paper Texture */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0"
                  style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
                />
                
                {/* Tape Deco - Refined Color - Soft Blue-ish Gray */}
                <div 
                  className="absolute -top-6 -left-12 w-40 h-10 bg-blue-100/30 backdrop-blur-[1px] -rotate-45 z-20 pointer-events-none border border-blue-200/10"
                  style={{ 
                    clipPath: "polygon(0% 10%, 5% 0%, 10% 8%, 20% 0%, 30% 10%, 40% 0%, 50% 15%, 60% 0%, 70% 10%, 80% 0%, 90% 10%, 100% 0%, 100% 90%, 95% 100%, 85% 90%, 75% 100%, 65% 90%, 55% 100%, 45% 90%, 35% 100%, 25% 90%, 15% 100%, 5% 90%, 0% 100%)",
                  }}
                />

                <div className="flex-1 relative z-10 overflow-y-auto scrollbar-none">
                   {children}
                </div>

                <div className="mt-auto px-8 py-6 border-t border-slate-100/50 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                     <p className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">
                        Clinical Interface v1.0.2
                     </p>
                   </div>
                   <p className="text-[9px] font-bold text-slate-300 tracking-tight">
                      SECURE ARCHIVE / NODE_ALPHA_04
                   </p>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
