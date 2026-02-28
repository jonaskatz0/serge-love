import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-[#0A0A0B] text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              {/* Full logo SVG — white text visible on dark footer background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/serge-logo.svg" alt="serge.love" className="h-8 w-auto block" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">The fastest way to create AI video ads. 1000+ actors, 6 AI engines, professional results.</p>
          </div>
          {[
            { title: 'Product', links: ['Features','Pricing','AI Actors','AI Models','API'] },
            { title: 'Company', links: ['About','Blog','Careers','Press','Contact'] },
            { title: 'Legal', links: ['Privacy Policy','Terms of Service','Cookie Policy','GDPR'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(l => <li key={l}><Link href="#" className="text-gray-400 text-sm hover:text-white transition-colors">{l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">© 2025 serge.love. All rights reserved.</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
