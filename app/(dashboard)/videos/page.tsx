'use client'
import { TopBar } from '@/components/dashboard/TopBar'
import { VideoCard } from '@/components/dashboard/VideoCard'
import Link from 'next/link'
import { Plus } from 'lucide-react'

const VIDEOS = [
  { id: '1', title: 'Summer Sale Campaign — Sophia', status: 'DONE' as const, aiModel: 'Sora 2 Pro', duration: 30, views: 12400, createdAt: new Date('2025-07-15'), gradient: 'from-pink-400 to-rose-500', format: '9:16' },
  { id: '2', title: 'Product Launch Hero — Marcus', status: 'PROCESSING' as const, aiModel: 'Veo 3.1', duration: 15, views: 0, createdAt: new Date('2025-07-16'), gradient: 'from-blue-400 to-indigo-500', format: '9:16' },
  { id: '3', title: 'Brand Story — Elena', status: 'DONE' as const, aiModel: 'Kling 3.0', duration: 60, views: 8900, createdAt: new Date('2025-07-14'), gradient: 'from-orange-400 to-rose-500', format: '9:16' },
  { id: '4', title: 'Flash Sale Ad — Carlos', status: 'DONE' as const, aiModel: 'Nano Banana 2', duration: 15, views: 4200, createdAt: new Date('2025-07-13'), gradient: 'from-green-400 to-emerald-500', format: '9:16' },
  { id: '5', title: 'Holiday Collection — Nina', status: 'FAILED' as const, aiModel: 'Wan 2.1', duration: 30, views: 0, createdAt: new Date('2025-07-12'), gradient: 'from-violet-400 to-purple-600', format: '9:16' },
  { id: '6', title: 'Testimonial — Priya', status: 'DONE' as const, aiModel: 'MiniMax Hailuo', duration: 30, views: 6100, createdAt: new Date('2025-07-11'), gradient: 'from-teal-400 to-emerald-500', format: '9:16' },
]

export default function VideosPage() {
  return (
    <div>
      <TopBar title="My Videos" subtitle="All your generated video ads" />
      <div className="p-8">
        <div className="grid grid-cols-3 gap-5">
          {VIDEOS.map(v => <VideoCard key={v.id} {...v} />)}
          <Link href="/create" className="bg-[#EBF5FF] border-2 border-dashed border-[#BFDBFE] rounded-2xl aspect-[9/16] max-h-64 flex flex-col items-center justify-center gap-3 hover:border-[#2563EB] hover:bg-[#DBEAFE] transition-all duration-200 group cursor-pointer">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <Plus size={24} className="text-[#2563EB]" />
            </div>
            <span className="text-sm font-semibold text-[#2563EB]">Create New Video</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
