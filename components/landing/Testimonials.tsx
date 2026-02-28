const testimonials = [
  { quote: "We went from spending $5,000/month on UGC creators to $49/month with serge.love. Our ROAS actually improved by 3.2x.", name: "Sarah Chen", role: "Head of Growth", company: "Bloom Beauty", result: "3.2x ROAS improvement", avatar: "SC", gradient: "from-pink-400 to-rose-500" },
  { quote: "The AI actors are incredibly realistic. Our audience can't tell the difference, and our CTR went up 47% in the first week.", name: "Marcus Johnson", role: "CEO", company: "FitCore App", result: "+47% CTR in week 1", avatar: "MJ", gradient: "from-blue-400 to-indigo-500" },
  { quote: "We now test 10x more ad variations than before. The speed of serge.love has completely transformed our ad strategy.", name: "Elena Rodriguez", role: "Performance Marketing Lead", company: "TechFlow SaaS", result: "10x more ad variations", avatar: "ER", gradient: "from-purple-400 to-violet-500" },
]
export function Testimonials() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EBF5FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-4">Testimonials</div>
          <h2 className="text-4xl font-bold text-[#0A0A0B]">Loved by growth marketers</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_,i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <p className="text-[#0A0A0B] text-base leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
              <div className="bg-[#EBF5FF] border border-[#BFDBFE] text-[#2563EB] text-xs font-bold px-3 py-1.5 rounded-full inline-block mb-6">{t.result}</div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>{t.avatar}</div>
                <div>
                  <div className="font-semibold text-[#0A0A0B] text-sm">{t.name}</div>
                  <div className="text-[#6B7280] text-xs">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
