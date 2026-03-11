'use client'

import { cn } from "@workspace/ui/lib/utils"
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

const MaskingTape = ({ className, rotate, delay = 0.5 }: { className?: string, rotate?: string, delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 1.15, rotate }}
    animate={{ opacity: 1, scale: 1, rotate }}
    transition={{ 
      delay, 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1],
      scale: { type: "spring", damping: 15, stiffness: 200 }
    }}
    className={cn(
      "absolute w-60 h-16 bg-blue-100/40 backdrop-blur-[1.5px] z-50 pointer-events-none overflow-hidden border border-blue-200/10",
      className
    )}
    style={{ 
      clipPath: "polygon(0% 10%, 4% 0%, 10% 8%, 15% 0%, 22% 10%, 28% 2%, 35% 12%, 42% 4%, 50% 15%, 58% 6%, 65% 14%, 72% 3%, 80% 12%, 88% 1%, 95% 9%, 100% 0%, 100% 90%, 96% 100%, 90% 92%, 84% 100%, 78% 90%, 70% 100%, 62% 91%, 55% 100%, 48% 89%, 40% 100%, 32% 92%, 25% 100%, 18% 90%, 10% 100%, 5% 91%, 0% 100%)",
      boxShadow: "inset 0 0 20px rgba(59,130,246,0.03), 0 2px 10px rgba(0,0,0,0.04)"
    }}
  >
    {/* Tape Texture */}
    <div 
      className="absolute inset-0 opacity-[0.2] mix-blend-multiply"
      style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
    />
  </motion.div>
)

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-12 selection:bg-blue-100/50 relative overflow-hidden font-sans"
      style={{ 
        backgroundColor: '#fcfbf8', // Cream background
      }}
    >
      {/* Background Paper Texture */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
      />

      {/* Masking Tape Illusion Elements */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
        <div className="relative w-full max-w-[1140px] md:h-[740px]">
          {/* Top Left Tape */}
          <MaskingTape 
            className="-top-2 -left-20" 
            rotate="-45deg" 
          />
          {/* Bottom Right Tape */}
          <MaskingTape 
            className="-bottom-1 -right-16 opacity-90" 
            rotate="-45deg" 
          />
        </div>
      </div>

      {/* Centered Paper Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1140px] min-h-[660px] md:h-[740px] bg-white rounded-[40px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.1)] border border-slate-200/50 overflow-hidden flex flex-col md:flex-row relative z-10"
      >
        {/* Card Specific Internal Texture Layers */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-multiply z-0"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}
        />
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.1] mix-blend-multiply z-0"
          style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/grey-paper.png")' }}
        />
        
        {/* Left Side: Detail & Form */}
        <div className="w-full md:w-[46%] p-8 sm:p-10 lg:p-14 lg:pb-12 flex flex-col relative z-20">
          <div className="flex justify-start mb-10">
            <Link href="/" className="group relative">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <div className="bg-white p-2 rounded-[20px] shadow-sm border border-slate-100 flex items-center gap-3">
                  <Image 
                    src="/images/Logo.png" 
                    alt="PITALRECORD Logo" 
                    width={28} 
                    height={28} 
                    className="rounded-lg grayscale opacity-70 contrast-125"
                    priority
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm tracking-tight text-slate-900">PTIALRECORD</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Clinical Protocol v1.0</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="grow">
            {children}
          </div>

          <div className="mt-12 pt-8 border-t border-dashed border-slate-100 flex flex-col gap-3">
            <div className="flex items-center gap-2">
               <div className="w-1 h-1 rounded-full bg-blue-500" />
               <p className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                 Nexus Secure Access Layer
               </p>
            </div>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-loose">
              © {new Date().getFullYear()} PITALRECORD INC. E2E ENCRYPTED STORAGE.
            </p>
          </div>
        </div>

        {/* Right Side: Boxed Medical Image */}
        <div className="hidden md:flex md:w-[54%] p-5 lg:p-6 relative">
          <div className="relative w-full h-full rounded-[30px] overflow-hidden border border-slate-100/50 shadow-sm bg-slate-50 group">
            <Image
              src="/images/auth/auth.png"
              alt="Medical Research"
              fill
              className="object-cover transition-transform duration-[4s] group-hover:scale-105"
              priority
            />
            
            {/* Soft Overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-slate-900/60 via-slate-900/10 to-transparent z-10" />
            
            {/* Subtle Overlay Content */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end p-12 text-center pointer-events-none">
               <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-xs"
               >
                  <div className="w-10 h-0.5 bg-blue-500/60 mb-6 mx-auto" />
                  <h3 className="text-xl font-bold text-white mb-4 leading-tight tracking-tight">
                    Secure archival for your medical history.
                  </h3>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.3em] leading-loose">
                    Data Integrity / Clinical OS
                  </p>
               </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Decorative Elements - Blue/Indigo instead of Green */}
      <div className="absolute top-[5%] right-[5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] z-0" />
      <div className="absolute bottom-[5%] left-[5%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] z-0" />
    </div>
  )
}
