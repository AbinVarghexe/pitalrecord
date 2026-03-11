import { cn } from "@workspace/ui/lib/utils"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-16 sm:py-24 relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 mt-16 md:mt-24 font-sans">
      
      {/* Small Plain Italic Heading */}
      <div className="w-full max-w-[1400px] mb-8 px-8 sm:px-16 md:px-24">
        <h3 className="text-lg sm:text-xl italic text-slate-500 tracking-wide">
          How it works
        </h3>
      </div>

      <div 
        className="w-full max-w-[1400px] overflow-hidden px-8 sm:px-16 md:px-24 mb-16 relative isolate"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10 w-full">
          
          {/* Left Side: Image Cards Effect */}
          <div className="relative w-full aspect-4/3 max-w-md mx-auto lg:max-w-none flex items-center justify-center -mt-8">
            {/* Card 1 (Back left) */}
            <div className="absolute w-[60%] h-[85%] bg-blue-50/50 backdrop-blur-sm border border-white/40 rounded-3xl -rotate-6 -translate-x-12 -translate-y-4 shadow-xl overflow-hidden transition-all duration-700 hover:-translate-y-6 hover:-rotate-12 z-10">
              <img src="https://images.unsplash.com/photo-1576091160550-2173ff9e5ee5?auto=format&fit=crop&w=600&q=80" alt="Medical Document" className="w-full h-full object-cover opacity-80" />
            </div>
            
            {/* Card 2 (Back right) */}
            <div className="absolute w-[60%] h-[85%] bg-indigo-50/50 backdrop-blur-sm border border-white/40 rounded-3xl rotate-6 translate-x-12 translate-y-2 shadow-xl overflow-hidden transition-all duration-700 hover:-translate-y-2 hover:rotate-12 z-20">
              <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80" alt="Medical Team" className="w-full h-full object-cover opacity-80" />
            </div>

            {/* Card 3 (Front center) - Tech Phone Apple-style */}
            <div className="absolute w-[50%] h-[110%] bg-white border border-gray-100 rounded-[2.5rem] p-2 shadow-2xl translate-y-8 overflow-hidden transition-all duration-700 hover:-translate-y-2 z-30">
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black relative">
                {/* Dynamic Island placeholder */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10 hidden sm:block"></div>
                {/* Screen content */}
                <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80" alt="App interface on phone" className="w-full h-full object-cover pt-1" />
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="flex flex-col gap-6 md:gap-8 relative z-10 pt-16 lg:pt-0 font-sans">
            {/* Apple-style minimalist pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/50 backdrop-blur-md border border-blue-100/50 w-fit text-blue-600">
              <span className="text-[13px] font-medium tracking-tight">How It Works</span>
            </div>

            {/* Main Heading with Apple-like typography */}
            <h2 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.1]">
              Transforming <br className="hidden sm:block" />
              patient care.
            </h2>
            
            {/* Clean Gradient Divider */}
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-80"></div>
            
            {/* Text Content */}
            <div className="text-[17px] sm:text-[19px] font-normal text-slate-500 leading-relaxed max-w-xl">
              <p className="mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.
              </p>
              <p className="mb-6">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
              </p>
            </div>
            
            {/* Calm, rounded Call to Action Button */}
            <div className="mt-2">
              <button className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-slate-900 text-white text-[15px] font-medium tracking-tight hover:bg-slate-800 hover:scale-105 transition-all duration-300 shadow-lg shadow-slate-900/20">
                Learn More
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
