'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Script from 'next/script'

const KreditSelbststaendigePage = () => {
  const [loanAmount, setLoanAmount] = useState(25000)
  const [loanTerm, setLoanTerm] = useState(48)
  const [businessType, setBusinessType] = useState('einzelunternehmen')
  const [businessYears, setBusinessYears] = useState('3-5')
  const [loanPurpose, setLoanPurpose] = useState('betriebsmittel')
  const [currentSlide, setCurrentSlide] = useState(0)
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Bitte füllen Sie alle Pflichtfelder aus.')
      return
    }
    if (!formData.privacy) {
      alert('Bitte akzeptieren Sie die Datenschutzbestimmungen.')
      return
    }
    alert('Vielen Dank für Ihre Anfrage! Wir werden uns innerhalb von 24 Stunden bei Ihnen melden.')
    setFormData({
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
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const testimonials = [
    {
      name: "Michael Weber",
      business: "Handwerksbetrieb",
      text: "Dank Kreditheld24 konnte ich schnell und unkompliziert eine neue Maschine finanzieren. Der Service war erstklassig!",
      rating: 5
    },
    {
      name: "Sarah Müller",
      business: "Online-Shop",
      text: "Als Selbstständige war es schwer, einen fairen Kredit zu bekommen. Hier fand ich endlich die richtige Lösung.",
      rating: 5
    },
    {
      name: "Thomas Klein",
      business: "Beratungsunternehmen",
      text: "Professionelle Beratung und transparente Konditionen. Kann ich jedem Unternehmer empfehlen!",
      rating: 5
    }
  ]

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
      
      <div className="font-sans text-gray-800 bg-white">

        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-r from-green-50 to-green-100 overflow-hidden">
          <div 
            className="absolute inset-0 bg-right bg-no-repeat bg-contain" 
            style={{
              backgroundImage: "url('https://readdy.ai/api/search-image?query=professional%2520business%2520person%2520working%2520on%2520laptop%2520in%2520modern%2520office%252C%2520business%2520documents%2520and%2520calculator%2520nearby%252C%2520soft%2520natural%2520lighting%252C%2520green%2520plants%2520in%2520background%252C%2520business%2520finance%2520concept%252C%2520entrepreneurship%2520theme%252C%2520clean%2520minimal%2520workspace%252C%2520with%2520plenty%2520of%2520empty%2520space%2520on%2520the%2520left%2520side%2520for%2520text&width=800&height=600&seq=self123&orientation=landscape')"
            }}
          ></div>
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                Kredite für Selbstständige – maßgeschneiderte Finanzlösungen
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8">
                Speziell entwickelte Kreditangebote für Unternehmer, Freiberufler und Gewerbetreibende mit flexiblen Konditionen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="#calculator" 
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
                >
                  <span>Jetzt Kredit berechnen</span>
                  <div className="w-5 h-5 ml-2 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
                <Link 
                  href="#beratung" 
                  className="border border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-medium py-3 px-6 rounded-button whitespace-nowrap flex items-center justify-center transition-all"
                >
                  <div className="w-5 h-5 mr-2 flex items-center justify-center">
                    <i className="ri-customer-service-line"></i>
                  </div>
                  <span>Beratung anfordern</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Kreditrechner für Selbstständige</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Berechnen Sie Ihre individuellen Kreditkonditionen und finden Sie die optimale Finanzierungslösung für Ihr Unternehmen.
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
                        min="5000" 
                        max="250000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">€</div>
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
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>5.000 €</span>
                      <span>250.000 €</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Laufzeit</label>
                    <div className="relative">
                      <div className="flex">
                        <button 
                          onClick={() => setLoanTerm(Math.max(12, loanTerm - 6))}
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
                          min="12" 
                          max="120"
                        />
                        <button 
                          onClick={() => setLoanTerm(Math.min(120, loanTerm + 6))}
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
                      min="12" 
                      max="120" 
                      step="6" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>12 Monate</span>
                      <span>120 Monate</span>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Unternehmensform</label>
                    <div className="relative">
                      <select 
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      >
                        <option value="einzelunternehmen">Einzelunternehmen</option>
                        <option value="freiberufler">Freiberufler</option>
                        <option value="gbr">GbR</option>
                        <option value="gmbh">GmbH</option>
                        <option value="ug">UG (haftungsbeschränkt)</option>
                        <option value="kg">KG</option>
                        <option value="ohg">OHG</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-arrow-down-s-line"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Geschäftsjahre</label>
                    <div className="relative">
                      <select 
                        value={businessYears}
                        onChange={(e) => setBusinessYears(e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
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
                    <label className="block text-gray-700 font-medium mb-2">Verwendungszweck</label>
                    <div className="relative">
                      <select 
                        value={loanPurpose}
                        onChange={(e) => setLoanPurpose(e.target.value)}
                        className="w-full appearance-none border border-gray-300 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
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
                      <div className="h-2 bg-primary rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
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
                  <p className="text-xs text-gray-500 mt-4 text-center">100% kostenlos & SCHUFA-neutral</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Häufig gestellte Fragen</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Antworten auf die wichtigsten Fragen rund um Kredite für Selbstständige.
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

        {/* Footer */}
        <footer className="bg-gray-800 text-white pt-12 pb-6">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-['Pacifico'] text-primary mb-4">Kreditheld24</h3>
                <p className="text-gray-300 mb-4">
                  Ihr unabhängiger Kreditvergleich für maßgeschneiderte Finanzierungslösungen zu Top-Konditionen.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-lg mb-4">Kreditarten</h4>
                <ul className="space-y-2">
                  <li><Link href="/ratenkredite" className="text-gray-300 hover:text-primary">Ratenkredit</Link></li>
                  <li><Link href="/umschuldung" className="text-gray-300 hover:text-primary">Umschuldung</Link></li>
                  <li><Link href="/schufa-neutral" className="text-gray-300 hover:text-primary">Kredit trotz SCHUFA</Link></li>
                  <li><Link href="/sofortkredit" className="text-gray-300 hover:text-primary">Sofortkredit</Link></li>
                  <li><Link href="/kredit-selbststaendige" className="text-primary hover:text-primary">Kredit für Selbstständige</Link></li>
                  <li><Link href="/autokredit" className="text-gray-300 hover:text-primary">Autokredit</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-lg mb-4">Über uns</h4>
                <ul className="space-y-2">
                  <li><Link href="/unternehmen" className="text-gray-300 hover:text-primary">Unternehmen</Link></li>
                  <li><Link href="/team" className="text-gray-300 hover:text-primary">Team</Link></li>
                  <li><Link href="/kontakt" className="text-gray-300 hover:text-primary">Kontakt</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-lg mb-4">Kontakt</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="w-5 h-5 flex items-center justify-center text-primary mr-2 mt-1">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <span className="text-gray-300">Kreditheldenstraße 24<br />10115 Berlin</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                      <i className="ri-phone-line"></i>
                    </div>
                    <Link href="tel:+4930123456789" className="text-gray-300 hover:text-primary">
                      030 / 123 456 789
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                      <i className="ri-mail-line"></i>
                    </div>
                    <Link href="mailto:info@kreditheld24.de" className="text-gray-300 hover:text-primary">
                      info@kreditheld24.de
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="mb-4 md:mb-0">
                  <p className="text-gray-400 text-sm">&copy; 2025 Kreditheld24. Alle Rechte vorbehalten.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link href="/impressum" className="text-gray-400 text-sm hover:text-primary">Impressum</Link>
                  <Link href="/datenschutz" className="text-gray-400 text-sm hover:text-primary">Datenschutz</Link>
                  <Link href="/agb" className="text-gray-400 text-sm hover:text-primary">AGB</Link>
                  <Link href="/cookie-einstellungen" className="text-gray-400 text-sm hover:text-primary">Cookie-Einstellungen</Link>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default KreditSelbststaendigePage