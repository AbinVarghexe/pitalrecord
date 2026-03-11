'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GoogleSignInButton } from '@/components/google-sign-in-button'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { useActionState } from 'react'
import { registerWithEmail } from '../actions'

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerWithEmail, null)

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tighter text-slate-900 mb-1.5">
          Create Account
        </h1>
        <p className="text-[14px] text-slate-400 font-medium leading-relaxed">
          Start your clinical journey with PITALRECORD.
        </p>
      </div>
      
      <div className="flex flex-col gap-4">
         <form action={formAction} className="flex flex-col gap-4">
           {state?.error && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[12px] font-bold"
             >
               Error: {state.error}
             </motion.div>
           )}

           <div className="space-y-3.5">
             {/* Name Row */}
             <div className="flex gap-4">
               <div className="flex-1 space-y-1.5">
                 <label htmlFor="firstName" className="text-[13px] font-bold text-slate-700 ml-1">
                   First Name
                 </label>
                 <Input 
                   id="firstName"
                   name="firstName" 
                   type="text" 
                   placeholder="Jane" 
                   className="h-10.5 block w-full rounded-2xl border-none bg-slate-50/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:text-[14px] px-4 transition-all placeholder:text-slate-300" 
                   required 
                 />
               </div>
               <div className="flex-1 space-y-1.5">
                 <label htmlFor="lastName" className="text-[13px] font-bold text-slate-700 ml-1">
                   Last Name
                 </label>
                 <Input 
                   id="lastName"
                   name="lastName" 
                   type="text" 
                   placeholder="Doe" 
                   className="h-10.5 block w-full rounded-2xl border-none bg-slate-50/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:text-[14px] px-4 transition-all placeholder:text-slate-300" 
                   required 
                 />
               </div>
             </div>

             <div className="space-y-1.5">
               <label htmlFor="email" className="text-[13px] font-bold text-slate-700 ml-1">
                 Email Address
               </label>
               <Input 
                 id="email"
                 name="email" 
                 type="email" 
                 placeholder="jane@clinical.com" 
                 className="h-10.5 block w-full rounded-2xl border-none bg-slate-50/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:text-[14px] px-4 transition-all placeholder:text-slate-300" 
                 required 
               />
             </div>

             <div className="space-y-1.5">
               <label htmlFor="password" className="text-[13px] font-bold text-slate-700 ml-1">
                 Password
               </label>
               <Input 
                 id="password"
                 name="password" 
                 type="password" 
                 placeholder="••••••••" 
                 className="h-10.5 block w-full rounded-2xl border-none bg-slate-50/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:text-[14px] px-4 transition-all placeholder:text-slate-300" 
                 required 
               />
             </div>
           </div>

           <Button 
             type="submit" 
             disabled={pending} 
             className="w-full h-11 rounded-2xl bg-slate-900 text-white font-bold text-[15px] transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 border-none shadow-xl shadow-slate-900/10"
           >
             {pending ? "Processing..." : "Create an account"}
           </Button>
         </form>

        <div className="relative my-1 flex items-center gap-4 px-2">
          <div className="grow h-px bg-slate-100" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">or</span>
          <div className="grow h-px bg-slate-100" />
        </div>

        <GoogleSignInButton className="w-full h-11 rounded-2xl border border-slate-100 bg-white text-slate-700 font-bold text-[14px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm" />

        <div className="mt-6 text-center px-4">
          <p className="text-[12px] text-slate-400 font-medium leading-relaxed">
            By joining, you agree to our <Link href="#" className="font-bold text-slate-800 hover:underline">Terms</Link> and <Link href="#" className="font-bold text-slate-800 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-[14px] text-slate-400 font-medium">
            Already a member?{' '}
            <Link href="/login" className="font-bold text-slate-900 hover:underline underline-offset-4">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
