'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GoogleSignInButton } from '@/components/google-sign-in-button'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { loginWithEmail } from '../actions'
import { useActionState } from 'react'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginWithEmail, null)

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tighter text-slate-900 mb-1.5">
          Login
        </h1>
        <p className="text-[14px] text-slate-400 font-medium leading-relaxed">
          Access your clinical records with PITALRECORD.
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
             <div className="space-y-1.5">
               <label htmlFor="email" className="text-[13px] font-bold text-slate-700 ml-1">
                 Email Address
               </label>
               <Input 
                 id="email"
                 name="email" 
                 type="email" 
                 placeholder="name@clinical.com" 
                 className="h-10.5 block w-full rounded-2xl border-none bg-slate-50/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 sm:text-[14px] px-4 transition-all placeholder:text-slate-300" 
                 required 
               />
             </div>

             <div className="space-y-1.5">
               <div className="flex justify-between items-center ml-1">
                 <label htmlFor="password" className="text-[13px] font-bold text-slate-700">
                   Password
                 </label>
               </div>
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
           
           <div className="flex items-center justify-between px-1">
             <div className="flex items-center">
               <input
                 id="remember-me"
                 name="remember-me"
                 type="checkbox"
                 className="h-4 w-4 rounded-lg border-slate-200 text-slate-900 focus:ring-slate-900 cursor-pointer transition-all"
               />
               <label htmlFor="remember-me" className="ml-2 block text-[12px] font-medium text-slate-500 cursor-pointer">
                 Stay logged in
               </label>
             </div>
             
             <Link href="#" className="text-[12px] font-bold text-blue-600 hover:text-blue-700 transition-colors">
               Forgot password?
             </Link>
           </div>

           <Button 
             type="submit" 
             disabled={pending} 
             className="w-full h-11 rounded-2xl bg-slate-900 text-white font-bold text-[15px] transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 border-none shadow-xl shadow-slate-900/10"
           >
             {pending ? "Authenticating..." : "Login"}
           </Button>
         </form>

        <div className="relative my-1 flex items-center gap-4 px-2">
          <div className="grow h-px bg-slate-100" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">or</span>
          <div className="grow h-px bg-slate-100" />
        </div>

        <GoogleSignInButton className="w-full h-11 rounded-2xl border border-slate-100 bg-white text-slate-700 font-bold text-[14px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm" />

        <div className="mt-6 text-center">
          <p className="text-[14px] text-slate-400 font-medium">
            Not a member?{' '}
            <Link href="/register" className="font-bold text-slate-900 hover:underline underline-offset-4">
              Create Clinical ID
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
