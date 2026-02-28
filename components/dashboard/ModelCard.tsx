import Link from 'next/link'
import { AIModel } from '@/lib/ai-models'

interface ModelCardProps {
  model: AIModel
  selected?: boolean
  onSelect?: () => void
  showDetail?: boolean
}

export function ModelCard({ model, selected, onSelect, showDetail }: ModelCardProps) {
  return (
    <div
      onClick={onSelect}
      className={`relative bg-white rounded-2xl border p-5 transition-all duration-200 ${
        selected ? 'border-2 border-[#2563EB] shadow-md scale-[1.01]' : 'border-[#E2E8F0] hover:shadow-md hover:border-[#BFDBFE] cursor-pointer'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{model.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#0A0A0B] text-sm">{model.name}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: model.badgeColor }}>{model.badge}</span>
            </div>
            <p className="text-xs text-[#6B7280]">{model.provider}</p>
          </div>
        </div>
        {selected && (
          <div className="w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        )}
      </div>
      <p className="text-xs text-[#6B7280] leading-relaxed mb-4">{model.description}</p>
      {showDetail && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[['Quality', model.quality + '%'],['Speed', model.speed + '%'],['$/video', '$' + model.pricePerVideo.toFixed(2)]].map(([label, val]) => (
            <div key={label} className="bg-[#F8FAFC] rounded-xl p-2.5 text-center">
              <div className="text-sm font-bold text-[#0A0A0B]">{val}</div>
              <div className="text-[10px] text-[#6B7280]">{label}</div>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        {[['Quality', model.quality], ['Speed', model.speed]].map(([label, val]) => (
          <div key={label}>
            <div className="flex justify-between text-[10px] text-[#6B7280] mb-1"><span>{label}</span><span>{val}%</span></div>
            <div className="w-full bg-[#E2E8F0] rounded-full h-1.5">
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${val}%`, backgroundColor: model.color }} />
            </div>
          </div>
        ))}
      </div>
      {showDetail && (
        <Link href={`/create?model=${model.id}`} className="mt-4 block w-full text-center text-sm font-semibold text-[#2563EB] bg-[#EBF5FF] hover:bg-[#DBEAFE] py-2 rounded-xl transition-colors">
          Use this engine →
        </Link>
      )}
    </div>
  )
}
