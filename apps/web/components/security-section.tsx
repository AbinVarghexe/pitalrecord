"use client"

import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"
import { useState } from "react"

export function SecuritySection() {
  const [auditLogsEnabled, setAuditLogsEnabled] = useState(true)

  return (
    <section id="security" className="relative w-full py-24 sm:py-32 overflow-hidden selection:bg-black/5">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Layout (Apple-inspired) */}
        <div className="flex flex-col gap-8 mb-16 px-4">
          <div className="flex flex-col gap-6">
            {/* Apple-style minimalist pill (matches previous sessions) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/50 backdrop-blur-md border border-blue-100/50 w-fit text-blue-600">
              <span className="text-[13px] font-medium tracking-tight">Security</span>
            </div>

            {/* Main Heading (matches previous sessions typography) */}
            <h2 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.1] max-w-4xl">
              At PTIALRECORD, we don't just store records — we <span className="font-serif italic">fortify</span> them.
            </h2>
            
            {/* Clean Gradient Divider */}
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>

            <p className="text-[17px] sm:text-[19px] font-normal text-slate-500 leading-relaxed max-w-2xl">
              Since day one, our architecture has been built on clinical-grade foundations to ensure your data remains your own.
            </p>
          </div>
        </div>

        {/* Main 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 h-full">
          
          {/* Card 1: Dark Clinical Mode (Ref: Dark Card with Toggle) */}
          <div className="group relative bg-slate-900 rounded-[32px] p-8 sm:p-10 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl shadow-slate-900/20 active:scale-[0.98]">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-8 border border-slate-700/50">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-medium text-slate-100 mb-6 leading-tight tracking-tight">
                AES-256 military-grade encryption — protecting your data in <span className="font-serif font-bold italic">perfect conditions</span>, always.
              </h3>
            </div>
            
            <div className="relative z-10 flex items-center justify-between pt-8 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setAuditLogsEnabled(!auditLogsEnabled)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    auditLogsEnabled ? "bg-blue-500" : "bg-slate-700"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      auditLogsEnabled ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
                <span className="text-slate-400 text-sm font-bold uppercase tracking-widest">Audit Logs</span>
              </div>
            </div>

            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          </div>

          {/* Card 2: Clinical Precision (Ref: Center Image Card) */}
          <div className="group relative rounded-[32px] overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl active:scale-[0.98] min-h-[400px]">
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" 
              alt="Medical Professional" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <div className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-sm uppercase tracking-widest mb-4 hover:bg-white/20 transition-all cursor-default">
                Patient Controlled Access
              </div>
              <p className="text-white/80 text-sm max-w-[200px] leading-relaxed">
                You generate the keys. You set the duration. You hold the power.
              </p>
            </div>
          </div>

          {/* Card 3: Standards & Stats (Ref: Right Stats Card) */}
          <div className="group relative bg-white rounded-[32px] p-8 sm:p-10 flex flex-col transition-all duration-500 hover:scale-[1.02] shadow-xl border border-slate-100 active:scale-[0.98]">
            <div className="mb-auto">
              <span className="text-[80px] font-bold text-slate-900 leading-none tracking-tighter">100%</span>
              <h4 className="text-xl font-bold text-slate-900 mt-2">End-to-End Encrypted</h4>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed font-medium">
                Every byte of your medical history is encrypted before it even leaves your device.
              </p>
            </div>

            <div className="space-y-6 pt-10 border-t border-slate-50">
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>GDPR Compliance</span>
                  <span>Active</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-slate-900 rounded-full transition-all duration-1000 group-hover:bg-blue-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>TLS 1.3 Encryption</span>
                  <span>98% Overhear</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-slate-900 rounded-full transition-all duration-1000 group-hover:bg-indigo-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>ISO 27001 Ready</span>
                  <span>Certified</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-slate-900 rounded-full transition-all duration-1000 group-hover:bg-slate-700" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Numbers Row (Ref: Facts in numbers) */}
        <div className="text-center mb-16">
          <p className="text-slate-500 text-[13px] font-bold uppercase tracking-[0.2em] mb-12">
            A few more facts about our clinical integrity
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900">256-Bit</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 border-t border-slate-100 pt-2 w-full max-w-[100px]">AES Standard</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900">0.0%</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 border-t border-slate-100 pt-2 w-full max-w-[100px]">Data Leaks</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900">5 Sec</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 border-t border-slate-100 pt-2 w-full max-w-[100px]">Revocation Speed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900">30 Min</span>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 border-t border-slate-100 pt-2 w-full max-w-[100px]">Default Key TTL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Newspaper Style Divider (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full h-8 flex items-center justify-center translate-y-1/2 overflow-hidden pointer-events-none">
        <div className="w-full border-t-2 border-dashed border-slate-400/20 relative">
            <div className="absolute left-[20%] top-0 -translate-y-1/2 bg-[#fcfbf8] px-2 flex items-center gap-1.5">
                <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic">Encrypted Connection Secure</span>
            </div>
        </div>
      </div>
    </section>
  )
}
