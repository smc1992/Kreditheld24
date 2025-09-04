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
      icon: "ri-team-line",
      title: "Schulungen & Training",
      description: "Regelmäßige Weiterbildungen zu Produkten, Markt und Verkaufstechniken."
    },
    {
      icon: "ri-line-chart-line",
      title: "Transparentes Reporting",
      description: "Detaillierte Auswertungen und Statistiken über Ihre Vermittlungserfolge."
    }
  ]

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 text-white transition-colors duration-300 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border border-blue-300 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-blue-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-blue-200 rounded-full"></div>
          <div className="absolute top-20 right-20 w-20 h-20 border border-blue-300 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-white">Partnerprogramm</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Partnerprogramm für Finanz- & Versicherungsmakler
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Erweitern Sie Ihr Portfolio und steigern Sie Ihre Einnahmen! Werden Sie Partner von Kreditheld24 und profitieren Sie von attraktiven Provisionen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#kontakt" 
                className="bg-white hover:bg-gray-100 text-blue-700 font-medium py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center group"
              >
                <span>Erstgespräch vereinbaren</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <Link 
                href="#rechner" 
                className="border border-white/30 hover:border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-xl transition-all flex items-center justify-center"
              >
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <i className="ri-calculator-line"></i>
                </div>
                <span>Provision berechnen</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/10 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-green-500 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-blue-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Partner-Vorteile</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ihre Vorteile als Kreditheld24-Partner</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Profitieren Sie von unserer langjährigen Erfahrung und unserem starken Netzwerk in der Finanzbranche.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vorteile.map((vorteil, index) => {
              const isGreenCard = index % 2 === 1; // Alternating pattern
              return (
                <div key={index} className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${isGreenCard ? 'hover:border-green-500/30' : 'hover:border-blue-500/30'} transform hover:-translate-y-2 p-6`}>
                  <div className={`w-16 h-16 ${isGreenCard ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 text-green-600' : 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 text-blue-600'} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${vorteil.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{vorteil.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{vorteil.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Provisions-Rechner */}
      <section id="rechner" className="py-16 bg-gradient-to-br from-white via-green-50/10 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-green-500 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Provisions-Rechner</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Berechnen Sie Ihr Einkommenspotenzial</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Ermitteln Sie Ihre möglichen Einnahmen als Kreditheld24-Partner.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors duration-300">
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
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Durchschnittliche Kreditsumme</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={durchschnittKredit}
                        onChange={(e) => setDurchschnittKredit(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="5000" 
                        max="100000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl transition-colors duration-300">
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
                      className="block w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-xl text-center transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-blue-800 dark:to-blue-900 text-white transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border border-blue-300 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-blue-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-blue-200 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-white">Jetzt starten</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Bereit für eine erfolgreiche Partnerschaft?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Starten Sie noch heute und profitieren Sie von unserem bewährten Partnerprogramm.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#kontakt" 
                className="bg-white hover:bg-gray-100 text-blue-700 font-medium py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center group"
              >
                <span>Kostenlose Beratung</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <Link 
                href="/kontakt" 
                className="border border-white/30 hover:border-white text-white hover:bg-white/10 font-medium py-3 px-8 rounded-xl transition-all flex items-center justify-center"
              >
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <i className="ri-phone-line"></i>
                </div>
                <span>Direkt anrufen</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PartnerprogrammPage