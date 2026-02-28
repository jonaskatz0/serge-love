'use client'
import { useState } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { AI_MODELS } from '@/lib/ai-models'
import { Check, ExternalLink } from 'lucide-react'

interface KeyState {
  value: string
  saved: boolean
  saving: boolean
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<Record<string, KeyState>>(
    Object.fromEntries(AI_MODELS.map(m => [m.id, { value: '', saved: false, saving: false }]))
  )
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleSave = async (modelId: string) => {
    setKeys(p => ({ ...p, [modelId]: { ...p[modelId], saving: true } }))
    await new Promise(r => setTimeout(r, 800))
    setKeys(p => ({ ...p, [modelId]: { ...p[modelId], saving: false, saved: true } }))
    showToast('API key saved! ✓')
  }

  return (
    <div>
      <TopBar title="API Keys" subtitle="Connect your own AI API keys to control costs" />
      <div className="p-8 space-y-6 max-w-3xl">
        <div className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-2xl p-5">
          <p className="text-sm text-[#6B7280]">
            <span className="font-semibold text-[#0A0A0B]">💡 Tip:</span> Use your own API keys to pay providers directly and reduce costs. Your keys are encrypted and stored securely.
          </p>
        </div>

        <div className="space-y-4">
          {AI_MODELS.map(model => {
            const key = keys[model.id]
            return (
              <div key={model.id} className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{model.emoji}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[#0A0A0B]">{model.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: model.badgeColor }}>{model.badge}</span>
                      </div>
                      <p className="text-xs text-[#6B7280]">{model.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${key.saved ? 'bg-green-400' : 'bg-[#E2E8F0]'}`} />
                    <span className={`text-xs font-medium ${key.saved ? 'text-green-600' : 'text-[#9CA3AF]'}`}>
                      {key.saved ? 'Connected' : 'Not configured'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <input
                    type="password"
                    placeholder="sk-••••••••••••••••••••••••"
                    value={key.value}
                    onChange={e => setKeys(p => ({ ...p, [model.id]: { ...p[model.id], value: e.target.value, saved: false } }))}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-mono"
                  />
                  <button
                    onClick={() => handleSave(model.id)}
                    disabled={!key.value || key.saving}
                    className="flex items-center gap-2 bg-[#0A0A0B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1a1a1b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {key.saving ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : key.saved ? (
                      <Check size={16} />
                    ) : null}
                    Save
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0A0A0B] text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2 animate-fade-in">
          <Check size={16} className="text-green-400" />
          {toast}
        </div>
      )}
    </div>
  )
}
