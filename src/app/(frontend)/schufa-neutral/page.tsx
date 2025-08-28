'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '@/components/UnverbindlichAnfragenButton'

const SchufaNeutralPage = () => {
  const [loanAmount, setLoanAmount] = useState(10000)
  const [loanTerm, setLoanTerm] = useState(36)

  // Calculate loan with higher interest rate for SCHUFA-neutral loans
  const calculateLoan = () => {
    const amount = loanAmount
    const months = loanTerm
    const yearlyRate = 0.0799 // 7.99% for SCHUFA-neutral loans
    const monthlyRate = yearlyRate / 12
    const payment = amount * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
    const total = payment * months
    
    return {
      monthlyPayment: payment.toFixed(2),
      totalCost: total.toFixed(2),
      effectiveRate: (yearlyRate * 100).toFixed(2)
    }
  }

  const loanCalculation = calculateLoan()

  const vorteile = [
    {
      icon: "ri-shield-check-line",
      title: "SCHUFA-unabhängige Prüfung",
      description: "Wir arbeiten mit Banken zusammen, die alternative Bonitätskriterien berücksichtigen und nicht nur auf den SCHUFA-Score schauen."
    },
    {
      icon: "ri-money-euro-box-line",
      title: "Flexible Kreditbeträge",
      description: "Kreditsummen von 1.000 € bis 50.000 € möglich - angepasst an Ihre individuelle finanzielle Situation."
    },
    {
      icon: "ri-timer-line",
      title: "Schnelle Auszahlung",
      description: "Nach positiver Prüfung erfolgt die Auszahlung bei vielen Banken innerhalb von 24 Stunden."
    }
  ]

  const faqData = [
    {
      question: "Was bedeutet 'Kredit trotz SCHUFA'?",
      answer: "Ein Kredit trotz SCHUFA bedeutet, dass die Bank bei der Kreditvergabe nicht ausschließlich auf den SCHUFA-Score schaut, sondern auch andere Faktoren wie Ihr aktuelles Einkommen berücksichtigt."
    },
    {
      question: "Welche Voraussetzungen muss ich erfüllen?",
      answer: "Sie benötigen ein regelmäßiges Einkommen, einen festen Wohnsitz in Deutschland und müssen volljährig sein. Die genauen Voraussetzungen können je nach Bank variieren."
    },
    {
      question: "Sind die Zinsen höher als bei normalen Krediten?",
      answer: "Ja, aufgrund des höheren Risikos für die Bank sind die Zinssätze bei SCHUFA-neutralen Krediten in der Regel etwas höher als bei herkömmlichen Krediten."
    },
    {
      question: "Wie schnell erhalte ich eine Zusage?",
      answer: "Bei vollständigen Unterlagen erhalten Sie meist innerhalb von 24-48 Stunden eine Rückmeldung. Bei positiver Entscheidung erfolgt die Auszahlung oft am nächsten Werktag."
    }
  ]

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="font-sans text-gray-800 bg-white">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-green-100">
        <div 
          className="absolute inset-0 bg-right bg-no-repeat bg-contain opacity-20" 
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=professional%20modern%20office%20environment%20with%20financial%20documents%20and%20calculator%20on%20desk%2C%20soft%20natural%20lighting%2C%20minimalist%20design%20with%20green%20accents%2C%20blurred%20background%20showing%20financial%20success%20and%20stability&width=1280&height=720&seq=hero1&orientation=landscape')"
          }}
        ></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Kredit trotz negativer SCHUFA</h1>
            <p className="text-xl text-gray-700 mb-8">
              Auch mit einer negativen SCHUFA-Bewertung haben Sie Chancen auf einen Kredit. Wir zeigen Ihnen die besten Möglichkeiten und unterstützen Sie bei der Antragstellung.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="#kreditrechner" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
              >
                <span>Jetzt Kredit berechnen</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <UnverbindlichAnfragenButton variant="secondary" size="md" className="py-3 px-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {vorteile.map((vorteil, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className={vorteil.icon}></i>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{vorteil.title}</h3>
                <p className="text-gray-600">{vorteil.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kreditrechner */}
      <section id="kreditrechner" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">SCHUFA-neutraler Kreditrechner</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Berechnen Sie Ihre möglichen Kreditkonditionen auch bei negativer SCHUFA-Bewertung.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Kreditsumme</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        min="1000" 
                        max="50000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">€</div>
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
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1.000 €</span>
                      <span>50.000 €</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Laufzeit</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                        min="12" 
                        max="84"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">Monate</div>
                    </div>
                    <input 
                      type="range" 
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      min="12" 
                      max="84" 
                      step="6" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>12 Monate</span>
                      <span>84 Monate</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Ihre Kreditkonditionen</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monatliche Rate:</span>
                      <span className="font-semibold text-lg">{loanCalculation.monthlyPayment} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Effektiver Jahreszins:</span>
                      <span className="font-semibold">{loanCalculation.effectiveRate} %</span>
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
                      Jetzt Kredit beantragen
                    </Link>
                    <p className="text-xs text-gray-500 mt-4 text-center">100% kostenlos & unverbindlich</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen zu Krediten trotz negativer SCHUFA.
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
            <h2 className="text-3xl font-bold mb-4">Bereit für Ihren SCHUFA-neutralen Kredit?</h2>
            <p className="text-gray-600 text-lg mb-8">
              Lassen Sie sich kostenlos beraten und finden Sie die beste Finanzierungslösung für Ihre Situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#kreditrechner" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
              >
                <span>Jetzt berechnen</span>
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
                <span>Kostenlose Beratung</span>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">100% kostenlos</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">Diskrete Abwicklung</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">Schnelle Zusage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-['Pacifico'] text-primary mb-4">Kreditheld24</h3>
              <p className="text-gray-300 mb-4">
                Ihr Spezialist für Kredite auch bei negativer SCHUFA - schnell, diskret und zuverlässig.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-primary">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-facebook-fill"></i>
                  </div>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-twitter-fill"></i>
                  </div>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-instagram-fill"></i>
                  </div>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Kreditarten</h4>
              <ul className="space-y-2">
                <li><Link href="/ratenkredite" className="text-gray-300 hover:text-primary">Ratenkredit</Link></li>
                <li><Link href="/umschuldung" className="text-gray-300 hover:text-primary">Umschuldung</Link></li>
                <li><Link href="/autokredit" className="text-gray-300 hover:text-primary">Autokredit</Link></li>
                <li><Link href="/sofortkredit" className="text-gray-300 hover:text-primary">Sofortkredit</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Service</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-300 hover:text-primary">FAQ</Link></li>
                <li><Link href="/kontakt" className="text-gray-300 hover:text-primary">Kontakt</Link></li>
                <li><Link href="/ueber-uns" className="text-gray-300 hover:text-primary">Über uns</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-primary">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Kontakt</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                    <i className="ri-phone-line"></i>
                  </div>
                  <span>0800 123 456 789</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                    <i className="ri-mail-line"></i>
                  </div>
                  <span>info@kreditheld24.de</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row md:justify-between">
              <p className="text-sm text-gray-400">&copy; 2025 Kreditheld24. Alle Rechte vorbehalten.</p>
              <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                <Link href="/impressum" className="text-sm text-gray-400 hover:text-primary">Impressum</Link>
                <Link href="/datenschutz" className="text-sm text-gray-400 hover:text-primary">Datenschutz</Link>
                <Link href="/agb" className="text-sm text-gray-400 hover:text-primary">AGB</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SchufaNeutralPage