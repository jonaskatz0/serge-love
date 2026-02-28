import { Download, Copy, Trash2, Play, Eye } from 'lucide-react'
import { formatNumber, formatDate, getStatusColor } from '@/lib/utils'

interface VideoCardProps {
  id: string
  title: string
  status: 'DONE' | 'PROCESSING' | 'FAILED'
  aiModel: string
  duration?: number
  views: number
  createdAt: Date | string
  gradient?: string
  format?: string
}

export function VideoCard({ title, status, aiModel, duration, views, createdAt, gradient = 'from-blue-400 to-purple-500', format = '9:16' }: VideoCardProps) {
  const statusStyle = getStatusColor(status)
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Thumbnail */}
      <div className={`relative bg-gradient-to-br ${gradient} ${format === '9:16' ? 'aspect-[9/16] max-h-48' : format === '16:9' ? 'aspect-video' : 'aspect-square'}`}>
        {status === 'PROCESSING' && (
          <div className="absolute inset-0 shimmer" />
        )}
        {status === 'DONE' && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <Play size={20} className="text-[#0A0A0B] ml-1" fill="currentColor" />
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statusStyle}`}>
            {status === 'DONE' ? '✓ Done' : status === 'PROCESSING' ? '⟳ Processing...' : '✗ Failed'}
          </span>
        </div>
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
            {duration}s
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-semibold text-[#0A0A0B] truncate mb-1">{title}</h3>
        <div className="flex items-center justify-between text-xs text-[#6B7280] mb-3">
          <span>{aiModel}</span>
          <span className="flex items-center gap-1"><Eye size={11} />{formatNumber(views)}</span>
        </div>
        <div className="text-xs text-[#9CA3AF] mb-3">{formatDate(createdAt)}</div>
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-[#2563EB] bg-[#EBF5FF] hover:bg-[#DBEAFE] py-1.5 rounded-lg transition-colors">
            <Download size={13} />Download
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-[#0A0A0B] hover:bg-[#F8FAFC] rounded-lg transition-colors">
            <Copy size={13} />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
