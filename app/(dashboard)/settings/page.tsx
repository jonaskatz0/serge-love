'use client'
import { useState } from 'react'
import { TopBar } from '@/components/dashboard/TopBar'
import { Input } from '@/components/ui/Input'
import { Check, AlertTriangle } from 'lucide-react'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [notifs, setNotifs] = useState({ videoReady: true, newActor: false, credits: true, offers: false })

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 600))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <TopBar title="Settings" subtitle="Manage your account preferences" />
      <div className="p-8 space-y-6 max-w-2xl">

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-[#0A0A0B]">Profile</h2>
          <Input label="Full Name" defaultValue="Jonas Fournier" placeholder="Your name" />
          <Input label="Email" defaultValue="jonas@serge.love" disabled className="opacity-60 cursor-not-allowed" />
          <div>
            <label className="block text-sm font-medium text-[#0A0A0B] mb-1.5">Default AI Engine</label>
            <select className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] bg-white">
              <option>Sora 2 Pro — OpenAI</option>
              <option>Veo 3.1 — Google</option>
              <option>Kling 3.0 — Kuaishou</option>
              <option>Nano Banana 2</option>
              <option>Wan 2.1 — Alibaba</option>
              <option>MiniMax Hailuo</option>
            </select>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 bg-[#0A0A0B] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1a1a1b] transition-all">
            {saved && <Check size={16} className="text-green-400" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-[#0A0A0B]">Subscription</h2>
          <div className="flex items-center justify-between p-4 bg-[#EBF5FF] rounded-xl border border-[#BFDBFE]">
            <div>
              <p className="font-semibold text-[#0A0A0B]">Pro Plan</p>
              <p className="text-sm text-[#6B7280]">$49/month · Next billing: Aug 1, 2025</p>
            </div>
            <span className="text-xs font-bold bg-[#2563EB] text-white px-3 py-1 rounded-full">ACTIVE</span>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="font-medium text-[#0A0A0B]">Credits used</span><span className="text-[#6B7280]">47 / 50</span></div>
            <div className="w-full bg-[#E2E8F0] rounded-full h-2">
              <div className="bg-[#2563EB] h-2 rounded-full" style={{ width: '94%' }} />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 bg-[#0A0A0B] text-white py-2.5 rounded-full text-sm font-semibold hover:bg-[#1a1a1b] transition-all">Upgrade to Agency</button>
            <button className="flex-1 border border-[#E2E8F0] text-[#6B7280] py-2.5 rounded-full text-sm font-medium hover:bg-[#F8FAFC] transition-all">Cancel Subscription</button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-7 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-[#0A0A0B]">Notifications</h2>
          {[
            { key: 'videoReady', label: 'Video generated', desc: 'Get notified when your video is ready' },
            { key: 'newActor', label: 'New actor available', desc: 'Be the first to use new AI actors' },
            { key: 'credits', label: 'Credits renewal', desc: 'Monthly credits reset notification' },
            { key: 'offers', label: 'Offers & promotions', desc: 'Special deals and feature announcements' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0A0A0B]">{label}</p>
                <p className="text-xs text-[#6B7280]">{desc}</p>
              </div>
              <button
                onClick={() => setNotifs(p => ({ ...p, [key]: !p[key as keyof typeof notifs] }))}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifs[key as keyof typeof notifs] ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${notifs[key as keyof typeof notifs] ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-red-100 p-7 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-red-600 flex items-center gap-2"><AlertTriangle size={18} />Danger Zone</h2>
          <p className="text-sm text-[#6B7280]">These actions are irreversible. Please be certain.</p>
          <div className="flex gap-3">
            <button className="flex-1 border border-red-300 text-red-600 py-2.5 rounded-full text-sm font-semibold hover:bg-red-50 transition-all">Delete All Videos</button>
            <button className="flex-1 bg-red-600 text-white py-2.5 rounded-full text-sm font-semibold hover:bg-red-700 transition-all">Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  )
}
