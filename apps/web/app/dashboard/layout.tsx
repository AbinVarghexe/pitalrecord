import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { SidebarProvider, SidebarInset } from '@workspace/ui/components/sidebar'
import { TooltipProvider } from '@workspace/ui/components/tooltip'
import { AppSidebar } from '@/components/app-sidebar'
import { AppNavbar } from '@/components/app-navbar'
import { PaperBackground } from '@/components/paper-background'
import { AppContentCard } from '@/components/app-content-card'

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
      <SidebarProvider defaultOpen={defaultOpen} style={{ '--sidebar-width': '15rem', '--sidebar-width-icon': '5.5rem' } as any}>
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

          /* ── Sidebar Integration ── */

          /* Raise the sidebar ABOVE the main content visually */
          [data-slot="sidebar-container"] {
            z-index: 50 !important;
            --sidebar-accent: transparent !important;
            --sidebar-accent-foreground: inherit !important;
          }

          /* Force center icons and set consistent height */
          [data-slot="sidebar-menu-button"] {
            height: 3rem !important;
          }


          /* Perfectly center icons in collapsed mode */
          [data-state="collapsed"] [data-slot="sidebar-menu-button"] {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 0 !important;
            width: 100% !important;
          }

          /* Override the fixed 8! size from the core component to allow larger icons */
          [data-state="collapsed"] [data-sidebar="menu-button"] {
             size: auto !important;
             width: 100% !important;
             height: 3rem !important;
          }

          /* Force visual consistency for icons in all states */
          [data-slot="sidebar-menu-button"] svg {
            width: 22px !important;
            height: 22px !important;
            min-width: 22px !important;
            min-height: 22px !important;
          }

          [data-state="collapsed"] [data-slot="sidebar-menu-button"] svg {
            margin: 0 auto !important;
          }

          /* Ensure the transition for the content shift is smooth */
          [data-slot="sidebar-inset"] {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Round BOTH sides of the floating sidebar card with shadow */
          [data-sidebar="sidebar"] {
            border-radius: 1.25rem !important;
            background: rgba(252, 251, 248, 0.97) !important;
            border: 1px solid rgba(226, 232, 240, 0.6) !important;
            box-shadow: 4px 0 24px rgba(0, 0, 0, 0.06), 0 2px 8px rgba(0, 0, 0, 0.04) !important;
          }

          /* Match the internal inner div radius */
          [data-slot="sidebar-inner"] {
             border-radius: 1.25rem !important;
             background: transparent !important;
          }
        `}</style>
        <PaperBackground>
          <AppSidebar />
          <SidebarInset className="relative flex flex-col flex-1 bg-transparent overflow-hidden font-sans md:pl-2">
            {/* ── Header ──────────────────────────────────────────────────────── */}
            <AppNavbar isDevelopment={isDevelopment} />

            {/* ── Main ────────────────────────────────────────────────────────── */}
            <main className="flex-1 relative z-10 overflow-hidden">
              <div className="h-full w-full p-4 md:p-6 lg:p-8">
                <AppContentCard isDevelopment={isDevelopment}>
                  {children}
                </AppContentCard>
              </div>
            </main>
          </SidebarInset>
        </PaperBackground>
      </SidebarProvider>
    </TooltipProvider>
  )
}
