'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface CookiePreferences {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    functional: false,
    analytics: false,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent')
    if (!cookieConsent) {
      setShowBanner(true)
    }
  }, [])

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true
    }
    savePreferences(allAccepted)
    setShowBanner(false)
  }

  const handleRejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    }
    savePreferences(onlyNecessary)
    setShowBanner(false)
  }

  const handleSaveSettings = () => {
    savePreferences(preferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify({
      preferences: prefs,
      timestamp: new Date().toISOString()
    }))
    
    // Apply cookie preferences
    applyCookiePreferences(prefs)
  }

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Here you would implement the actual cookie setting logic
    // For example, enable/disable Google Analytics, marketing pixels, etc.
    
    if (prefs.analytics) {
      // Enable Google Analytics or other analytics tools
      console.log('Analytics cookies enabled')
    }
    
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled')
    }
    
    if (prefs.functional) {
      // Enable functional cookies
      console.log('Functional cookies enabled')
    }
  }

  const handlePreferenceChange = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return // Cannot disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  if (!showBanner) return null

  return (
    <>
      {/* Cookie Banner Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300">
          {!showSettings ? (
            // Main Banner
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <div className="w-6 h-6 flex items-center justify-center text-white">
                    <i className="ri-shield-check-line text-xl"></i>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Ihre Privatsphäre ist uns wichtig
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                    Wir verwenden Cookies und ähnliche Technologien, um Ihnen die bestmögliche Nutzererfahrung zu bieten. 
                    Einige Cookies sind technisch notwendig, andere helfen uns, unsere Website zu verbessern und Ihnen 
                    personalisierte Inhalte anzuzeigen.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5">
                    <i className="ri-information-line"></i>
                  </div>
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">Wichtige Information:</p>
                    <p>
                      Durch Klicken auf "Alle akzeptieren" stimmen Sie der Speicherung von Cookies auf Ihrem Gerät zu, 
                      um die Navigation auf der Website zu verbessern und unsere Marketingbemühungen zu unterstützen. 
                      Sie können Ihre Einstellungen jederzeit in unseren Cookie-Einstellungen ändern.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={handleAcceptAll}
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex-1 sm:flex-none"
                >
                  Alle akzeptieren
                </button>
                <button
                  onClick={handleRejectAll}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-medium py-3 px-6 rounded-lg transition-all duration-300 flex-1 sm:flex-none"
                >
                  Alle ablehnen
                </button>
                <button
                  onClick={() => setShowSettings(true)}
                  className="border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-3 px-6 rounded-lg transition-all duration-300 flex-1 sm:flex-none"
                >
                  Einstellungen
                </button>
              </div>

              <div className="text-center">
                <Link 
                  href="/datenschutz" 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary underline"
                >
                  Mehr Informationen in unserer Datenschutzerklärung
                </Link>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Cookie-Einstellungen
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>

              <div className="space-y-6">
                {/* Necessary Cookies */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notwendige Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Immer aktiv</p>
                    </div>
                    <div className="w-12 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden. 
                    Sie speichern keine persönlich identifizierbaren Informationen.
                  </p>
                </div>

                {/* Functional Cookies */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Funktionale Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Optional</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('functional')}
                      className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 ${
                        preferences.functional 
                          ? 'bg-primary justify-end' 
                          : 'bg-gray-300 dark:bg-gray-600 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Diese Cookies ermöglichen erweiterte Funktionen und Personalisierung, wie z.B. das Speichern 
                    Ihrer Sprachpräferenzen oder Login-Informationen.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Analyse-Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Optional</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('analytics')}
                      className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 ${
                        preferences.analytics 
                          ? 'bg-primary justify-end' 
                          : 'bg-gray-300 dark:bg-gray-600 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, 
                    indem sie Informationen anonym sammeln und melden.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Marketing-Cookies</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Optional</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('marketing')}
                      className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 ${
                        preferences.marketing 
                          ? 'bg-primary justify-end' 
                          : 'bg-gray-300 dark:bg-gray-600 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Diese Cookies werden verwendet, um Ihnen relevante Werbung zu zeigen und die Effektivität 
                    unserer Werbekampagnen zu messen.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={handleSaveSettings}
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex-1 sm:flex-none"
                >
                  Einstellungen speichern
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-3 px-6 rounded-lg transition-all duration-300 flex-1 sm:flex-none"
                >
                  Alle akzeptieren
                </button>
              </div>

              <div className="text-center mt-4">
                <Link 
                  href="/datenschutz" 
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary underline"
                >
                  Mehr Informationen in unserer Datenschutzerklärung
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CookieBanner