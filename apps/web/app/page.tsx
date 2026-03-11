import Link from 'next/link'
import { MarketingNavbar } from '@/components/marketing-navbar'
import { HowItWorksSection } from '@/components/how-it-works-section'
import { FeaturesSection } from '@/components/features-section'
import { SecuritySection } from '@/components/security-section'
import { PricingSection } from '@/components/pricing-section'
import { MarketingFooter } from '@/components/marketing-footer'


export default function Page() {
  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      <div 
        className="min-h-screen text-black font-sans selection:bg-black/10 overflow-x-hidden relative z-0"
        style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")', backgroundColor: '#fcfbf8' }}
      >
        <MarketingNavbar />

        {/* Hero Section */}
        <main className="relative pt-[120px] flex flex-col items-center justify-center px-4 sm:px-8 z-10 min-h-[calc(100vh-80px)]">
          <div className="relative w-full max-w-[1600px] min-h-[90vh] rounded-t-[16px] md:rounded-t-[24px] overflow-hidden flex flex-col items-center justify-center text-center p-8 sm:p-12 shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.1)] isolate">
            {/* Background Image inside the Card with Bottom Fade */}
            <div 
              className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-[2s] hover:scale-105"
              style={{
                backgroundImage: 'url("/images/hero/Hero.png")',
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}
            />
            {/* Darker Overlay to ensure text readability */}
            <div 
              className="absolute inset-0 bg-black/40 mix-blend-multiply z-0" 
              style={{
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
              }}
            />
            
            {/* Content overlaid on image */}
            <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center p-8 sm:p-12">
              
              {/* Centered Hero Content */}
              <div className="pointer-events-auto flex flex-col items-center max-w-5xl mx-auto relative -top-[100px]">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight leading-none text-white/90 drop-shadow-xl mb-4 text-center px-4">
                  <span className="font-sans">Your <span className=''>Medical</span></span><span className="italic font-serif"> History,</span> <br className="hidden sm:block" />
                  <span className="font-sans font-semibold tracking-tighter text-black"><span className="italic font-serif text-white"> Organized.</span> All In One Place.</span>
                </h1>
                <p className="text-[18px] sm:text-xl text-gray-200 italic max-w-3xl mx-auto font-medium tracking-tight drop-shadow-md mb-12 leading-tight px-4">
                  PTIALRECORD digitizes your prescriptions, extracts medical insights with AI, and gives you full control over who sees your health data.
                </p>
              </div>

              {/* Bottom Centered CTA Button */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
                <Link 
                  href="/register" 
                  className="px-10 py-4 bg-black rounded-full text-[16px] font-bold text-white transition-all duration-300 hover:scale-105 hover:bg-zinc-900 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.3)] active:scale-95 flex items-center gap-2 group/btn"
                >
                  Start your own journey
                  <svg 
                    className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>

              {/* Bottom Left Testimonial Badge (Transparent Style) */}
              <Link 
                href="#testimonials"
                className="pointer-events-auto group absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-fit flex items-center gap-4 rounded-full p-2 pr-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                {/* Testimonial Text & Link Icon (Moved to Left) */}
                <div className="flex flex-col justify-center items-end text-right">
                  <div className="flex items-center gap-1 mb-0.5">
                    {[1,2,3,4,5].map((star) => (
                      <svg key={star} className="w-3 h-3 text-black fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-black text-[13px] font-bold tracking-tight flex items-center gap-1.5 leading-none">
                    <svg className="w-3.5 h-3.5 text-black group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Trusted by 10k+ doctors
                  </span>
                </div>

                {/* 3 Overlapping Badges/Avatars (Moved to Right, Spread on Hover) */}
                <div className="flex -space-x-2.5 group-hover:space-x-0.5 transition-all duration-300">
                  <img 
                    className="w-10 h-10 rounded-full border-2 border-white/50 object-cover relative z-30 hover:z-50 hover:scale-125 transition-all duration-300" 
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80" 
                    alt="Doctor 1" 
                  />
                  <img 
                    className="w-10 h-10 rounded-full border-2 border-white/50 object-cover relative z-20 hover:z-50 hover:scale-125 transition-all duration-300" 
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=100&q=80" 
                    alt="Doctor 2" 
                  />
                  <img 
                    className="w-10 h-10 rounded-full border-2 border-white/50 object-cover relative z-10 hover:z-50 hover:scale-125 transition-all duration-300" 
                    src="https://images.unsplash.com/photo-1594824436998-d5e65ce4aa10?auto=format&fit=crop&w=100&q=80" 
                    alt="Doctor 3" 
                  />
                </div>
              </Link>
              
              {/* Bottom Right Social Links (Bare Outlines) */}
              <div className="pointer-events-auto absolute bottom-6 right-6 sm:bottom-10 sm:right-10 flex items-center gap-4">
                <Link
                  href="#"
                  className="flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-70 text-black cursor-pointer"
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-70 text-black cursor-pointer"
                  aria-label="Twitter / X"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </Link>
                <Link
                  href="#"
                  className="flex items-center justify-center transition-all duration-300 hover:scale-110 hover:opacity-70 text-black cursor-pointer"
                  aria-label="GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                  </svg>
                </Link>
              </div>

            </div>
          </div>
        </main>

        <HowItWorksSection />
        <FeaturesSection />
        <SecuritySection />
        <PricingSection />
        <MarketingFooter />
      </div>
    </>
  )
}
