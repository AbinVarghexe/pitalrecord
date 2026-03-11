import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-100">
      <div className="w-full max-w-[400px]">
        {/* Logo Banner */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="group flex flex-col items-center gap-2">
            <div className="bg-black text-white h-12 w-12 rounded-full flex items-center justify-center font-semibold text-xl tracking-tighter shadow-sm group-hover:scale-105 transition-transform duration-300">
              P.
            </div>
          </Link>
        </div>

        {/* White container resembling an Apple ID modal */}
        {children}
      </div>
      
      {/* Footer minimal text */}
      <div className="mt-12 text-center text-[13px] text-gray-500 font-medium">
        PTIALRECORD Secure Login
        <p className="mt-1">All data is end-to-end encrypted.</p>
      </div>
    </div>
  )
}
