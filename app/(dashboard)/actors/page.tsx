'use client'
import { useState } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { ActorCard } from '@/components/dashboard/ActorCard'
import { ACTORS } from '@/lib/ai-models'
import { Search } from 'lucide-react'

const FILTERS = ['All', 'Female', 'Male', 'European', 'Asian', 'Latino', 'African', 'Corporate', 'Casual', 'Luxury']

export default function ActorsPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = ACTORS.filter(a => {
    const matchFilter = filter === 'All' || a.gender === filter || a.ethnicity === filter || a.style === filter
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.style.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div>
      <TopBar title="AI Actors" subtitle={`${ACTORS.length}+ actors available`} />
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search actors..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-[#0A0A0B] text-white' : 'bg-[#F8FAFC] text-[#6B7280] border border-[#E2E8F0] hover:border-[#BFDBFE]'}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {filtered.map(a => <ActorCard key={a.id} {...a} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#6B7280]">No actors found for this filter.</div>
        )}
      </div>
    </div>
  )
}
