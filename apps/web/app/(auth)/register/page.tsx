'use client'

import Link from 'next/link'
import { GoogleSignInButton } from '@/components/google-sign-in-button'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { useActionState } from 'react'
import { registerWithEmail } from '../actions'

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerWithEmail, null)

  return (
    <div className="flex flex-col">
      <div className="text-center mb-10">
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-[#1d1d1f] mb-3">
          Create Your ID
        </h1>
        <p className="text-[15px] text-[#86868b] font-medium">
          One account for everything PTIALRECORD.
        </p>
      </div>
      
      <div className="flex flex-col gap-5">
         <form action={formAction} className="flex flex-col gap-4">
           {state?.error && (
             <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
               {state.error}
             </div>
           )}
           {/* Name row */}
           <div className="flex gap-4">
             <div className="flex-1">
               <Input 
                 id="firstName"
                 name="firstName" 
                 type="text" 
                 placeholder="First Name" 
                 className="h-14 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-4 bg-white/50" 
                 required 
               />
             </div>
             <div className="flex-1">
               <Input 
                 id="lastName"
                 name="lastName" 
                 type="text" 
                 placeholder="Last Name" 
                 className="h-14 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-4 bg-white/50" 
                 required 
               />
             </div>
           </div>

           {/* Account Details row */}
           <div className="flex flex-col gap-4 mt-2">
             <Input 
               id="email"
               name="email" 
               type="email" 
               placeholder="name@example.com" 
               className="h-14 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-4 bg-white/50" 
               required 
             />
             <Input 
               id="password"
               name="password" 
               type="password" 
               placeholder="Password" 
               className="h-14 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-4 bg-white/50" 
               required 
             />
           </div>

           <Button type="submit" disabled={pending} className="w-full h-12 rounded-full mt-4 text-base font-medium shadow-sm active:scale-[0.98] transition-all bg-[#007aff] hover:bg-[#0071e3] text-white border-0 disabled:opacity-70 disabled:cursor-not-allowed">
             {pending ? 'Creating ID...' : 'Continue'}
           </Button>
         </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#f5f5f7] text-[#86868b]">Or continue with</span>
          </div>
        </div>

        <GoogleSignInButton className="w-full h-12 rounded-full text-base font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all" />

        <div className="mt-8 text-center text-[13px] text-[#86868b] px-4">
          By continuing, you agree to the PTIALRECORD Terms of Service and Privacy Policy.
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-[14px] text-[#86868b]">
            Already have an ID?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:underline">
              Sign in.
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
