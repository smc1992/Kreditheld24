'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/providers/ThemeProvider'

const megaMenuData = {
  kreditarten: {
    title: 'Ratenkredite',
    description: 'Finden Sie den passenden Kredit für Ihre Bedürfnisse',
    icon: 'ri-bank-card-line',
    href: '/kreditarten',
    sections: [
      {
        title: 'Privatkredite',
        items: [
          { name: 'Ratenkredite', href: '/ratenkredite', icon: 'ri-money-euro-circle-line', description: 'Flexible Finanzierung für alle Wünsche' },
          { name: 'Autokredit', href: '/autokredit', icon: 'ri-car-line', description: 'Günstige Fahrzeugfinanzierung' },
          { name: 'Sofortkredit', href: '/sofortkredit', icon: 'ri-flashlight-line', description: 'Schnelle Auszahlung in 24h' },
        ]
      },
      {
        title: 'Spezialfinanzierung',
        items: [
          { name: 'Umschuldung', href: '/umschuldung', icon: 'ri-exchange-line', description: 'Kredite zusammenfassen und sparen' },
          { name: 'SCHUFA-neutral', href: '/schufa-neutral', icon: 'ri-shield-check-line', description: 'Kredit trotz negativer SCHUFA' },
          { name: 'Kredit für Selbstständige', href: '/kredit-selbststaendige', icon: 'ri-briefcase-4-line', description: 'Finanzierung für Unternehmer' },
        ]
      }
    ]
  },
  baufinanzierung: {
    title: 'Baufinanzierung',
    description: 'Verwirklichen Sie Ihren Traum vom Eigenheim',
    icon: 'ri-home-4-line',
    href: '/baufinanzierung',
    sections: [
      {
        title: 'Immobilienfinanzierung',
        items: [
          { name: 'Baufinanzierung', href: '/baufinanzierung', icon: 'ri-home-heart-line', description: 'Komplette Immobilienfinanzierung' },
          { name: 'Immobilienkredit', href: '/immobilienkredit', icon: 'ri-building-line', description: 'Kauf von Bestandsimmobilien' },
          { name: 'Modernierungsdarlehen', href: '/modernierungsdarlehen', icon: 'ri-hammer-line', description: 'Renovierung und Modernisierung' },
        ]
      },
      {
        title: 'Anschlussfinanzierung',
        items: [
          { name: 'Anschlussfinanzierung', href: '/anschlussfinanzierung', icon: 'ri-refresh-line', description: 'Günstige Anschlussfinanzierung' },
          { name: 'Forward-Darlehen', href: '/forwarddarlehen', icon: 'ri-calendar-check-line', description: 'Zinssicherung für die Zukunft' },
        ]
      }
    ]
  },
  service: {
    title: 'Service & Beratung',
    description: 'Umfassende Unterstützung rund um Ihre Finanzierung',
    icon: 'ri-customer-service-2-line',
    href: '#',
    sections: [
      {
        title: 'Informationen',
        items: [
          { name: 'Kreditrechner', href: '/kreditrechner', icon: 'ri-calculator-line', description: 'Interaktiver Kreditrechner' },
          { name: 'Aktuelle Zinssätze', href: '/zinssaetze', icon: 'ri-line-chart-line', description: 'Tagesaktuelle Konditionen' },
          { name: 'Kreditglossar', href: '/glossar', icon: 'ri-book-open-line', description: 'Fachbegriffe einfach erklärt' },
          { name: 'FAQ', href: '/faq', icon: 'ri-question-answer-line', description: 'Häufig gestellte Fragen' },
        ]
      },
      {
        title: 'Beratung & Partner',
        items: [
          { name: 'Tipps & Ratgeber', href: '/tipps-kreditaufnahme', icon: 'ri-lightbulb-line', description: 'Hilfreiche Finanzierungstipps' },
          { name: 'Partnerprogramm', href: '/partnerprogramm', icon: 'ri-team-line', description: 'Werden Sie unser Partner' },
          { name: 'Rechtliche Hinweise', href: '/rechtliche-hinweise', icon: 'ri-file-text-line', description: 'Wichtige rechtliche Informationen' },
        ]
      }
    ]
  }
}

