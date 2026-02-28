'use client'
import { useRouter } from 'next/navigation'

interface ActorCardProps {
  id: string
  name: string
  gender: string
  ethnicity: string
  style: string
  mood: string
  gradient: string
  selected?: boolean
  onSelect?: () => void
}

export function ActorCard({ id, name, gender, ethnicity, style, mood, gradient, selected, onSelect }: ActorCardProps) {
  const router = useRouter()
  const handleUse = () => {
    if (onSelect) {
      onSelect()
    } else {
      router.push(`/create?actor=${id}`)
    }
  }
  return (
    <div className={`relative group rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ${selected ? 'ring-2 ring-[#2563EB] shadow-lg scale-[1.02]' : 'hover:shadow-md hover:scale-[1.02]'}`} onClick={handleUse}>
      <div className={`bg-gradient-to-br ${gradient} aspect-[3/4] flex flex-col items-center justify-center p-4`}>
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-3 flex items-center justify-center text-2xl font-bold text-white">
          {name.charAt(0)}
        </div>
        {selected && (
          <div className="absolute top-3 right-3 w-6 h-6 bg-[#2563EB] rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="bg-white text-[#0A0A0B] text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:bg-[#EBF5FF] transition-colors">
            Use Actor
          </button>
        </div>
      </div>
      <div className="bg-white p-3 border-t border-[#E2E8F0]">
        <p className="text-sm font-semibold text-[#0A0A0B]">{name}</p>
        <p className="text-xs text-[#6B7280]">{style} · {mood}</p>
        <div className="flex gap-1 mt-1.5">
          <span className="text-[10px] bg-[#EBF5FF] text-[#2563EB] px-1.5 py-0.5 rounded-full font-medium">{gender}</span>
          <span className="text-[10px] bg-[#F8FAFC] text-[#6B7280] px-1.5 py-0.5 rounded-full font-medium">{ethnicity}</span>
        </div>
      </div>
    </div>
  )
}
