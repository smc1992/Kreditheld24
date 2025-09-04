'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '@/components/UnverbindlichAnfragenButton'
import Script from 'next/script'

const UmschuldungPage = () => {
  const [totalDebtAmount, setTotalDebtAmount] = useState(24000)
  const [currentInterestRate, setCurrentInterestRate] = useState(8.5)
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = useState(730)
  const [loansCount, setLoansCount] = useState(3)
  const [newInterestRate, setNewInterestRate] = useState(4.5)
  const [newLoanTerm, setNewLoanTerm] = useState(48)
  const [formData, setFormData] = useState({
    anrede: 'herr',
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    geburtsdatum: '',
    strasse: '',
    plz: '',
    ort: '',
    beruf: '',
    einkommen: '',
    ausgaben: '',
    datenschutz: false
  })

  // Calculate new monthly payment and savings
  const calculateSavings = () => {
    const amount = totalDebtAmount
    const newRate = newInterestRate / 100
    const term = newLoanTerm
    
    const monthlyInterestRate = newRate / 12
    const newPayment = amount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, term)) / (Math.pow(1 + monthlyInterestRate, term) - 1)
    const monthlySaving = currentMonthlyPayment - newPayment
    const totalSaving = monthlySaving * term
    
    return {
      newPayment: newPayment.toFixed(2),
      monthlySaving: monthlySaving.toFixed(2),
      totalSaving: totalSaving.toFixed(2)
    }
  }

  const savings = calculateSavings()

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze mit einem individuellen Angebot bei Ihnen melden.')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqData = [
    {
      question: "Was ist eine Umschuldung?",
      answer: "Bei einer Umschuldung werden bestehende Kredite durch einen neuen Kredit mit besseren Konditionen abgelöst. Ziel ist es, durch einen niedrigeren Zinssatz die monatliche Rate zu senken oder durch eine längere Laufzeit die finanzielle Belastung zu reduzieren."
    },
    {
      question: "Für wen lohnt sich eine Umschuldung?",
      answer: "Eine Umschuldung lohnt sich besonders für Personen, die mehrere Kredite mit unterschiedlichen Laufzeiten haben, Kredite mit hohen Zinssätzen bedienen, ihre monatliche Belastung reduzieren möchten, einen besseren Überblick über ihre Finanzen bekommen wollen oder von aktuell günstigeren Zinsen profitieren können."
    },
    {
      question: "Welche Kredite kann ich umschulden?",
      answer: "Grundsätzlich können fast alle Arten von Krediten umgeschuldet werden, darunter Ratenkredite, Autokredite, Kreditkartenschulden, Dispokredite, Möbelkredite und andere Finanzierungen. Ausgenommen sind in der Regel Immobilienkredite, für die spezielle Umschuldungsangebote existieren."
    },
    {
      question: "Ist eine Umschuldung auch mit negativer SCHUFA möglich?",
      answer: "Ja, auch mit negativen SCHUFA-Einträgen ist eine Umschuldung möglich. Allerdings können die Konditionen weniger günstig ausfallen. Wir arbeiten mit Banken zusammen, die auch bei nicht optimaler Bonität faire Angebote machen."
    },
    {
      question: "Wie läuft die Ablösung der bestehenden Kredite ab?",
      answer: "Nach Genehmigung des neuen Kredits übernimmt die Bank in der Regel die komplette Abwicklung. Die Ablösesummen werden direkt an Ihre bisherigen Kreditgeber überwiesen. Sie müssen sich um nichts kümmern."
    }
  ]

  useEffect(() => {
    // Initialize ECharts for savings chart with delay to ensure script is loaded
    const initChart = () => {
      if (typeof window !== 'undefined' && (window as any).echarts) {
        const chartDom = document.getElementById('savings-chart')
        if (chartDom) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const myChart = (window as any).echarts.init(chartDom)
          const option = {
            animation: true,
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderColor: '#10b981',
              borderWidth: 1,
              textStyle: {
                color: '#1f2937'
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter: function(params: any) {
                let result = params[0].name + '<br/>'
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                params.forEach((param: any) => {
                  result += param.marker + param.seriesName + ': ' + param.value.toLocaleString() + ' €<br/>'
                })
                return result
              }
            },
            legend: {
              data: ['Aktuelle Kredite', 'Nach Umschuldung'],
              textStyle: {
                color: '#1f2937'
              },
              top: 10
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              top: '15%',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              data: ['Monatliche Rate', 'Gesamtkosten (48 Monate)'],
              axisLine: {
                lineStyle: {
                  color: '#d1d5db'
                }
              },
              axisLabel: {
                color: '#1f2937',
                fontSize: 12
              }
            },
            yAxis: {
              type: 'value',
              axisLine: {
                show: false
              },
              axisLabel: {
                color: '#1f2937',
                formatter: '{value} €'
              },
              splitLine: {
                lineStyle: {
                  color: '#f3f4f6'
                }
              }
            },
            series: [
              {
                name: 'Aktuelle Kredite',
                type: 'bar',
                data: [730, 35040],
                itemStyle: {
                  color: '#ef4444',
                  borderRadius: [4, 4, 0, 0]
                },
                barWidth: '35%',
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{c} €',
                  color: '#1f2937'
                }
              },
              {
                name: 'Nach Umschuldung',
                type: 'bar',
                data: [550, 26400],
                itemStyle: {
                  color: '#10b981',
                  borderRadius: [4, 4, 0, 0]
                },
                barWidth: '35%',
                label: {
                  show: true,
                  position: 'top',
                  formatter: '{c} €',
                  color: '#1f2937'
                }
              }
            ]
          }
          myChart.setOption(option)
          
          const handleResize = () => myChart.resize()
          window.addEventListener('resize', handleResize)
          
          return () => {
            window.removeEventListener('resize', handleResize)
            myChart.dispose()
          }
        }
      } else {
        // Retry after a short delay if ECharts is not loaded yet
        setTimeout(initChart, 100)
      }
    }
    
    // Start initialization with a small delay to ensure DOM is ready
    setTimeout(initChart, 200)
  }, [])

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/echarts/5.5.0/echarts.min.js" />
      
      <div className="font-sans text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900 transition-colors duration-300">

        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] transition-colors duration-300">
          <div 
            className="absolute inset-0 bg-right bg-no-repeat bg-contain opacity-20 sm:opacity-40 md:opacity-60 lg:opacity-90"
            style={{
              backgroundImage: "url('https://readdy.ai/api/search-image?query=professional%2520financial%2520advisor%2520discussing%2520debt%2520consolidation%2520with%2520client%252C%2520showing%2520charts%2520on%2520tablet%252C%2520modern%2520office%2520setting%252C%2520bright%2520and%2520airy%2520space%252C%2520green%2520plants%2520in%2520background%252C%2520soft%2520natural%2520lighting%252C%2520documents%2520with%2520graphs%2520showing%2520savings%252C%2520left%2520side%2520with%2520clean%2520white%2520space%2520for%2520text&width=800&height=600&seq=umschuldung123&orientation=landscape')"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-green-50/80 to-transparent sm:from-green-50/90 sm:via-green-50/70 md:from-green-50/80 md:via-green-50/60 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-transparent dark:sm:from-gray-900/90 dark:sm:via-gray-900/70 dark:md:from-gray-900/80 dark:md:via-gray-900/60"></div>
          <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20 lg:py-24 relative z-10 flex items-center min-h-[500px] sm:min-h-[600px] lg:min-h-[700px]">
            <div className="max-w-xl lg:max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4 sm:mb-6 leading-tight">
                Clever umschulden und Geld sparen
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 sm:mb-10 leading-relaxed">
                Fassen Sie bestehende Kredite zu besseren Konditionen zusammen und reduzieren Sie Ihre monatliche Belastung deutlich.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link 
                  href="#calculator" 
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base group"
                >
                  <span>Sparpotenzial berechnen</span>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
                <UnverbindlichAnfragenButton variant="secondary" size="md" className="py-3 sm:py-4 px-6 sm:px-8 text-sm sm:text-base" />
              </div>
            </div>
          </div>
        </section>

        {/* Advantages */}
        <section id="advantages" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vorteile der Umschuldung</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Eine Umschuldung bietet zahlreiche finanzielle Vorteile und verschafft Ihnen mehr finanziellen Spielraum.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className="ri-money-euro-box-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Niedrigere monatliche Rate</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Reduzieren Sie Ihre monatliche Belastung und gewinnen Sie finanziellen Spielraum für andere wichtige Ausgaben.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className="ri-file-list-3-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Bessere Übersicht</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Statt mehrerer Kredite bei verschiedenen Banken haben Sie nur noch einen Kredit mit einer Rate zu verwalten.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className="ri-percent-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Günstigerer Zinssatz</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Profitieren Sie von aktuell niedrigeren Zinsen und sparen Sie über die gesamte Laufzeit erhebliche Summen.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className="ri-calendar-line ri-lg"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Flexible Laufzeiten</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Passen Sie die Laufzeit an Ihre finanzielle Situation an – kürzer für schnellere Schuldenfreiheit oder länger für niedrigere Raten.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Savings Example */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Typisches Einsparpotenzial</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Sehen Sie anhand eines Beispiels, wie viel Sie durch eine Umschuldung sparen können.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
                <div className="p-6 md:p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Aktuelle Situation</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">Ratenkredit</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">12.000 € (8,9%)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">Autokredit</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">8.500 € (6,5%)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">Kreditkarte</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">3.500 € (14,9%)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">Gesamtsumme</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">24.000 €</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">Monatliche Rate</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">730 €</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Restlaufzeit</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">48 Monate</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Nach der Umschuldung</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">Neuer Kredit</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">24.000 € (4,5%)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">Monatliche Rate</span>
                          <span className="font-medium text-primary">550 €</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">Restlaufzeit</span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">48 Monate</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-600">
                          <span className="text-gray-600 dark:text-gray-300">Monatliche Ersparnis</span>
                          <span className="font-semibold text-primary">180 €</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-300">Gesamtersparnis</span>
                          <span className="font-semibold text-primary">8.640 €</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <div id="savings-chart" style={{ width: '100%', height: '300px' }} className="bg-gray-50 dark:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                          <i className="ri-bar-chart-line ri-2x"></i>
                        </div>
                        <p>Diagramm wird geladen...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section id="calculator" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Umschuldungsrechner</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Berechnen Sie Ihr individuelles Sparpotenzial und finden Sie heraus, wie viel Sie durch eine Umschuldung sparen können.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 max-w-4xl mx-auto transition-colors duration-300">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Aktuelle Situation</h3>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Gesamte Kreditsumme</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={totalDebtAmount}
                        onChange={(e) => setTotalDebtAmount(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="1000" 
                        max="100000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                    <input 
                      type="range" 
                      value={totalDebtAmount}
                      onChange={(e) => setTotalDebtAmount(Number(e.target.value))}
                      min="1000" 
                      max="100000" 
                      step="500" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>1.000 €</span>
                      <span>100.000 €</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Durchschnittlicher Zinssatz</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={currentInterestRate}
                        onChange={(e) => setCurrentInterestRate(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="1" 
                        max="20" 
                        step="0.1"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">%</div>
                    </div>
                    <input 
                      type="range" 
                      value={currentInterestRate}
                      onChange={(e) => setCurrentInterestRate(Number(e.target.value))}
                      min="1" 
                      max="20" 
                      step="0.1" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>1%</span>
                      <span>20%</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Aktuelle monatliche Rate</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={currentMonthlyPayment}
                        onChange={(e) => setCurrentMonthlyPayment(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="50" 
                        max="5000"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">€</div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Anzahl Kredite</label>
                    <div className="flex">
                      <button 
                        onClick={() => setLoansCount(Math.max(1, loansCount - 1))}
                        className="bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-l border border-gray-300 dark:border-gray-600 transition-colors duration-300"
                      >
                        <i className="ri-subtract-line"></i>
                      </button>
                      <input 
                        type="number" 
                        value={loansCount}
                        onChange={(e) => setLoansCount(Number(e.target.value))}
                        className="w-full border-y border-gray-300 dark:border-gray-600 py-3 px-4 text-center bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="1" 
                        max="10"
                      />
                      <button 
                        onClick={() => setLoansCount(Math.min(10, loansCount + 1))}
                        className="bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-r border border-gray-300 dark:border-gray-600 transition-colors duration-300"
                      >
                        <i className="ri-add-line"></i>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Neue Konditionen</h3>
                  
                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Neuer Zinssatz</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={newInterestRate}
                        onChange={(e) => setNewInterestRate(Number(e.target.value))}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="1" 
                        max="15" 
                        step="0.1"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">%</div>
                    </div>
                    <input 
                      type="range" 
                      value={newInterestRate}
                      onChange={(e) => setNewInterestRate(Number(e.target.value))}
                      min="1" 
                      max="15" 
                      step="0.1" 
                      className="w-full mt-2 accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>1%</span>
                      <span>15%</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Neue Laufzeit</label>
                    <div className="flex">
                      <button 
                        onClick={() => setNewLoanTerm(Math.max(12, newLoanTerm - 6))}
                        className="bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-l border border-gray-300 dark:border-gray-600 transition-colors duration-300"
                      >
                        <i className="ri-subtract-line"></i>
                      </button>
                      <input 
                        type="number" 
                        value={newLoanTerm}
                        onChange={(e) => setNewLoanTerm(Number(e.target.value))}
                        className="w-full border-y border-gray-300 dark:border-gray-600 py-3 px-4 text-center bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                        min="12" 
                        max="120"
                      />
                      <button 
                        onClick={() => setNewLoanTerm(Math.min(120, newLoanTerm + 6))}
                        className="bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 font-bold py-3 px-4 rounded-r border border-gray-300 dark:border-gray-600 transition-colors duration-300"
                      >
                        <i className="ri-add-line"></i>
                      </button>
                    </div>
                    <div className="absolute inset-y-0 right-12 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">Monate</div>
                    <input 
                      type="range" 
                      value={newLoanTerm}
                      onChange={(e) => setNewLoanTerm(Number(e.target.value))}
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

                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg transition-colors duration-300">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Ihr Sparpotenzial</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Neue monatliche Rate:</span>
                        <span className="font-semibold text-primary">{savings.newPayment} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Monatliche Ersparnis:</span>
                        <span className="font-semibold text-primary">{savings.monthlySaving} €</span>
                      </div>
                      <div className="flex justify-between border-t pt-3">
                        <span className="text-gray-600 dark:text-gray-300">Gesamtersparnis:</span>
                        <span className="font-bold text-primary text-lg">{savings.totalSaving} €</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="angebot" className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Unverbindliches Angebot anfordern</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Füllen Sie das Formular aus und erhalten Sie ein individuelles Umschuldungsangebot von unseren Experten.
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleFormSubmit} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 md:p-8 transition-colors duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Anrede</label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="anrede" 
                          value="herr" 
                          checked={formData.anrede === 'herr'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full mr-2 flex items-center justify-center">
                          <div className={`w-2 h-2 bg-primary rounded-full ${formData.anrede === 'herr' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                        <span className="text-gray-900 dark:text-gray-100">Herr</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="anrede" 
                          value="frau" 
                          checked={formData.anrede === 'frau'}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full mr-2 flex items-center justify-center">
                          <div className={`w-2 h-2 bg-primary rounded-full ${formData.anrede === 'frau' ? 'opacity-100' : 'opacity-0'}`}></div>
                        </div>
                        <span className="text-gray-900 dark:text-gray-100">Frau</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Vorname</label>
                    <input 
                      type="text" 
                      name="vorname"
                      value={formData.vorname}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nachname</label>
                    <input 
                      type="text" 
                      name="nachname"
                      value={formData.nachname}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">E-Mail</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Telefon</label>
                    <input 
                      type="tel" 
                      name="telefon"
                      value={formData.telefon}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Geburtsdatum</label>
                    <input 
                      type="date" 
                      name="geburtsdatum"
                      value={formData.geburtsdatum}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="flex items-start">
                    <input 
                      type="checkbox" 
                      name="datenschutz"
                      checked={formData.datenschutz}
                      onChange={handleInputChange}
                      className="mt-1 mr-3"
                      required
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Ich habe die <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link> gelesen und stimme der Verarbeitung meiner Daten zu.
                    </span>
                  </label>
                </div>
                
                <div className="mt-8">
                  <button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all text-center"
                  >
                    Unverbindliches Angebot anfordern
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">100% kostenlos & SCHUFA-neutral</p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">So funktioniert die Umschuldung</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                In nur vier einfachen Schritten zu Ihrer erfolgreichen Umschuldung.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-green-100 dark:bg-green-800 md:block hidden"></div>
                <div className="space-y-12">
                  <div className="relative">
                    <div className="md:flex items-start">
                      <div className="md:flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl z-10 relative md:mr-8">1</div>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm flex-grow transition-colors duration-300">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Bonitätsprüfung</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Wir prüfen Ihre Kreditwürdigkeit SCHUFA-neutral und ermitteln, welche Konditionen für Sie möglich sind.
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                              <i className="ri-check-line"></i>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Kostenlos</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                              <i className="ri-check-line"></i>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">SCHUFA-neutral</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                              <i className="ri-check-line"></i>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Schnell & unkompliziert</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="md:flex items-start">
                      <div className="md:flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl z-10 relative md:mr-8">2</div>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm flex-grow transition-colors duration-300">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Kreditvergleich</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Wir vergleichen die Angebote von über 20 Banken und finden die beste Lösung für Ihre Umschuldung.
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                              <i className="ri-check-line"></i>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Unabhängiger Vergleich</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                              <i className="ri-check-line"></i>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Über 20 Banken</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                              <i className="ri-check-line"></i>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Beste Konditionen</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="md:flex items-start">
                      <div className="md:flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl z-10 relative md:mr-8">3</div>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm flex-grow transition-colors duration-300">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Dokumenteneinreichung</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Reichen Sie alle erforderlichen Unterlagen bequem online ein – ohne Papierkram und Behördengänge.
                        </p>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded transition-colors duration-300">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Benötigte Unterlagen:</h4>
                            <ul className="space-y-2">
                              <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                                  <i className="ri-checkbox-circle-line"></i>
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">Personalausweis</span>
                              </li>
                              <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                                  <i className="ri-checkbox-circle-line"></i>
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">Gehaltsabrechnungen (3 Monate)</span>
                              </li>
                              <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                                  <i className="ri-checkbox-circle-line"></i>
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">Kontoauszüge (3 Monate)</span>
                              </li>
                            </ul>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-600 p-4 rounded transition-colors duration-300">
                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Für bestehende Kredite:</h4>
                            <ul className="space-y-2">
                              <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                                  <i className="ri-checkbox-circle-line"></i>
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">Kreditverträge</span>
                              </li>
                              <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                                  <i className="ri-checkbox-circle-line"></i>
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">Aktuelle Salden</span>
                              </li>
                              <li className="flex items-center">
                                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                                  <i className="ri-checkbox-circle-line"></i>
                                </div>
                                <span className="text-gray-600 dark:text-gray-300">Ablöseinformationen</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="md:flex items-start">
                      <div className="md:flex-shrink-0 mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl z-10 relative md:mr-8">4</div>
                      </div>
                      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm flex-grow transition-colors duration-300">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Vertragsabschluss</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                          Unterschreiben Sie Ihren neuen Kreditvertrag digital und die Bank kümmert sich um die Ablösung Ihrer bestehenden Kredite.
                        </p>
                        <div className="flex flex-wrap gap-4">
                          <div className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                              <i className="ri-check-line"></i>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Digitale Unterschrift</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                              <i className="ri-check-line"></i>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Automatische Ablösung</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                              <i className="ri-check-line"></i>
                            </div>
                            <span className="text-gray-600 dark:text-gray-300">Schnelle Bearbeitung</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Häufig gestellte Fragen</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Antworten auf die wichtigsten Fragen rund um das Thema Umschuldung.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-4">
                {faqData.map((faq, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between p-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <span className="font-medium text-left text-gray-900 dark:text-gray-100">{faq.question}</span>
                      <div className="w-5 h-5 flex items-center justify-center text-primary">
                        <i className={openFaq === index ? "ri-subtract-line" : "ri-add-line"}></i>
                      </div>
                    </button>
                    {openFaq === index && (
                      <div className="px-5 pb-5 bg-white dark:bg-gray-800">
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
        <section className="py-16 bg-green-50 dark:bg-green-900/20 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bereit, Ihre Finanzen zu optimieren?</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                Starten Sie jetzt Ihre Umschuldung und sparen Sie bares Geld. Unser Expertenteam unterstützt Sie bei jedem Schritt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="#calculator" 
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
                >
                  <span>Sparpotenzial berechnen</span>
                  <div className="w-5 h-5 ml-2 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
                <Link 
                  href="#angebot" 
                  className="border border-gray-300 dark:border-gray-600 hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-3 px-8 rounded-button whitespace-nowrap flex items-center justify-center transition-all"
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
                  <span className="text-gray-600 dark:text-gray-300">100% kostenlos</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">SCHUFA-neutral</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">Unverbindlich</span>
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                    <i className="ri-check-line"></i>
                  </div>
                  <span className="text-gray-600 dark:text-gray-300">Schnelle Bearbeitung</span>
                </div>
              </div>
            </div>
          </div>
        </section>


      </div>
    </>
  )
}

export default UmschuldungPage