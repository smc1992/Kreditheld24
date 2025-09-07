'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

// Mapping für deutsche Seitennamen
const pageNames: Record<string, string> = {
  '': 'Startseite',
  'autokredit': 'Autokredit',
  'ratenkredite': 'Ratenkredite',
  'umschuldung': 'Umschuldung',
  'sofortkredit': 'Sofortkredit',
  'kredit-selbststaendige': 'Kredit für Selbstständige',
  'schufa-neutral': 'SCHUFA-neutral',
  'kreditarten': 'Ratenkredite',
  'kreditanfrage': 'Kreditanfrage',
  'kreditrechner': 'Kreditrechner',
  'kontakt': 'Kontakt',
  'ueber-uns': 'Über uns',
  'impressum': 'Impressum',
  'datenschutz': 'Datenschutz',
  'glossar': 'Glossar',
  'zinssaetze': 'Zinssätze',
  'rechtliche-hinweise': 'Rechtliche Hinweise',
  'tipps-kreditaufnahme': 'Tipps für Kreditaufnahme',
  'baufinanzierung': 'Baufinanzierung',
  'immobilienkredit': 'Immobilienkredit',
  'anschlussfinanzierung': 'Anschlussfinanzierung',
  'modernierungsdarlehen': 'Modernierungsdarlehen',
  'forwarddarlehen': 'Forward-Darlehen',
  'partnerprogramm': 'Partnerprogramm'
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const pathname = usePathname()
  
  // Automatische Breadcrumb-Generierung basierend auf der URL
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items
    
    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Startseite', href: '/' }
    ]
    
    let currentPath = ''
    pathSegments.forEach((segment, _index) => {
      currentPath += `/${segment}`
      const label = pageNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
      
      breadcrumbs.push({
        label,
        href: currentPath
      })
    })
    
    return breadcrumbs
  }
  
  const breadcrumbs = generateBreadcrumbs()
  
  // Nicht anzeigen auf der Startseite oder wenn nur ein Element vorhanden ist
  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null
  }
  
  return (
    <nav className={`bg-gray-50 border-b border-gray-200 ${className}`} aria-label="Breadcrumb">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1
            
            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-gray-400 mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                
                {isLast ? (
                  <span className="text-gray-500 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}

// Spezielle Breadcrumb-Komponente für individuelle Pfade
export function CustomBreadcrumb({ items, className = '' }: BreadcrumbProps) {
  if (!items || items.length <= 1) {
    return null
  }
  
  return (
    <nav className={`bg-gray-50 border-b border-gray-200 ${className}`} aria-label="Breadcrumb">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            
            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <svg
                    className="w-4 h-4 text-gray-400 mx-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                
                {isLast ? (
                  <span className="text-gray-500 font-medium" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}