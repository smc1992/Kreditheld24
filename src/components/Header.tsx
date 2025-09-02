'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const navigation = [
  { 
    name: 'Kreditarten', 
    href: '/kreditarten',
    submenu: [
      { name: 'Ratenkredite', href: '/ratenkredite' },
      { name: 'Autokredit', href: '/autokredit' },
      { name: 'Umschuldung', href: '/umschuldung' },
      { name: 'Kredit für Selbstständige', href: '/kredit-selbststaendige' },
      { name: 'SCHUFA-neutral', href: '/schufa-neutral' },
      { name: 'Sofortkredit', href: '/sofortkredit' },
    ]
  },
  { name: 'Tipps & Ratgeber', href: '/tipps-kreditaufnahme' },
  { name: 'Über uns', href: '/ueber-uns' },
  { name: 'Kontakt', href: '/kontakt' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Check if click is outside dropdown
      if (!target.closest('.dropdown-container')) {
        setDropdownOpen(false)
      }
      
      // Check if click is outside mobile menu
      if (!target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false)
        setMobileDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-['Pacifico'] text-primary hover:text-primary-600 transition-colors">
            Kreditheld24
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
               <div key={item.name} className="relative group dropdown-container">
                 {item.submenu ? (
                   <>
                     <button
                        className="flex items-center px-4 py-2 text-gray-700 hover:text-primary font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (item.name === 'Kreditarten') {
                            setDropdownOpen(!dropdownOpen)
                          }
                        }}
                      >
                        {item.name}
                        <i className={`ml-1 text-sm transition-transform duration-200 ${
                          (item.name === 'Kreditarten' && dropdownOpen) ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
                        }`}></i>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {item.name === 'Kreditarten' && dropdownOpen && (
                         <div 
                           className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 transition-all duration-200 z-50"
                           onClick={(e) => e.stopPropagation()}
                         >
                           {item.submenu.map((subItem) => (
                             <Link
                               key={subItem.name}
                               href={subItem.href}
                               className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors font-medium"
                             >
                               {subItem.name}
                             </Link>
                           ))}
                         </div>
                       )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-gray-700 hover:text-primary font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          
          {/* CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Link
              href="/kreditanfrage"
              className="hidden md:inline-flex items-center px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <i className="ri-calculator-line mr-2"></i>
              Kreditanfrage
            </Link>
            
            <button 
               className="lg:hidden p-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200 mobile-menu-container"
               onClick={(e) => {
                 e.stopPropagation()
                 setMobileMenuOpen(!mobileMenuOpen)
               }}
             >
              <i className={`text-xl transition-transform duration-200 ${
                mobileMenuOpen ? 'ri-close-line rotate-90' : 'ri-menu-line'
              }`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`lg:hidden bg-white border-t border-gray-100 transition-all duration-300 overflow-hidden mobile-menu-container ${
        mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.submenu ? (
                  <>
                    <button
                        className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                        onClick={() => {
                          if (item.name === 'Kreditarten') {
                            setMobileDropdownOpen(!mobileDropdownOpen)
                          }
                        }}
                      >
                       {item.name}
                       <i className={`ri-arrow-down-s-line transition-transform duration-200 ${
                         (item.name === 'Kreditarten' && mobileDropdownOpen) ? 'rotate-180' : ''
                       }`}></i>
                     </button>
                     
                     <div className={`ml-4 space-y-1 transition-all duration-200 overflow-hidden ${
                       (item.name === 'Kreditarten' && mobileDropdownOpen) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                     }`}>
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className="block px-4 py-2.5 text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Mobile CTA */}
            <Link
              href="/kreditanfrage"
              className="flex items-center justify-center w-full mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="ri-calculator-line mr-2"></i>
              Kreditanfrage starten
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}