'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MegaMenuItem {
  title: string
  href: string
  description: string
  icon?: React.ReactNode
  badge?: string
  popular?: boolean
}

interface MegaMenuSection {
  title: string
  items: MegaMenuItem[]
}

interface MegaMenuProps {
  trigger: React.ReactNode
  sections: MegaMenuSection[]
  className?: string
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const kreditartenSections: MegaMenuSection[] = [
  {
    title: 'Beliebte Kreditarten',
    items: [
      {
        title: 'Ratenkredit',
        href: '/ratenkredite',
        description: 'Flexibler Kredit für alle Wünsche mit festen Raten',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        popular: true
      },
      {
        title: 'Autokredit',
        href: '/autokredit',
        description: 'Günstige Finanzierung für Ihr Traumauto',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        ),
        popular: true
      },
      {
        title: 'Umschuldung',
        href: '/umschuldung',
        description: 'Bestehende Kredite zusammenfassen und sparen',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      },
      {
        title: 'Sofortkredit',
        href: '/sofortkredit',
        description: 'Schnelle Auszahlung in wenigen Stunden',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        ),
        badge: 'Schnell'
      }
    ]
  },
  {
    title: 'Spezielle Kredite',
    items: [
      {
        title: 'Kredit für Selbstständige',
        href: '/kredit-selbststaendige',
        description: 'Maßgeschneiderte Lösungen für Unternehmer',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V8m8 0V6a2 2 0 00-2-2H10a2 2 0 00-2 2v2" />
          </svg>
        )
      },
      {
        title: 'SCHUFA-neutral',
        href: '/schufa-neutral',
        description: 'Kreditanfrage ohne SCHUFA-Eintrag',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
        badge: 'Sicher'
      }
    ]
  },
  {
    title: 'Service & Beratung',
    items: [
      {
        title: 'Kreditvergleich',
        href: '/kreditarten',
        description: 'Alle Kreditarten im Überblick',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      },
      {
        title: 'Aktuelle Zinssätze',
        href: '/zinssaetze',
        description: 'Tagesaktuelle Konditionen aller Banken',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        )
      },
      {
        title: 'Kreditglossar',
        href: '/glossar',
        description: 'Alle wichtigen Begriffe erklärt',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      },
      {
        title: 'Tipps & Ratgeber',
        href: '/tipps-kreditaufnahme',
        description: 'Hilfreiche Informationen zur Kreditaufnahme',
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        )
      }
    ]
  }
]

export default function MegaMenu({ 
  trigger, 
  sections, 
  className = '', 
  width = 'xl' 
}: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [_activeSection, _setActiveSection] = useState(0)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-6xl',
    full: 'max-w-full'
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="cursor-pointer"
      >
        {trigger}
      </div>

      {/* Mega Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 z-50 mt-2"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className={`
            ${widthClasses[width]} w-screen bg-white rounded-lg shadow-2xl border border-gray-200
            transform transition-all duration-200 ease-out
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
          `}>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          className="group block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            {item.icon && (
                              <div className="flex-shrink-0 text-green-600 group-hover:text-green-700 transition-colors">
                                {item.icon}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-600 transition-colors">
                                  {item.title}
                                </h4>
                                {item.popular && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Beliebt
                                  </span>
                                )}
                                {item.badge && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Call to Action */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Noch Fragen?</h4>
                    <p className="text-sm text-gray-500">Unsere Experten beraten Sie gerne kostenlos</p>
                  </div>
                  <div className="flex space-x-3">
                    <Link
                      href="/kontakt"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Kontakt
                    </Link>
                    <Link
                      href="/kreditanfrage"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      Individueller Service
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Vordefiniertes Kreditarten Mega Menu
export function KreditartenMegaMenu({ 
  trigger, 
  className = '' 
}: { 
  trigger: React.ReactNode
  className?: string 
}) {
  return (
    <MegaMenu
      trigger={trigger}
      sections={kreditartenSections}
      className={className}
      width="xl"
    />
  )
}