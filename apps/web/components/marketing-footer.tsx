"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@workspace/ui/lib/utils"

export function MarketingFooter() {
  const platformLinks = [
    { name: "Pricing", href: "#" },
    { name: "Smart OCR", href: "#" },
    { name: "Medical Timeline", href: "#" },
  ]

  const securityLinks = [
    { name: "Data Privacy", href: "#" },
    { name: "Encrypted Storage", href: "#" },
    { name: "Consent Logs", href: "#" },
  ]

  const companyLinks = [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
  ]

  return (
    <footer className="relative w-full text-black pt-16 md:pt-24 pb-12 overflow-hidden selection:bg-black/5" style={{ backgroundColor: '#fcfbf8' }}>
      {/* Background Paper Texture (Intensified) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
      />
      
      {/* Newspaper Cutting Line at Top */}
      <div className="absolute top-0 left-0 w-full h-8 flex items-center justify-center -translate-y-1/2 overflow-hidden pointer-events-none">
        <div className="w-full border-t-2 border-dashed border-slate-400/40 relative">
            <div className="absolute left-10 top-0 -translate-y-1/2 bg-[#fcfbf8] px-2 flex items-center gap-1.5 transition-opacity">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 11-4.243 4.243 3 3 0 014.243-4.243zm0-5.758a3 3 0 11-4.243-4.243 3 3 0 014.243 4.243z" />
                </svg>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cut Here</span>
            </div>
            <div className="absolute right-10 top-0 -translate-y-1/2 bg-[#fcfbf8] px-2 flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Official Record</span>
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 11-4.243 4.243 3 3 0 014.243-4.243zm0-5.758a3 3 0 11-4.243-4.243 3 3 0 014.243 4.243z" />
                </svg>
            </div>
        </div>
      </div>

      {/* Decorative Hand-drawn Sketches (Background) */}
      <div className="absolute top-20 right-10 w-48 h-48 opacity-[0.03] pointer-events-none rotate-12 select-none">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M100 20 C 140 20, 140 80, 100 80 C 60 80, 60 20, 100 20 Z M100 80 L 100 180 M100 100 L 140 120 M100 120 L 60 140" />
            <circle cx="100" cy="50" r="10" />
        </svg>
      </div>
      <div className="absolute bottom-40 left-10 w-40 h-40 opacity-[0.03] pointer-events-none -rotate-6 select-none">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="50" y="30" width="100" height="140" rx="4" />
            <path d="M70 60 L 130 60 M70 90 L 130 90 M70 120 L 110 120" />
        </svg>
      </div>

      {/* Top CTA Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 md:px-12 text-center mb-16 md:mb-24 pt-4 md:pt-8">
        <h2 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8 md:mb-10 leading-[1.1] text-slate-900 font-serif italic italic-none">
          Ready to Turn Complexity <br className="hidden sm:block" />
          into Clarity?
        </h2>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3 rounded-full bg-slate-900 text-white font-medium text-[15px] hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
          >
            Start Now
          </Link>
          <Link
            href="#"
            className="px-8 py-3 rounded-full border border-slate-200 text-slate-900 font-medium text-[15px] hover:bg-slate-50 transition-all active:scale-95"
          >
            Book a Demo
          </Link>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newspaper Style Certified Stamp */}
        <div className="absolute top-0 right-20 -translate-y-full md:translate-y-0 rotate-12 pointer-events-none select-none hidden md:block opacity-60">
            <div className="border-4 border-rose-600/30 text-rose-600/40 p-3 rounded-xl font-bold uppercase tracking-widest text-xl rotate-[-5deg]">
                <div className="border-2 border-rose-600/20 p-2 rounded-lg">
                    Certified <br />
                    System 1.0
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20 border-t-2 border-slate-900/5 pt-16 relative">
          {/* Logo & Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image 
                src="/images/Logo.png" 
                alt="PTIALRECORD Logo" 
                width={32} 
                height={32} 
              />
              <span className="text-xl font-bold tracking-tight text-slate-900">PTIALRECORD</span>
            </Link>
            
            <div className="flex flex-col gap-4 text-slate-500 text-sm leading-relaxed max-w-xs font-medium">
              <div className="flex gap-3">
                <svg className="w-5 h-5 mt-0.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Empire State Building, 350 5th Avenue, New York, NY 10118, United States</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5.172V18a2 2 0 002 2h14a2 2 0 002-2V5.172a2 2 0 00-.586-1.414l-1.414-1.414A2 2 0 0016.586 2H7.414a2 2 0 00-1.414.586L4.586 4A2 2 0 004 5.414l-1 1z" />
                </svg>
                <span>(+1) 5056469494</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <Link href="mailto:partnership@pitalrecord.com" className="hover:text-black transition-colors">partnership@pitalrecord.com</Link>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-[13px] uppercase tracking-wider text-slate-900 border-b border-slate-900/5 pb-2">Platform</h4>
            <ul className="flex flex-col gap-4">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-black transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-[13px] uppercase tracking-wider text-slate-900 border-b border-slate-900/5 pb-2">Security</h4>
            <ul className="flex flex-col gap-4">
              {securityLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-black transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="font-bold text-[13px] uppercase tracking-wider text-slate-900 border-b border-slate-900/5 pb-2">Company</h4>
            <ul className="flex flex-col gap-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-500 hover:text-black transition-colors text-sm font-medium">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-black/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <Link href="#" className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-400 hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </Link>
            <Link href="#" className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-400 hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </Link>
            <Link href="#" className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-400 hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </Link>
            <Link href="#" className="p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-400 hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
            </Link>
          </div>

          <div className="flex gap-8 text-[13px] text-slate-400 font-medium">
            <Link href="#" className="hover:text-black transition-colors underline decoration-slate-200 underline-offset-4">Terms of Service</Link>
            <Link href="#" className="hover:text-black transition-colors underline decoration-slate-200 underline-offset-4">Privacy Policy</Link>
          </div>
        </div>

        <div className="text-center relative">
          <p className="text-slate-400 text-[11px] mb-4 relative z-10 font-bold uppercase tracking-widest">
            © 2025 · PTIALRECORD · Patient Intelligence System
          </p>
        </div>
      </div>

      {/* Large Semi-transparent Logo Text Bottom-aligned */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none select-none z-0">
        <span className="text-[clamp(8rem,15vw,15rem)] font-black text-black/4 tracking-[-0.04em] leading-none uppercase translate-y-[10%]">
          PTIALRECORD
        </span>
      </div>

    </footer>
  )
}
