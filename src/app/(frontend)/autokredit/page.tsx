'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

const AutokreditPage = () => {
  const [vehiclePrice, setVehiclePrice] = useState(25000)
  const [downPayment, setDownPayment] = useState(5000)
  const [loanTerm, setLoanTerm] = useState(60)
  const [vehicleType, setVehicleType] = useState('gebrauchtwagen')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Calculate loan amount and monthly payment
  const calculateLoan = () => {
    const loanAmount = vehiclePrice - downPayment
    const interestRate = 0.0299 // 2.99% annual interest rate for Autokredit
    const monthlyInterestRate = interestRate / 12
    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
    const totalCost = monthlyPayment * loanTerm
    
    return {
      loanAmount: loanAmount.toFixed(2),
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
      question: "Was ist ein Autokredit?",
      answer: "Ein Autokredit ist ein zweckgebundenes Darlehen zur Finanzierung eines Fahrzeugs. Das Auto dient dabei als Sicherheit für die Bank. Dadurch sind die Zinsen oft günstiger als bei einem normalen Ratenkredit."
    },
    {
      question: "Kann ich auch Gebrauchtwagen finanzieren?",
      answer: "Ja, Sie können sowohl Neuwagen als auch Gebrauchtwagen finanzieren. Bei Gebrauchtwagen gibt es meist eine Altersgrenze (oft bis 8-10 Jahre) und eine Mindestlaufleistung."
    },
    {
      question: "Wie hoch sollte die Anzahlung sein?",
      answer: "Eine Anzahlung von 10-20% des Fahrzeugpreises ist empfehlenswert. Je höher die Anzahlung, desto niedriger die monatliche Rate und die Gesamtkosten des Kredits."
    },
    {
      question: "Wer ist Eigentümer des Fahrzeugs?",
      answer: "Bei einem Autokredit sind Sie sofort Eigentümer des Fahrzeugs. Die Bank erhält lediglich eine Sicherungsübereignung, die nach vollständiger Rückzahlung erlischt."
    },
    {
      question: "Kann ich den Autokredit vorzeitig ablösen?",
      answer: "Ja, eine vorzeitige Ablösung ist jederzeit möglich. Dabei kann eine Vorfälligkeitsentschädigung anfallen, die jedoch gesetzlich begrenzt ist."
    }
  ]

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-green-50 to-green-100 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
        <div 
          className="absolute inset-0 bg-right bg-no-repeat bg-contain opacity-20 sm:opacity-40 md:opacity-60 lg:opacity-90"
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=modern%2520luxury%2520car%2520with%2520soft%2520lighting%2520in%2520a%2520minimalist%2520showroom%2520with%2520light%2520green%2520background%252C%2520professional%2520product%2520photography%252C%2520clean%2520composition%252C%2520no%2520people%252C%2520high-end%2520automotive%2520photography%252C%2520elegant%2520atmosphere%252C%2520subtle%2520reflections%2520on%2520polished%2520floor&width=800&height=600&seq=autokredit123&orientation=landscape')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-green-50/80 to-transparent sm:from-green-50/90 sm:via-green-50/70 md:from-green-50/80 md:via-green-50/60"></div>
        <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10 flex items-center min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
              <span className="block sm:inline">Autokredit –</span>
              <span className="block text-primary mt-1 sm:mt-0 sm:ml-2">Günstige Finanzierung</span>
              <span className="block mt-1">für Ihren Traumwagen</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8 leading-relaxed">
              Finanzieren Sie Ihren Neuwagen oder Gebrauchtwagen zu attraktiven Konditionen – 100% kostenlos & SCHUFA-neutral vergleichen.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="#calculator"
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base group"
              >
                <span>Jetzt Autokredit berechnen</span>
                <div className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <Link
                href="#process"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button flex items-center justify-center transition-all text-sm sm:text-base group bg-white/90 hover:bg-primary"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex items-center justify-center">
                  <i className="ri-information-line"></i>
                </div>
                <span>Mehr erfahren</span>
              </Link>
            </div>
            
            {/* Mobile Trust Indicators */}
            <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-primary">
                    <i className="ri-shield-check-line"></i>
                  </div>
                </div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">100% sicher</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-primary">
                    <i className="ri-timer-line"></i>
                  </div>
                </div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">Schnelle Zusage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-primary">
                    <i className="ri-money-euro-circle-line"></i>
                  </div>
                </div>
                <span className="text-gray-700 font-medium text-sm sm:text-base">Kostenlos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Vorteile unserer Autokredite</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Profitieren Sie von günstigen Zinsen und flexiblen Konditionen für Ihre Fahrzeugfinanzierung.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-percent-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Günstige Zinsen</h3>
              <p className="text-gray-600">
                Profitieren Sie von attraktiven Zinssätzen ab 2,99% effektiv p.a. für Ihre Fahrzeugfinanzierung.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-car-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Neu- & Gebrauchtwagen</h3>
              <p className="text-gray-600">
                Finanzieren Sie sowohl Neuwagen als auch Gebrauchtwagen bis zu einem Alter von 8 Jahren.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-money-euro-box-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Flexible Anzahlung</h3>
              <p className="text-gray-600">
                Bestimmen Sie selbst die Höhe Ihrer Anzahlung und reduzieren Sie so Ihre monatliche Rate.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-calendar-check-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Laufzeiten bis 96 Monate</h3>
              <p className="text-gray-600">
                Wählen Sie Laufzeiten zwischen 12 und 96 Monaten für niedrige monatliche Raten.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-shield-check-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Sofortiges Eigentum</h3>
              <p className="text-gray-600">
                Sie werden sofort Eigentümer des Fahrzeugs und können es frei nutzen und versichern.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-timer-flash-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Schnelle Auszahlung</h3>
              <p className="text-gray-600">
                Nach Zusage erhalten Sie das Geld innerhalb von 24-48 Stunden für Ihren Autokauf.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Autokredit-Rechner</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berechnen Sie Ihre monatliche Rate für Ihren Traumwagen und finden Sie die beste Finanzierung.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Fahrzeugpreis</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="5000"
                      max="100000"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      €
                    </div>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="100000"
                    step="1000"
                    value={vehiclePrice}
                    onChange={(e) => setVehiclePrice(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5.000 €</span>
                    <span>100.000 €</span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Anzahlung</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      min="0"
                      max={vehiclePrice}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      €
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={vehiclePrice}
                    step="500"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                     <span>0 €</span>
                     <span>{vehiclePrice} €</span>
                   </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Laufzeit</label>
                  <div className="relative">
                    <div className="flex">
                      <button
                        onClick={() => setLoanTerm(Math.max(12, loanTerm - 6))}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-l border border-gray-300 rounded-button whitespace-nowrap"
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
                        min="12"
                        max="96"
                      />
                      <button
                        onClick={() => setLoanTerm(Math.min(96, loanTerm + 6))}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-r border border-gray-300 rounded-button whitespace-nowrap"
                      >
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-add-line"></i>
                        </div>
                      </button>
                    </div>
                    <div className="absolute inset-y-0 right-12 flex items-center pr-3 pointer-events-none text-gray-500">
                      Monate
                    </div>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="96"
                    step="6"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>12 Monate</span>
                    <span>96 Monate</span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Fahrzeugtyp</label>
                  <div className="relative">
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full appearance-none border border-gray-300 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="neuwagen">Neuwagen</option>
                      <option value="gebrauchtwagen">Gebrauchtwagen</option>
                      <option value="jahreswagen">Jahreswagen</option>
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
                <h3 className="text-xl font-semibold mb-4">Ihre Finanzierungskonditionen</h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Kreditsumme:</span>
                    <span className="font-semibold">{loanCalculation.loanAmount} €</span>
                  </div>
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
                    <div className="h-2 bg-primary rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Bonitätsscore: Gut</span>
                    <span>85/100</span>
                  </div>
                </div>
                <Link
                  href="/kontakt"
                  className="block w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all text-center"
                >
                  Jetzt Autokredit beantragen
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
            <h2 className="text-3xl font-bold mb-4">So funktioniert Ihre Autofinanzierung</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In nur wenigen Schritten zu Ihrem Traumauto – schnell, sicher und transparent.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Fahrzeug auswählen</h3>
              <p className="text-gray-600">
                Wählen Sie Ihr Wunschfahrzeug beim Händler aus und lassen Sie sich ein Angebot erstellen.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Finanzierung berechnen</h3>
              <p className="text-gray-600">
                Nutzen Sie unseren Rechner und vergleichen Sie die besten Angebote von über 20 Banken.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Antrag stellen</h3>
              <p className="text-gray-600">
                Stellen Sie Ihren Kreditantrag online und legitimieren Sie sich per VideoIdent.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Auto kaufen</h3>
              <p className="text-gray-600">
                Nach der Zusage erhalten Sie das Geld und können Ihr Traumauto kaufen.
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
              Antworten auf die wichtigsten Fragen rund um Autokredite bei Kreditheld24.
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
          <h2 className="text-3xl font-bold mb-4">Bereit für Ihren Traumwagen?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Vergleichen Sie jetzt kostenlos die besten Autokredit-Angebote und fahren Sie schon bald Ihr Traumauto.
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

export default AutokreditPage