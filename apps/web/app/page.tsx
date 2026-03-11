import Link from 'next/link'
import { IconChevronRight } from '@tabler/icons-react'

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 overflow-x-hidden">
      {/* Navigation - Rounded Pill */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4">
        <div className="flex items-center justify-between rounded-full bg-[#1c1c1e]/80 px-4 py-3 backdrop-blur-xl shadow-2xl border border-white/10 transition-all hover:bg-[#1c1c1e]/90">
          <div className="flex items-center gap-2">
            <div className="bg-white text-black h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm tracking-tighter">
              P.
            </div>
            <span className="font-semibold text-sm tracking-tight hidden sm:block">PTIALRECORD</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-white/70">
            <Link href="#" className="hover:text-white transition-colors">Features</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">For Clinics</Link>
          </nav>

          <div className="flex items-center">
            {/* Redirects to Account Creation / Login Page */}
            <Link href="/login" className="bg-white text-black px-5 py-2 rounded-full text-xs font-semibold hover:bg-gray-200 transition-all duration-300">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-48 pb-32 flex flex-col items-center justify-center text-center px-4 sm:px-6 z-10">
        <h2 className="text-[#a0a0ab] font-semibold tracking-wider text-xs md:text-sm mb-6 uppercase">
          The new standard in health records
        </h2>
        <h1 className="text-5xl md:text-7xl lg:text-[6rem] font-semibold tracking-tighter leading-[1.05] max-w-5xl mx-auto bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
          Your health. <br /> In your hands.
        </h1>
        <p className="mt-8 text-lg md:text-xl text-[#a0a0ab] max-w-2xl mx-auto font-medium tracking-tight leading-relaxed">
          A secure, intelligent medical system designed for complete privacy, instant accessibility, and total peace of mind.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
          <Link href="/login" className="bg-white text-black px-8 py-3.5 rounded-full text-base font-semibold hover:bg-gray-200 transition-all duration-300">
            Get Started
          </Link>
          <Link href="#" className="text-white group flex items-center gap-1.5 text-base font-medium hover:text-white/80 transition-colors">
            Learn more <IconChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Device Image / Mockup Area */}
        <div className="mt-24 w-full max-w-[1000px] aspect-[4/3] md:aspect-video relative group">
          {/* Subtle glow effect underneath */}
          <div className="absolute inset-x-20 -inset-y-10 bg-linear-to-b from-white/10 to-transparent blur-[80px] opacity-70 rounded-full pointer-events-none" />
          
          <div className="relative w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 bg-[#0a0a0c] shadow-2xl flex items-center justify-center">
             {/* High quality clean abstract/medical software placeholder */}
             <img 
               src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=2400&q=80" 
               alt="Platform Interface" 
               className="w-full h-full object-cover scale-105 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal hover:scale-100 transition-all duration-[1.5s] ease-out"
             />
             <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent opacity-80 pointer-events-none" />
          </div>
        </div>
      </main>
    </div>
  )
}
