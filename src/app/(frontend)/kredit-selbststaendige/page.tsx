'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import UnverbindlichAnfragenButton from '../../../components/UnverbindlichAnfragenButton'

const KreditSelbststaendigePage = () => {
  const [loanAmount, setLoanAmount] = useState(25000)
  const [loanTerm, setLoanTerm] = useState(48)
  const [businessType, setBusinessType] = useState('einzelunternehmen')
  const [businessYears, setBusinessYears] = useState('3-5')
  const [loanPurpose, setLoanPurpose] = useState('betriebsmittel')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessForm: 'einzelunternehmen',
    businessYears: '3-5',
    loanAmount: '25000',
    loanPurpose: 'betriebsmittel',
    privacy: false
  })

  // Calculate loan conditions
  const calculateLoan = () => {
    let baseRate = 5.49
    
    // Adjust rate based on business type
    switch (businessType) {
      case 'gmbh':
      case 'ug':
        baseRate -= 0.5
        break
      case 'freiberufler':
        baseRate += 0.3
        break
      default:
        break
    }
    
    // Adjust rate based on business years
    switch (businessYears) {
      case '1':
        baseRate += 1.5
        break
      case '1-3':
        baseRate += 0.8
        break
      case '5+':
        baseRate -= 0.3
        break
      default:
        break
    }
    
    const monthlyRate = baseRate / 100 / 12
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / (Math.pow(1 + monthlyRate, loanTerm) - 1)
    const totalCost = monthlyPayment * loanTerm
    
    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      interestRate: baseRate.toFixed(2),
      totalCost: totalCost.toFixed(2)
    }
  }

  const loanCalculation = calculateLoan()

  // Removed unused form handling functions

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Removed unused testimonials array

  const faqData = [
    {
      question: "Welche Voraussetzungen muss ich als Selbstständiger erfüllen?",
      answer: "Sie sollten mindestens 6 Monate selbstständig tätig sein, ein regelmäßiges Einkommen nachweisen können und über eine positive Bonität verfügen. Je nach Kreditart können weitere Anforderungen gelten."
    },
    {
      question: "Welche Unterlagen benötige ich für den Kreditantrag?",
      answer: "Typischerweise benötigen Sie: Personalausweis, Einkommensnachweise der letzten 2-3 Monate, Kontoauszüge, BWA oder Steuerbescheid und je nach Verwendungszweck weitere spezifische Unterlagen."
    },
    {
      question: "Wie lange dauert die Kreditbearbeitung?",
      answer: "Die Bearbeitung dauert in der Regel 2-5 Werktage. Bei vollständigen Unterlagen und positiver Bonität kann eine Zusage oft schon innerhalb von 24 Stunden erfolgen."
    },
    {
      question: "Kann ich als Freiberufler auch einen Kredit erhalten?",
      answer: "Ja, Freiberufler können ebenfalls Kredite erhalten. Oft sind die Konditionen sogar günstiger als für Gewerbetreibende, da Freiberufler als weniger risikobehaftet eingestuft werden."
    },
    {
      question: "Sind Sicherheiten erforderlich?",
      answer: "Das hängt von der Kredithöhe und Ihrer Bonität ab. Viele Kredite bis 50.000 € können ohne zusätzliche Sicherheiten vergeben werden. Bei höheren Summen können Sicherheiten erforderlich sein."
    }
  ]

  useEffect(() => {
    // Initialize charts when component mounts
    if (typeof window !== 'undefined' && (window as any).echarts) {
      // Industry Chart
      const industryChartDom = document.getElementById('industryChart')
      if (industryChartDom) {
        const industryChart = (window as any).echarts.init(industryChartDom)
        const industryOption = {
          animation: false,
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#eee',
            borderWidth: 1,
            textStyle: { color: '#1f2937' }
          },
          legend: {
            orient: 'horizontal',
            bottom: '0%',
            textStyle: { color: '#1f2937' }
          },
          series: [{
            name: 'Branchenverteilung',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: { show: false },
            emphasis: {
              label: {
                show: true,
                fontSize: '14',
                fontWeight: 'bold',
                color: '#1f2937'
              }
            },
            data: [
              {value: 25, name: 'Handel', itemStyle: {color: 'rgba(87, 181, 231, 1)'}},
              {value: 20, name: 'Handwerk', itemStyle: {color: 'rgba(141, 211, 199, 1)'}},
              {value: 18, name: 'Dienstleistung', itemStyle: {color: 'rgba(251, 191, 114, 1)'}},
              {value: 15, name: 'IT/Tech', itemStyle: {color: 'rgba(252, 141, 98, 1)'}},
              {value: 12, name: 'Gastronomie', itemStyle: {color: 'rgba(188, 128, 189, 1)'}},
              {value: 10, name: 'Sonstige', itemStyle: {color: 'rgba(204, 204, 204, 1)'}}
            ]
          }]
        }
        industryChart.setOption(industryOption)
        
        const handleResize = () => industryChart.resize()
        window.addEventListener('resize', handleResize)
        
        return () => {
          window.removeEventListener('resize', handleResize)
          industryChart.dispose()
        }
      }
    }
  }, [])

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.5.0/echarts.min.js" />
      
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
              backgroundImage: "url('/images/business-owner-unique.webp')"
            }}
          ></div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-blue-50/80 to-transparent dark:from-gray-900/95 dark:via-gray-800/80 dark:to-transparent"></div>
          <div className="container mx-auto px-4 py-12 md:py-24 relative z-10">
            <div className="max-w-xl md:max-w-2xl mx-auto md:mx-0">
              <div className="mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Speziell für Selbstständige</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center md:text-left leading-tight">
                Kredite für <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">Selbstständige</span> – maßgeschneiderte Finanzlösungen
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 text-center md:text-left">
                Speziell entwickelte Kreditangebote für Unternehmer, Freiberufler und Gewerbetreibende mit flexiblen Konditionen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  href="/kreditrechner"
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

        {/* Calculator */}
        <section id="calculator" className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-24 h-24 border border-blue-500 rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 border border-primary rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-blue-400 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 mb-6">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Kostenloser Rechner</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Kreditrechner für Selbstständige</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Berechnen Sie Ihre individuellen Kreditkonditionen und finden Sie die optimale Finanzierungslösung für Ihr Unternehmen.
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
                        min="5000" 
                        max="250000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      min="5000" 
                      max="250000" 
                      step="1000" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>5.000 €</span>
                      <span>250.000 €</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Laufzeit</label>
                    <div className="relative">
                      <div className="flex">
                        <button 
                          onClick={() => setLoanTerm(Math.max(12, loanTerm - 6))}
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-l border border-gray-300 dark:border-gray-600"
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-subtract-line"></i>
                          </div>
                        </button>
                        <input 
                          type="number" 
                          value={loanTerm}
                          onChange={(e) => setLoanTerm(Number(e.target.value))}
                          className="w-full border-y border-gray-300 dark:border-gray-600 py-3 px-4 text-center bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                          min="12" 
                          max="120"
                        />
                        <button 
                          onClick={() => setLoanTerm(Math.min(120, loanTerm + 6))}
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-r border border-gray-300 dark:border-gray-600"
                        >
                          <div className="w-4 h-4 flex items-center justify-center">
                            <i className="ri-add-line"></i>
                          </div>
                        </button>
                      </div>
                      <div className="absolute inset-y-0 right-12 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">Monate</div>
                    </div>
                    <input 
                      type="range" 
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
                      min="12" 
                      max="120" 
                      step="6" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>12 Monate</span>
                      <span>120 Monate</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Unternehmensform</label>
                    <div className="relative">
                      <select 
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full appearance-none border border-gray-300 dark:border-gray-600 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      >
                        <option value="einzelunternehmen">Einzelunternehmen</option>
                        <option value="freiberufler">Freiberufler</option>
                        <option value="gbr">GbR</option>
                        <option value="gmbh">GmbH</option>
                        <option value="ug">UG (haftungsbeschränkt)</option>
                        <option value="kg">KG</option>
                        <option value="ohg">OHG</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-arrow-down-s-line"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Geschäftsjahre</label>
                    <div className="relative">
                      <select 
                        value={businessYears}
                        onChange={(e) => setBusinessYears(e.target.value)}
                        className="w-full appearance-none border border-gray-300 dark:border-gray-600 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      >
                        <option value="1">Weniger als 1 Jahr</option>
                        <option value="1-3">1-3 Jahre</option>
                        <option value="3-5">3-5 Jahre</option>
                        <option value="5+">Mehr als 5 Jahre</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-arrow-down-s-line"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Verwendungszweck</label>
                    <div className="relative">
                      <select 
                        value={loanPurpose}
                        onChange={(e) => setLoanPurpose(e.target.value)}
                        className="w-full appearance-none border border-gray-300 dark:border-gray-600 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      >
                        <option value="betriebsmittel">Betriebsmittel</option>
                        <option value="investition">Investition</option>
                        <option value="expansion">Geschäftserweiterung</option>
                        <option value="umschuldung">Umschuldung</option>
                        <option value="fahrzeug">Fahrzeugfinanzierung</option>
                        <option value="maschinen">Maschinen & Anlagen</option>
                        <option value="sonstiges">Sonstiges</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-arrow-down-s-line"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-600 rounded-lg p-6 transition-colors duration-300">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Ihre Kreditkonditionen</h3>
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Monatliche Rate:</span>
                      <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">{loanCalculation.monthlyPayment} €</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Effektiver Jahreszins:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{loanCalculation.interestRate} %</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600 dark:text-gray-300">Gesamtkosten:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{loanCalculation.totalCost} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Zinsbindung:</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Gesamte Laufzeit</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div className="h-2 bg-primary rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Bonitätsscore: Gut</span>
                      <span>78/100</span>
                    </div>
                  </div>
                  <Link 
                    href="#beratung" 
                    className="block w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all text-center"
                  >
                    Jetzt Kreditangebote vergleichen
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">100% kostenlos & SCHUFA-neutral</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
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
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Häufige Fragen</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Häufig gestellte Fragen</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Antworten auf die wichtigsten Fragen rund um Kredite für Selbstständige.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                    <button 
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-6 py-4 font-medium flex justify-between items-center text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <div className={`w-5 h-5 flex items-center justify-center text-primary transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                    </button>
                    {openFaq === index && (
                      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


      </div>
    </>
  )
}

export default KreditSelbststaendigePage