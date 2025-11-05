'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '../../../components/UnverbindlichAnfragenButton'

const ImmobilienkreditPage = () => {
  const [kaufpreis, setKaufpreis] = useState(400000)
  const [eigenkapital, setEigenkapital] = useState(80000)
  const [laufzeit, setLaufzeit] = useState(30)
  const [tilgung, setTilgung] = useState(2)

  // Berechnung des Immobilienkredits
  const calculateImmobilienkredit = () => {
    const darlehenssumme = kaufpreis - eigenkapital
    const zinssatz = 0.034 // 3,4% Beispielzins für Immobilienkredit
    const tilgungsrate = tilgung / 100
    const gesamtrate = (zinssatz + tilgungsrate) / 12
    const monatlicheRate = darlehenssumme * gesamtrate
    const restschuld = darlehenssumme * Math.pow(1 + zinssatz/12, laufzeit*12) - monatlicheRate * ((Math.pow(1 + zinssatz/12, laufzeit*12) - 1) / (zinssatz/12))
    
    return {
      darlehenssumme: darlehenssumme.toFixed(0),
      monatlicheRate: monatlicheRate.toFixed(2),
      zinssatz: (zinssatz * 100).toFixed(2),
      restschuld: Math.max(0, restschuld).toFixed(0)
    }
  }

  const berechnung = calculateImmobilienkredit()

  const vorteile = [
    {
      icon: "ri-home-heart-line",
      title: "Traumimmobilie finanzieren",
      description: "Verwirklichen Sie Ihren Traum vom Eigenheim mit unserem maßgeschneiderten Immobilienkredit."
    },
    {
      icon: "ri-percent-line",
      title: "Niedrige Zinsen",
      description: "Profitieren Sie von attraktiven Zinssätzen und günstigen Konditionen für Ihre Immobilienfinanzierung."
    },
    {
      icon: "ri-time-line",
      title: "Lange Laufzeiten",
      description: "Flexible Laufzeiten bis zu 40 Jahren für niedrige monatliche Raten und optimale Planbarkeit."
    },
    {
      icon: "ri-shield-star-line",
      title: "Sichere Investition",
      description: "Immobilien als wertstabile Kapitalanlage und Schutz vor Inflation für Ihre Zukunft."
    },
    {
      icon: "ri-calculator-line",
      title: "Flexible Tilgung",
      description: "Wählen Sie Ihre Tilgungsrate und nutzen Sie Sondertilgungen für eine schnellere Entschuldung."
    },
    {
      icon: "ri-customer-service-2-line",
      title: "Expertenberatung",
      description: "Persönliche Beratung durch unsere Immobilienfinanzierungs-Experten von der ersten Idee bis zur Schlüsselübergabe."
    }
  ]

  const immobilienarten = [
    {
      icon: "ri-home-4-line",
      title: "Eigenheim",
      description: "Einfamilienhaus, Doppelhaushälfte oder Reihenhaus für die ganze Familie.",
      features: ["Garten und Privatsphäre", "Individuelle Gestaltung", "Langfristige Wertsteigerung"]
    },
    {
      icon: "ri-building-line",
      title: "Eigentumswohnung",
      description: "Wohnung in Mehrfamilienhaus oder Wohnanlage als Kapitalanlage oder Eigennutzung.",
      features: ["Zentrale Lage", "Geringere Nebenkosten", "Gute Verkehrsanbindung"]
    },
    {
      icon: "ri-hammer-line",
      title: "Neubau",
      description: "Finanzierung für den Bau Ihrer Traumimmobilie nach individuellen Wünschen.",
      features: ["Moderne Ausstattung", "Energieeffizient", "Keine Renovierungskosten"]
    },
    {
      icon: "ri-ancient-gate-line",
      title: "Bestandsimmobilie",
      description: "Kauf einer bereits bestehenden Immobilie mit Charme und Geschichte.",
      features: ["Sofort bezugsfertig", "Gewachsene Nachbarschaft", "Günstiger Kaufpreis"]
    }
  ]

  const prozessSchritte = [
    {
      schritt: "1",
      title: "Beratungstermin",
      description: "Kostenlose Erstberatung zu Ihren Finanzierungsmöglichkeiten.",
      icon: "ri-calendar-line"
    },
    {
      schritt: "2",
      title: "Finanzierungsplan",
      description: "Erstellung eines individuellen Finanzierungskonzepts.",
      icon: "ri-file-chart-line"
    },
    {
      schritt: "3",
      title: "Objektbewertung",
      description: "Professionelle Bewertung Ihrer Wunschimmobilie.",
      icon: "ri-search-eye-line"
    },
    {
      schritt: "4",
      title: "Kreditantrag",
      description: "Antragstellung bei der Bank mit den besten Konditionen.",
      icon: "ri-file-text-line"
    }
  ]

  const faqData = [
    {
      question: "Wie viel Eigenkapital benötige ich für einen Immobilienkredit?",
      answer: "Empfohlen werden mindestens 20% des Kaufpreises plus Nebenkosten (ca. 10-15%). Eine Vollfinanzierung ist möglich, führt aber zu höheren Zinsen und strengeren Bonitätsprüfungen."
    },
    {
      question: "Welche Nebenkosten fallen beim Immobilienkauf an?",
      answer: "Nebenkosten betragen etwa 10-15% des Kaufpreises: Grunderwerbsteuer (3,5-6,5%), Notar- und Grundbuchkosten (ca. 2%), Maklercourtage (0-7,14%) und ggf. Gutachterkosten."
    },
    {
      question: "Wie lange kann die Laufzeit eines Immobilienkredits sein?",
      answer: "Immobilienkredite haben typischerweise Laufzeiten von 15-40 Jahren. Längere Laufzeiten bedeuten niedrigere monatliche Raten, aber höhere Gesamtkosten durch mehr Zinszahlungen."
    },
    {
      question: "Was ist der Unterschied zwischen Sollzins und Effektivzins?",
      answer: "Der Sollzins ist der reine Kreditzins. Der Effektivzins beinhaltet zusätzlich alle Nebenkosten und ist daher höher. Er ermöglicht den Vergleich verschiedener Kreditangebote."
    },
    {
      question: "Kann ich meinen Immobilienkredit vorzeitig ablösen?",
      answer: "Ja, aber meist fällt eine Vorfälligkeitsentschädigung an. Nach 10 Jahren Zinsbindung haben Sie ein gesetzliches Sonderkündigungsrecht mit 6 Monaten Kündigungsfrist."
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
            backgroundImage: "url('/images/real-estate-new.webp')"
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-blue-50/80 to-transparent dark:from-gray-900/95 dark:via-gray-800/80 dark:to-transparent"></div>
        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <div className="max-w-xl md:max-w-2xl mx-auto md:mx-0">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Traumimmobilie finanzieren</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center md:text-left leading-tight">
              <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">Immobilienkredit</span> für Ihr Traumhaus
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 text-center md:text-left">
              Günstige Zinsen, flexible Laufzeiten und persönliche Beratung für den Kauf Ihrer Traumimmobilie. Jetzt Finanzierung berechnen!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="#rechner"
                className="group bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-medium py-4 px-8 rounded-button whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
              >
                <span>Immobilienkredit berechnen</span>
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
                  <i className="ri-home-heart-line"></i>
                </div>
                <span>Traumimmobilie</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-5 h-5 text-green-500 mr-2">
                  <i className="ri-percent-line"></i>
                </div>
                <span>Niedrige Zinsen</span>
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
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Immobilienkredit Vorteile</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vorteile unseres Immobilienkredits</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Profitieren Sie von unserer Expertise und finden Sie die optimale Finanzierung für Ihre Immobilie.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vorteile.map((vorteil, index) => {
              const isGreenCard = index === 0 || index === 2 || index === 4; // Alternating pattern
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

      {/* Immobilienarten */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Finanzierung für jede Immobilie</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Ob Eigenheim, Eigentumswohnung oder Kapitalanlage - wir finden die passende Finanzierung.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {immobilienarten.map((art, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className={art.icon}></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{art.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{art.description}</p>
                <ul className="space-y-1">
                  {art.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <div className="w-4 h-4 flex items-center justify-center text-primary mr-2">
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

      {/* Kreditrechner */}
      <section id="rechner" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Immobilienkredit-Rechner</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Berechnen Sie Ihre monatliche Rate und erhalten Sie einen ersten Überblick über Ihre Immobilienfinanzierung.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Kaufpreis der Immobilie</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={kaufpreis}
                        onChange={(e) => setKaufpreis(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="100000" 
                        max="3000000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={kaufpreis}
                      onChange={(e) => setKaufpreis(Number(e.target.value))}
                      min="100000" 
                      max="3000000" 
                      step="10000" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>100.000 €</span>
                      <span>3.000.000 €</span>
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
                        max={kaufpreis}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={eigenkapital}
                      onChange={(e) => setEigenkapital(Number(e.target.value))}
                      min="0" 
                      max={kaufpreis} 
                      step="5000" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>0 €</span>
                      <span>{kaufpreis.toLocaleString()} €</span>
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
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Tilgung:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{tilgung} %</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600 dark:text-gray-300">Eigenkapitalanteil:</span>
                        <span className="font-bold text-primary">{((eigenkapital / kaufpreis) * 100).toFixed(1)} %</span>
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
      <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
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
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Immobilienkredit Prozess</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">So läuft Ihr Immobilienkredit ab</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In vier einfachen Schritten zu Ihrer Immobilienfinanzierung.
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
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Häufige Fragen</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen rund um den Immobilienkredit.
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
              Lassen Sie sich kostenlos beraten und finden Sie den optimalen Immobilienkredit für Ihr Vorhaben.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#rechner" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button transition-all flex items-center justify-center"
              >
                <span>Kredit berechnen</span>
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
                <span className="text-gray-600 dark:text-gray-300">Günstige Zinsen</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Flexible Laufzeiten</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Persönliche Beratung</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Kostenlos & unverbindlich</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default ImmobilienkreditPage