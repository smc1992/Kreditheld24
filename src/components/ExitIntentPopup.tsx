'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ExitIntentPopupProps {
  title?: string
  subtitle?: string
  offer?: string
  ctaText?: string
  ctaLink?: string
  delay?: number
  showOnce?: boolean
  excludePaths?: string[]
  className?: string
}

interface PopupOffer {
  title: string
  subtitle: string
  offer: string
  ctaText: string
  ctaLink: string
  badge?: string
  icon?: React.ReactNode
}

// Vordefinierte Angebote
const popupOffers: PopupOffer[] = [
  {
    title: 'Warten Sie!',
    subtitle: 'Verpassen Sie nicht unsere besten Konditionen',
    offer: 'Erhalten Sie eine kostenlose Kreditberatung und sparen Sie bis zu 2.000€ pro Jahr',
    ctaText: 'Jetzt kostenlos beraten lassen',
    ctaLink: '/kontakt',
    badge: 'Kostenlos',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )
  },
  {
    title: 'Noch nicht das Richtige gefunden?',
    subtitle: 'Lassen Sie uns Ihnen helfen',
    offer: 'Unsere Experten finden den perfekten Kredit für Ihre Situation - 100% kostenlos und unverbindlich',
    ctaText: 'Individueller Service',
    ctaLink: '/kreditanfrage',
    badge: 'Unverbindlich',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: 'Exklusives Angebot!',
    subtitle: 'Nur für kurze Zeit verfügbar',
    offer: 'Sichern Sie sich jetzt 0,5% Zinsvorteil bei Ihrer Kreditanfrage - Angebot gültig nur heute',
    ctaText: 'Individueller Service',
    ctaLink: '/kreditanfrage?promo=exit-intent',
    badge: 'Limitiert',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    )
  }
]

export default function ExitIntentPopup({
  title,
  subtitle,
  offer,
  ctaText,
  ctaLink,
  delay = 3000,
  showOnce = true,
  excludePaths = ['/kreditanfrage', '/kontakt'],
  className = ''
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [currentOffer, setCurrentOffer] = useState<PopupOffer>(popupOffers[0])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // Wähle zufälliges Angebot oder verwende Props
  useEffect(() => {
    if (title && subtitle && offer && ctaText && ctaLink) {
      setCurrentOffer({
        title,
        subtitle,
        offer,
        ctaText,
        ctaLink
      })
    } else {
      // Zufälliges Angebot auswählen
      const randomOffer = popupOffers[Math.floor(Math.random() * popupOffers.length)]
      setCurrentOffer(randomOffer)
    }
  }, [title, subtitle, offer, ctaText, ctaLink])

  // Prüfe ob Popup auf aktueller Seite angezeigt werden soll
  const shouldShowOnPage = !excludePaths.some(path => pathname.includes(path))

  // Exit Intent Detection
  useEffect(() => {
    if (!shouldShowOnPage || (showOnce && hasShown)) return

    let hasTriggered = false

    const handleMouseLeave = (e: MouseEvent) => {
      // Nur triggern wenn Maus den oberen Bereich verlässt
      if (e.clientY <= 0 && !hasTriggered && !isVisible) {
        hasTriggered = true
        
        // Verzögerung vor Anzeige
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true)
          setHasShown(true)
        }, 100)
      }
    }

    const handleScroll = () => {
      // Triggere auch bei 70% Scroll-Tiefe
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      
      if (scrollPercent > 70 && !hasTriggered && !isVisible) {
        hasTriggered = true
        
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true)
          setHasShown(true)
        }, delay)
      }
    }

    // Event Listeners hinzufügen
    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [shouldShowOnPage, showOnce, hasShown, isVisible, delay])

  // Popup schließen
  const closePopup = () => {
    setIsVisible(false)
  }

  // ESC-Taste zum Schließen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isVisible) {
        closePopup()
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible])

  // Popup nach Seitenwechsel schließen
  useEffect(() => {
    setIsVisible(false)
  }, [pathname])

  if (!isVisible || !shouldShowOnPage) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
        onClick={closePopup}
      />
      
      {/* Popup */}
      <div className={`
        fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50
        bg-white rounded-lg shadow-2xl max-w-md w-full mx-4
        transition-all duration-300 ease-out
        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        ${className}
      `}>
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Schließen"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          {/* Icon & Badge */}
          <div className="flex items-center justify-center mb-4">
            {currentOffer.icon && (
              <div className="bg-green-100 p-3 rounded-full text-green-600 mb-2">
                {currentOffer.icon}
              </div>
            )}
          </div>
          
          {currentOffer.badge && (
            <div className="text-center mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {currentOffer.badge}
              </span>
            </div>
          )}

          {/* Content */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {currentOffer.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentOffer.subtitle}
            </p>
            <p className="text-lg text-gray-800 mb-6 leading-relaxed">
              {currentOffer.offer}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href={currentOffer.ctaLink}
              onClick={closePopup}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 text-center block"
            >
              {currentOffer.ctaText}
            </Link>
            
            <button
              onClick={closePopup}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors duration-200"
            >
              Nein danke, vielleicht später
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                100% kostenlos
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Unverbindlich
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                SCHUFA-neutral
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Spezielle Exit-Intent Popups für verschiedene Seiten
export function KreditartenExitPopup() {
  return (
    <ExitIntentPopup
      title="Perfekten Kredit gefunden?"
      subtitle="Lassen Sie uns Ihnen helfen"
      offer="Unsere Experten vergleichen über 20 Banken und finden garantiert den besten Zinssatz für Sie"
      ctaText="Individueller Service"
      ctaLink="/kreditanfrage"
      excludePaths={['/kreditanfrage', '/kontakt']}
    />
  )
}

export function ZinssaetzeExitPopup() {
  return (
    <ExitIntentPopup
      title="Zinssätze zu hoch?"
      subtitle="Wir finden bessere Konditionen"
      offer="Erhalten Sie eine persönliche Kreditanalyse und sparen Sie bis zu 40% bei den Zinsen"
      ctaText="Persönliche Analyse anfordern"
      ctaLink="/kontakt"
      excludePaths={['/kreditanfrage', '/kontakt']}
    />
  )
}

export function DefaultExitPopup() {
  return (
    <ExitIntentPopup
      excludePaths={['/kreditanfrage', '/kontakt', '/impressum', '/datenschutz']}
      delay={5000}
      showOnce={true}
    />
  )
}

// Hook für Exit-Intent Funktionalität
export function useExitIntent(callback: () => void, delay: number = 0) {
  useEffect(() => {
    let hasTriggered = false
    let timeoutRef: NodeJS.Timeout | null = null

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        hasTriggered = true
        
        if (delay > 0) {
          timeoutRef = setTimeout(callback, delay)
        } else {
          callback()
        }
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (timeoutRef) {
        clearTimeout(timeoutRef)
      }
    }
  }, [callback, delay])
}