'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '@/components/UnverbindlichAnfragenButton'

const BaufinanzierungPage = () => {
  const [immobilienpreis, setImmobilienpreis] = useState(350000)
  const [eigenkapital, setEigenkapital] = useState(70000)
  const [laufzeit, setLaufzeit] = useState(25)
  const [zinsbindung, setZinsbindung] = useState(10)

  // Berechnung der Baufinanzierung
  const calculateBaufinanzierung = () => {
    const darlehenssumme = immobilienpreis - eigenkapital
    const zinssatz = 0.035 // 3,5% Beispielzins
    const monatlicheRate = (darlehenssumme * (zinssatz / 12)) / (1 - Math.pow(1 + (zinssatz / 12), -(laufzeit * 12)))
    const gesamtkosten = monatlicheRate * laufzeit * 12
    
    return {
      darlehenssumme: darlehenssumme.toFixed(0),
      monatlicheRate: monatlicheRate.toFixed(2),
      zinssatz: (zinssatz * 100).toFixed(2),
      gesamtkosten: gesamtkosten.toFixed(0)
    }
  }

  const berechnung = calculateBaufinanzierung()

  const vorteile = [
    {
      icon: "ri-home-4-line",
      title: "Günstige Zinsen",
      description: "Profitieren Sie von historisch niedrigen Bauzinsen und sichern Sie sich langfristig günstige Konditionen."
    },
    {
      icon: "ri-shield-check-line",
      title: "Lange Zinsbindung",
      description: "Planungssicherheit durch Zinsbindungen von 5 bis 30 Jahren - schützen Sie sich vor Zinsänderungen."
    },
    {
      icon: "ri-calculator-line",
      title: "Flexible Tilgung",
      description: "Wählen Sie Ihre Tilgungsrate frei und nutzen Sie Sondertilgungen für eine schnellere Entschuldung."
    },
    {
      icon: "ri-bank-line",
      title: "Über 400 Banken",
      description: "Wir vergleichen für Sie die Angebote von über 400 Banken und finden die beste Baufinanzierung."
    },
    {
      icon: "ri-user-heart-line",
      title: "Persönliche Beratung",
      description: "Unsere Experten beraten Sie kostenlos und unverbindlich zu allen Fragen der Baufinanzierung."
    },
    {
      icon: "ri-file-list-3-line",
      title: "Komplette Abwicklung",
      description: "Von der Beratung bis zur Auszahlung - wir begleiten Sie durch den gesamten Finanzierungsprozess."
    }
  ]

  const prozessSchritte = [
    {
      schritt: "1",
      title: "Kostenlose Beratung",
      description: "Vereinbaren Sie einen Termin mit unseren Baufinanzierungsexperten.",
      icon: "ri-customer-service-2-line"
    },
    {
      schritt: "2",
      title: "Finanzierungskonzept",
      description: "Wir erstellen ein individuelles Finanzierungskonzept für Ihr Vorhaben.",
      icon: "ri-file-text-line"
    },
    {
      schritt: "3",
      title: "Angebote vergleichen",
      description: "Vergleichen Sie die besten Angebote von über 400 Banken.",
      icon: "ri-scales-3-line"
    },
    {
      schritt: "4",
      title: "Antrag stellen",
      description: "Stellen Sie Ihren Antrag bei der Bank Ihrer Wahl.",
      icon: "ri-send-plane-line"
    }
  ]

  const faqData = [
    {
      question: "Wie viel Eigenkapital benötige ich?",
      answer: "Grundsätzlich sollten Sie mindestens 20% des Kaufpreises plus Nebenkosten als Eigenkapital mitbringen. Eine Vollfinanzierung ist möglich, aber mit höheren Zinsen verbunden."
    },
    {
      question: "Welche Nebenkosten fallen beim Immobilienkauf an?",
      answer: "Rechnen Sie mit etwa 10-15% des Kaufpreises für Nebenkosten: Grunderwerbsteuer (3,5-6,5%), Notar- und Grundbuchkosten (ca. 2%) sowie ggf. Maklercourtage (3-7%)."
    },
    {
      question: "Wie lange sollte die Zinsbindung sein?",
      answer: "Bei niedrigen Zinsen empfiehlt sich eine längere Zinsbindung von 15-20 Jahren. Bei höheren Zinsen kann eine kürzere Bindung von 5-10 Jahren sinnvoll sein."
    },
    {
      question: "Was ist eine Sondertilgung?",
      answer: "Sondertilgungen sind zusätzliche Zahlungen zur regulären Rate, mit denen Sie Ihr Darlehen schneller zurückzahlen können. Viele Banken gewähren 5-10% Sondertilgung pro Jahr kostenfrei."
    },
    {
      question: "Welche Unterlagen benötige ich?",
      answer: "Für die Baufinanzierung benötigen Sie: Einkommensnachweise, Selbstauskunft, Objektunterlagen, Eigenkapitalnachweis und bei Neubau die Baugenehmigung."
    }
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300">



      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] transition-colors duration-300">
        <div 
          className="absolute inset-0 bg-right bg-no-repeat bg-contain opacity-20 sm:opacity-40 md:opacity-60 lg:opacity-90" 
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=modern%20house%20architecture%20with%20beautiful%20garden%2C%20family%20home%20exterior%2C%20contemporary%20residential%20building%2C%20bright%20daylight%2C%20professional%20real%20estate%20photography%2C%20clean%20and%20inviting%20atmosphere&width=800&height=600&seq=baufinanzierung_hero&orientation=landscape')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-green-50/80 to-transparent sm:from-green-50/90 sm:via-green-50/70 md:from-green-50/80 md:via-green-50/60 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-transparent dark:sm:from-gray-900/90 dark:sm:via-gray-900/70 dark:md:from-gray-900/80 dark:md:via-gray-900/60"></div>
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10 flex items-center min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
          <div className="max-w-xl lg:max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Baufinanzierung zu Top-Konditionen
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Verwirklichen Sie Ihren Traum vom Eigenheim. Günstige Zinsen, flexible Tilgung und persönliche Beratung von über 400 Banken.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link 
                  href="#rechner" 
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base group"
                >
                  <span>Finanzierung berechnen</span>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
                <UnverbindlichAnfragenButton variant="secondary" size="md" className="py-3 sm:py-4 px-6 sm:px-8 text-sm sm:text-base" />
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
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Baufinanzierung Vorteile</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ihre Vorteile bei der Baufinanzierung</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Profitieren Sie von unserer langjährigen Erfahrung und unserem großen Netzwerk an Bankpartnern.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vorteile.map((vorteil, index) => {
              const isBlueCard = index === 1 || index === 3; // Alternating pattern
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

      {/* Baufinanzierungsrechner */}
      <section id="rechner" className="py-16 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-24 h-24 border border-primary rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Kostenloser Rechner</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Baufinanzierungsrechner</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Berechnen Sie Ihre individuelle Baufinanzierung und erhalten Sie einen ersten Überblick über Ihre monatliche Rate.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Immobilienpreis</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={immobilienpreis}
                        onChange={(e) => setImmobilienpreis(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="100000" 
                        max="2000000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={immobilienpreis}
                      onChange={(e) => setImmobilienpreis(Number(e.target.value))}
                      min="100000" 
                      max="2000000" 
                      step="10000" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>100.000 €</span>
                      <span>2.000.000 €</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Eigenkapital</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={eigenkapital}
                        onChange={(e) => setEigenkapital(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="0" 
                        max={immobilienpreis}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={eigenkapital}
                      onChange={(e) => setEigenkapital(Number(e.target.value))}
                      min="0" 
                      max={immobilienpreis} 
                      step="5000" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0 €</span>
                      <span>{immobilienpreis.toLocaleString()} €</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg transition-colors duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Ihre Finanzierung</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Darlehenssumme:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{Number(berechnung.darlehenssumme).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Monatliche Rate:</span>
                        <span className="font-semibold text-primary text-lg">{Number(berechnung.monatlicheRate).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Zinssatz (Beispiel):</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{berechnung.zinssatz} %</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600 dark:text-gray-300">Eigenkapitalanteil:</span>
                        <span className="font-bold text-primary">{((eigenkapital / immobilienpreis) * 100).toFixed(1)} %</span>
                      </div>
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
                      100% kostenlos & unverbindlich
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prozess */}
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
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Baufinanzierung Prozess</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">So läuft Ihre Baufinanzierung ab</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In vier einfachen Schritten zu Ihrer optimalen Baufinanzierung.
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
      <section className="py-16 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
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
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Häufige Fragen</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen rund um das Thema Baufinanzierung.
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bereit für Ihre Traumimmobilie?</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Lassen Sie sich kostenlos beraten und finden Sie die optimale Finanzierung für Ihr Eigenheim.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#rechner" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button transition-all flex items-center justify-center"
              >
                <span>Finanzierung berechnen</span>
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
                <span>Beratung anfordern</span>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">100% kostenlos</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Unverbindlich</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Über 400 Banken</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Persönliche Beratung</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default BaufinanzierungPage