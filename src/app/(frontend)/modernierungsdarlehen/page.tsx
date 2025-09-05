'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '@/components/UnverbindlichAnfragenButton'

const ModernierungsdarlehenPage = () => {
  const [modernierungssumme, setModernierungssumme] = useState(50000)
  const [laufzeit, setLaufzeit] = useState(10)
  const [verwendungszweck, setVerwendungszweck] = useState('energetisch')

  // Berechnung des Modernierungsdarlehens
  const calculateModernierungsdarlehen = () => {
    let zinssatz = 0.045 // 4,5% Basiszins
    
    // Zinsvergünstigung für energetische Modernisierung
    if (verwendungszweck === 'energetisch') {
      zinssatz = 0.035 // 3,5% für KfW-förderfähige Maßnahmen
    }
    
    const monatlicheRate = (modernierungssumme * (zinssatz / 12)) / (1 - Math.pow(1 + (zinssatz / 12), -(laufzeit * 12)))
    const gesamtkosten = monatlicheRate * laufzeit * 12
    const zinsen = gesamtkosten - modernierungssumme
    
    return {
      monatlicheRate: monatlicheRate.toFixed(2),
      zinssatz: (zinssatz * 100).toFixed(2),
      gesamtkosten: gesamtkosten.toFixed(0),
      zinsen: zinsen.toFixed(0)
    }
  }

  const berechnung = calculateModernierungsdarlehen()

  const vorteile = [
    {
      icon: "ri-home-gear-line",
      title: "Wertsteigerung",
      description: "Steigern Sie den Wert Ihrer Immobilie durch gezielte Modernisierungsmaßnahmen."
    },
    {
      icon: "ri-leaf-line",
      title: "Energieeffizienz",
      description: "Reduzieren Sie Ihre Energiekosten durch energetische Sanierung und profitieren Sie von Förderungen."
    },
    {
      icon: "ri-money-euro-circle-line",
      title: "Günstige Zinsen",
      description: "Profitieren Sie von attraktiven Zinssätzen, besonders bei energetischen Modernisierungen."
    },
    {
      icon: "ri-time-line",
      title: "Flexible Laufzeiten",
      description: "Wählen Sie Laufzeiten von 2 bis 20 Jahren und passen Sie die Rate an Ihr Budget an."
    },
    {
      icon: "ri-shield-check-line",
      title: "Ohne Grundschuld",
      description: "Modernierungsdarlehen bis 50.000 € oft ohne Grundschuldeintragung möglich."
    },
    {
      icon: "ri-gift-line",
      title: "KfW-Förderung",
      description: "Kombinieren Sie Ihr Darlehen mit KfW-Förderungen und Zuschüssen für maximale Ersparnis."
    }
  ]

  const modernierungsarten = [
    {
      icon: "ri-fire-line",
      title: "Heizung & Energie",
      description: "Neue Heizungsanlage, Wärmepumpe, Solarthermie",
      foerderung: "Bis zu 40% Zuschuss",
      beispiele: ["Wärmepumpe", "Pelletheizung", "Solaranlage", "Dämmung"]
    },
    {
      icon: "ri-window-line",
      title: "Fenster & Türen",
      description: "Neue Fenster, Türen, Rollläden für bessere Dämmung",
      foerderung: "Bis zu 20% Zuschuss",
      beispiele: ["3-fach Verglasung", "Haustür", "Rollläden", "Wintergarten"]
    },
    {
      icon: "ri-drop-line",
      title: "Bad & Sanitär",
      description: "Badsanierung, altersgerechter Umbau, neue Sanitäranlagen",
      foerderung: "Bis zu 12,5% Zuschuss",
      beispiele: ["Barrierefrei", "Dusche", "Fliesen", "Armaturen"]
    },
    {
      icon: "ri-hammer-line",
      title: "Dach & Fassade",
      description: "Dachsanierung, Fassadendämmung, Dachausbau",
      foerderung: "Bis zu 20% Zuschuss",
      beispiele: ["Dachdämmung", "Fassade", "Dachfenster", "Gauben"]
    }
  ]

  const prozessSchritte = [
    {
      schritt: "1",
      title: "Beratung",
      description: "Kostenlose Beratung zu Modernisierungsmöglichkeiten und Förderungen.",
      icon: "ri-customer-service-2-line"
    },
    {
      schritt: "2",
      title: "Planung",
      description: "Detailplanung der Maßnahmen und Kostenvoranschläge.",
      icon: "ri-draft-line"
    },
    {
      schritt: "3",
      title: "Finanzierung",
      description: "Optimale Finanzierung mit Darlehen und Förderungen.",
      icon: "ri-bank-card-line"
    },
    {
      schritt: "4",
      title: "Umsetzung",
      description: "Durchführung der Modernisierung mit qualifizierten Handwerkern.",
      icon: "ri-tools-line"
    }
  ]

  const faqData = [
    {
      question: "Bis zu welcher Summe ist ein Modernierungsdarlehen möglich?",
      answer: "Modernierungsdarlehen sind in der Regel bis zu 50.000 € ohne Grundschuldeintragung möglich. Für höhere Summen wird meist eine Grundschuld benötigt."
    },
    {
      question: "Welche KfW-Förderungen gibt es für Modernisierungen?",
      answer: "Die KfW bietet verschiedene Programme: KfW 261/262 für energetische Sanierung (bis 150.000 €), KfW 455-B für altersgerechtes Umbauen (bis 6.250 € Zuschuss) und weitere spezielle Programme."
    },
    {
      question: "Kann ich ein Modernierungsdarlehen mit KfW-Krediten kombinieren?",
      answer: "Ja, oft ist eine Kombination möglich und sinnvoll. KfW-Kredite haben sehr günstige Zinsen, decken aber nicht immer alle Kosten ab. Ein zusätzliches Modernierungsdarlehen kann die Finanzierungslücke schließen."
    },
    {
      question: "Welche Unterlagen benötige ich für ein Modernierungsdarlehen?",
      answer: "Sie benötigen Einkommensnachweise, Kostenvoranschläge der Handwerker, bei energetischen Maßnahmen ggf. einen Energieberater-Nachweis und Objektunterlagen Ihrer Immobilie."
    },
    {
      question: "Wie lange dauert die Bearbeitung eines Modernierungsdarlehens?",
      answer: "Die Bearbeitung dauert in der Regel 1-2 Wochen. Bei KfW-Anträgen kann es etwas länger dauern. Wichtig: KfW-Anträge müssen vor Beginn der Maßnahmen gestellt werden."
    }
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 overflow-hidden transition-colors duration-300">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-400/10 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <div 
          className="absolute inset-0 bg-right bg-no-repeat bg-cover md:bg-contain opacity-20 md:opacity-100"
          style={{
            backgroundImage: "url('/images/modernierungsdarlehen-hero.webp')"
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-blue-50/80 to-transparent dark:from-gray-900/95 dark:via-gray-800/80 dark:to-transparent"></div>
        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <div className="max-w-xl md:max-w-2xl mx-auto md:mx-0">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Mit KfW-Förderung</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center md:text-left leading-tight">
              <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">Modernierungsdarlehen</span> mit KfW-Förderung
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 text-center md:text-left">
              Modernisieren Sie Ihr Zuhause und sparen Sie Energie! Profitieren Sie von günstigen Zinsen und attraktiven KfW-Förderungen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="#rechner"
                className="group bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-medium py-4 px-8 rounded-button whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
              >
                <span>Modernierung berechnen</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <UnverbindlichAnfragenButton variant="secondary" size="md" className="backdrop-blur-sm" />
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 mt-8 justify-center md:justify-start">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-5 h-5 text-green-500 mr-2">
                  <i className="ri-shield-check-line"></i>
                </div>
                <span>100% kostenlos</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-5 h-5 text-green-500 mr-2">
                  <i className="ri-gift-line"></i>
                </div>
                <span>KfW-Förderung</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-5 h-5 text-green-500 mr-2">
                  <i className="ri-leaf-line"></i>
                </div>
                <span>Energieeffizient</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 bg-gradient-to-br from-white via-green-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-primary rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Modernierungsdarlehen Vorteile</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vorteile des Modernierungsdarlehens</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Investieren Sie in Ihr Zuhause und profitieren Sie von zahlreichen Vorteilen.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vorteile.map((vorteil, index) => {
              const isBlueCard = index === 1 || index === 3 || index === 5; // Alternating pattern
              return (
                <div key={index} className={`group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${isBlueCard ? 'hover:border-blue-500/30' : 'hover:border-primary/30'} transform hover:-translate-y-2`}>
                  <div className={`w-16 h-16 ${isBlueCard ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700' : 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700'} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 flex items-center justify-center ${isBlueCard ? 'text-blue-600' : 'text-primary'}`}>
                      <i className={`${vorteil.icon} text-2xl`}></i>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{vorteil.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{vorteil.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modernierungsarten */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Modernierungsmaßnahmen mit Förderung</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Entdecken Sie die verschiedenen Modernierungsmöglichkeiten und profitieren Sie von staatlichen Förderungen.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modernierungsarten.map((art, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-orange-600">
                    <i className={art.icon}></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{art.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{art.description}</p>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded mb-4">
                  <p className="text-green-700 dark:text-green-400 text-sm font-medium">{art.foerderung}</p>
                </div>
                <ul className="space-y-1">
                  {art.beispiele.map((beispiel, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-4 h-4 flex items-center justify-center text-orange-500 mr-2">
                        <i className="ri-check-line"></i>
                      </div>
                      {beispiel}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modernierungsrechner */}
      <section id="rechner" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Modernierungsrechner</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Berechnen Sie die Kosten Ihrer Modernisierung und entdecken Sie Ihre Finanzierungsmöglichkeiten.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Modernierungssumme</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={modernierungssumme}
                        onChange={(e) => setModernierungssumme(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="5000" 
                        max="150000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={modernierungssumme}
                      onChange={(e) => setModernierungssumme(Number(e.target.value))}
                      min="5000" 
                      max="150000" 
                      step="5000" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>5.000 €</span>
                      <span>150.000 €</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Verwendungszweck</label>
                    <select 
                      value={verwendungszweck}
                      onChange={(e) => setVerwendungszweck(e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300"
                    >
                      <option value="energetisch">Energetische Modernisierung</option>
                      <option value="bad">Bad & Sanitär</option>
                      <option value="dach">Dach & Fassade</option>
                      <option value="allgemein">Allgemeine Modernisierung</option>
                    </select>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Laufzeit</label>
                    <div className="flex">
                      <button 
                        onClick={() => setLaufzeit(Math.max(2, laufzeit - 1))}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-l hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                      >
                        -
                      </button>
                      <div className="border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 px-4 py-2 text-center min-w-[80px] text-gray-900 dark:text-gray-100">
                        {laufzeit} Jahre
                      </div>
                      <button 
                        onClick={() => setLaufzeit(Math.min(20, laufzeit + 1))}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-r hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>2 Jahre</span>
                      <span>20 Jahre</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg transition-colors duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Ihre Finanzierung</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Modernierungssumme:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{modernierungssumme.toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Monatliche Rate:</span>
                        <span className="font-semibold text-primary text-lg">{Number(berechnung.monatlicheRate).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Zinssatz:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{berechnung.zinssatz} %</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Gesamtkosten:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{Number(berechnung.gesamtkosten).toLocaleString()} €</span>
                      </div>
                      {verwendungszweck === 'energetisch' && (
                        <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded mt-4">
                          <p className="text-green-700 dark:text-green-400 text-sm font-medium">💡 KfW-Förderung möglich!</p>
                          <p className="text-green-600 dark:text-green-300 text-xs mt-1">Bis zu 40% Zuschuss oder günstigere KfW-Kredite</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="/kontakt"
                      className="block w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button text-center transition-all"
                    >
                      Kostenlose Beratung anfordern
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                      Inklusive KfW-Förderberatung
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prozess */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">So läuft Ihre Modernisierung ab</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Von der Planung bis zur Umsetzung - wir begleiten Sie bei jedem Schritt.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {prozessSchritte.map((schritt, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{schritt.schritt}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{schritt.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{schritt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gradient-to-br from-white via-blue-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-primary rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-blue-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Häufige Fragen</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen zum Modernierungsdarlehen.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="font-medium text-left text-gray-900 dark:text-gray-100">{faq.question}</span>
                    <div className="w-5 h-5 flex items-center justify-center text-primary">
                      <i className={openFaq === index ? "ri-subtract-line" : "ri-add-line"}></i>
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 bg-white dark:bg-gray-700">
                      <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 dark:from-green-900/20 dark:via-green-800/30 dark:to-green-900/20 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border border-green-400 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-green-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-300 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Jetzt starten</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bereit für Ihre Modernisierung?</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Lassen Sie sich kostenlos beraten und entdecken Sie alle Förderungsmöglichkeiten für Ihr Vorhaben.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#rechner" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button transition-all flex items-center justify-center"
              >
                <span>Modernierung berechnen</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <Link 
                href="/kontakt" 
                className="border border-gray-300 dark:border-gray-600 hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-3 px-8 rounded-button transition-all flex items-center justify-center"
              >
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <i className="ri-customer-service-2-line"></i>
                </div>
                <span>Förderberatung</span>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">KfW-Förderung</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Günstige Zinsen</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Ohne Grundschuld</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Kostenlose Beratung</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default ModernierungsdarlehenPage