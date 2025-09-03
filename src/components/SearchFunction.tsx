'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  category: 'page' | 'service' | 'info'
  keywords: string[]
}

interface SearchFunctionProps {
  placeholder?: string
  className?: string
  showCategories?: boolean
  maxResults?: number
}

// Statische Suchdaten für die Website
const searchData: SearchResult[] = [
  // Hauptseiten
  {
    id: 'home',
    title: 'Startseite',
    description: 'Kreditheld24 - Ihr Partner für günstige Kredite und Finanzierungen',
    url: '/',
    category: 'page',
    keywords: ['startseite', 'home', 'kreditheld24', 'kredit', 'finanzierung']
  },
  {
    id: 'ratenkredite',
    title: 'Ratenkredite',
    description: 'Flexible Ratenkredite mit günstigen Zinsen für alle Ihre Wünsche',
    url: '/ratenkredite',
    category: 'service',
    keywords: ['ratenkredit', 'kredit', 'finanzierung', 'zinsen', 'rate']
  },
  {
    id: 'autokredit',
    title: 'Autokredit',
    description: 'Günstige Autofinanzierung für Neu- und Gebrauchtwagen',
    url: '/autokredit',
    category: 'service',
    keywords: ['autokredit', 'autofinanzierung', 'fahrzeugkredit', 'auto', 'kfz']
  },
  {
    id: 'umschuldung',
    title: 'Umschuldung',
    description: 'Bestehende Kredite zusammenfassen und Zinsen sparen',
    url: '/umschuldung',
    category: 'service',
    keywords: ['umschuldung', 'kreditablösung', 'zusammenfassen', 'sparen']
  },
  {
    id: 'sofortkredit',
    title: 'Sofortkredit',
    description: 'Schnelle Kreditauszahlung in wenigen Stunden',
    url: '/sofortkredit',
    category: 'service',
    keywords: ['sofortkredit', 'schnell', 'express', 'eilkredit', 'blitzkredit']
  },
  {
    id: 'kredit-selbststaendige',
    title: 'Kredit für Selbstständige',
    description: 'Maßgeschneiderte Kreditlösungen für Unternehmer und Freiberufler',
    url: '/kredit-selbststaendige',
    category: 'service',
    keywords: ['selbstständige', 'unternehmer', 'freiberufler', 'geschäftskredit']
  },
  {
    id: 'schufa-neutral',
    title: 'SCHUFA-neutral',
    description: 'Kreditanfrage ohne Auswirkung auf Ihren SCHUFA-Score',
    url: '/schufa-neutral',
    category: 'service',
    keywords: ['schufa', 'neutral', 'score', 'bonitätsprüfung', 'konditionsanfrage']
  },
  
  // Service-Seiten
  {
    id: 'zinssaetze',
    title: 'Aktuelle Zinssätze',
    description: 'Tagesaktuelle Zinssätze aller Banken im Vergleich',
    url: '/zinssaetze',
    category: 'info',
    keywords: ['zinssätze', 'zinsen', 'konditionen', 'vergleich', 'aktuell']
  },
  {
    id: 'glossar',
    title: 'Kreditglossar',
    description: 'Alle wichtigen Kreditbegriffe einfach erklärt',
    url: '/glossar',
    category: 'info',
    keywords: ['glossar', 'begriffe', 'lexikon', 'erklärung', 'definition']
  },
  {
    id: 'rechtliche-hinweise',
    title: 'Rechtliche Hinweise',
    description: 'Widerrufsrecht, Kreditvermittlung und SCHUFA-Informationen',
    url: '/rechtliche-hinweise',
    category: 'info',
    keywords: ['rechtlich', 'widerrufsrecht', 'kreditvermittlung', 'schufa', 'gewo']
  },
  {
    id: 'tipps-kreditaufnahme',
    title: 'Tipps für Kreditaufnahme',
    description: 'Hilfreiche Ratschläge und Tipps rund um die Kreditaufnahme',
    url: '/tipps-kreditaufnahme',
    category: 'info',
    keywords: ['tipps', 'ratgeber', 'hilfe', 'beratung', 'kreditaufnahme']
  },
  
  // Weitere Seiten
  {
    id: 'kreditanfrage',
    title: 'Kreditanfrage',
    description: 'Stellen Sie eine unverbindliche Kreditanfrage',
    url: '/kreditanfrage',
    category: 'service',
    keywords: ['kreditanfrage', 'antrag', 'beantragen', 'anfrage', 'formular']
  },
  {
    id: 'kontakt',
    title: 'Kontakt',
    description: 'Nehmen Sie Kontakt mit unseren Kreditexperten auf',
    url: '/kontakt',
    category: 'page',
    keywords: ['kontakt', 'beratung', 'telefon', 'email', 'support']
  },
  {
    id: 'ueber-uns',
    title: 'Über uns',
    description: 'Erfahren Sie mehr über Kreditheld24 und unser Team',
    url: '/ueber-uns',
    category: 'page',
    keywords: ['über uns', 'team', 'unternehmen', 'geschichte', 'mission']
  },
  {
    id: 'kreditarten',
    title: 'Kreditarten Übersicht',
    description: 'Alle verfügbaren Kreditarten im Überblick',
    url: '/kreditarten',
    category: 'info',
    keywords: ['kreditarten', 'übersicht', 'vergleich', 'arten', 'typen']
  }
]

