import { GoogleSignInButton } from '@/components/google-sign-in-button'

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
         <h1 className="font-serif text-[2.5rem] tracking-tight font-medium leading-none text-[#1A1A1A]">
            Welcome back
         </h1>
         <p className="text-sm text-black/60 font-medium leading-relaxed">
            Sign in to your account securely.
         </p>
      </div>
      
      <div className="mt-8">
         <GoogleSignInButton />
      </div>
      
      <p className="text-xs text-center mt-12 text-black/40 font-medium">
         Securely managed and maintained by PTIALRECORD. <br/>
         All data is encrypted end-to-end.
      </p>
    </div>
  )
}
