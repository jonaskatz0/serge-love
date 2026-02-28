'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/serge-logo.svg" alt="serge.love" className="h-9 w-auto block" />
          </Link>

          {/* Navigation links */}
          <div className="hidden md:flex items-center gap-8">
            {[['Features', '#features'], ['Pricing', '/pricing'], ['Languages', '#languages'], ['Enterprise', '#enterprise']].map(([label, href]) => (
              <Link key={label} href={href} className="text-sm text-[#6B7280] hover:text-[#0A0A0B] transition-colors font-medium">{label}</Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/sign-in" className="text-sm font-medium text-[#6B7280] hover:text-[#0A0A0B] transition-colors px-4 py-2 rounded-full hover:bg-[#F8FAFC]">
              Login
            </Link>
            <Link href="/sign-up" className="text-sm font-semibold bg-[#0A0A0B] text-white px-5 py-2 rounded-full hover:bg-[#1a1a1b] transition-all duration-200 shadow-sm hover:shadow-md">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
