'use client'

import { useState } from 'react'
import { IconDatabaseImport } from '@tabler/icons-react'
import { seedDemoData } from '@/lib/actions/demo'
import { toast } from '@workspace/ui/components/sonner'
import { cn } from '@workspace/ui/lib/utils'

export function SeedDemoButton() {
  const [loading, setLoading] = useState(false)

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null

  const handleSeed = async () => {
    setLoading(true)
    try {
      const result = await seedDemoData()
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      toast.error('Failed to seed demo data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className={cn(
        'group relative flex items-center gap-2 px-4 py-2 rounded-full border border-blue-200 bg-white/50 text-[11px] font-bold uppercase tracking-widest text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        loading && 'animate-pulse'
      )}
    >
      <IconDatabaseImport className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
      {loading ? 'Seeding...' : 'Seed Demo Data'}
    </button>
  )
}
