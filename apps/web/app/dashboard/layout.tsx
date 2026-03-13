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
  const isDevelopment = process.env.NODE_ENV === 'development'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !isDevelopment) {
    redirect('/login')
  }

  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <style>{`
          @keyframes drawWave {
            0% { stroke-dashoffset: 1000; }
            100% { stroke-dashoffset: 0; }
          }
          .animate-wavy-border {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: drawWave 1.5s ease-out forwards;
          }
        `}</style>
        <AppSidebar />
        <SidebarInset className="relative flex min-h-screen bg-[#fcfbf8] overflow-hidden font-sans">
          {/* Background Texture - Cream Paper */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.25] mix-blend-multiply z-0"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
          />

          <header 
            className="flex h-16 shrink-0 items-center gap-2 border-b border-white/40 px-6 bg-[#fcfbf8]/60 backdrop-blur-md sticky top-0 z-30 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
          >
            <SidebarTrigger className="-ml-1 text-slate-400 hover:text-slate-900 transition-colors" />
            <Separator orientation="vertical" className="mx-2 h-4 bg-slate-200/60" />
            <div className="flex items-center gap-3">
              <div className="bg-blue-50/50 backdrop-blur-md border border-blue-100/50 rounded-lg p-1.5 shadow-sm">
                <IconLayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600/80">
                Patient OS / <span className="text-slate-900">Core</span>
              </span>
            </div>

            {/* Wavy Animated Border - Bottom of Header */}
            <div className="absolute bottom-0 left-0 w-full h-[3px] overflow-hidden translate-y-full pointer-events-none">
              <svg 
                width="100%" 
                height="100%" 
                preserveAspectRatio="none" 
                viewBox="0 0 1000 10" 
                xmlns="http://www.w3.org/2000/svg"
                className="absolute inset-0"
              >
                <path 
                  d="M0 5 Q 125 -5, 250 5 T 500 5 T 750 5 T 1000 5" 
                  fill="none" 
                  stroke="rgba(0,0,0,0.08)" 
                  strokeWidth="2"
                  className="animate-wavy-border"
                />
              </svg>
            </div>
          </header>

          <main className="flex-1 relative z-10 overflow-hidden">
            <div className="h-full w-full p-4 md:p-6 lg:p-8">
              {/* Paper Card Wrap - Clean Rounded Corner Apple Style */}
              <div className="relative w-full h-full bg-white rounded-[32px] md:rounded-[40px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-200/40 overflow-hidden flex flex-col">
                {/* Subtle Paper Texture */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0"
                  style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
                />
                
                {/* Tape Deco - Refined Color - Soft Blue */}
                <div 
                  className="absolute -top-6 -left-12 w-48 h-12 bg-blue-100/30 backdrop-blur-[1.5px] -rotate-45 z-20 pointer-events-none border border-blue-200/10"
                  style={{ 
                    clipPath: "polygon(0% 10%, 4% 0%, 10% 8%, 15% 0%, 22% 10%, 28% 2%, 35% 12%, 42% 4%, 50% 15%, 58% 6%, 65% 14%, 72% 3%, 80% 12%, 88% 1%, 95% 9%, 100% 0%, 100% 90%, 96% 100%, 90% 92%, 84% 100%, 78% 90%, 70% 100%, 62% 91%, 55% 100%, 48% 89%, 40% 100%, 32% 92%, 25% 100%, 18% 90%, 10% 100%, 5% 91%, 0% 100%)",
                  }}
                />

                <div className="flex-1 relative z-10 overflow-y-auto scrollbar-none">
                   {children}
                </div>

                <div className="mt-auto px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-[#fcfbf8]/30">
                   <div className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                     <p className="text-[10px] font-bold tracking-[0.25em] text-slate-400 uppercase">
                        Clinical Interface v1.0.2{isDevelopment ? ' / Dev Bypass' : ''}
                     </p>
                   </div>
                   <p className="text-[10px] font-bold text-slate-300 tracking-widest uppercase">
                      Secure Archive / Node_Alpha_04
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
