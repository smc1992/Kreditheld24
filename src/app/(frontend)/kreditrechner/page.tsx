'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'

export default function KreditrechnerPage() {
  const [widgetLoaded, setWidgetLoaded] = useState(false)
  const [widgetError, setWidgetError] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  return (
    <>
      <Head>
        <title>Kreditrechner - Kreditheld24</title>
        <meta name="description" content="Berechnen Sie Ihren Kredit mit unserem interaktiven Kreditrechner. Vergleichen Sie Zinssätze und finden Sie die beste Finanzierung." />
        <meta name="keywords" content="Kreditrechner, Kredit berechnen, Zinssätze vergleichen, Kreditheld24, Finanzierung" />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900 text-white py-16 transition-colors duration-300 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-24 h-24 border border-green-300 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 border border-green-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-200 rounded-full"></div>
            <div className="absolute top-20 right-20 w-20 h-20 border border-green-300 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-white">Kreditrechner</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Interaktiver Kreditrechner
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-100">
                Berechnen Sie Ihren Wunschkredit und vergleichen Sie die besten Angebote
              </p>
            </div>
          </div>
        </section>

        {/* Kreditrechner Widget Section */}
        <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-800/30 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Live-Rechner</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Berechnen Sie Ihren Kredit
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Nutzen Sie unseren interaktiven Kreditrechner für eine sofortige Berechnung Ihrer Finanzierungsmöglichkeiten
                </p>
              </div>
              
              {/* Econ Widget Container */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6">
                  <div id="econ" className="min-h-[600px] w-full">
                    {!widgetLoaded && !widgetError && !isInitialized && (
                      <div className="flex items-center justify-center h-[600px]">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                          <p className="text-gray-600 dark:text-gray-300">Kreditrechner wird geladen...</p>
                        </div>
                      </div>
                    )}
                    {widgetError && (
                      <div className="flex items-center justify-center h-[600px]">
                        <div className="text-center max-w-md">
                          <div className="w-16 h-16 bg-red-100 dark:bg-red-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Kreditrechner temporär nicht verfügbar</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">Der externe Kreditrechner ist momentan nicht erreichbar. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.</p>
                          <div className="space-y-2">
                            <a href="/kontakt" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                              Jetzt Kontakt aufnehmen
                            </a>
                            <br />
                            <button 
                              onClick={() => window.location.reload()} 
                              className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                            >
                              Seite neu laden
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vorteile Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-green-50/10 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Warum unseren Kreditrechner nutzen?
                </h2>
                <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Unser Rechner bietet Ihnen transparente und aktuelle Konditionen von über 20 Banken
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-500/30 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Sofortige Berechnung</h4>
                  <p className="text-gray-600 dark:text-gray-300">Erhalten Sie in Echtzeit Ihre monatlichen Raten und Gesamtkosten.</p>
                </div>
                
                <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-500/30 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Beste Konditionen</h4>
                  <p className="text-gray-600 dark:text-gray-300">Vergleich von über 20 Banken für die günstigsten Zinssätze.</p>
                </div>
                
                <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-500/30 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">100% Sicher</h4>
                  <p className="text-gray-600 dark:text-gray-300">Ihre Daten werden verschlüsselt übertragen und nicht gespeichert.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Econ Scripts */}
      <Script 
        src="https://europace.nc.econ-application.de/frontend/europace/assets/js/econ.js" 
        strategy="afterInteractive"
        onLoad={() => {
          // Prevent double initialization
          if (isInitialized) {
            console.log('Econ widget already initialized, skipping...');
            return;
          }
          
          // Initialize Econ after script is loaded
          try {
            if (typeof window !== 'undefined' && (window as any).econ) {
              // Clear any existing widget content
              const econContainer = document.getElementById('econ');
              if (econContainer) {
                // Remove any existing iframes or content
                const existingIframes = econContainer.querySelectorAll('iframe');
                existingIframes.forEach(iframe => iframe.remove());
              }
              
              (window as any).econ.initEcon('econ', 'https://europace.nc.econ-application.de/econ/process/LKJ98/kreditlead?epid_uv=XPS71', [], 0);
              setWidgetLoaded(true);
              setIsInitialized(true);
              console.log('Econ widget initialized successfully');
            }
          } catch (error) {
            console.error('Econ widget initialization failed:', error);
            setWidgetError(true);
          }
        }}
        onError={() => {
          console.error('Econ script failed to load');
          setWidgetError(true);
        }}
      />
      </div>
    </>
  )
}