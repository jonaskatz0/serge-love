import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: LucideIcon
  iconColor?: string
  iconBg?: string
}

export function StatCard({ title, value, change, changeType = 'neutral', icon: Icon, iconColor = 'text-[#2563EB]', iconBg = 'bg-[#EBF5FF]' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        {change && (
          <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', {
            'bg-green-50 text-green-700': changeType === 'positive',
            'bg-red-50 text-red-700': changeType === 'negative',
            'bg-gray-50 text-gray-600': changeType === 'neutral',
          })}>
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-extrabold text-[#0A0A0B] mb-1">{value}</div>
      <div className="text-sm text-[#6B7280]">{title}</div>
    </div>
  )
}
