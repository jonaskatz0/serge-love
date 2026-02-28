'use client'
import Link from 'next/link'

const VIDEO_MOCKS = [
  { gradient: 'from-pink-400 via-rose-400 to-red-400', label: 'Beauty' },
  { gradient: 'from-blue-400 via-indigo-400 to-purple-400', label: 'Tech' },
  { gradient: 'from-green-400 via-emerald-400 to-teal-400', label: 'Health' },
  { gradient: 'from-orange-400 via-amber-400 to-yellow-400', label: 'Food' },
  { gradient: 'from-purple-400 via-violet-400 to-fuchsia-400', label: 'Fashion' },
  { gradient: 'from-cyan-400 via-sky-400 to-blue-400', label: 'Travel' },
  { gradient: 'from-red-400 via-rose-400 to-pink-400', label: 'Sport' },
  { gradient: 'from-teal-400 via-green-400 to-emerald-400', label: 'Home' },
  { gradient: 'from-fuchsia-400 via-pink-400 to-rose-400', label: 'Pets' },
  { gradient: 'from-amber-400 via-orange-400 to-red-400', label: 'Finance' },
]

function VideoMock({ gradient, label }: { gradient: string; label: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl w-28 h-48 flex-shrink-0 flex items-end p-3 shadow-lg`}>
      <span className="text-white text-xs font-semibold bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">{label}</span>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen bg-white overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-[#EBF5FF]/30 to-white pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-[#EBF5FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold">
              <span>🔥</span><span>Sora 2 Pro is now LIVE</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-[#0A0A0B] leading-tight tracking-tight">
                The fastest way to<br />
                <span className="text-[#2563EB]">create AI video ads</span>
              </h1>
              <p className="text-lg text-[#6B7280] max-w-lg leading-relaxed">
                Write your script → Pick an AI actor → Generate video. Professional ads in under 2 minutes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/sign-up" className="inline-flex items-center gap-2 bg-[#0A0A0B] text-white px-7 py-4 rounded-full font-semibold text-base hover:bg-[#1a1a1b] transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Start Free
                <span className="text-gray-400 text-sm bg-white/20 px-2 py-0.5 rounded-full">3 videos included</span>
              </Link>
              <button className="inline-flex items-center gap-2 text-[#0A0A0B] px-6 py-4 rounded-full font-semibold text-base border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all duration-200">
                <span className="w-8 h-8 bg-[#EBF5FF] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#2563EB] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                </span>
                Watch demo
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#6B7280]">
              {['No credit card required', 'Free plan forever', 'Cancel anytime'].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  {t}
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[520px] overflow-hidden rounded-3xl">
            <div className="absolute inset-0 flex gap-4">
              <div className="flex-1 overflow-hidden">
                <div className="animate-scroll-up flex flex-col gap-4">
                  {[...VIDEO_MOCKS.slice(0,5), ...VIDEO_MOCKS.slice(0,5)].map((v, i) => <VideoMock key={i} {...v} />)}
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="animate-scroll-down flex flex-col gap-4">
                  {[...VIDEO_MOCKS.slice(5), ...VIDEO_MOCKS.slice(5)].map((v, i) => <VideoMock key={i} {...v} />)}
                </div>
              </div>
            </div>
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[['300k+','Videos generated'],['3.1x','Average ROAS'],['2m 20s','Avg generation time'],['300+','Brands trust us']].map(([v,l]) => (
              <div key={l} className="text-center">
                <div className="text-3xl font-extrabold text-[#0A0A0B]">{v}</div>
                <div className="text-sm text-[#6B7280] mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
