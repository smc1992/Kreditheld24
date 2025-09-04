'use client'
import React, { useState } from 'react'
import Link from 'next/link'
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
          className="absolute inset-0 bg-right bg-no-repeat bg-cover md:bg-contain opacity-20 md:opacity-100"
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=professional%20financial%20advisor%20or%20banker%20working%20with%20digital%20tablet%20in%20modern%20minimalist%20office%2C%20soft%20lighting%20with%20green%20accents%2C%20clean%20and%20simple%20composition%2C%20blurred%20background%20with%20financial%20charts%2C%20elegant%20and%20professional%20atmosphere&width=800&height=600&seq=hero123&orientation=landscape')"
          }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-blue-50/80 to-transparent dark:from-gray-900/95 dark:via-gray-800/80 dark:to-transparent"></div>
        
        <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
          <div className="max-w-xl md:max-w-2xl mx-auto md:mx-0">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Deutschlands führender Kreditvergleich</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center md:text-left leading-tight">
              Schnell zum <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">besten Kredit</span> – vergleichen lohnt sich
            </h1>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 text-center md:text-left">
              Jetzt mit wenigen Klicks zu Ihrem Wunschkredit – 100% kostenlos & SCHUFA-neutral.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="#calculator"
                className="group bg-gradient-to-r from-primary to-green-600 hover:from-green-600 hover:to-primary text-white font-medium py-4 px-8 rounded-button whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-105"
              >
                <span>Jetzt Kredit berechnen</span>
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
                  <i className="ri-time-line"></i>
                </div>
                <span>In 2 Minuten</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-5 h-5 text-green-500 mr-2">
                  <i className="ri-user-heart-line"></i>
                </div>
                <span>SCHUFA-neutral</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full mx-4 relative transition-colors duration-300">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-close-line ri-lg"></i>
                </div>
              </button>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Warum Kreditheld24?</h3>
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
      <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-20 h-20 border border-primary rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Einfach & Transparent</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">So funktioniert&apos;s</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In nur drei einfachen Schritten zu Ihrem Wunschkredit – schnell, sicher und transparent.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-primary/50">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 flex items-center justify-center text-primary">
                    <i className="ri-edit-line text-2xl"></i>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Kreditwunsch eingeben</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Geben Sie Ihre gewünschte Kreditsumme, Laufzeit und den Verwendungszweck an.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-blue-500/50">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 flex items-center justify-center text-blue-600">
                    <i className="ri-scales-3-line text-2xl"></i>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Angebote vergleichen</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Vergleichen Sie die besten Angebote von über 20 Banken und Kreditinstituten.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-green-500/50">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <div className="w-10 h-10 flex items-center justify-center text-green-600">
                    <i className="ri-check-line text-2xl"></i>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Online abschließen</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Schließen Sie Ihren Kreditvertrag bequem online ab – ohne Papierkram und Behördengänge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-gradient-to-br from-white via-green-50/30 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-24 h-24 bg-primary rounded-full blur-xl animate-pulse delay-300"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Ihre Vorteile</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Warum Kreditheld24?</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Wir machen Kreditvergleiche einfach, transparent und sicher – damit Sie die beste Finanzierungslösung finden.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 flex items-center justify-center text-primary">
                  <i className="ri-bank-line text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Unabhängiger Bankenvergleich</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Wir vergleichen über 20 Banken und Kreditinstitute, um Ihnen das beste Angebot zu präsentieren.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 flex items-center justify-center text-blue-600">
                  <i className="ri-shield-check-line text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">100% SCHUFA-neutral</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Unsere Kreditanfrage hat keinen negativen Einfluss auf Ihren SCHUFA-Score – garantiert sicher.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-500/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 flex items-center justify-center text-purple-600">
                  <i className="ri-flashlight-line text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Schnelle Auszahlung</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Bei vielen Banken erhalten Sie Ihr Geld bereits innerhalb von 24 Stunden nach Zusage.
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
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-coins-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Keine versteckten Kosten</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Unser Service ist für Sie zu 100% kostenlos – wir verdienen an den Banken, nicht an Ihnen.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-smartphone-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Digitale Antragsstrecke</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Erledigen Sie den gesamten Kreditantrag online – von der Anfrage bis zur Unterschrift.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                <div className="w-6 h-6 flex items-center justify-center text-primary">
                  <i className="ri-customer-service-2-line ri-lg"></i>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Persönliche Beratung</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Bei Fragen steht Ihnen unser Expertenteam telefonisch oder per E-Mail zur Verfügung.
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
                Bei vielen Banken erhalten Sie Ihr Geld innerhalb von 24 Stunden nach Vertragsabschluss.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-primary rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 mb-6">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Unsere Kreditlösungen</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Maßgeschneiderte Finanzierung</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Wir bieten maßgeschneiderte Finanzierungslösungen für jeden Bedarf – finden Sie den passenden Kredit für Ihre Situation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/ratenkredite" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-7 h-7 flex items-center justify-center text-primary">
                    <i className="ri-money-euro-box-line text-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">Ratenkredit</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  Flexible Laufzeiten und Raten für Ihre persönlichen Wünsche.
                </p>
                <div className="text-primary font-medium flex items-center text-sm">
                  <span>Mehr erfahren</span>
                  <div className="w-4 h-4 ml-1 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/umschuldung" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-7 h-7 flex items-center justify-center text-primary">
                    <i className="ri-exchange-funds-line text-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">Umschuldung</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  Bestehende Kredite zusammenfassen und Geld sparen.
                </p>
                <div className="text-primary font-medium flex items-center text-sm">
                  <span>Mehr erfahren</span>
                  <div className="w-4 h-4 ml-1 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/schufa-neutral" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-7 h-7 flex items-center justify-center text-blue-600">
                    <i className="ri-file-shield-line text-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors">SCHUFA-neutral</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  Kreditanfrage ohne Einfluss auf Ihren SCHUFA-Score.
                </p>
                <div className="text-blue-600 font-medium flex items-center text-sm">
                  <span>Mehr erfahren</span>
                  <div className="w-4 h-4 ml-1 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/sofortkredit" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-7 h-7 flex items-center justify-center text-primary">
                    <i className="ri-flashlight-line text-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">Sofortkredit</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  Schnelle Auszahlung innerhalb von 24 Stunden.
                </p>
                <div className="text-primary font-medium flex items-center text-sm">
                  <span>Mehr erfahren</span>
                  <div className="w-4 h-4 ml-1 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/kredit-selbststaendige" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:border-blue-500/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-7 h-7 flex items-center justify-center text-blue-600">
                    <i className="ri-briefcase-4-line text-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 transition-colors">Selbstständige</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  Spezielle Finanzierung für Unternehmer und Freiberufler.
                </p>
                <div className="text-blue-600 font-medium flex items-center text-sm">
                  <span>Mehr erfahren</span>
                  <div className="w-4 h-4 ml-1 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
            <Link href="/autokredit" className="group">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-7 h-7 flex items-center justify-center text-primary">
                    <i className="ri-car-line text-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-primary transition-colors">Autokredit</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  Günstige Finanzierung für Neu- und Gebrauchtwagen.
                </p>
                <div className="text-primary font-medium flex items-center text-sm">
                  <span>Mehr erfahren</span>
                  <div className="w-4 h-4 ml-1 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section id="calculator" className="py-16 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-24 h-24 border border-primary rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Kostenloser Rechner</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Kreditrechner</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Berechnen Sie Ihre monatliche Rate und finden Sie den passenden Kredit für Ihre Bedürfnisse.
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
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
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
                      className="w-full appearance-none border border-gray-300 dark:border-gray-600 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 transition-colors duration-300"
                    >
                      <option value="freie_verwendung">Freie Verwendung</option>
                      <option value="auto">Autokauf</option>
                      <option value="umschuldung">Umschuldung</option>
                      <option value="renovierung">Renovierung</option>
                      <option value="moebel">Möbelkauf</option>
                      <option value="elektronik">Elektronik</option>
                      <option value="urlaub">Urlaub</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-6 transition-colors duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Ihre Kreditkonditionen</h3>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Monatliche Rate:</span>
                    <span className="font-semibold text-lg">{loanCalculation.monthlyPayment} €</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Effektiver Jahreszins:</span>
                    <span className="font-semibold">{loanCalculation.interestRate} %</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-300">Gesamtkosten:</span>
                    <span className="font-semibold">{loanCalculation.totalCost} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Zinsbindung:</span>
                    <span className="font-semibold">Gesamte Laufzeit</span>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-2 bg-primary rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  100% kostenlos & SCHUFA-neutral
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Das sagen unsere Kunden</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Tausende zufriedene Kunden vertrauen auf unseren Service – lesen Sie selbst.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                &quot;Sehr schnelle und unkomplizierte Abwicklung. Innerhalb von 2 Tagen hatte ich mein Geld auf dem Konto. Kann ich nur weiterempfehlen!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Michael S.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ratenkredit über 15.000 €</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                &quot;Die Umschuldung meiner drei Kredite hat mir monatlich über 200 € gespart. Der Service war top und alles lief reibungslos ab.&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Sandra M.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Umschuldung über 28.000 €</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg transition-colors duration-300">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                  <i className="ri-star-fill"></i>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                &quot;Trotz negativer SCHUFA-Einträge konnte mir geholfen werden. Faire Konditionen und transparente Beratung. Vielen Dank!&quot;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Thomas K.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Kredit trotz SCHUFA über 8.000 €</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-green-600 dark:from-green-700 dark:to-green-600 text-white transition-colors duration-300 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-200 rounded-full blur-lg animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-white">Jetzt starten</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Bereit für Ihren Wunschkredit?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Starten Sie jetzt Ihren kostenlosen und unverbindlichen Kreditvergleich.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#calculator"
              className="group bg-white text-primary hover:bg-gray-100 dark:bg-gray-200 dark:hover:bg-gray-300 font-medium py-4 px-8 rounded-button shadow-lg hover:shadow-xl transition-all inline-flex items-center justify-center transform hover:scale-105"
            >
              <span>Jetzt vergleichen</span>
              <div className="w-5 h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                <i className="ri-arrow-right-line"></i>
              </div>
            </Link>
            <Link
              href="/kontakt"
              className="group border-2 border-white text-white hover:bg-white hover:text-primary dark:hover:bg-gray-200 font-medium py-4 px-8 rounded-button transition-all inline-flex items-center justify-center backdrop-blur-sm"
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
