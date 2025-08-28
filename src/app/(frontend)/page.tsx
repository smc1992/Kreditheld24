'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import UnverbindlichAnfragenButton from '@/components/UnverbindlichAnfragenButton'

const HomePage = () => {
  const [loanAmount, setLoanAmount] = useState(10000)
  const [loanTerm, setLoanTerm] = useState(60)
  const [loanPurpose, setLoanPurpose] = useState('freie_verwendung')
  const [showInfoModal, setShowInfoModal] = useState(false)

  // Calculate monthly rate and total cost
  const calculateLoan = () => {
    const interestRate = 0.0399 // 3.99% annual interest rate
    const monthlyInterestRate = interestRate / 12
    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) / (Math.pow(1 + monthlyInterestRate, loanTerm) - 1)
    const totalCost = monthlyPayment * loanTerm
    
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalCost: totalCost.toFixed(2),
      interestRate: '3,99'
    }
  }

  const loanCalculation = calculateLoan()

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-green-50 to-green-100 overflow-hidden">
        <div 
          className="absolute inset-0 bg-right bg-no-repeat bg-cover md:bg-contain opacity-20 md:opacity-100"
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=professional%20financial%20advisor%20or%20banker%20working%20with%20digital%20tablet%20in%20modern%20minimalist%20office%2C%20soft%20lighting%20with%20green%20accents%2C%20clean%20and%20simple%20composition%2C%20blurred%20background%20with%20financial%20charts%2C%20elegant%20and%20professional%20atmosphere&width=800&height=600&seq=hero123&orientation=landscape')"
          }}
        ></div>
        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <div className="max-w-xl md:max-w-2xl mx-auto md:mx-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 text-center md:text-left">
              Schnell zum besten Kredit – vergleichen lohnt sich
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-8 text-center md:text-left">
              Jetzt mit wenigen Klicks zu Ihrem Wunschkredit – 100% kostenlos & SCHUFA-neutral.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="#calculator"
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
              >
                <span>Jetzt Kredit berechnen</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <UnverbindlichAnfragenButton variant="secondary" size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 relative">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-close-line ri-lg"></i>
                </div>
              </button>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6">Warum Kreditheld24?</h3>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center text-primary">
                      <i className="ri-shield-check-line"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">SCHUFA-neutrale Anfrage</h4>
                    <p className="text-gray-600">Ihre Kreditanfrage hat keine Auswirkungen auf Ihren SCHUFA-Score.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center text-primary">
                      <i className="ri-bank-line"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">20+ Bankpartner</h4>
                    <p className="text-gray-600">Wir vergleichen die Angebote von über 20 renommierten Banken für Sie.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center text-primary">
                      <i className="ri-money-euro-box-line"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">100% kostenlos</h4>
                    <p className="text-gray-600">Unser Vergleichsservice ist für Sie völlig kostenfrei und unverbindlich.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center text-primary">
                      <i className="ri-timer-flash-line"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Schnelle Auszahlung</h4>
                    <p className="text-gray-600">Nach Zusage erhalten Sie Ihr Geld innerhalb von 24 Stunden.</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold mb-4">So funktioniert&apos;s:</h4>
                <div className="flex mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <span className="text-primary font-medium">1</span>
                  </div>
                  <p className="text-gray-600">Geben Sie Ihre Wunschkonditionen ein und starten Sie die kostenlose Anfrage</p>
                </div>
                <div className="flex mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <span className="text-primary font-medium">2</span>
                  </div>
                  <p className="text-gray-600">Vergleichen Sie die Angebote und wählen Sie das beste aus</p>
                </div>
                <div className="flex">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 shrink-0">
                    <span className="text-primary font-medium">3</span>
                  </div>
                  <p className="text-gray-600">Schließen Sie den Kredit bequem online ab</p>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  href="#calculator"
                  className="block w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all text-center"
                  onClick={() => setShowInfoModal(false)}
                >
                  Jetzt Kreditangebote vergleichen
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">So funktioniert&apos;s</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              In nur drei einfachen Schritten zu Ihrem Wunschkredit – schnell, sicher und transparent.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 flex items-center justify-center text-primary">
                  <i className="ri-edit-line ri-xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Kreditwunsch eingeben</h3>
              <p className="text-gray-600">
                Geben Sie Ihre gewünschte Kreditsumme, Laufzeit und den Verwendungszweck an.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 flex items-center justify-center text-primary">
                  <i className="ri-scales-3-line ri-xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Angebote vergleichen</h3>
              <p className="text-gray-600">
                Vergleichen Sie die besten Angebote von über 20 Banken und Kreditinstituten.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 flex items-center justify-center text-primary">
                  <i className="ri-check-line ri-xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Online abschließen</h3>
              <p className="text-gray-600">
                Schließen Sie Ihren Kreditvertrag bequem online ab – ohne Papierkram und Behördengänge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ihre Vorteile bei Kreditheld24</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Wir machen Kreditvergleiche einfach, transparent und sicher – damit Sie die beste Finanzierungslösung finden.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-bank-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Unabhängiger Bankenvergleich</h3>
              <p className="text-gray-600">
                Wir vergleichen über 20 Banken und Kreditinstitute, um Ihnen das beste Angebot zu präsentieren.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-shield-check-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">SCHUFA-neutrale Anfrage</h3>
              <p className="text-gray-600">
                Unsere Vorabanfrage hat keinen Einfluss auf Ihren SCHUFA-Score – garantiert.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-coins-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Keine versteckten Kosten</h3>
              <p className="text-gray-600">
                Unser Service ist für Sie zu 100% kostenlos – wir verdienen an den Banken, nicht an Ihnen.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-smartphone-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Digitale Antragsstrecke</h3>
              <p className="text-gray-600">
                Erledigen Sie den gesamten Kreditantrag online – von der Anfrage bis zur Unterschrift.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-customer-service-2-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Persönliche Beratung</h3>
              <p className="text-gray-600">
                Bei Fragen steht Ihnen unser Expertenteam telefonisch oder per E-Mail zur Verfügung.
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
                Bei vielen Banken erhalten Sie Ihr Geld innerhalb von 24 Stunden nach Vertragsabschluss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unsere Kreditangebote</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Wir bieten maßgeschneiderte Finanzierungslösungen für jeden Bedarf – finden Sie den passenden Kredit für Ihre Situation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/ratenkredite" className="group">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center text-primary group-hover:text-white">
                    <i className="ri-money-euro-box-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Ratenkredit</h3>
                <p className="text-gray-600 mb-4">
                  Flexible Laufzeiten und Raten für Ihre persönlichen Wünsche und Anschaffungen.
                </p>
                <div className="text-primary font-medium flex items-center">
                  <span>Mehr erfahren</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/umschuldung" className="group">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center text-primary group-hover:text-white">
                    <i className="ri-exchange-funds-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Umschuldung</h3>
                <p className="text-gray-600 mb-4">
                  Bestehende Kredite zu besseren Konditionen zusammenfassen und Geld sparen.
                </p>
                <div className="text-primary font-medium flex items-center">
                  <span>Mehr erfahren</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/schufa-neutral" className="group">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center text-primary group-hover:text-white">
                    <i className="ri-file-shield-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Kredit trotz SCHUFA</h3>
                <p className="text-gray-600 mb-4">
                  Spezielle Angebote für Kunden mit negativen SCHUFA-Einträgen oder niedrigem Score.
                </p>
                <div className="text-primary font-medium flex items-center">
                  <span>Mehr erfahren</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/sofortkredit" className="group">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center text-primary group-hover:text-white">
                    <i className="ri-flashlight-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Sofortkredit</h3>
                <p className="text-gray-600 mb-4">
                  Schnelle Auszahlung innerhalb von 24 Stunden für dringende Finanzierungsbedarfe.
                </p>
                <div className="text-primary font-medium flex items-center">
                  <span>Mehr erfahren</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/kredit-selbststaendige" className="group">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center text-primary group-hover:text-white">
                    <i className="ri-briefcase-4-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Kredit für Selbstständige</h3>
                <p className="text-gray-600 mb-4">
                  Spezielle Finanzierungslösungen für Unternehmer, Freiberufler und Gewerbetreibende.
                </p>
                <div className="text-primary font-medium flex items-center">
                  <span>Mehr erfahren</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/autokredit" className="group">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:border-primary hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                  <div className="w-6 h-6 flex items-center justify-center text-primary group-hover:text-white">
                    <i className="ri-car-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Autokredit</h3>
                <p className="text-gray-600 mb-4">
                  Günstige Finanzierung für Neu- und Gebrauchtwagen mit attraktiven Konditionen.
                </p>
                <div className="text-primary font-medium flex items-center">
                  <span>Mehr erfahren</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kreditrechner</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Berechnen Sie Ihre monatliche Rate und finden Sie den passenden Kredit für Ihre Bedürfnisse.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-4xl mx-auto">
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
                      max="100000"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
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
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1.000 €</span>
                    <span>100.000 €</span>
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
                        max="120"
                      />
                      <button
                        onClick={() => setLoanTerm(Math.min(120, loanTerm + 6))}
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
                    max="120"
                    step="6"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>12 Monate</span>
                    <span>120 Monate</span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">Verwendungszweck</label>
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

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Das sagen unsere Kunden</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tausende zufriedene Kunden vertrauen auf unseren Service – lesen Sie selbst.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Sehr schnelle und unkomplizierte Abwicklung. Innerhalb von 2 Tagen hatte ich mein Geld auf dem Konto. Kann ich nur weiterempfehlen!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Michael S.</p>
                  <p className="text-sm text-gray-500">Ratenkredit über 15.000 €</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Die Umschuldung meiner drei Kredite hat mir monatlich über 200 € gespart. Der Service war top und alles lief reibungslos ab.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Sandra M.</p>
                  <p className="text-sm text-gray-500">Umschuldung über 28.000 €</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                &quot;Trotz negativer SCHUFA-Einträge konnte mir geholfen werden. Faire Konditionen und transparente Beratung. Vielen Dank!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Thomas K.</p>
                  <p className="text-sm text-gray-500">Kredit trotz SCHUFA über 8.000 €</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für Ihren Wunschkredit?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Starten Sie jetzt Ihren kostenlosen und unverbindlichen Kreditvergleich.
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

export default HomePage
