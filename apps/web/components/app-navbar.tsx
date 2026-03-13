import { SidebarTrigger } from '@workspace/ui/components/sidebar'
import { Separator } from '@workspace/ui/components/separator'
import { IconLayoutDashboard, IconSearch } from '@tabler/icons-react'

export function AppNavbar({ isDevelopment }: { isDevelopment: boolean }) {
  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between px-6 mx-3 mt-3 rounded-[1.25rem] bg-[#fcfbf8]/97 backdrop-blur-md sticky top-3 z-30"
      style={{
        backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
        border: '1px solid rgba(226, 232, 240, 0.6)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-slate-400 hover:text-slate-900 transition-colors" />
        <Separator orientation="vertical" className="mx-2 h-4 bg-slate-200/60" />
        <div className="flex items-center gap-3">
          <div className="bg-blue-50/50 backdrop-blur-md border border-blue-100/50 rounded-lg p-1.5 shadow-sm">
            <IconLayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-600/80 flex items-center gap-1">
            Patient OS <span className="text-slate-400">/</span> <span className="text-slate-900">Core</span>
          </span>
        </div>
      </div>

      <form action="/dashboard/search" method="GET" className="flex items-center">
        <div className="relative flex items-center">
          <IconSearch className="absolute left-3 w-4 h-4 text-blue-500 pointer-events-none" stroke={2} />
          <input
            name="q"
            type="search"
            placeholder="Search records…"
            className="h-9 w-52 pl-9 pr-4 rounded-xl bg-slate-100/70 border border-slate-300 text-[13px] font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
          />
        </div>
      </form>

      {/* Wavy Animated Border */}
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
  )
}
