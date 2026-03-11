'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select'
import { Card, CardContent } from '@workspace/ui/components/card'
import { IconSearch, IconX, IconFilter } from '@tabler/icons-react'
import type { FamilyProfile } from '@/lib/supabase/types'

interface TimelineSearchProps {
  profiles: FamilyProfile[]
  searchParams: {
    q?: string
    profile?: string
    from?: string
    to?: string
  }
}

export function TimelineSearch({ profiles, searchParams }: TimelineSearchProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showFilters, setShowFilters] = useState(
    !!(searchParams.profile || searchParams.from || searchParams.to)
  )

  const [query, setQuery] = useState(searchParams.q || '')
  const [profile, setProfile] = useState(searchParams.profile || '')
  const [fromDate, setFromDate] = useState(searchParams.from || '')
  const [toDate, setToDate] = useState(searchParams.to || '')

  function applyFilters() {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (profile) params.set('profile', profile)
    if (fromDate) params.set('from', fromDate)
    if (toDate) params.set('to', toDate)

    startTransition(() => {
      router.push(`/dashboard/timeline?${params.toString()}`)
    })
  }

  function clearFilters() {
    setQuery('')
    setProfile('')
    setFromDate('')
    setToDate('')
    startTransition(() => {
      router.push('/dashboard/timeline')
    })
  }

  const hasFilters = query || profile || fromDate || toDate

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctors, hospitals, diagnoses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="pl-10"
              />
            </div>
            <Button onClick={applyFilters} disabled={isPending}>
              {isPending ? 'Searching...' : 'Search'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <IconFilter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid gap-4 sm:grid-cols-3 pt-4 border-t">
              <div className="space-y-2">
                <Label>Profile</Label>
                <Select value={profile} onValueChange={setProfile}>
                  <SelectTrigger>
                    <SelectValue placeholder="All profiles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All profiles</SelectItem>
                    {profiles.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>From Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>To Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {hasFilters && (
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <IconX className="h-4 w-4 mr-1" />
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
