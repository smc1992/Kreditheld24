'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '@/components/UnverbindlichAnfragenButton'

const RatenkreditePage = () => {
  const [loanAmount, setLoanAmount] = useState(10000)
  const [loanTerm, setLoanTerm] = useState(60)
  const [loanPurpose, setLoanPurpose] = useState('freie_verwendung')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Calculate monthly rate and total cost
  const calculateLoan = () => {
    const interestRate = 0.0299 // 2.99% annual interest rate for Ratenkredite
    const monthlyInterestRate = interestRate / 12
    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
    const totalCost = monthlyPayment * loanTerm
    
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalCost: totalCost.toFixed(2),
      interestRate: '2,99'
    }
  }

  const loanCalculation = calculateLoan()

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqData = [
    {
      question: "Was ist ein Ratenkredit?",
      answer: "Ein Ratenkredit ist ein Darlehen, das Sie in gleichbleibenden monatlichen Raten zurückzahlen. Die Höhe der Rate und die Laufzeit werden bei Vertragsabschluss festgelegt. Ratenkredite eignen sich ideal für größere Anschaffungen wie Möbel, Elektronik oder Renovierungen."
    },
    {
      question: "Welche Voraussetzungen muss ich erfüllen?",
      answer: "Für einen Ratenkredit benötigen Sie: Volljährigkeit, Wohnsitz in Deutschland, regelmäßiges Einkommen, positive Bonität und ein deutsches Bankkonto. Die genauen Voraussetzungen können je nach Bank variieren."
    },
    {
      question: "Wie schnell erhalte ich das Geld?",
      answer: "Nach erfolgreicher Prüfung und Vertragsabschluss wird das Geld meist innerhalb von 24-48 Stunden auf Ihr Konto überwiesen. Bei digitalen Banken kann die Auszahlung sogar noch schneller erfolgen."
    },
    {
      question: "Kann ich den Kredit vorzeitig zurückzahlen?",
      answer: "Ja, bei den meisten unserer Partnerbanken können Sie Ihren Ratenkredit jederzeit ganz oder teilweise vorzeitig zurückzahlen. Oft ist dies sogar kostenfrei möglich oder gegen eine geringe Vorfälligkeitsentschädigung."
    },
    {
      question: "Ist die Anfrage wirklich SCHUFA-neutral?",
      answer: "Ja, unsere Kreditanfrage ist zu 100% SCHUFA-neutral. Wir führen nur eine Konditionsanfrage durch, die keinen Einfluss auf Ihren SCHUFA-Score hat. Erst bei einer konkreten Kreditbeantragung wird eine SCHUFA-Auskunft eingeholt."
    }
  ]

  return (
    <div className="font-sans text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] transition-colors duration-300">
        <div 
          className="absolute inset-0 bg-right bg-no-repeat bg-contain opacity-20 sm:opacity-40 md:opacity-60 lg:opacity-90"
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=modern%2520minimalist%2520office%2520interior%2520with%2520financial%2520advisor%2520desk%252C%2520soft%2520natural%2520lighting%252C%2520glass%2520walls%252C%2520subtle%2520green%2520plants%252C%2520sleek%2520computer%2520displays%2520showing%2520financial%2520charts%252C%2520clean%2520and%2520professional%2520atmosphere%252C%2520muted%2520color%2520palette%2520with%2520light%2520greens%2520and%2520whites&width=800&height=600&seq=ratenkredit789&orientation=landscape')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-green-50/80 to-transparent sm:from-green-50/90 sm:via-green-50/70 md:from-green-50/80 md:via-green-50/60"></div>
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10 flex items-center min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
          <div className="max-w-xl lg:max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 leading-tight mb-6">
                Ratenkredite zu <span className="text-primary">Top-Konditionen</span>
              </h1>
              <div className="h-1 w-24 bg-primary rounded mb-8"></div>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Flexible Laufzeiten, günstige Zinsen und schnelle Auszahlung – Ihr maßgeschneiderter Ratenkredit bei Kreditheld24.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="#calculator"
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base group"
                >
                  <span>Jetzt Ratenkredit berechnen</span>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
                <UnverbindlichAnfragenButton variant="secondary" size="md" className="py-3 sm:py-4 px-6 sm:px-8 text-sm sm:text-base" />
              </div>
              <div className="mt-12 flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center text-primary">
                      <i className="ri-shield-check-line"></i>
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium">100% sicher</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center text-primary">
                      <i className="ri-timer-line"></i>
                    </div>
                  </div>
                  <span className="text-gray-700 font-medium">Schnelle Zusage</span>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vorteile unserer Ratenkredite</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Bei Kreditheld24 finden Sie den passenden Ratenkredit zu attraktiven Konditionen – maßgeschneidert für Ihre Bedürfnisse.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-percent-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Attraktive Zinsen</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Profitieren Sie von günstigen Zinssätzen ab 2,99% effektiv p.a. durch unseren Bankenvergleich.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-calendar-check-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Flexible Laufzeiten</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Wählen Sie Laufzeiten zwischen 12 und 120 Monaten – ganz nach Ihren finanziellen Möglichkeiten.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-money-euro-box-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Kreditsummen bis 100.000 €</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Finanzieren Sie kleine Anschaffungen oder große Projekte mit Kreditsummen von 1.000 € bis 100.000 €.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-timer-flash-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Schnelle Auszahlung</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Erhalten Sie Ihr Geld innerhalb von 24 Stunden nach Vertragsabschluss auf Ihrem Konto.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-refund-2-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Kostenlose Sondertilgung</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Zahlen Sie Ihren Kredit jederzeit teilweise oder vollständig zurück – ohne zusätzliche Gebühren.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-shield-check-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">SCHUFA-neutrale Anfrage</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Unsere Vorabanfrage hat keinen Einfluss auf Ihren SCHUFA-Score – garantiert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ratenkredit-Rechner</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Berechnen Sie Ihre individuelle Monatsrate und finden Sie den passenden Ratenkredit für Ihre Bedürfnisse.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 max-w-4xl mx-auto transition-colors duration-300">
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
                      max="100000"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                      €
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="500"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>1.000 €</span>
                    <span>100.000 €</span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Laufzeit</label>
                  <div className="relative">
                    <div className="flex">
                      <button
                        onClick={() => setLoanTerm(Math.max(12, loanTerm - 6))}
                        className="bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-l border border-gray-300 dark:border-gray-600 rounded-button whitespace-nowrap transition-colors duration-300"
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-subtract-line"></i>
                        </div>
                      </button>
                      <input
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(Number(e.target.value))}
                        className="w-full border-y border-gray-300 dark:border-gray-600 py-3 px-4 text-center bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300"
                        min="12"
                        max="120"
                      />
                      <button
                        onClick={() => setLoanTerm(Math.min(120, loanTerm + 6))}
                        className="bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-r border border-gray-300 dark:border-gray-600 rounded-button whitespace-nowrap transition-colors duration-300"
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-add-line"></i>
                        </div>
                      </button>
                    </div>
                    <div className="absolute inset-y-0 right-12 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                      Monate
                    </div>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    step="6"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>12 Monate</span>
                    <span>120 Monate</span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Verwendungszweck</label>
                  <div className="relative">
                    <select
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                      className="w-full appearance-none border border-gray-300 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="freie_verwendung">Freie Verwendung</option>
                      <option value="auto">Autokauf</option>
                      <option value="umschuldung">Umschuldung</option>
                      <option value="renovierung">Renovierung</option>
                      <option value="moebel">Möbelkauf</option>
                      <option value="elektronik">Elektronik</option>
                      <option value="urlaub">Urlaub</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">Ihre Kreditkonditionen</h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Monatliche Rate:</span>
                    <span className="font-semibold text-lg">{loanCalculation.monthlyPayment} €</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Effektiver Jahreszins:</span>
                    <span className="font-semibold">{loanCalculation.interestRate} %</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Gesamtkosten:</span>
                    <span className="font-semibold">{loanCalculation.totalCost} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zinsbindung:</span>
                    <span className="font-semibold">Gesamte Laufzeit</span>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Bonitätsscore: Sehr gut</span>
                    <span>90/100</span>
                  </div>
                </div>
                <Link
                  href="/kontakt"
                  className="block w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all text-center"
                >
                  Jetzt Kreditangebote vergleichen
                </Link>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  100% kostenlos & SCHUFA-neutral
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">So einfach geht&apos;s</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In nur wenigen Schritten zu Ihrem Ratenkredit – schnell, sicher und transparent.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Kreditwunsch eingeben</h3>
              <p className="text-gray-600">
                Geben Sie Ihre gewünschte Kreditsumme und Laufzeit in unseren Rechner ein.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Angebote vergleichen</h3>
              <p className="text-gray-600">
                Vergleichen Sie die besten Angebote von über 20 Banken und wählen Sie das passende aus.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Antrag stellen</h3>
              <p className="text-gray-600">
                Füllen Sie den Kreditantrag online aus und legitimieren Sie sich per VideoIdent.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Geld erhalten</h3>
              <p className="text-gray-600">
                Nach erfolgreicher Prüfung erhalten Sie das Geld innerhalb von 24 Stunden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen rund um Ratenkredite bei Kreditheld24.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {faqData.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className={`ri-${openFaq === index ? 'subtract' : 'add'}-line`}></i>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="bg-white px-6 pb-6 rounded-b-lg shadow-sm">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für Ihren Ratenkredit?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Vergleichen Sie jetzt kostenlos die besten Angebote und sparen Sie bares Geld.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#calculator"
              className="bg-white text-primary hover:bg-gray-100 font-medium py-3 px-8 rounded-button shadow-md transition-all inline-flex items-center justify-center"
            >
              <span>Jetzt vergleichen</span>
              <div className="w-5 h-5 ml-2 flex items-center justify-center">
                <i className="ri-arrow-right-line"></i>
              </div>
            </Link>
            <Link
              href="/kontakt"
              className="border-2 border-white text-white hover:bg-white hover:text-primary font-medium py-3 px-8 rounded-button transition-all inline-flex items-center justify-center"
            >
              <div className="w-5 h-5 mr-2 flex items-center justify-center">
                <i className="ri-customer-service-2-line"></i>
              </div>
              <span>Beratung anfordern</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RatenkreditePage