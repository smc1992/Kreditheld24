'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '../../../components/UnverbindlichAnfragenButton'


const RatenkreditePage = () => {

  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [econLoaded, setEconLoaded] = useState(false)
  const [econError, setEconError] = useState(false)
  const econInitRef = useRef(false)
  const scriptAddedRef = useRef(false)

  useEffect(() => {
    const ECON_SRC = 'https://europace.nc.econ-application.de/frontend/europace/assets/js/econ.js'
    const targetId = 'econ-ratenkredit'
    const container = typeof document !== 'undefined' ? document.getElementById(targetId) : null
    if (!container) return

    const initialize = () => {
      if (econInitRef.current) return
      try {
        const econ = (window as any).econ
        if (econ && typeof econ.initEcon === 'function') {
          econ.initEcon(
            targetId,
            'https://europace.nc.econ-application.de/econ/process/LKJ98/kreditlead?epid_uv=XPS71',
            [],
            0
          )
          econInitRef.current = true
          setEconLoaded(true)
        } else {
          console.warn('Econ library loaded but API missing')
        }
      } catch (e) {
        console.error('Econ init failed on ratenkredite page:', e)
        setEconError(true)
      }
    }

    // If econ already available, initialize once
    if (typeof window !== 'undefined' && (window as any).econ) {
      initialize()
    }

    // Avoid re-adding script in StrictMode
    let script = document.querySelector(`script[src="${ECON_SRC}"]`) as HTMLScriptElement | null
    if (!script && !scriptAddedRef.current) {
      script = document.createElement('script')
      script.src = ECON_SRC
      script.async = true
      script.onload = initialize
      script.onerror = (e) => {
        console.error('Failed to load econ script', e)
        setEconError(true)
      }
      document.body.appendChild(script)
      scriptAddedRef.current = true
    } else if (script) {
      // If script exists and is already loaded, initialize
      // Some browsers set readyState, otherwise rely on econ presence
      if ((script as any).readyState === 'complete' || (window as any).econ) {
        initialize()
      } else {
        script.addEventListener('load', initialize, { once: true })
      }
    }

    return () => {
      // Keep script; guards ensure no duplicate initialization on re-renders
    }
  }, [])


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
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-30"
          style={{
            backgroundImage: "url('/images/ratenkredite-hero-new.webp')"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-50/95 via-green-50/80 to-transparent sm:from-green-50/90 sm:via-green-50/70 md:from-green-50/80 md:via-green-50/60 dark:from-gray-900/95 dark:via-gray-900/80 dark:to-transparent dark:sm:from-gray-900/90 dark:sm:via-gray-900/70 dark:md:from-gray-900/80 dark:md:via-gray-900/60"></div>
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
                  href="/kreditanfrage"
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base group"
                >
                  <span>Individueller Service</span>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
                <Link 
                  href="#econ-ratenkredit"
                  className="group bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-button shadow-md hover:shadow-lg transition-all flex items-center justify-center text-sm sm:text-base"
                >
                  <span>Jetzt Kredit berechnen</span>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 ml-2 flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
              </div>
              
            {/* Mobile Trust Indicators */}
            <div className="mt-8 sm:mt-12 flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 dark:bg-gray-700/90 flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-primary">
                    <i className="ri-shield-check-line"></i>
                  </div>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">100% sicher</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 dark:bg-gray-700/90 flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-primary">
                    <i className="ri-timer-line"></i>
                  </div>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">Schnelle Zusage</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/90 dark:bg-gray-700/90 flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center text-primary">
                    <i className="ri-money-euro-circle-line"></i>
                  </div>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">Kostenlos</span>
              </div>
            </div>
            </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-br from-white via-green-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
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
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Ratenkredit Vorteile</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vorteile unserer Ratenkredite</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Bei Kreditheld24 finden Sie den passenden Ratenkredit zu attraktiven Konditionen – maßgeschneidert für Ihre Bedürfnisse.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 flex items-center justify-center text-primary">
                  <i className="ri-percent-line text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Attraktive Zinsen</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Profitieren Sie von günstigen Zinssätzen ab 2,99% effektiv p.a. durch unseren Bankenvergleich.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 flex items-center justify-center text-blue-600">
                  <i className="ri-calendar-check-line text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Flexible Laufzeiten</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Wählen Sie Laufzeiten zwischen 12 und 120 Monaten – ganz nach Ihren finanziellen Möglichkeiten.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 flex items-center justify-center text-primary">
                  <i className="ri-money-euro-box-line text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Kreditsummen bis 100.000 €</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Finanzieren Sie kleine Anschaffungen oder große Projekte mit Kreditsummen von 1.000 € bis 100.000 €.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-primary/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 flex items-center justify-center text-primary">
                  <i className="ri-timer-flash-line text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Schnelle Auszahlung</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Erhalten Sie Ihr Geld innerhalb von 24 Stunden nach Vertragsabschluss auf Ihrem Konto.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 flex items-center justify-center text-blue-600">
                  <i className="ri-refund-2-line text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">Kostenlose Sondertilgung</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Zahlen Sie Ihren Kredit jederzeit teilweise oder vollständig zurück – ohne zusätzliche Gebühren.
              </p>
            </div>
            <div className="group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-500/30 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <div className="w-8 h-8 flex items-center justify-center text-blue-600">
                  <i className="ri-shield-check-line text-2xl"></i>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">SCHUFA-neutrale Anfrage</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Unsere Vorabanfrage hat keinen Einfluss auf Ihren SCHUFA-Score – garantiert.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live-Rechner Embed */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Ratenkredit – Live-Rechner</h2>
            <p className="text-gray-600 dark:text-gray-300">Starten Sie Ihre unverbindliche Konditionsübersicht.</p>
          </div>
          <div id="econ-ratenkredit" className="min-h-[600px] w-full" />
           {econError && (
             <div className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
               Externer Kreditrechner aktuell nicht erreichbar. Bitte später erneut versuchen oder <a href="/kontakt" className="text-primary underline">Kontakt aufnehmen</a>.
             </div>
           )}

        </div>
      </section>



      {/* Process Section */}
      <section id="process" className="py-16 bg-gradient-to-br from-white via-blue-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
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
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Einfacher Prozess</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">So einfach geht&apos;s</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In nur wenigen Schritten zu Ihrem Ratenkredit – schnell, sicher und transparent.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Kreditwunsch eingeben</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Geben Sie Ihre gewünschte Kreditsumme und Laufzeit in unseren Rechner ein.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Angebote vergleichen</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Vergleichen Sie die besten Angebote von über 20 Banken und wählen Sie das passende aus.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Antrag stellen</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Füllen Sie den Kreditantrag online aus und legitimieren Sie sich per VideoIdent.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Geld erhalten</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Nach erfolgreicher Prüfung erhalten Sie das Geld innerhalb von 24 Stunden.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
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
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Häufige Fragen</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Antworten auf die wichtigsten Fragen rund um Ratenkredite bei Kreditheld24.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {faqData.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-left flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-800 dark:text-gray-100">{faq.question}</span>
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className={`ri-${openFaq === index ? 'subtract' : 'add'}-line`}></i>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="bg-white dark:bg-gray-700 px-6 pb-6 rounded-b-lg shadow-sm transition-colors duration-300">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary via-green-600 to-primary dark:from-green-700 dark:via-green-600 dark:to-green-700 text-white transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border border-green-300 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-green-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-200 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-white">Jetzt starten</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Bereit für Ihren Ratenkredit?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Vergleichen Sie jetzt kostenlos die besten Angebote und sparen Sie bares Geld.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kreditanfrage"
              className="bg-white text-primary hover:bg-gray-100 font-medium py-3 px-8 rounded-button shadow-md transition-all inline-flex items-center justify-center"
            >
              <span>Individueller Service</span>
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