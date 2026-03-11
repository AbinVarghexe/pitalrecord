"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { cn } from "@workspace/ui/lib/utils"

export function MarketingNavbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
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
      `}</style>
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300 ease-in-out border-b",
          scrolled 
            ? "py-5 bg-[#fcfbf8]/60 backdrop-blur-md border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.05)]" 
            : "py-8 bg-transparent border-transparent"
        )}
        style={{
          backgroundImage: scrolled ? 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between relative z-10">
          {/* Logo Left */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 font-sans text-black hover:opacity-80 transition-opacity">
			<Image 
			  src="/images/Logo.png" 
			  alt="PTIALRECORD Logo" 
			  width={32} 
			  height={32} 
			  className="object-contain"
			/>
			<span className="font-semibold text-[17px] tracking-tight hidden sm:block">PTIALRECORD</span>
          </Link>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-[14px] text-gray-700 hover:text-black transition-colors font-medium drop-shadow-sm">
              How It Works
            </Link>
            <Link href="#features" className="text-[14px] text-gray-700 hover:text-black transition-colors font-medium drop-shadow-sm">
              Features
            </Link>
            <Link href="#security" className="text-[14px] text-gray-700 hover:text-black transition-colors font-medium drop-shadow-sm">
              Security
            </Link>
            <Link href="#pricing" className="text-[14px] text-gray-700 hover:text-black transition-colors font-medium drop-shadow-sm">
              Pricing
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center text-[14px] font-medium text-gray-800 hover:text-black transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-black/90 text-white text-[14px] font-medium hover:bg-black hover:shadow-lg hover:scale-105 transition-all shadow-md"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Wavy Animated Border */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 w-full h-[6px] overflow-hidden translate-y-full pointer-events-none">
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
                stroke="rgba(0,0,0,0.15)" 
                strokeWidth="2"
                className="animate-wavy-border"
              />
            </svg>
          </div>
        )}
      </header>
    </>
  )
}
