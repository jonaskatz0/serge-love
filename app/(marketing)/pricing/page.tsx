import { Pricing } from '@/components/landing/Pricing'
import { Footer } from '@/components/landing/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — serge.love',
  description: 'Simple, transparent pricing for AI video ad generation.',
}

export default function PricingPage() {
  return (
    <>
      <div className="pt-24 pb-12 bg-white text-center">
        <h1 className="text-5xl font-extrabold text-[#0A0A0B] mb-4">Simple pricing</h1>
        <p className="text-[#6B7280] text-xl">Start free, upgrade when you need more</p>
      </div>
      <Pricing />
      <Footer />
    </>
  )
}