const quickLinks = [
  { name: 'Über uns', href: '/ueber-uns', icon: 'ri-user-heart-line' },
  { name: 'Kontakt', href: '/kontakt', icon: 'ri-customer-service-line' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Check if click is outside mega menu
      if (!target.closest('.mega-menu-container')) {
        setActiveMegaMenu(null)
      }
      
      // Check if click is outside mobile menu
      if (!target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const handleMegaMenuToggle = (menuKey: string) => {
    setActiveMegaMenu(activeMegaMenu === menuKey ? null : menuKey)
  }

  const handleMobileSubmenuToggle = (menuKey: string) => {
    setActiveMobileSubmenu(activeMobileSubmenu === menuKey ? null : menuKey)
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-lg border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity h-full">
            <img 
              src="/images/Kreditheld24 Logo.png" 
              alt="Kreditheld24 Logo" 
              className="h-full w-auto object-contain"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 mega-menu-container">
            {/* Mega Menu Items */}
            {Object.entries(megaMenuData).map(([key, menuData]) => (
              <div key={key} className="relative group">
                <button
                  className={`flex items-center px-5 py-3 font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeMegaMenu === key 
                      ? 'text-white bg-primary shadow-lg' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 dark:hover:bg-gray-800'
                  }`}
                  onMouseEnter={() => setActiveMegaMenu(key)}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMegaMenuToggle(key)
                  }}
                >
                  <i className={`${menuData.icon} mr-2 text-lg`}></i>
                  {menuData.title}
                  <i className={`ml-2 text-sm transition-transform duration-300 ${
                    activeMegaMenu === key ? 'ri-arrow-up-s-line rotate-180' : 'ri-arrow-down-s-line'
                  }`}></i>
                </button>
                
                {/* Mega Menu Dropdown */}
                {activeMegaMenu === key && (
                  <div 
                    className={`absolute top-full mt-3 w-screen max-w-5xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-300 ${
                      key === 'kreditarten' || key === Object.keys(megaMenuData)[0] 
                        ? 'left-0' 
                        : key === 'service'
                        ? 'left-1/2 transform -translate-x-1/2'
                        : 'left-1/2 transform -translate-x-1/2'
                    }`}
                    onMouseLeave={() => setActiveMegaMenu(null)}
                  >
                    <div className="p-8">
                      {/* Header */}
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                          <i className={`${menuData.icon} text-3xl text-primary`}></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{menuData.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">{menuData.description}</p>
                      </div>
                      
                      {/* Sections */}
                      <div className="grid md:grid-cols-2 gap-10">
                        {menuData.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="space-y-1">
                            <div className="flex items-center mb-5">
                              <div className="w-1 h-6 bg-gradient-to-b from-primary to-primary/60 rounded-full mr-3"></div>
                              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                {section.title}
                              </h4>
                            </div>
                            <div className="space-y-2">
                              {section.items.map((item, itemIndex) => (
                                <Link
                                  key={itemIndex}
                                  href={item.href}
                                  className="group flex items-start p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 group-hover:from-primary/20 group-hover:to-primary/30 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                                    <i className={`${item.icon} text-primary text-lg`}></i>
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors duration-300 mb-1">
                                      {item.name}
                                    </h5>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                      {item.description}
                                    </p>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-2">
                                    <i className="ri-arrow-right-line text-primary"></i>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Footer CTA */}
                      <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="text-center sm:text-left">
                            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Noch Fragen?</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Unsere Experten beraten Sie gerne kostenlos</p>
                          </div>
                          <div className="flex gap-3">
                            <Link
                              href="/kontakt"
                              className="inline-flex items-center px-4 py-2 border border-primary text-primary font-medium rounded-xl hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
                              onClick={() => setActiveMegaMenu(null)}
                            >
                              <i className="ri-phone-line mr-2"></i>
                              Kontakt
                            </Link>
                            <Link
                              href={menuData.href}
                              className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-primary to-primary-600 text-white font-medium rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                              onClick={() => setActiveMegaMenu(null)}
                            >
                              <span>Alle {menuData.title} anzeigen</span>
                              <i className="ri-arrow-right-line ml-2"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Quick Links */}
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary font-medium rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
              >
                <i className={`${link.icon} mr-2 text-lg`}></i>
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Theme Toggle, CTA Button & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
              <ThemeToggle />
            </div>
            
            <Link
              href="/kreditanfrage"
              className="hidden md:flex items-center px-6 py-3 bg-gradient-to-r from-primary to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <i className="ri-calculator-line mr-2"></i>
              Kreditanfrage
            </Link>
            
            {/* Mobile Menu Button */}
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
      <div className={`lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-all duration-300 overflow-hidden mobile-menu-container ${
        mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-2">
            {/* Mobile Mega Menu Items */}
            {Object.entries(megaMenuData).map(([key, menuData]) => (
              <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Mobile Menu Header - Clickable */}
                <button
                  className="w-full bg-gray-50 dark:bg-gray-800 p-4 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleMobileSubmenuToggle(key)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                        <i className={`${menuData.icon} text-primary`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{menuData.title}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{menuData.description}</p>
                      </div>
                    </div>
                    <i className={`text-gray-500 transition-transform duration-200 ${
                      activeMobileSubmenu === key ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'
                    }`}></i>
                  </div>
                </button>
                
                {/* Mobile Menu Content - Collapsible */}
                <div className={`transition-all duration-300 overflow-hidden ${
                  activeMobileSubmenu === key ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="max-h-80 overflow-y-auto">
                  <div className="p-4 pt-0">
                    {/* Mobile Menu Sections */}
                    {menuData.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="mb-4 last:mb-0">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-gray-600 pb-1">
                          {section.title}
                        </h4>
                        <div className="space-y-1">
                          {section.items.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={item.href}
                              className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                              onClick={() => {
                                setMobileMenuOpen(false)
                                setActiveMobileSubmenu(null)
                              }}
                            >
                              <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center mr-3 flex-shrink-0">
                                <i className={`${item.icon} text-primary text-sm`}></i>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.name}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">{item.description}</div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Mobile Quick Links */}
            <div className="space-y-1">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`${link.icon} mr-3`}></i>
                  {link.name}
                </Link>
              ))}
            </div>
            
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