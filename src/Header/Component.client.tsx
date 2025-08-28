'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    setMobileMenuOpen(false) // Close mobile menu on route change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm" {...(theme ? { 'data-theme': theme } : {})}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-primary transition-colors hover:text-green-600" 
              style={{ fontFamily: data?.logo?.fontFamily || 'Pacifico, cursive' }}
            >
              {data?.logo?.text || 'Kreditheld24'}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <HeaderNav data={data} />

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
            aria-label={mobileMenuOpen ? "Menü schließen" : "Menü öffnen"}
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {mobileMenuOpen ? (
                <i className="ri-close-line ri-lg"></i>
              ) : (
                <i className="ri-menu-line ri-lg"></i>
              )}
            </div>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 bg-white">
            <nav className="flex flex-col space-y-1">
              {/* Kredite Section */}
              <div className="mb-4">
                <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Kredite
                </div>
                {(data?.navItems || [])
                  .filter(({ link }) => 
                    ['Ratenkredite', 'Autokredit', 'Umschuldung', 'Sofortkredit', 'SCHUFA-neutral', 'Selbstständige'].includes(link?.label || '')
                  )
                  .map(({ link }, i) => {
                    const isActive = pathname === link?.url
                    return (
                      <Link
                        key={i}
                        href={link?.url || '#'}
                        className={`block px-6 py-3 text-base font-medium transition-colors rounded-md mx-3 ${
                          isActive 
                            ? 'text-primary bg-green-50 font-semibold' 
                            : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3 opacity-60"></div>
                          {link?.label}
                        </div>
                      </Link>
                    )
                  })
                }
                <Link
                  href="/kreditarten"
                  className="block px-6 py-3 text-base font-medium text-primary hover:bg-gray-50 rounded-md mx-3 mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <div className="w-4 h-4 mr-3 flex items-center justify-center">
                      <i className="ri-grid-line"></i>
                    </div>
                    <span>Alle Kreditarten</span>
                    <div className="w-4 h-4 ml-auto flex items-center justify-center">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </div>
                </Link>
              </div>
              
              {/* Service Navigation Items */}
               <div className="border-t border-gray-200 pt-4">
                 <div className="px-3 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                   Service
                 </div>
                 {/* Tipps Seite */}
                 {(data?.navItems || [])
                   .filter(({ link }) => link?.label === 'Tipps')
                   .map(({ link }, i) => {
                     const isActive = pathname === link?.url
                     return (
                       <Link
                         key={i}
                         href={link?.url || '#'}
                         className={`block px-6 py-3 text-base font-medium transition-colors rounded-md mx-3 ${
                           isActive 
                             ? 'text-primary bg-green-50 font-semibold' 
                             : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                         }`}
                         onClick={() => setMobileMenuOpen(false)}
                       >
                         <div className="flex items-center">
                           <div className="w-4 h-4 mr-3 flex items-center justify-center text-primary">
                             <i className="ri-lightbulb-line"></i>
                           </div>
                           {link?.label}
                         </div>
                       </Link>
                     )
                   })
                 }
                 {/* Andere Service Items */}
                 {(data?.navItems || [])
                   .filter(({ link }) => 
                     !['Ratenkredite', 'Autokredit', 'Umschuldung', 'Sofortkredit', 'SCHUFA-neutral', 'Selbstständige', 'Tipps'].includes(link?.label || '')
                   )
                   .map(({ link }, i) => {
                     const isActive = pathname === link?.url
                     return (
                       <Link
                         key={i}
                         href={link?.url || '#'}
                         className={`block px-6 py-3 text-base font-medium transition-colors rounded-md mx-3 ${
                           isActive 
                             ? 'text-primary bg-green-50 font-semibold' 
                             : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                         }`}
                         onClick={() => setMobileMenuOpen(false)}
                       >
                         <div className="flex items-center">
                           <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 opacity-60"></div>
                           {link?.label}
                         </div>
                       </Link>
                     )
                   })
                 }
               </div>
              
              {/* Mobile CTA Button */}
              <div className="pt-6 border-t border-gray-200 mt-4">
                <Link
                  href="/kontakt"
                  className="block w-full bg-primary hover:bg-green-500 text-white font-medium py-4 px-4 rounded-button text-center transition-all shadow-sm mx-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 mr-2 flex items-center justify-center">
                      <i className="ri-customer-service-2-line"></i>
                    </div>
                    <span>Kostenlose Beratung</span>
                  </div>
                </Link>
                <div className="text-center mt-3 px-3">
                  <p className="text-sm text-gray-500">
                    100% kostenlos & unverbindlich
                  </p>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
