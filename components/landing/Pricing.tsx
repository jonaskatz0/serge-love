import Link from 'next/link'

const plans = [
  { name: 'STARTER', price: 0, label: 'Free forever', popular: false, features: ['3 videos / month','Basic AI actors','HD quality','Watermark included','Email support'], cta: 'Get Started Free', href: '/sign-up' },
  { name: 'PRO', price: 49, label: 'per month', popular: true, features: ['50 videos / month','All AI actors','4K quality','No watermark','Advanced analytics','Priority generation','Priority support'], cta: 'Start Pro Trial', href: '/sign-up?plan=pro' },
  { name: 'AGENCY', price: 149, label: 'per month', popular: false, features: ['Unlimited videos','Full API access','White-label','Dedicated support','Multi-accounts','Custom integrations','SLA guarantee'], cta: 'Contact Sales', href: '/sign-up?plan=agency' },
]

export function Pricing() {
  return (
    <section className="py-24 bg-white" id="pricing">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#EBF5FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-2 rounded-full text-sm font-semibold mb-4">Pricing</div>
          <h2 className="text-4xl font-bold text-[#0A0A0B]">Simple, transparent pricing</h2>
          <p className="text-[#6B7280] text-lg mt-4">Start free, scale as you grow</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 items-start">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative rounded-2xl p-8 ${plan.popular ? 'bg-[#0A0A0B] text-white shadow-2xl scale-105' : 'bg-white border border-[#E2E8F0] shadow-sm'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#2563EB] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">MOST POPULAR</span>
                </div>
              )}
              <div className="mb-8">
                <div className={`text-xs font-bold tracking-widest mb-2 ${plan.popular ? 'text-gray-400' : 'text-[#2563EB]'}`}>{plan.name}</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">${plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-gray-400' : 'text-[#6B7280]'}`}>{plan.label !== 'Free forever' ? '/mo' : ''} {plan.label}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <svg className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-[#2563EB]' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className={`text-sm ${plan.popular ? 'text-gray-200' : 'text-[#6B7280]'}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href} className={`block w-full text-center py-3 px-6 rounded-full font-semibold text-sm transition-all duration-200 ${plan.popular ? 'bg-white text-[#0A0A0B] hover:bg-gray-100' : 'bg-[#0A0A0B] text-white hover:bg-[#1a1a1b]'}`}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
