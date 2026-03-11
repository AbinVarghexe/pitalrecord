'use client'

import Link from 'next/link'
import { GoogleSignInButton } from '@/components/google-sign-in-button'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { loginWithEmail } from '../actions'
import { useActionState } from 'react'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginWithEmail, null)

  return (
    <div className="flex flex-col">
      <div className="text-center mb-10">
        <h1 className="text-[28px] md:text-[32px] font-semibold tracking-tight text-[#1d1d1f] mb-3">
          Sign In
        </h1>
        <p className="text-[15px] text-[#86868b] font-medium">
          Use your PTIALRECORD ID to get started.
        </p>
      </div>
      
      <div className="flex flex-col gap-5">
         <form action={formAction} className="flex flex-col gap-5">
           {state?.error && (
             <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
               {state.error}
             </div>
           )}
           <div className="flex flex-col gap-2 relative">
             <div className="relative">
               <Input 
                 id="email"
                 name="email" 
                 type="email" 
                 placeholder="Email or PTIALRECORD ID" 
                 className="h-14 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-4 bg-white/50" 
                 required 
               />
             </div>
             <div className="relative mt-1">
               <Input 
                 id="password"
                 name="password" 
                 type="password" 
                 placeholder="Password" 
                 className="h-14 block w-full rounded-2xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-base px-4 bg-white/50" 
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
                 className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
               />
               <label htmlFor="remember-me" className="ml-2 block text-sm text-[#1d1d1f]">
                 Remember me
               </label>
             </div>

             <div className="text-sm">
               <Link href="#" className="font-medium text-blue-600 hover:text-blue-500">
                 Forgot password?
               </Link>
             </div>
           </div>

           <Button type="submit" disabled={pending} className="w-full h-12 rounded-full mt-2 text-base font-medium shadow-sm active:scale-[0.98] transition-all bg-[#007aff] hover:bg-[#0071e3] text-white border-0 disabled:opacity-70 disabled:cursor-not-allowed">
             {pending ? 'Signing in...' : 'Sign In'}
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

        <div className="mt-8 text-center">
          <p className="text-[14px] text-[#86868b]">
            Don't have an ID?{' '}
            <Link href="/register" className="font-medium text-blue-600 hover:underline">
              Create yours now.
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
