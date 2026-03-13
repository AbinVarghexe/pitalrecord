import React from 'react'

export function AppContentCard({
  children,
  isDevelopment = false,
  className = '',
}: {
  children: React.ReactNode
  isDevelopment?: boolean
  className?: string
}) {
  return (
    <div className={`relative w-full h-full bg-white rounded-[32px] md:rounded-[40px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.08)] border border-slate-200/40 overflow-hidden flex flex-col ${className}`}>
      {/* Subtle Paper Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
      />

      {/* Tape Deco — Soft Blue */}
      <div
        className="absolute -top-6 -left-12 w-48 h-12 bg-blue-100/30 backdrop-blur-[1.5px] -rotate-45 z-20 pointer-events-none border border-blue-200/10"
        style={{
          clipPath: "polygon(0% 10%, 4% 0%, 10% 8%, 15% 0%, 22% 10%, 28% 2%, 35% 12%, 42% 4%, 50% 15%, 58% 6%, 65% 14%, 72% 3%, 80% 12%, 88% 1%, 95% 9%, 100% 0%, 100% 90%, 96% 100%, 90% 92%, 84% 100%, 78% 90%, 70% 100%, 62% 91%, 55% 100%, 48% 89%, 40% 100%, 32% 92%, 25% 100%, 18% 90%, 10% 100%, 5% 91%, 0% 100%)",
        }}
      />

      <div className="flex-1 relative z-10 overflow-y-auto scrollbar-none">
        {children}
      </div>

      {/* Footer */}
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
  )
}
