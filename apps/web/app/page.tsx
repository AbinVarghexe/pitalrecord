import { IconStarFilled } from '@tabler/icons-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#DDECEE] text-[#1A1A1A] font-sans selection:bg-yellow-200 overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-[#FFB800] py-2 text-center text-xs font-semibold tracking-wide">
        The proud part of Unikorns. A world-class creative design agency.
      </div>

      {/* Navigation */}
      <header className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between rounded-full bg-white/40 px-3 py-2 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-white/40">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-[#1A1A1A] text-white h-9 w-9 rounded-full flex items-center justify-center font-bold text-base tracking-tighter">
              C.
            </div>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
            <Link href="#" className="hover:text-black/70 transition-colors">Our Work</Link>
            <Link href="#" className="hover:text-black/70 transition-colors">Cases</Link>
            <Link href="#" className="hover:text-black/70 transition-colors">How to start</Link>
            <Link href="#" className="hover:text-black/70 transition-colors">Reviews</Link>
            <Link href="#" className="hover:text-black/70 transition-colors">Benefits</Link>
            <Link href="#" className="hover:text-black/70 transition-colors">Market comparison</Link>
            <Link href="#" className="hover:text-black/70 transition-colors">FAQ</Link>
          </nav>

          {/* Right Button */}
          <div className="flex items-center">
            <Link href="#" className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black/80 transition-all duration-200">
              Contact
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="mx-auto mt-24 max-w-5xl px-4 text-center sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Rating Pill */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm border border-black/5">
          <div className="font-bold text-xs tracking-tighter flex items-center opacity-80">
            <span className="text-[11px] me-1 font-extrabold">C</span>
          </div>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <IconStarFilled key={i} className="h-[14px] w-[14px] text-[#FF453A]" />
            ))}
          </div>
          <span className="text-xs font-bold ml-1 opacity-90">5.0</span>
        </div>

        {/* Headline */}
        <h1 className="mt-8 font-serif text-[3.5rem] tracking-tight sm:text-[5.5rem] font-medium leading-[0.95] text-[#1A1A1A] max-w-4xl mx-auto">
          Creative department for brands <br className="hidden md:block"/> without in-house capacity
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-sm sm:text-lg text-black/60 max-w-xl mx-auto leading-relaxed font-medium">
          Scale your creative capacity: <br className="hidden sm:block"/> flexible, high-quality, and cost-effective.
        </p>

        {/* Placeholder Landscape Image Area */}
        <div className="mt-16 w-full max-w-[1200px] aspect-16/7 md:aspect-21/9 rounded-[2rem] overflow-hidden relative shadow-2xl transition-transform duration-700 hover:scale-[1.02]">
          {/* A high-quality placeholder image of green hills that blends nicely with the background */}
          <img
            src="https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=2400&q=80"
            alt="Landscape Placeholder"
            className="w-full h-full object-cover origin-bottom scale-105"
          />
          {/* Subtle vignette/overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </main>
      
      {/* Decorative gradient bleed at the bottom to match image style if needed */}
      <div className="h-32 w-full bg-linear-to-t from-[#DDECEE] to-transparent absolute bottom-0 opacity-50 pointer-events-none"></div>
    </div>
  )
}

