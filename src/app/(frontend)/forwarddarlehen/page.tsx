'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '@/components/UnverbindlichAnfragenButton'

const ForwarddarlehenPage = () => {
  const [restschuld, setRestschuld] = useState(300000)
  const [vorlaufzeit, setVorlaufzeit] = useState(24)
  const [zinsbindung, setZinsbindung] = useState(15)
  const [aktuellerZins, setAktuellerZins] = useState(3.2)

  // Berechnung des Forward-Darlehens
  const calculateForwardDarlehen = () => {
    const forwardAufschlag = (vorlaufzeit / 12) * 0.02 // 0.02% pro Monat Vorlaufzeit
    const forwardZins = aktuellerZins + forwardAufschlag
    const monatlicheRate = (restschuld * (forwardZins / 100)) / 12
    const jahresrate = monatlicheRate * 12
    const gesamtkosten = jahresrate * zinsbindung
    
    return {
      forwardZins: forwardZins.toFixed(2),
      forwardAufschlag: forwardAufschlag.toFixed(2),
      monatlicheRate: monatlicheRate.toFixed(2),
      jahresrate: jahresrate.toFixed(0),
      gesamtkosten: gesamtkosten.toFixed(0)
    }
  }

  const berechnung = calculateForwardDarlehen()

  const vorteile = [
    {
      icon: "ri-shield-check-line",
      title: "Zinssicherheit",
      description: "Sichern Sie sich heute schon die aktuellen Zinsen für Ihre zukünftige Anschlussfinanzierung."
    },
    {
      icon: "ri-calendar-check-line",
      title: "Bis 5 Jahre im Voraus",
      description: "Forward-Darlehen können bis zu 60 Monate vor Ablauf der aktuellen Zinsbindung abgeschlossen werden."
    },
    {
      icon: "ri-line-chart-line",
      title: "Schutz vor Zinsanstieg",
      description: "Schützen Sie sich vor steigenden Zinsen und profitieren Sie von Planungssicherheit."
    },
    {
      icon: "ri-calculator-line",
      title: "Planbare Kosten",
      description: "Kalkulieren Sie Ihre zukünftigen Finanzierungskosten bereits heute exakt."
    },
    {
      icon: "ri-time-line",
      title: "Flexible Vorlaufzeit",
      description: "Wählen Sie den optimalen Zeitpunkt zwischen 12 und 60 Monaten im Voraus."
    },
    {
      icon: "ri-bank-line",
      title: "Bankenwechsel möglich",
      description: "Nutzen Sie die Gelegenheit für einen Bankenwechsel zu besseren Konditionen."
    }
  ]

  const zinsszenarien = [
    {
      szenario: "Zinsen steigen um 1%",
      aktuell: aktuellerZins,
      zukunft: aktuellerZins + 1,
      ersparnis: ((restschuld * 0.01) / 12 * 12 * zinsbindung).toFixed(0),
      farbe: "text-green-600"
    },
    {
      szenario: "Zinsen steigen um 2%",
      aktuell: aktuellerZins,
      zukunft: aktuellerZins + 2,
      ersparnis: ((restschuld * 0.02) / 12 * 12 * zinsbindung).toFixed(0),
      farbe: "text-green-700"
    },
    {
      szenario: "Zinsen fallen um 0,5%",
      aktuell: aktuellerZins,
      zukunft: aktuellerZins - 0.5,
      mehrkosten: ((restschuld * 0.005) / 12 * 12 * zinsbindung).toFixed(0),
      farbe: "text-red-600"
    }
  ]

  const prozessSchritte = [
    {
      schritt: "1",
      title: "Beratung",
      description: "Analyse Ihrer aktuellen Finanzierung und Zinsentwicklung.",
      icon: "ri-search-line"
    },
    {
      schritt: "2",
      title: "Antrag",
      description: "Antragstellung für das Forward-Darlehen bei der gewählten Bank.",
      icon: "ri-file-text-line"
    },
    {
      schritt: "3",
      title: "Zusage",
      description: "Zinssicherung durch verbindliche Darlehenszusage.",
      icon: "ri-shield-check-line"
    },
    {
      schritt: "4",
      title: "Abruf",
      description: "Abruf des Darlehens zum vereinbarten Zeitpunkt.",
      icon: "ri-calendar-event-line"
    }
  ]

  const faqData = [
    {
      question: "Was ist ein Forward-Darlehen?",
      answer: "Ein Forward-Darlehen ist ein Kredit, den Sie heute abschließen, aber erst in der Zukunft (12-60 Monate später) abrufen. So sichern Sie sich die heutigen Zinsen für Ihre spätere Anschlussfinanzierung."
    },
    {
      question: "Wie hoch ist der Forward-Aufschlag?",
      answer: "Der Forward-Aufschlag beträgt typischerweise 0,01-0,03% pro Monat Vorlaufzeit. Bei 24 Monaten Vorlaufzeit sind das etwa 0,24-0,72% Aufschlag auf den aktuellen Zinssatz."
    },
    {
      question: "Wann lohnt sich ein Forward-Darlehen?",
      answer: "Ein Forward-Darlehen lohnt sich, wenn Sie mit steigenden Zinsen rechnen. Der Forward-Aufschlag sollte niedriger sein als der erwartete Zinsanstieg."
    },
    {
      question: "Kann ich das Forward-Darlehen kündigen?",
      answer: "Forward-Darlehen sind bindend. Eine Kündigung ist nur gegen Zahlung einer Vorfälligkeitsentschädigung möglich. Daher sollten Sie die Entscheidung gut durchdenken."
    },
    {
      question: "Welche Unterlagen benötige ich?",
      answer: "Sie benötigen aktuelle Einkommensnachweise, eine Selbstauskunft, Unterlagen zur Immobilie und den aktuellen Darlehensvertrag mit Restschuldnachweis."
    }
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300">



      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] transition-colors duration-300">
        <div 
          className="absolute inset-0 bg-right bg-no-repeat bg-contain opacity-20 sm:opacity-40 md:opacity-60 lg:opacity-90" 
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=financial%20planning%20future%20security%20charts%20graphs%2C%20interest%20rate%20protection%2C%20professional%20financial%20advisor%20office%2C%20modern%20workspace&width=800&height=600&seq=forward_hero&orientation=landscape')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-50/95 via-purple-50/80 to-transparent sm:from-purple-50/90 sm:via-purple-50/70 md:from-purple-50/80 md:via-purple-50/60 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-transparent dark:sm:from-gray-900/90 dark:sm:via-gray-900/70 dark:md:from-gray-900/80 dark:md:via-gray-900/60"></div>
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10 flex items-center min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
          <div className="max-w-xl lg:max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Forward-Darlehen: Zinsen heute sichern
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Schützen Sie sich vor steigenden Zinsen! Sichern Sie sich bereits heute günstige Konditionen für Ihre zukünftige Anschlussfinanzierung.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link 
                  href="#rechner" 
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base group"
                >
                  <span>Forward-Zins berechnen</span>
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
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vorteile des Forward-Darlehens</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sichern Sie sich Zinssicherheit und profitieren Sie von Planbarkeit für Ihre Zukunft.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vorteile.map((vorteil, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-purple-600">
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

      {/* Zinsszenarien */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Zinsszenarien im Vergleich</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sehen Sie, wie sich verschiedene Zinsentwicklungen auf Ihre Finanzierung auswirken würden.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-300">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-600">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Szenario</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Heute</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">In {vorlaufzeit} Monaten</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">Auswirkung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zinsszenarien.map((szenario, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-4 px-4 text-gray-900 dark:text-gray-100">{szenario.szenario}</td>
                        <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-300">{szenario.aktuell.toFixed(2)}%</td>
                        <td className="text-center py-4 px-4 text-gray-600 dark:text-gray-300">{szenario.zukunft.toFixed(2)}%</td>
                        <td className={`text-right py-4 px-4 font-semibold ${szenario.farbe}`}>
                          {szenario.ersparnis ? `+${Number(szenario.ersparnis).toLocaleString()} €` : `-${Number(szenario.mehrkosten).toLocaleString()} €`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  💡 <strong>Hinweis:</strong> Die Tabelle zeigt die Auswirkungen über {zinsbindung} Jahre Zinsbindung bei einer Restschuld von {restschuld.toLocaleString()} €.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forward-Rechner */}
      <section id="rechner" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Forward-Rechner</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Berechnen Sie Ihren Forward-Zins und die Kosten für Ihre Zinssicherung.
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
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Vorlaufzeit</label>
                    <div className="flex">
                      <button 
                        onClick={() => setVorlaufzeit(Math.max(12, vorlaufzeit - 6))}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-l hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                      >
                        -
                      </button>
                      <div className="border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 px-4 py-2 text-center min-w-[100px] text-gray-900 dark:text-gray-100">
                        {vorlaufzeit} Monate
                      </div>
                      <button 
                        onClick={() => setVorlaufzeit(Math.min(60, vorlaufzeit + 6))}
                        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-r hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>12 Monate</span>
                      <span>60 Monate</span>
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
                        max="8"
                        step="0.1"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">%</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg transition-colors duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Ihr Forward-Darlehen</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Aktueller Zinssatz:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{aktuellerZins.toFixed(2)} %</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Forward-Aufschlag:</span>
                        <span className="font-semibold text-orange-600">+{berechnung.forwardAufschlag} %</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600 dark:text-gray-300">Forward-Zinssatz:</span>
                        <span className="font-semibold text-primary text-lg">{berechnung.forwardZins} %</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Monatliche Rate:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{Number(berechnung.monatlicheRate).toLocaleString()} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Vorlaufzeit:</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{vorlaufzeit} Monate</span>
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
                      Unverbindliche Forward-Beratung
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">So funktioniert das Forward-Darlehen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In vier einfachen Schritten zu Ihrer Zinssicherung.
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
              Antworten auf die wichtigsten Fragen zum Forward-Darlehen.
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
      <section className="py-16 bg-purple-50 dark:bg-purple-900/20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bereit für Ihre Zinssicherung?</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Lassen Sie sich kostenlos beraten und sichern Sie sich die heutigen Zinsen für Ihre Zukunft.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#rechner" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button transition-all flex items-center justify-center"
              >
                <span>Forward-Zins berechnen</span>
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
                <span>Zinssicherung anfragen</span>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Bis 5 Jahre im Voraus</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Zinssicherheit</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Kostenlose Beratung</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600 dark:text-gray-300">Unverbindlich</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default ForwarddarlehenPage