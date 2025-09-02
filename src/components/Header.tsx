'use client'

import Link from 'next/link'
import { Logo } from '@/components/Logo/Logo'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: 'Startseite', href: '/' },
  { name: 'Ratenkredite', href: '/ratenkredite' },
  { name: 'Autokredit', href: '/autokredit' },
  { name: 'Umschuldung', href: '/umschuldung' },
  { name: 'Kreditarten', href: '/kreditarten' },
  { name: 'Kontakt', href: '/kontakt' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm border-b">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Logo />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/kreditanfrage"
              className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
            >
              Kreditanfrage
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Menü öffnen</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-gray-700 hover:text-primary font-medium transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/kreditanfrage"
                className="block mx-3 mt-4 bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kreditanfrage
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}