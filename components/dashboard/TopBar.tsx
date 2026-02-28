'use client'
import Link from 'next/link'
import { Bell } from 'lucide-react'

interface TopBarProps {
  title: string
  subtitle?: string
}

export function TopBar({ title, subtitle }: TopBarProps) {
  return (
    <header className="bg-white border-b border-[#E2E8F0] h-16 flex items-center px-8 gap-4">
      <div className="flex-1">
        <h1 className="text-xl font-bold text-[#0A0A0B]">{title}</h1>
        {subtitle && <p className="text-xs text-[#6B7280]">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0A0A0B] transition-colors relative">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full" />
        </button>
        <Link href="/create" className="bg-[#0A0A0B] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#1a1a1b] transition-all duration-200 shadow-sm hover:shadow-md">
          + Create Ad
        </Link>
      </div>
    </header>
  )
}