export default function SearchFunction({ 
  placeholder = 'Suchen...', 
  className = '',
  showCategories = true,
  maxResults = 8
}: SearchFunctionProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Suche durchführen
  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const searchResults = searchData
      .filter(item => {
        // Suche in Titel, Beschreibung und Keywords
        const titleMatch = item.title.toLowerCase().includes(query)
        const descriptionMatch = item.description.toLowerCase().includes(query)
        const keywordMatch = item.keywords.some(keyword => 
          keyword.toLowerCase().includes(query)
        )
        
        return titleMatch || descriptionMatch || keywordMatch
      })
      .sort((a, b) => {
        // Sortierung: Exakte Titel-Matches zuerst, dann nach Relevanz
        const aExactTitle = a.title.toLowerCase() === query
        const bExactTitle = b.title.toLowerCase() === query
        
        if (aExactTitle && !bExactTitle) return -1
        if (!aExactTitle && bExactTitle) return 1
        
        const aTitleMatch = a.title.toLowerCase().includes(query)
        const bTitleMatch = b.title.toLowerCase().includes(query)
        
        if (aTitleMatch && !bTitleMatch) return -1
        if (!aTitleMatch && bTitleMatch) return 1
        
        return 0
      })
      .slice(0, maxResults)

    setResults(searchResults)
  }, [maxResults])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query)
    }, 150)

    return () => clearTimeout(timer)
  }, [query, performSearch])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultClick(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleResultClick = (result: SearchResult) => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setSelectedIndex(-1)
    router.push(result.url)
  }

  const getCategoryIcon = (category: SearchResult['category']) => {
    switch (category) {
      case 'service':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      case 'info':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  const getCategoryColor = (category: SearchResult['category']) => {
    switch (category) {
      case 'service': return 'text-green-600'
      case 'info': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => {
            setIsOpen(true)
            if (query) performSearch(query)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-green-500 focus:border-green-500"
        />
        
        {/* Clear button */}
        {query && (
          <button
            onClick={() => {
              setQuery('')
              setResults([])
              setIsOpen(false)
              inputRef.current?.focus()
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          <div className="py-2">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors
                  ${index === selectedIndex ? 'bg-gray-50' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  {showCategories && (
                    <div className={`flex-shrink-0 mt-0.5 ${getCategoryColor(result.category)}`}>
                      {getCategoryIcon(result.category)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {result.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {result.description}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {result.url}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* No results message */}
          {query && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Keine Ergebnisse für &quot;{query}&quot; gefunden
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Kompakte Suchleiste für Header
export function CompactSearch({ className = '' }: { className?: string }) {
  return (
    <SearchFunction
      placeholder="Suchen..."
      className={`w-64 ${className}`}
      showCategories={false}
      maxResults={5}
    />
  )
}

// Vollständige Suchseite
export function FullPageSearch() {
  return (
    <div className="max-w-2xl mx-auto">
      <SearchFunction
        placeholder="Durchsuchen Sie unsere Website..."
        className="w-full"
        showCategories={true}
        maxResults={12}
      />
    </div>
  )
}