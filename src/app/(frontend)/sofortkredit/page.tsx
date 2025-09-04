'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '@/components/UnverbindlichAnfragenButton'

const SofortkreditPage = () => {
  const [loanAmount, setLoanAmount] = useState(15000)
  const [loanTerm, setLoanTerm] = useState(48)

  // Calculate loan with competitive rates for instant credit
  const calculateLoan = () => {
    const amount = loanAmount
    const term = loanTerm
    const rate = 0.0399 // 3.99% for instant credit
    const monthlyInterestRate = rate / 12
    const monthlyPayment = amount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term)) / (Math.pow(1 + monthlyInterestRate, term) - 1)
    const totalPayment = monthlyPayment * term
    
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      interestRate: (rate * 100).toFixed(2),
      totalCost: totalPayment.toFixed(2)
    }
  }

  const loanCalculation = calculateLoan()

  const vorteile = [
    {
      icon: "ri-flashlight-line",
      title: "Sofortige Zusage",
      description: "Erhalten Sie innerhalb weniger Minuten eine verbindliche Kreditentscheidung - 24/7 verfügbar."
    },
    {
      icon: "ri-time-line",
      title: "24h Auszahlung",
      description: "Bei positiver Entscheidung erfolgt die Auszahlung bereits am nächsten Werktag auf Ihr Konto."
    },
    {
      icon: "ri-smartphone-line",
      title: "100% Online",
      description: "Komplette Abwicklung online - keine Papierformulare, kein Postversand, keine Wartezeiten."
    },
    {
      icon: "ri-shield-check-line",
      title: "Sicher & Diskret",
      description: "Höchste Sicherheitsstandards und absolute Diskretion bei der Bearbeitung Ihrer Anfrage."
    },
    {
      icon: "ri-money-euro-circle-line",
      title: "Flexible Beträge",
      description: "Kreditsummen von 1.000 € bis 50.000 € - genau passend zu Ihrem Finanzierungsbedarf."
    },
    {
      icon: "ri-file-list-3-line",
      title: "Minimale Unterlagen",
      description: "Nur wenige Dokumente erforderlich - Upload direkt über unsere sichere Plattform."
    }
  ]

  const prozessSchritte = [
    {
      schritt: "1",
      title: "Antrag stellen",
      description: "Füllen Sie unser Online-Formular in nur 3 Minuten aus.",
      icon: "ri-edit-line"
    },
    {
      schritt: "2",
      title: "Sofortige Prüfung",
      description: "Automatische Bonitätsprüfung und sofortige Kreditentscheidung.",
      icon: "ri-search-line"
    },
    {
      schritt: "3",
      title: "Unterlagen hochladen",
      description: "Laden Sie die erforderlichen Dokumente sicher hoch.",
      icon: "ri-upload-line"
    },
    {
      schritt: "4",
      title: "Geld erhalten",
      description: "Auszahlung innerhalb von 24 Stunden auf Ihr Konto.",
      icon: "ri-bank-line"
    }
  ]

  const faqData = [
    {
      question: "Wie schnell erhalte ich wirklich mein Geld?",
      answer: "Bei vollständigen Unterlagen und positiver Bonitätsprüfung erfolgt die Auszahlung innerhalb von 24 Stunden. In den meisten Fällen ist das Geld bereits am nächsten Werktag auf Ihrem Konto."
    },
    {
      question: "Welche Unterlagen benötige ich?",
      answer: "Sie benötigen lediglich einen gültigen Personalausweis, Einkommensnachweise der letzten 2 Monate und aktuelle Kontoauszüge. Alle Dokumente können Sie bequem online hochladen."
    },
    {
      question: "Ist die Online-Beantragung sicher?",
      answer: "Ja, wir verwenden modernste Verschlüsselungstechnologien und sind nach höchsten Sicherheitsstandards zertifiziert. Ihre Daten sind bei uns absolut sicher."
    },
    {
      question: "Kann ich den Kredit vorzeitig zurückzahlen?",
      answer: "Ja, Sie können Ihren Sofortkredit jederzeit kostenfrei ganz oder teilweise vorzeitig zurückzahlen. Dadurch sparen Sie Zinsen."
    },
    {
      question: "Welche Voraussetzungen muss ich erfüllen?",
      answer: "Sie müssen mindestens 18 Jahre alt sein, einen festen Wohnsitz in Deutschland haben und über ein regelmäßiges Einkommen verfügen. Eine positive Bonität ist erforderlich."
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
            backgroundImage: "url('https://readdy.ai/api/search-image?query=modern%20minimalist%20financial%20office%20environment%20with%20soft%20natural%20lighting%2C%20clean%20workspace%20with%20digital%20displays%20showing%20financial%20data%2C%20contemporary%20professional%20setting%20with%20green%20accent%20colors%2C%20abstract%20geometric%20patterns%20in%20background%2C%20no%20people%20visible%2C%20professional%20and%20trustworthy%20atmosphere&width=800&height=600&seq=sofortkredit_hero&orientation=landscape')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-green-50/80 to-transparent sm:from-green-50/90 sm:via-green-50/70 md:from-green-50/80 md:via-green-50/60 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-transparent dark:sm:from-gray-900/90 dark:sm:via-gray-900/70 dark:md:from-gray-900/80 dark:md:via-gray-900/60"></div>
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10 flex items-center min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
          <div className="max-w-xl lg:max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Sofortkredit mit Auszahlung in 24 Stunden
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Schnelle und unkomplizierte Finanzierung für dringende Vorhaben. 100% online, minimaler Aufwand, maximale Flexibilität.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link 
                  href="#calculator" 
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base group"
                >
                  <span>Jetzt Sofortkredit berechnen</span>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ihre Vorteile beim Sofortkredit</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Profitieren Sie von unserer schnellen und unkomplizierten Online-Kreditabwicklung.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vorteile.map((vorteil, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
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

      {/* Kreditrechner */}
      <section id="calculator" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Sofortkredit-Rechner</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Berechnen Sie Ihre individuellen Kreditkonditionen und erhalten Sie sofort eine Entscheidung.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Kreditsumme</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="1000" 
                        max="50000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      min="1000" 
                      max="50000" 
                      step="500" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>1.000 €</span>
                      <span>50.000 €</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Laufzeit</label>
                    <div className="relative">
                      <div className="flex">
                        <button 
                          onClick={() => setLoanTerm(Math.max(6, loanTerm - 6))}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-l border border-gray-300"
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-subtract-line"></i>
                          </div>
                        </button>
                        <input 
                          type="number" 
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          className="w-full border-y border-gray-300 py-3 px-4 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                          min="6" 
                          max="84"
                        />
                        <button 
                          onClick={() => setLoanTerm(Math.min(84, loanTerm + 6))}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-r border border-gray-300"
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-add-line"></i>
                          </div>
                        </button>
                      </div>
                      <div className="absolute inset-y-0 right-12 flex items-center pr-3 pointer-events-none text-gray-500">Monate</div>
                    </div>
                    <input 
                      type="range" 
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      min="6" 
                      max="84" 
                      step="6" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>6 Monate</span>
                      <span>84 Monate</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Ihre Sofortkredit-Konditionen</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monatliche Rate:</span>
                      <span className="font-semibold text-lg">{loanCalculation.monthlyPayment} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effektiver Jahreszins:</span>
                      <span className="font-semibold">{loanCalculation.interestRate} %</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Gesamtkosten:</span>
                      <span className="font-bold text-primary text-lg">{loanCalculation.totalCost} €</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link 
                      href="/kontakt" 
                      className="block w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button text-center transition-all"
                    >
                      Jetzt Sofortkredit beantragen
                    </Link>
                    <p className="text-xs text-gray-500 mt-4 text-center">Sofortige Zusage • 24h Auszahlung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prozess */}
      <section id="prozess" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">So einfach geht&apos;s</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In nur 4 einfachen Schritten zu Ihrem Sofortkredit - schnell, sicher und unkompliziert.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {prozessSchritte.map((schritt, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 flex items-center justify-center text-white">
                      <i className={`${schritt.icon} ri-xl`}></i>
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {schritt.schritt}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">{schritt.title}</h3>
                <p className="text-gray-600 text-sm">{schritt.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen rund um Ihren Sofortkredit.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-6 py-4 font-medium flex justify-between items-center"
                  >
                    <span>{faq.question}</span>
                    <div className={`w-5 h-5 flex items-center justify-center text-primary transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 border-t border-gray-100">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Bereit für Ihren Sofortkredit?</h2>
            <p className="text-gray-600 text-lg mb-8">
              Starten Sie jetzt Ihre Anfrage und erhalten Sie innerhalb weniger Minuten eine Entscheidung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#calculator" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
              >
                <span>Jetzt beantragen</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <Link 
                href="/kontakt" 
                className="border border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-medium py-3 px-8 rounded-button whitespace-nowrap flex items-center justify-center transition-all"
              >
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <i className="ri-customer-service-2-line"></i>
                </div>
                <span>Persönliche Beratung</span>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">Sofortige Zusage</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">24h Auszahlung</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">100% Online</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">Kostenlos & unverbindlich</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default SofortkreditPage