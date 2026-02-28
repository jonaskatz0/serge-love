export function HowItWorks() {
  const steps = [
    { number: '01', icon: '✍️', title: 'Write or generate your script', description: "Use our AI script writer or write your own. Input your product URL and we'll craft the perfect ad copy automatically." },
    { number: '02', icon: '👤', title: 'Choose from 1000+ AI actors', description: 'Browse our diverse library of AI actors. Filter by gender, ethnicity, style, and mood to find the perfect fit for your brand.' },
    { number: '03', icon: '🎬', title: 'Generate your video in 2 minutes', description: 'Our AI engines render your video ad with perfect lip sync, natural gestures, and professional quality. Download and publish.' },
  ]
  return (
    <section className="py-24 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EBF5FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-4">How it works</div>
          <h2 className="text-4xl font-bold text-[#0A0A0B]">From idea to video in 3 steps</h2>
          <p className="text-[#6B7280] text-lg mt-4 max-w-2xl mx-auto">The simplest workflow for creating high-converting video ads</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-[#EBF5FF] border border-[#BFDBFE] rounded-2xl p-8 hover:shadow-md hover:scale-[1.02] transition-all duration-200">
              <div className="text-7xl font-extrabold text-[#DBEAFE] leading-none mb-6">{step.number}</div>
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-[#0A0A0B] mb-3">{step.title}</h3>
              <p className="text-[#6B7280] leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
