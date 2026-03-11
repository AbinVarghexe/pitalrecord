import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

export function PricingSection() {
  const tiers = [
    {
      name: "The Individual",
      tagline: "PERSONAL ARCHIVE",
      id: "tier-free",
      href: "/register",
      price: "$0.00",
      description: "START ORGANIZING YOUR CLINICAL HISTORY WITH BASIC INTELLIGENCE. SECURE STORAGE FOR YOUR ESSENTIAL MEDICAL RECORDS.",
      features: [
        { qty: "50x", item: "PRESCRIPTION UPLOADS", amt: "$0.00" },
        { qty: "1x", item: "BASIC OCR SCANNING", amt: "$0.00", sub: "*INCLUDED" },
        { qty: "1x", item: "MEDICAL TIMELINE", amt: "$0.00" },
        { qty: "1x", item: "SECURE CLOUD STORAGE", amt: "$0.00" },
        { qty: "1x", item: "COMMUNITY SUPPORT", amt: "$0.00" },
      ],
      mostPopular: false,
    },
    {
      name: "Family Pro",
      tagline: "CLINICAL PRECISION",
      id: "tier-pro",
      href: "/register",
      price: "$12.00",
      description: "COMPREHENSIVE SUITE FOR FAMILY HEALTH. UNLIMITED PROCESSING, DOCTOR PORTAL ACCESS, AND ADVANCED ANALYTICS.",
      features: [
        { qty: "UNLI", item: "PRESCRIPTION UPLOADS", amt: "$5.00" },
        { qty: "10x", item: "FAMILY PROFILES", amt: "$3.00", sub: "*SECURE" },
        { qty: "1x", item: "PRIORITY AI MEDICAL-NER", amt: "$2.00" },
        { qty: "ADDL", item: "DOCTOR ACCESS KEYS", amt: "$1.00" },
        { qty: "1x", item: "TIMELINE PDF EXPORT", amt: "$0.50" },
        { qty: "1x", item: "24/7 CLINICAL SUPPORT", amt: "$0.50" },
      ],
      mostPopular: true,
    },
  ]

  return (
    <section id="pricing" className="w-full py-24 sm:py-32 relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 font-sans selection:bg-black/5">
      
      {/* Newspaper Style Heading (Matches Security/How it works) */}
      <div className="w-full max-w-7xl px-8 sm:px-16 md:px-24 mb-20 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/50 backdrop-blur-md border border-blue-100/50 w-fit text-blue-600">
            <span className="text-[13px] font-medium tracking-tight">Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.1] max-w-4xl">
            Choose the plan that's <br className="hidden sm:block" />
            <span className="font-serif italic text-blue-600">right</span> for your clinical workflow.
          </h2>
          <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>
          <p className="text-[17px] sm:text-[19px] font-normal text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Just ringing you up real quick. No hidden fees, just pure clinical precision.
          </p>
        </div>
      </div>

      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-12 lg:gap-16">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              "relative w-full max-w-[420px] transition-all duration-500 hover:scale-[1.02] shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] flex flex-col p-10 sm:p-12 min-h-[600px]",
              tier.mostPopular && "ring-1 ring-slate-200"
            )}
            style={{ 
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
              backgroundColor: '#fcfbf8',
              maskImage: `
                linear-gradient(to bottom, transparent, black 15px, black calc(100% - 15px), transparent),
                url("data:image/svg+xml,%3Csvg width='30' height='15' viewBox='0 0 30 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L15 15L30 0' fill='black'/%3E%3C/svg%3E"),
                url("data:image/svg+xml,%3Csvg width='30' height='15' viewBox='0 0 30 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15L15 0L30 15' fill='black'/%3E%3C/svg%3E")
              `,
              maskPosition: "center center, top center, bottom center",
              maskRepeat: "no-repeat, repeat-x, repeat-x",
              maskSize: "100% 100%, 30px 15px, 30px 15px",
              WebkitMaskImage: `
                linear-gradient(to bottom, transparent, black 15px, black calc(100% - 15px), transparent),
                url("data:image/svg+xml,%3Csvg width='30' height='15' viewBox='0 0 30 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L15 15L30 0' fill='black'/%3E%3C/svg%3E"),
                url("data:image/svg+xml,%3Csvg width='30' height='15' viewBox='0 0 30 15' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 15L15 0L30 15' fill='black'/%3E%3C/svg%3E")
              `,
              WebkitMaskPosition: "center center, top center, bottom center",
              WebkitMaskRepeat: "no-repeat, repeat-x, repeat-x",
              WebkitMaskSize: "100% 100%, 30px 15px, 30px 15px"
            }}
          >
            {/* Receipt Header */}
            <div className="text-center mb-10">
              <h3 className="text-4xl font-serif italic font-bold tracking-tight text-slate-900 mb-2">
                {tier.name}
              </h3>
              <p className="text-[12px] font-mono font-bold tracking-[0.3em] text-slate-400 uppercase">
                {tier.tagline}
              </p>
            </div>

            {/* Description */}
            <div className="mb-10 text-center">
              <p className="text-[11px] font-mono leading-relaxed text-slate-500 font-medium">
                {tier.description}
              </p>
            </div>

            {/* Items Table */}
            <div className="flex-grow">
              <div className="grid grid-cols-[auto_1fr_auto] gap-4 border-y border-dashed border-slate-300 py-3 mb-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Qty.</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase text-center">Item</span>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase text-right">Amt</span>
              </div>
              
              <div className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="grid grid-cols-[auto_1fr_auto] gap-4 items-baseline">
                    <span className="text-[11px] font-mono text-slate-600 font-medium">{feature.qty}</span>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono text-slate-900 font-bold tracking-wide uppercase">{feature.item}</span>
                      {feature.sub && <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">{feature.sub}</span>}
                    </div>
                    <span className="text-[11px] font-mono text-slate-900 font-bold text-right">{feature.amt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Section */}
            <div className="border-t-[3px] border-double border-slate-300 pt-6 mb-10">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-mono font-bold text-slate-900 tracking-tighter">Total</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-mono font-bold text-slate-900 tracking-tighter">{tier.price}</span>
                  {tier.price !== "$0.00" && <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">/month</span>}
                </div>
              </div>
              <div className="h-px w-full border-b border-dashed border-slate-300 mt-4" />
            </div>

            {/* Barcode & Action */}
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2 opacity-60">
                <svg width="220" height="40" viewBox="0 0 220 40" className="text-slate-900">
                  <rect x="0" width="2" height="40" fill="currentColor" />
                  <rect x="4" width="1" height="40" fill="currentColor" />
                  <rect x="8" width="3" height="40" fill="currentColor" />
                  <rect x="15" width="2" height="40" fill="currentColor" />
                  <rect x="20" width="1" height="40" fill="currentColor" />
                  <rect x="25" width="4" height="40" fill="currentColor" />
                  <rect x="35" width="2" height="40" fill="currentColor" />
                  <rect x="42" width="1" height="40" fill="currentColor" />
                  <rect x="50" width="3" height="40" fill="currentColor" />
                  <rect x="60" width="2" height="40" fill="currentColor" />
                  <rect x="68" width="4" height="40" fill="currentColor" />
                  <rect x="80" width="1" height="40" fill="currentColor" />
                  <rect x="85" width="3" height="40" fill="currentColor" />
                  <rect x="95" width="2" height="40" fill="currentColor" />
                  <rect x="105" width="1" height="40" fill="currentColor" />
                  <rect x="110" width="4" height="40" fill="currentColor" />
                  <rect x="120" width="2" height="40" fill="currentColor" />
                  <rect x="130" width="3" height="40" fill="currentColor" />
                  <rect x="140" width="1" height="40" fill="currentColor" />
                  <rect x="145" width="3" height="40" fill="currentColor" />
                  <rect x="155" width="2" height="40" fill="currentColor" />
                  <rect x="165" width="4" height="40" fill="currentColor" />
                  <rect x="175" width="1" height="40" fill="currentColor" />
                  <rect x="185" width="2" height="40" fill="currentColor" />
                  <rect x="195" width="3" height="40" fill="currentColor" />
                  <rect x="205" width="1" height="40" fill="currentColor" />
                  <rect x="210" width="4" height="40" fill="currentColor" />
                  <rect x="218" width="2" height="40" fill="currentColor" />
                </svg>
                <span className="text-[10px] font-mono font-bold tracking-[0.4em] text-slate-400 uppercase">Tap to checkout</span>
              </div>

              <Link
                href={tier.href}
                className={cn(
                  "w-full py-4 text-center text-[12px] font-mono font-bold uppercase tracking-widest transition-all duration-300 border-2 border-slate-900 hover:bg-slate-900 hover:text-white active:scale-95",
                  tier.mostPopular ? "bg-slate-900 text-white" : "bg-transparent text-slate-900"
                )}
              >
                Claim Package
              </Link>
            </div>

            {/* Most Popular Stamp */}
            {tier.mostPopular && (
              <div className="absolute top-4 right-4 rotate-12">
                <div className="border-2 border-blue-500/30 text-blue-600/50 px-2 py-1 rounded font-mono text-[10px] font-bold uppercase tracking-widest">
                  Best Value
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Decorative Ornaments (Matches Security Section vibe) */}
      <div className="absolute top-1/2 -left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
      
    </section>
  )
}
