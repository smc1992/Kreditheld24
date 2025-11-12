'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '../../../components/UnverbindlichAnfragenButton'

const AnschlussfinanzierungPage = () => {
  const [restschuld, setRestschuld] = useState(250000)
  const [aktuellerZins, setAktuellerZins] = useState(4.2)
  const [neuerZins, setNeuerZins] = useState(3.1)
  const [laufzeit, setLaufzeit] = useState(15)

  // Berechnung der Anschlussfinanzierung
  const calculateAnschlussfinanzierung = () => {
    const aktuelleRate = (restschuld * (aktuellerZins / 100)) / 12
    const neueRate = (restschuld * (neuerZins / 100)) / 12
    const ersparnis = aktuelleRate - neueRate
    const jahresersparnis = ersparnis * 12
    const gesamtersparnis = jahresersparnis * laufzeit
    
    return {
      aktuelleRate: aktuelleRate.toFixed(2),
      neueRate: neueRate.toFixed(2),
      ersparnis: ersparnis.toFixed(2),
      jahresersparnis: jahresersparnis.toFixed(0),
      gesamtersparnis: gesamtersparnis.toFixed(0)
    }
  }

  const berechnung = calculateAnschlussfinanzierung()

  const vorteile = [
    {
      icon: "ri-money-euro-circle-line",
      title: "Zinsen sparen",
      description: "Profitieren Sie von gesunkenen Zinsen und reduzieren Sie Ihre monatliche Belastung erheblich."
    },
    {
      icon: "ri-time-line",
      title: "Rechtzeitig planen",
      description: "Planen Sie Ihre Anschlussfinanzierung bereits 5 Jahre vor Ablauf der Zinsbindung."
    },
    {
      icon: "ri-shield-check-line",
      title: "Zinssicherheit",
      description: "Sichern Sie sich heute schon günstige Zinsen für die Zukunft mit einem Forward-Darlehen."
    },
    {
      icon: "ri-calculator-line",
      title: "Flexible Gestaltung",
      description: "Passen Sie Tilgungsrate und Laufzeit an Ihre aktuelle Lebenssituation an."
    },
    {
      icon: "ri-bank-line",
      title: "Bankenwechsel",
      description: "Wechseln Sie zu einer anderen Bank und profitieren Sie von besseren Konditionen."
    },
    {
      icon: "ri-customer-service-2-line",
      title: "Expertenberatung",
      description: "Unsere Spezialisten beraten Sie kostenlos zu allen Optionen Ihrer Anschlussfinanzierung."
    }
  ]

  const anschlussoptionen = [
    {
      icon: "ri-refresh-line",
      title: "Prolongation",
      description: "Verlängerung bei der aktuellen Bank",
      features: ["Einfache Abwicklung", "Keine neuen Unterlagen", "Schnelle Zusage"],
      nachteile: ["Oft nicht beste Konditionen", "Keine Verhandlungsmacht"]
    },
    {
      icon: "ri-exchange-line",
      title: "Umschuldung",
      description: "Wechsel zu einer anderen Bank",
      features: ["Bessere Zinsen möglich", "Neue Konditionen", "Verhandlungsspielraum"],
      nachteile: ["Mehr Aufwand", "Neue Bonitätsprüfung"]
    },
    {
      icon: "ri-calendar-check-line",
      title: "Forward-Darlehen",
      description: "Zinssicherung für die Zukunft",
      features: ["Zinssicherheit", "Bis 5 Jahre im Voraus", "Schutz vor Zinsanstieg"],
      nachteile: ["Forward-Aufschlag", "Bindung an Konditionen"]
    }
  ]

  const prozessSchritte = [
    {
      schritt: "1",
      title: "Analyse",
      description: "Prüfung Ihrer aktuellen Finanzierung und Restschuld.",
      icon: "ri-search-line"
    },
    {
      schritt: "2",
      title: "Vergleich",
      description: "Vergleich verschiedener Anschlussfinanzierungs-Optionen.",
      icon: "ri-scales-3-line"
    },
    {
      schritt: "3",
      title: "Beratung",
      description: "Persönliche Beratung zu den besten Konditionen.",
      icon: "ri-user-heart-line"
    },
    {
      schritt: "4",
      title: "Abschluss",
      description: "Abschluss der optimalen Anschlussfinanzierung.",
      icon: "ri-contract-line"
    }
  ]

  const faqData = [
    {
      question: "Wann sollte ich mich um die Anschlussfinanzierung kümmern?",
      answer: "Idealerweise sollten Sie sich bereits 12-18 Monate vor Ablauf der Zinsbindung um die Anschlussfinanzierung kümmern. So haben Sie genügend Zeit für Vergleiche und Verhandlungen."
    },
    {
      question: "Was ist ein Forward-Darlehen?",
      answer: "Ein Forward-Darlehen ermöglicht es Ihnen, sich bereits heute Zinsen für eine Anschlussfinanzierung in der Zukunft zu sichern. Dies ist bis zu 5 Jahre im Voraus möglich."
    },
    {
      question: "Kann ich bei der Anschlussfinanzierung die Bank wechseln?",
      answer: "Ja, Sie können frei wählen, ob Sie bei Ihrer aktuellen Bank bleiben oder zu einer anderen Bank wechseln. Ein Bankenwechsel kann oft bessere Konditionen bringen."
    },
    {
      question: "Welche Unterlagen benötige ich für die Anschlussfinanzierung?",
      answer: "Sie benötigen aktuelle Einkommensnachweise, eine Selbstauskunft, den aktuellen Darlehensvertrag und ggf. eine aktuelle Immobilienbewertung."
    },
    {
      question: "Was passiert, wenn ich nichts unternehme?",
      answer: "Wenn Sie nichts unternehmen, verlängert sich Ihr Darlehen automatisch zu den dann gültigen Konditionen Ihrer Bank. Diese sind oft nicht die günstigsten am Markt."
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
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-30"
          style={{
            backgroundImage: "url('/images/anschlussfinanzierung-hero-new.webp')"
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-blue-50/80 to-transparent dark:from-gray-900/95 dark:via-gray-800/80 dark:to-transparent"></div>
        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <div className="max-w-xl md:max-w-2xl mx-auto md:mx-0">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Zinsen sparen</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center md:text-left leading-tight">
              <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">Anschlussfinanzierung</span> mit Top-Zinsen
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 text-center md:text-left">
              Sparen Sie bei Ihrer Anschlussfinanzierung! Vergleichen Sie jetzt die besten Konditionen und sichern Sie sich günstige Zinsen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/kreditrechner"
                className="group bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-medium py-4 px-8 rounded-button whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
              >
                <span>Ersparnis berechnen</span>
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
                  <i className="ri-money-euro-circle-line"></i>
                </div>
                <span>Zinsen sparen</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-5 h-5 text-green-500 mr-2">
                  <i className="ri-time-line"></i>
                </div>
                <span>Rechtzeitig planen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
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
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Anschlussfinanzierung Vorteile</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vorteile der Anschlussfinanzierung</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Nutzen Sie die Chance auf bessere Konditionen und sparen Sie bei Ihrer Anschlussfinanzierung.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vorteile.map((vorteil, index) => {
              const isGreenCard = index === 1 || index === 3 || index === 5; // Alternating pattern
              return (
                <div key={index} className={`group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${isGreenCard ? 'hover:border-primary/30' : 'hover:border-blue-500/30'} transform hover:-translate-y-2`}>
                  <div className={`w-16 h-16 ${isGreenCard ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700' : 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700'} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 flex items-center justify-center ${isGreenCard ? 'text-primary' : 'text-blue-600'}`}>
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

      {/* Anschlussoptionen */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ihre Optionen für die Anschlussfinanzierung</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Wählen Sie die für Sie beste Option und profitieren Sie von optimalen Konditionen.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {anschlussoptionen.map((option, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-blue-600">
                    <i className={option.icon}></i>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{option.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{option.description}</p>
                <div className="mb-4">
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Vorteile:</h4>
                  <ul className="space-y-1">
                    {option.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-4 h-4 flex items-center justify-center text-green-500 mr-2">
                          <i className="ri-check-line"></i>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-2">Nachteile:</h4>
                  <ul className="space-y-1">
                    {option.nachteile.map((nachteil, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className="w-4 h-4 flex items-center justify-center text-orange-500 mr-2">
                          <i className="ri-close-line"></i>
                        </div>
                        {nachteil}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ersparnis-Rechner */}
      <section id="rechner" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ersparnis-Rechner</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Berechnen Sie Ihr Sparpotenzial bei der Anschlussfinanzierung.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Restschuld</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={restschuld}
                        onChange={(e) => setRestschuld(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="50000" 
                        max="1000000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={restschuld}
                      onChange={(e) => setRestschuld(Number(e.target.value))}
                      min="50000" 
                      max="1000000" 
                      step="10000" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>50.000 €</span>
                      <span>1.000.000 €</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Aktueller Zinssatz</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={aktuellerZins}
                        onChange={(e) => setAktuellerZins(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="1" 
                        max="10"
                        step="0.1"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">%</div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Neuer Zinssatz</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={neuerZins}
                        onChange={(e) => setNeuerZins(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="1" 
                        max="10"
                        step="0.1"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">%</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg transition-colors duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Ihre Ersparnis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Aktuelle Rate:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{Number(berechnung.aktuelleRate).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Neue Rate:</span>
                        <span className="font-semibold text-primary text-lg">{Number(berechnung.neueRate).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600 dark:text-gray-300">Monatliche Ersparnis:</span>
                        <span className="font-bold text-green-600 text-lg">{Number(berechnung.ersparnis).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Jährliche Ersparnis:</span>
                        <span className="font-bold text-green-600">{Number(berechnung.jahresersparnis).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Gesamtersparnis ({laufzeit} Jahre):</span>
                        <span className="font-bold text-green-600 text-xl">{Number(berechnung.gesamtersparnis).toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={{
                        pathname: '/umschuldung',
                        query: {
                          amount: restschuld,
                          currentInterest: aktuellerZins,
                          newInterest: neuerZins,
                          termYears: laufzeit,
                        },
                      }}
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
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">So läuft Ihre Anschlussfinanzierung ab</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In vier einfachen Schritten zu Ihrer optimalen Anschlussfinanzierung.
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
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen zur Anschlussfinanzierung.
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
      <section className="py-16 bg-blue-50 dark:bg-blue-900/20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bereit für Ihre Anschlussfinanzierung?</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Lassen Sie sich kostenlos beraten und sparen Sie bei Ihrer Anschlussfinanzierung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kreditrechner" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button transition-all flex items-center justify-center"
              >
                <span>Ersparnis berechnen</span>
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
                <span className="text-gray-600 dark:text-gray-300">Kostenloser Vergleich</span>
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
                <span className="text-gray-600 dark:text-gray-300">Expertenberatung</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Beste Konditionen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default AnschlussfinanzierungPage