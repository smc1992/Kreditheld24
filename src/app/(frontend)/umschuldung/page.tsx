'use client'
import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '../../../components/UnverbindlichAnfragenButton'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'

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

  // Prefill via Suspense-isolated Client subcomponent to satisfy Next.js build
  const PrefillFromParams: React.FC = () => {
    const params = useSearchParams()
    useEffect(() => {
      if (!params) return

      const amount = params.get('amount')
      const currentInterest = params.get('currentInterest')
      const newInterest = params.get('newInterest')
      const termYears = params.get('termYears')
      const currentMonthly = params.get('currentMonthly')

      if (amount) {
        const val = parseFloat(amount)
        if (!Number.isNaN(val)) setTotalDebtAmount(val)
      }
      if (currentInterest) {
        const val = parseFloat(currentInterest)
        if (!Number.isNaN(val)) setCurrentInterestRate(val)
      }
      if (newInterest) {
        const val = parseFloat(newInterest)
        if (!Number.isNaN(val)) setNewInterestRate(val)
      }
      if (termYears) {
        const years = parseFloat(termYears)
        if (!Number.isNaN(years)) setNewLoanTerm(Math.round(years * 12))
      }
      // If currentMonthly not provided, approximate from amount & current interest
      if (currentMonthly) {
        const val = parseFloat(currentMonthly)
        if (!Number.isNaN(val)) setCurrentMonthlyPayment(val)
      } else if (amount && currentInterest) {
        const amt = parseFloat(amount)
        const rate = parseFloat(currentInterest)
        if (!Number.isNaN(amt) && !Number.isNaN(rate)) {
          const approx = (amt * (rate / 100)) / 12
          setCurrentMonthlyPayment(Number(approx.toFixed(2)))
        }
      }
    }, [params])
    return null
  }

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

        {/* Suspense boundary for query param prefill */}
        <Suspense fallback={null}>
          <PrefillFromParams />
        </Suspense>

        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] transition-colors duration-300">
          <div 
            className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-30"
            style={{
              backgroundImage: "url('/images/debt-consolidation-new.webp')"
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
                  href="/kreditrechner" 
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
        <section id="advantages" className="py-16 bg-gradient-to-br from-white via-green-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 border border-primary rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-500 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-green-400 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Umschuldung Vorteile</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vorteile der Umschuldung</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Eine Umschuldung bietet zahlreiche finanzielle Vorteile und verschafft Ihnen mehr finanziellen Spielraum.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 flex items-center justify-center text-primary">
                    <i className="ri-money-euro-box-line text-2xl"></i>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Niedrigere monatliche Rate</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Reduzieren Sie Ihre monatliche Belastung und gewinnen Sie finanziellen Spielraum für andere wichtige Ausgaben.
                </p>
              </div>
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500/30 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 flex items-center justify-center text-blue-600">
                    <i className="ri-file-list-3-line text-2xl"></i>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Bessere Übersicht</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Statt mehrerer Kredite bei verschiedenen Banken haben Sie nur noch einen Kredit mit einer Rate zu verwalten.
                </p>
              </div>
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 flex items-center justify-center text-primary">
                    <i className="ri-percent-line text-2xl"></i>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Günstigerer Zinssatz</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Profitieren Sie von aktuell niedrigeren Zinsen und sparen Sie über die gesamte Laufzeit erhebliche Summen.
                </p>
              </div>
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500/30 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 h-8 flex items-center justify-center text-blue-600">
                    <i className="ri-calendar-line text-2xl"></i>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Flexible Laufzeiten</h3>
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

        {/* Aktionen statt Rechner */}
        <section id="aktionen" className="py-16 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
          {/* Hintergrundmuster */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-24 h-24 border border-primary rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 border border-blue-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-400 rounded-full"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Schnellstart</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Was möchten Sie tun?</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Wählen Sie zwischen dem Kreditvergleich und unserer individuellen Service-Anfrage.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kreditrechner" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
              >
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <i className="ri-external-link-line"></i>
                </div>
                <span>Jetzt Kredit vergleichen</span>
              </Link>
              <UnverbindlichAnfragenButton variant="secondary" size="md" className="py-3 px-8" />
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
            </div>
          </div>
        </section>

        {/* Contact Form entfernt */}

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
        <section className="py-16 bg-gradient-to-br from-green-50 via-green-100/50 to-green-50 dark:from-green-900/20 dark:via-green-800/30 dark:to-green-900/20 transition-colors duration-300 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-24 h-24 border border-green-400 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 border border-green-500 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-300 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Jetzt starten</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Bereit, Ihre Finanzen zu optimieren?</h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                Starten Sie jetzt Ihre Umschuldung und sparen Sie bares Geld. Unser Expertenteam unterstützt Sie bei jedem Schritt.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/kreditrechner" 
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
                >
                  <span>Sparpotenzial berechnen</span>
                  <div className="w-5 h-5 ml-2 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
                <UnverbindlichAnfragenButton 
                  variant="secondary" 
                  size="md" 
                  className="px-8"
                />
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