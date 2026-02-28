const features = [
  { icon: '👥', title: '1000+ AI actors', description: 'Diverse library of AI actors across genders, ethnicities, styles, and moods. Find the perfect face for your brand.' },
  { icon: '⚡', title: '6 AI engines', description: 'Sora 2 Pro, Veo 3.1, Kling 3.0, and more. Choose the best engine for quality, speed, or budget.' },
  { icon: '✍️', title: 'AI Script Writer', description: 'Enter your product URL and our AI generates compelling ad scripts optimized for conversions.' },
  { icon: '⏱️', title: 'Generate in 2 minutes', description: 'From script to finished video in under 2 minutes. Iterate quickly and test more ad variations.' },
  { icon: '🌍', title: '50+ languages', description: 'Create video ads in any language with native-sounding AI voices and perfect lip sync.' },
  { icon: '📊', title: 'Analytics & ROAS', description: 'Track views, CTR, conversions, and revenue impact. Know exactly which ads are driving results.' },
]
export function Features() {
  return (
    <section className="py-24 bg-[#F8FAFC]" id="features">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EBF5FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-4">Features</div>
          <h2 className="text-4xl font-bold text-[#0A0A0B]">Everything you need to scale<br />your video ad production</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-[#E2E8F0] p-7 hover:shadow-md hover:border-[#BFDBFE] hover:scale-[1.01] transition-all duration-200">
              <div className="text-3xl mb-4">{f.icon}</div>
              <div className="text-[#2563EB] text-sm font-semibold mb-2 flex items-center gap-1"><span>✦</span><span>{f.title}</span></div>
              <p className="text-[#6B7280] text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
