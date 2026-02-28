'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Sparkles, Users, Video, Bot, BarChart3, Key, Settings, LogOut } from 'lucide-react'

const nav = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/create',     icon: Sparkles,         label: 'Create Ad',   highlight: true },
  { href: '/actors',     icon: Users,            label: 'AI Actors' },
  { href: '/videos',     icon: Video,            label: 'My Videos' },
  { href: '/models',     icon: Bot,              label: 'AI Models' },
  { href: '/analytics',  icon: BarChart3,        label: 'Analytics' },
  { href: '/api-keys',   icon: Key,              label: 'API Keys' },
  { href: '/settings',   icon: Settings,         label: 'Settings' },
]

interface SidebarProps {
  userName?: string
  userPlan?: string
  credits?: number
  maxCredits?: number
}

export function Sidebar({
  userName = 'Demo User',
  userPlan = 'Pro Plan',
  credits = 47,
  maxCredits = 50,
}: SidebarProps) {
  const pathname = usePathname()
  const pct = maxCredits > 0 ? Math.round((credits / maxCredits) * 100) : 100

  return (
    <aside className="w-64 bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col h-full fixed left-0 top-0 bottom-0 z-40">
      {/* Logo */}
      <div className="p-6 border-b border-[#E2E8F0]">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/serge-logo.svg" alt="serge.love" className="h-9 w-auto block" />
        </Link>
      </div>

      {/* Credits */}
      <div className="px-4 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Credits</span>
          <span className="text-xs font-bold text-[#0A0A0B]">{credits}/{maxCredits > 0 ? maxCredits : '∞'}</span>
        </div>
        <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 mb-2">
          <div
            className="bg-[#2563EB] h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="text-xs text-[#6B7280]">{userPlan} · Resets Jul 31</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {nav.map(({ href, icon: Icon, label, highlight }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-[#EBF5FF] text-[#2563EB] border-l-2 border-[#2563EB] pl-[10px]'
                  : highlight
                  ? 'text-[#0A0A0B] hover:bg-[#EBF5FF] hover:text-[#2563EB]'
                  : 'text-[#6B7280] hover:bg-[#F0F4F8] hover:text-[#0A0A0B]'
              }`}
            >
              <Icon
                size={17}
                className={
                  active ? 'text-[#2563EB]'
                  : highlight ? 'text-[#2563EB]'
                  : 'text-[#9CA3AF] group-hover:text-[#0A0A0B]'
                }
              />
              <span>{label}</span>
              {highlight && !active && (
                <span className="ml-auto text-[10px] font-bold bg-[#2563EB] text-white px-1.5 py-0.5 rounded-full">
                  NEW
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#0A0A0B] truncate">{userName}</p>
            <p className="text-xs text-[#6B7280]">{userPlan}</p>
          </div>
          <Link
            href="/sign-in"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[#9CA3AF] hover:text-[#0A0A0B] hover:bg-[#E2E8F0] transition-colors"
            title="Sign out"
          >
            <LogOut size={14} />
          </Link>
        </div>
      </div>
    </aside>
  )
}
