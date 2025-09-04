'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '@/components/UnverbindlichAnfragenButton'

const PartnerprogrammPage = () => {
  const [partnerUmsatz, setPartnerUmsatz] = useState(50000)
  const [anzahlKunden, setAnzahlKunden] = useState(20)
  const [durchschnittKredit, setDurchschnittKredit] = useState(25000)

  // Berechnung der Partner-Provision
  const calculatePartnerProvision = () => {
    const provisionRate = 0.015 // 1,5% Provision
    const monatlicheVermittlungen = anzahlKunden
    const jahresVermittlungen = monatlicheVermittlungen * 12
    const jahresUmsatz = jahresVermittlungen * durchschnittKredit
    const jahresProvision = jahresUmsatz * provisionRate
    const monatlicheProvision = jahresProvision / 12
    
    return {
      monatlicheProvision: monatlicheProvision.toFixed(0),
      jahresProvision: jahresProvision.toFixed(0),
      jahresUmsatz: jahresUmsatz.toFixed(0),
      provisionRate: (provisionRate * 100).toFixed(1)
    }
  }

  const berechnung = calculatePartnerProvision()

  const vorteile = [
    {
      icon: "ri-money-euro-circle-line",
      title: "Attraktive Provisionen",
      description: "Bis zu 1,5% Provision auf vermittelte Kreditsummen mit transparenter und pünktlicher Auszahlung."
    },
    {
      icon: "ri-customer-service-2-line",
      title: "Persönlicher Support",
      description: "Dedicated Partner-Manager für optimale Betreuung und schnelle Bearbeitung Ihrer Anfragen."
    },
    {
      icon: "ri-shield-check-line",
      title: "Seriöser Partner",
      description: "Langjährige Erfahrung, transparente Prozesse und höchste Qualitätsstandards in der Kreditvermittlung."
    },
    {
      icon: "ri-tools-line",
      title: "Marketing-Support",
      description: "Professionelle Werbematerialien, Landing Pages und Marketing-Tools für Ihren Erfolg."
    },
    {
      icon: "ri-speed-line",
      title: "Schnelle Abwicklung",
      description: "Digitale Prozesse und kurze Bearbeitungszeiten für zufriedene Kunden und schnelle Provisionen."
    },
    {
      icon: "ri-team-line",
      title: "Exklusivität",
      description: "Gebietsschutz und exklusive Konditionen für etablierte Partner in definierten Regionen."
    }
  ]

  const leistungen = [
    {
      icon: "ri-bank-line",
      title: "Kreditvermittlung",
      description: "Ratenkredite, Autokredite, Umschuldungen",
      provision: "1,0 - 1,5%",
      features: ["Bis 100.000 € Kreditsumme", "Schnelle Zusagen", "Digitaler Antragsprozess"]
    },
    {
      icon: "ri-home-4-line",
      title: "Baufinanzierung",
      description: "Immobilienkredite, Anschlussfinanzierungen",
      provision: "0,8 - 1,2%",
      features: ["Bis 2 Mio. € Finanzierung", "400+ Bankpartner", "Persönliche Beratung"]
    }
  ]

  const prozessSchritte = [
    {
      schritt: "1",
      title: "Erstgespräch",
      description: "Kostenlose Beratung zu Ihren Möglichkeiten als Partner.",
      icon: "ri-calendar-line"
    },
    {
      schritt: "2",
      title: "Vertragsabschluss",
      description: "Individuelle Partnervereinbarung mit attraktiven Konditionen.",
      icon: "ri-contract-line"
    },
    {
      schritt: "3",
      title: "Onboarding",
      description: "Schulung, Materialien und Zugang zu unserem Partner-Portal.",
      icon: "ri-graduation-cap-line"
    },
    {
      schritt: "4",
      title: "Start",
      description: "Erste Vermittlungen und kontinuierlicher Support.",
      icon: "ri-rocket-line"
    }
  ]

  const faqData = [
    {
      question: "Welche Voraussetzungen muss ich als Partner erfüllen?",
      answer: "Sie benötigen eine Gewerbeanmeldung als Finanz- oder Versicherungsmakler, eine Berufshaftpflichtversicherung und idealerweise erste Erfahrungen in der Finanzberatung. Wir unterstützen auch Quereinsteiger."
    },
    {
      question: "Wie hoch sind die Provisionen und wann werden sie ausgezahlt?",
      answer: "Die Provisionen variieren je nach Produktbereich zwischen 0,5% und 2,5%. Die Auszahlung erfolgt monatlich nach Vertragsabschluss und Auszahlung des Kredits an den Kunden."
    },
    {
      question: "Welche Unterstützung erhalte ich als Partner?",
      answer: "Sie erhalten einen persönlichen Ansprechpartner, Schulungen, Marketing-Materialien, ein Partner-Portal mit Tracking-Tools und technischen Support für alle Fragen."
    },
    {
      question: "Gibt es Mindestabschlüsse oder Exklusivitätsklauseln?",
      answer: "Es gibt keine Mindestabschlüsse. Exklusivität bieten wir etablierten Partnern in definierten Gebieten an. Die Zusammenarbeit ist jederzeit mit einer Frist von 3 Monaten kündbar."
    },
    {
      question: "Wie funktioniert die Kundenbetreuung und wer ist Ansprechpartner?",
      answer: "Sie bleiben der Hauptansprechpartner für Ihre Kunden. Wir unterstützen Sie bei der Bearbeitung und stehen für Rückfragen zur Verfügung. Die Kundenbeziehung bleibt bei Ihnen."
    }
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    unternehmen: '',
    erfahrung: '',
    nachricht: ''
  })

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Hier würde die Formular-Logik implementiert werden
    console.log('Partner-Anfrage:', formData)
  }

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300">



      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] transition-colors duration-300">
        <div 
          className="absolute inset-0 bg-right bg-no-repeat bg-contain opacity-20 sm:opacity-40 md:opacity-60 lg:opacity-90" 
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=professional%20business%20partnership%20handshake%20modern%20office%2C%20financial%20advisors%20meeting%2C%20successful%20collaboration%2C%20bright%20corporate%20environment&width=800&height=600&seq=partner_hero&orientation=landscape')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/95 via-blue-50/80 to-transparent sm:from-blue-50/90 sm:via-blue-50/70 md:from-blue-50/80 md:via-blue-50/60 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-transparent dark:sm:from-gray-900/90 dark:sm:via-gray-900/70 dark:md:from-gray-900/80 dark:md:via-gray-900/60"></div>
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10 flex items-center min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
          <div className="max-w-xl lg:max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Partnerprogramm für Finanz- & Versicherungsmakler
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Erweitern Sie Ihr Portfolio und steigern Sie Ihre Einnahmen! Werden Sie Partner von Kreditheld24 und profitieren Sie von attraktiven Provisionen.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link 
                  href="#kontakt" 
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base group"
                >
                  <span>Erstgespräch vereinbaren</span>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
                <Link 
                  href="#rechner" 
                  className="border border-gray-300 dark:border-gray-600 hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button transition-all flex items-center justify-center text-sm sm:text-base"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex items-center justify-center">
                    <i className="ri-calculator-line"></i>
                  </div>
                  <span>Provision berechnen</span>
                </Link>
              </div>
            </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ihre Vorteile als Kreditheld24-Partner</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Profitieren Sie von unserer langjährigen Erfahrung und unserem starken Netzwerk in der Finanzbranche.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vorteile.map((vorteil, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-blue-600">
                    <i className={vorteil.icon}></i>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{vorteil.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{vorteil.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leistungen & Provisionen */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Unsere Leistungen & Ihre Provisionen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Vielfältige Produktpalette mit attraktiven Provisionssätzen für nachhaltigen Erfolg.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {leistungen.map((leistung, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-blue-600">
                    <i className={leistung.icon}></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{leistung.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{leistung.description}</p>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded mb-4">
                  <p className="text-green-700 dark:text-green-400 text-sm font-medium">Provision: {leistung.provision}</p>
                </div>
                <ul className="space-y-1">
                  {leistung.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-4 h-4 flex items-center justify-center text-blue-500 mr-2">
                        <i className="ri-check-line"></i>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provisions-Rechner */}
      <section id="rechner" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Provisions-Rechner</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Berechnen Sie Ihr Einkommenspotenzial als Kreditheld24-Partner.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Kunden pro Monat</label>
                    <div className="flex">
                      <button 
                        onClick={() => setAnzahlKunden(Math.max(1, anzahlKunden - 5))}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-l hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                      >
                        -
                      </button>
                      <div className="border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 px-4 py-2 text-center min-w-[80px] text-gray-900 dark:text-gray-100">
                        {anzahlKunden}
                      </div>
                      <button 
                        onClick={() => setAnzahlKunden(Math.min(100, anzahlKunden + 5))}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-r hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>1 Kunde</span>
                      <span>100 Kunden</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Durchschnittliche Kreditsumme</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={durchschnittKredit}
                        onChange={(e) => setDurchschnittKredit(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="5000" 
                        max="100000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={durchschnittKredit}
                      onChange={(e) => setDurchschnittKredit(Number(e.target.value))}
                      min="5000" 
                      max="100000" 
                      step="5000" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>5.000 €</span>
                      <span>100.000 €</span>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg transition-colors duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Ihr Einkommenspotenzial</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Kunden/Monat:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{anzahlKunden}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Ø Kreditsumme:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{durchschnittKredit.toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Provision:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{berechnung.provisionRate}%</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600 dark:text-gray-300">Monatlich:</span>
                        <span className="font-semibold text-primary text-lg">{Number(berechnung.monatlicheProvision).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Jährlich:</span>
                        <span className="font-bold text-green-600 text-xl">{Number(berechnung.jahresProvision).toLocaleString()} €</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link
                      href="#kontakt"
                      className="block w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button text-center transition-all"
                    >
                      Jetzt Partner werden
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                      Kostenlose Beratung & unverbindlich
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">So werden Sie unser Partner</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In vier einfachen Schritten zur erfolgreichen Partnerschaft.
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

      {/* Kontaktformular */}
      <section id="kontakt" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Erstgespräch vereinbaren</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Lassen Sie uns über Ihre Möglichkeiten als Partner sprechen. Wir freuen uns auf Sie!
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-300">
              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Vorname *</label>
                  <input 
                    type="text" 
                    name="vorname"
                    value={formData.vorname}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nachname *</label>
                  <input 
                    type="text" 
                    name="nachname"
                    value={formData.nachname}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">E-Mail *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Telefon *</label>
                  <input 
                    type="tel" 
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Unternehmen</label>
                  <input 
                    type="text" 
                    name="unternehmen"
                    value={formData.unternehmen}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Erfahrung</label>
                  <select 
                    name="erfahrung"
                    value={formData.erfahrung}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="neueinsteiger">Neueinsteiger</option>
                    <option value="1-3-jahre">1-3 Jahre</option>
                    <option value="3-5-jahre">3-5 Jahre</option>
                    <option value="5-plus-jahre">5+ Jahre</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nachricht</label>
                  <textarea 
                    name="nachricht"
                    value={formData.nachricht}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                    placeholder="Erzählen Sie uns von Ihren Zielen und Fragen..."
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button transition-all flex items-center justify-center"
                  >
                    <div className="w-5 h-5 mr-2 flex items-center justify-center">
                      <i className="ri-send-plane-line"></i>
                    </div>
                    Erstgespräch anfragen
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                    Wir melden uns innerhalb von 24 Stunden bei Ihnen
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen zur Partnerschaft mit Kreditheld24.
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bereit für eine erfolgreiche Partnerschaft?</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Starten Sie noch heute und profitieren Sie von attraktiven Provisionen und professionellem Support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#kontakt" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button transition-all flex items-center justify-center"
              >
                <span>Erstgespräch vereinbaren</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <Link 
                href="#rechner" 
                className="border border-gray-300 dark:border-gray-600 hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-3 px-8 rounded-button transition-all flex items-center justify-center"
              >
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <i className="ri-calculator-line"></i>
                </div>
                <span>Provision berechnen</span>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Kostenlose Partnerschaft</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Attraktive Provisionen</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Persönlicher Support</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Keine Mindestabschlüsse</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default PartnerprogrammPage