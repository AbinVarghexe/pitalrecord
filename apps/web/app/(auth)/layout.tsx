'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-12 selection:bg-slate-200/50 relative overflow-hidden"
      style={{ 
        backgroundColor: '#fcfbf8', // Landing page cream background
      }}
    >
      {/* Background Paper Texture (Matches Landing Page) */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}
      />

      {/* Centered Paper Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1140px] min-h-[660px] md:h-[740px] bg-white rounded-[40px] shadow-[0_40px_100px_-30px_rgba(0,0,0,0.12)] border border-slate-200/60 overflow-hidden flex flex-col md:flex-row relative z-10"
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
        <div className="w-full md:w-[46%] p-8 sm:p-10 lg:p-12 lg:pb-10 flex flex-col relative z-20">
          <div className="flex justify-start mb-8">
            <Link href="/" className="group relative">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10"
              >
                <div className="bg-[#fcfbf8] p-1.5 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-slate-100/50 backdrop-blur-sm">
                  <Image 
                    src="/images/Logo.png" 
                    alt="PITALRECORD Logo" 
                    width={30} 
                    height={30} 
                    className="rounded-xl grayscale brightness-110"
                    priority
                  />
                </div>
              </motion.div>
            </Link>
          </div>

          <div className="grow">
            {children}
          </div>

          <div className="mt-12 pt-6 border-t border-dashed border-slate-100 flex flex-col gap-2">
            <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-slate-300 uppercase">
              Clinical Protocol v2.5.4
            </p>
            <p className="text-[9px] font-mono text-slate-300">
              © {new Date().getFullYear()} PITALRECORD INC. SECURE ACCESS LAYER.
            </p>
          </div>
        </div>

        {/* Right Side: Boxed Medical Image */}
        <div className="hidden md:flex md:w-[54%] p-4 lg:p-5 relative">
          <div className="relative w-full h-full rounded-[32px] overflow-hidden border border-slate-100/50 shadow-sm bg-slate-50/50 group">
            <Image
              src="/images/auth/auth.png"
              alt="Medical Research"
              fill
              className="object-cover transition-transform duration-[3s] group-hover:scale-105"
              priority
            />
            
            {/* Dark Bottom Gradient for Text Readability */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
            
            {/* Subtle Overlay Content */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-center justify-end p-10 text-center pointer-events-none">
               <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-xs"
               >
                  <div className="w-12 h-0.5 bg-white/40 mb-5 mx-auto" />
                  <h3 className="text-lg font-serif italic text-white mb-3 leading-relaxed drop-shadow-sm">
                    "Your medical history is your <span className="underline decoration-white/30 underline-offset-4">most valuable</span> archive."
                  </h3>
                  <p className="text-[10px] font-mono font-bold text-white/70 uppercase tracking-widest leading-loose">
                    PTIALRECORD / Data Integrity
                  </p>
               </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Background Decorative Element */}
      <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-green-200/20 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] bg-blue-100/20 rounded-full blur-[80px] z-0" />
    </div>
  )
}
