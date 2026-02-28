import { TopBar } from '@/components/dashboard/TopBar'
import { ModelCard } from '@/components/dashboard/ModelCard'
import { AI_MODELS } from '@/lib/ai-models'

export default function ModelsPage() {
  return (
    <div>
      <TopBar title="AI Models" subtitle="Choose the best engine for your campaign" />
      <div className="p-8 space-y-6">
        <div className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-2xl p-5">
          <p className="text-sm text-[#6B7280]">
            <span className="font-semibold text-[#0A0A0B]">6 AI engines available.</span> Each engine has different strengths. Use your own API keys in Settings to control costs.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6">
          {AI_MODELS.map(m => <ModelCard key={m.id} model={m} showDetail />)}
        </div>
      </div>
    </div>
  )
}
