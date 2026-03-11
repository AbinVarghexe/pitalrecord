import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

export function FeaturesSection() {
  return (
    <section id="features" className="w-full py-16 md:py-24 relative z-10 flex flex-col items-center justify-center font-sans">
      
      {/* Small Plain Italic Heading (matches HowItWorksSection) */}
      <div className="w-full max-w-[1400px] mb-8 md:mb-10 px-6 sm:px-8 md:px-12">
        <h3 className="text-lg sm:text-xl italic text-slate-500 tracking-wide">
          Our Capabilities
        </h3>
      </div>

      <div className="w-full max-w-[1400px] relative isolate px-6 sm:px-8 md:px-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start relative z-10">
          
          {/* Left Side: Content */}
          <div className="flex flex-col gap-8 max-w-xl py-8">
            {/* Apple-style minimalist pill (matches HowItWorksSection) */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/50 backdrop-blur-md border border-blue-100/50 w-fit text-blue-600">
              <span className="text-[13px] font-medium tracking-tight">Features</span>
            </div>

            {/* Heading (matches HowItWorksSection typography) */}
            <h2 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.1]">
              Empower your health <br className="hidden sm:block" />
              journey.
            </h2>

            {/* Clean Gradient Divider (matches HowItWorksSection) */}
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>

            {/* Description */}
            <div className="text-[17px] sm:text-[19px] font-normal text-slate-500 leading-relaxed max-w-xl">
              <p className="mb-6">
                Medical records simplified. Securely digitise, manage, and share your health history with a platform designed for patients and clinicians.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-slate-900 text-white text-[15px] font-medium tracking-tight hover:bg-slate-800 hover:scale-105 transition-all duration-300 shadow-lg shadow-slate-900/20"
              >
                Try for free!
              </Link>
              <Link 
                href="#demo" 
                className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm text-slate-900 text-[15px] font-medium tracking-tight hover:bg-slate-50 hover:scale-105 transition-all duration-300"
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Right Side: Staggered Rotated Cards (matches HowItWorksSection style) */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full mt-8 lg:mt-0 flex items-center justify-center">
            
            {/* Card 1: Smart Extraction (Back left - matches Card 1 style) */}
            <div className="absolute w-[55%] sm:w-[50%] aspect-square bg-blue-50/50 backdrop-blur-sm border border-white/40 rounded-3xl -rotate-6 -translate-x-8 sm:-translate-x-12 -translate-y-8 sm:-translate-y-12 shadow-xl overflow-hidden transition-all duration-700 hover:-translate-y-16 hover:-rotate-12 group z-10 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-2 sm:mb-4 transition-transform group-hover:scale-111">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Smart - OCR</h3>
              <p className="text-[11px] sm:text-[13px] text-slate-500 leading-relaxed font-medium">
                Instant digitisation.
              </p>
            </div>

            {/* Card 2: Secure Timeline (Back right - matches Card 2 style) */}
            <div className="absolute w-[55%] sm:w-[50%] aspect-square bg-indigo-50/50 backdrop-blur-sm border border-white/40 rounded-3xl rotate-6 translate-x-8 sm:translate-x-12 translate-y-2 sm:translate-y-4 shadow-xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:rotate-12 group z-20 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-2 sm:mb-4 transition-transform group-hover:scale-110">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Secure - History</h3>
              <p className="text-[11px] sm:text-[13px] text-slate-500 leading-relaxed font-medium">
                Encrypted timeline.
              </p>
            </div>

            {/* Card 3: Doctor Sync (Front center - matches Card 3 style) */}
            <div className="absolute w-[50%] sm:w-[45%] aspect-square bg-white border border-gray-100 rounded-3xl shadow-2xl translate-y-16 sm:translate-y-20 overflow-hidden transition-all duration-700 hover:-translate-y-4 group z-30 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-2 sm:mb-4 transition-transform group-hover:scale-110">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-0.5 sm:mb-1 text-sm sm:text-base">Clinical - Sync</h3>
              <p className="text-[11px] sm:text-[13px] text-slate-500 leading-relaxed font-medium">
                Safe data sharing.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
