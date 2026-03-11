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
    <section id="pricing" className="w-full py-24 md:py-40 relative z-10 flex flex-col items-center justify-center font-sans selection:bg-black/5">
      
      {/* Newspaper Style Heading (Matches Security/How it works) */}
      <div className="w-full max-w-7xl px-6 sm:px-8 md:px-12 mb-16 md:mb-24 text-center">
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

      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-12 flex flex-wrap justify-center gap-8 md:gap-10 lg:gap-12 items-start text-slate-900">
        {tiers.map((tier) => (
          <div key={tier.id} className="relative w-full max-w-[350px] group transition-all duration-500 hover:-translate-y-2">
            {/* The Ticket Shadow & Shape Container - Standardized h-[640px] for clickability and uniformity */}
            <div 
              className="relative w-full h-[640px] flex flex-col"
              style={{
                filter: "drop-shadow(0 0 1px rgba(0,0,0,0.3)) drop-shadow(0 4px 6px rgba(0,0,0,0.05)) drop-shadow(0 30px 60px rgba(0,0,0,0.12))"
              }}
            >
              {/* The Ticket Body with Sharp SVG Edge Masking */}
              <div 
                className="relative grow flex flex-col bg-[#fcfbf8] border-x border-slate-200/30 overflow-hidden"
                style={{
                  backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")',
                  /* Razor-sharp ticket edges using data SVG */
                  maskImage: `
                    url("data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20L10 0L20 20L30 0L40 20H0Z' fill='black'/%3E%3C/svg%3E"), 
                    url("data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L10 20L20 0L30 20L40 0H0Z' fill='black'/%3E%3C/svg%3E"),
                    radial-gradient(circle at 0 320px, transparent 18px, black 19px),
                    radial-gradient(circle at 100% 320px, transparent 18px, black 19px),
                    linear-gradient(black, black)
                  `,
                  maskPosition: "top center, bottom center, left top, right top, center center",
                  maskRepeat: "repeat-x, repeat-x, no-repeat, no-repeat, no-repeat",
                  maskSize: "16px 8px, 16px 8px, 100% 100%, 100% 100%, 100% 100%",
                  maskComposite: "add, add, intersect, intersect, intersect",
                  WebkitMaskImage: `
                    url("data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 20L10 0L20 20L30 0L40 20H0Z' fill='black'/%3E%3C/svg%3E"), 
                    url("data:image/svg+xml,%3Csvg width='40' height='20' viewBox='0 0 40 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L10 20L20 0L30 20L40 0H0Z' fill='black'/%3E%3C/svg%3E"),
                    radial-gradient(circle at 0 320px, transparent 18px, black 19px),
                    radial-gradient(circle at 100% 320px, transparent 18px, black 19px),
                    linear-gradient(black, black)
                  `,
                  WebkitMaskPosition: "top center, bottom center, left top, right top, center center",
                  WebkitMaskRepeat: "repeat-x, repeat-x, no-repeat, no-repeat, no-repeat",
                  WebkitMaskSize: "16px 8px, 16px 8px, 100% 100%, 100% 100%, 100% 100%",
                  WebkitMaskComposite: "source-over, source-over, destination-in, destination-in, destination-in"
                }}
              >
                {/* Visual Border Overlay */}
                <div className="absolute inset-x-0 top-0 h-px bg-white/40 z-10" />
                
                {/* Side Notch Perforation - Locked to 320px */}
                <div className="absolute top-[320px] left-0 w-full h-[2px] border-t-2 border-dashed border-slate-900/10 pointer-events-none z-10" />

                <div className="grow flex flex-col p-6 sm:p-7 pt-10 sm:pt-12 pb-10">
                  {/* Receipt Header */}
                  <div className="text-center mb-5 relative">
                    <h3 className="text-3xl font-serif italic font-bold tracking-tight text-slate-900 mb-1.5">
                      {tier.name}
                    </h3>
                    <p className="text-[10px] font-mono font-black tracking-[0.4em] text-blue-600 uppercase">
                      {tier.tagline}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="mb-5 text-center px-2">
                    <p className="text-[9.5px] font-mono leading-relaxed text-slate-500 font-bold uppercase tracking-wider">
                      {tier.description}
                    </p>
                  </div>

                  {/* Items Table */}
                  <div className="grow">
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 border-y-2 border-slate-900/10 py-2.5 mb-4">
                      <span className="text-[8.5px] font-mono font-black text-slate-400 uppercase tracking-widest">Qty.</span>
                      <span className="text-[8.5px] font-mono font-black text-slate-400 uppercase text-center tracking-widest">Entry</span>
                      <span className="text-[8.5px] font-mono font-black text-slate-400 uppercase text-right tracking-widest">Unit</span>
                    </div>
                    
                    <div className="space-y-2 mb-5">
                      {tier.features.map((feature, idx) => (
                        <div key={idx} className="grid grid-cols-[auto_1fr_auto] gap-2 items-baseline">
                          <span className="text-[10.5px] font-mono text-slate-500 font-bold">{feature.qty}</span>
                          <div className="flex flex-col">
                            <span className="text-[10.5px] font-mono text-slate-900 font-black tracking-tight uppercase leading-none">{feature.item}</span>
                            {feature.sub && <span className="text-[8px] font-mono text-blue-600/70 font-bold uppercase mt-0.5">{feature.sub}</span>}
                          </div>
                          <span className="text-[10.5px] font-mono text-slate-900 font-black text-right">{feature.amt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total & Barcode Section */}
                  <div className="mt-auto">
                    <div className="border-t-4 border-double border-slate-900/10 pt-3 mb-5">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-[16px] font-mono font-black text-slate-900 tracking-tighter uppercase">Net Total</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-mono font-black text-slate-900 tracking-tighter">{tier.price}</span>
                          {tier.price !== "$0.00" && <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">/MO</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-col items-center gap-2 w-full opacity-90 group-hover:opacity-100 transition-opacity px-4">
                        <div className="flex gap-0.5 h-8 items-end w-full justify-center">
                          {[2,1,3,1,2,5,1,2,4,1,2,5,1,1,3,2,1,4,1,2,2].map((w, i) => (
                            <div key={i} className="bg-slate-900" style={{ width: `${w}px`, height: `${60 + (i % 7) * 5}%` }} />
                          ))}
                        </div>
                        <div className="text-[8px] font-mono font-black tracking-[0.4em] text-slate-400 uppercase text-center truncate w-full">
                          TRXN-ID: {tier.id.toUpperCase()}
                        </div>
                      </div>

                      <Link
                        href={tier.href}
                        className={cn(
                          "w-full py-3 text-center text-[12px] font-mono font-black uppercase tracking-[0.2em] transition-all duration-300 border-[3px] border-slate-900 hover:bg-slate-900 hover:text-white active:scale-[0.97] shadow-[4px_4px_0px_rgba(15,23,42,1)] active:shadow-none translate-y-0 active:translate-x-[4px] active:translate-y-[4px]",
                          tier.mostPopular ? "bg-slate-900 text-white" : "bg-transparent text-slate-900"
                        )}
                      >
                        Activate Plan
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Ribbon */}
              {tier.mostPopular && (
                <div className="absolute top-5 -right-2 rotate-12 z-30 pointer-events-none">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-sm font-mono text-[9px] font-black uppercase tracking-[0.2em] shadow-[6px_6px_15px_rgba(37,99,235,0.3)] border-b-2 border-blue-800">
                    Recommended
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-40 w-[700px] h-[700px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      
    </section>
  )
}
