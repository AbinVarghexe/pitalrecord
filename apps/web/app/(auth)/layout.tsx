import { IconStarFilled } from '@tabler/icons-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white text-[#1A1A1A] font-sans flex">
      {/* Left Side - Visual/Hero Section */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center relative bg-[#DDECEE] p-12 overflow-hidden">
        {/* Background Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-linear-to-b from-white/30 to-transparent pointer-events-none" />
        
        <div className="max-w-xl z-10 w-full mb-12">
          {/* Logo / Rating Pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/60 backdrop-blur-md px-3 py-1.5 shadow-sm border border-black/5 mb-8 transition-transform hover:scale-105">
            <div className="font-bold text-xs tracking-tighter flex items-center opacity-80">
              <span className="text-[11px] me-1 font-extrabold bg-[#1A1A1A] text-white h-5 w-5 rounded-full flex items-center justify-center">C.</span>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <IconStarFilled key={i} className="h-[12px] w-[12px] text-[#FF453A]" />
              ))}
            </div>
            <span className="text-xs font-bold ml-1 opacity-90 pr-1">Trusted</span>
          </div>

          <h1 className="font-serif text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight text-[#1A1A1A] mb-6">
            Secure tracking<br />for better health.
          </h1>
          <p className="text-lg text-black/60 font-medium max-w-md">
            Manage your prescriptions, track timeline history, and seamlessly share records with your doctors.
          </p>
        </div>

        {/* Floating Mockup / Image Area */}
        <div className="relative w-full max-w-[500px] aspect-4/3 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-700 hover:scale-[1.03]">
          <Image
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80"
            alt="Medical Records Management"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#DDECEE]/80 to-transparent mix-blend-multiply" />
        </div>

        {/* Decorative Grid/Elements */}
        <div className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[40%] bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Right Side - Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:flex-none lg:w-[480px] xl:w-[560px] 2xl:w-[640px] bg-white relative">
         <div className="mx-auto w-full max-w-sm lg:w-[400px]">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden mb-12 flex justify-center">
              <Link href="/" className="bg-[#1A1A1A] text-white h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl tracking-tighter shadow-md">
                C.
              </Link>
            </div>

            {children}

         </div>
      </div>
    </div>
  )
}
