'use client'
import React, { useState } from 'react'
import Link from 'next/link'

const TippsKreditaufnahmePage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqData = [
    {
      question: "Welche Unterlagen benötige ich für einen Kreditantrag?",
      answer: "Für einen Kreditantrag benötigen Sie in der Regel: Personalausweis oder Reisepass, Einkommensnachweise der letzten 3 Monate (Gehaltsabrechnungen), Kontoauszüge der letzten 3 Monate, bei Selbstständigen: BWA und Steuerbescheide der letzten 2 Jahre."
    },
    {
      question: "Wie kann ich meine Bonität verbessern?",
      answer: "Zur Bonitätsverbesserung können Sie: Bestehende Kredite pünktlich zurückzahlen, unnötige Girokonten schließen, SCHUFA-Auskunft prüfen und Fehler korrigieren lassen, Kreditkartenlimits reduzieren und regelmäßiges Einkommen nachweisen."
    },
    {
      question: "Was ist der Unterschied zwischen Sollzins und effektivem Jahreszins?",
      answer: "Der Sollzins ist der reine Zinssatz für das geliehene Geld. Der effektive Jahreszins beinhaltet zusätzlich alle Nebenkosten wie Bearbeitungsgebühren und ist daher die wichtigere Vergleichsgröße."
    },
    {
      question: "Wann sollte ich einen Kredit umschulden?",
      answer: "Eine Umschuldung lohnt sich, wenn: die aktuellen Zinsen deutlich niedriger sind als bei Ihrem bestehenden Kredit, Sie mehrere Kredite zu einem zusammenfassen möchten oder Sie die monatliche Rate reduzieren wollen."
    },
    {
      question: "Kann ich einen Kredit vorzeitig zurückzahlen?",
      answer: "Ja, Kredite können grundsätzlich vorzeitig zurückgezahlt werden. Bei Verbraucherdarlehen darf die Bank maximal 1% der Restschuld (bei Restlaufzeit über 12 Monate) bzw. 0,5% (bei Restlaufzeit unter 12 Monate) als Vorfälligkeitsentschädigung verlangen."
    }
  ]

  const tipps = [
    {
      kategorie: "Vorbereitung",
      icon: "ri-file-list-3-line",
      tipps: [
        "Sammeln Sie alle erforderlichen Unterlagen vor der Antragstellung",
        "Prüfen Sie Ihre SCHUFA-Auskunft auf Fehler",
        "Berechnen Sie Ihre monatliche Belastbarkeit realistisch",
        "Legen Sie den genauen Kreditbedarf fest"
      ]
    },
    {
      kategorie: "Vergleich",
      icon: "ri-scales-3-line",
      tipps: [
        "Vergleichen Sie immer den effektiven Jahreszins, nicht nur den Sollzins",
        "Achten Sie auf versteckte Kosten und Gebühren",
        "Prüfen Sie die Möglichkeit kostenloser Sondertilgungen",
        "Berücksichtigen Sie die Flexibilität bei Ratenpausen"
      ]
    },
    {
      kategorie: "Bonität",
      icon: "ri-line-chart-line",
      tipps: [
        "Zahlen Sie bestehende Kredite pünktlich zurück",
        "Schließen Sie nicht benötigte Girokonten",
        "Vermeiden Sie häufige Kontowechsel",
        "Nutzen Sie den Dispokredit nur kurzfristig"
      ]
    },
    {
      kategorie: "Abschluss",
      icon: "ri-contract-line",
      tipps: [
        "Lesen Sie den Kreditvertrag sorgfältig durch",
        "Nutzen Sie Ihr 14-tägiges Widerrufsrecht",
        "Prüfen Sie alle Konditionen vor der Unterschrift",
        "Bewahren Sie alle Unterlagen sicher auf"
      ]
    }
  ]

  return (
    <div className="font-sans text-gray-800 bg-white">
      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900 text-white transition-colors duration-300 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border border-green-300 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-green-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-200 rounded-full"></div>
          <div className="absolute top-20 right-20 w-20 h-20 border border-green-300 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-white">Kreditratgeber</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Tipps zur Kreditaufnahme
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Erfahren Sie, wie Sie einen Kredit optimal vorbereiten, vergleichen und zu den besten Konditionen abschließen können. Mit unseren Expertentipps sparen Sie Zeit und Geld.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="#tipps"
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-sm transition-all"
              >
                Zu den Tipps
              </Link>
              <Link
                href="#checklisten"
                className="bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-sm transition-all border border-gray-200"
              >
                Checklisten herunterladen
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Optimieren Sie Ihren Weg zum Wunschkredit</h2>
            <p className="text-lg text-gray-600">
              Die richtige Vorbereitung und Planung kann Ihnen tausende Euro sparen und den Kreditprozess erheblich vereinfachen. Unsere Experten haben die wichtigsten Tipps zusammengestellt.
            </p>
          </div>

          {/* Categories Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16" id="kategorien">
            {tipps.map((kategorie, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md hover:border-primary/30">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 text-primary">
                  <i className={`${kategorie.icon} ri-2x`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3">{kategorie.kategorie}</h3>
                <p className="text-gray-600 mb-4">
                  {kategorie.kategorie === 'Vorbereitung' && 'Lernen Sie, wie Sie sich optimal auf die Kreditbeantragung vorbereiten und welche Unterlagen Sie bereithalten sollten.'}
                  {kategorie.kategorie === 'Vergleich' && 'Erfahren Sie, worauf Sie beim Kreditvergleich achten sollten und wie Sie die versteckten Kosten identifizieren.'}
                  {kategorie.kategorie === 'Bonität' && 'Entdecken Sie effektive Strategien zur Verbesserung Ihrer Kreditwürdigkeit und Senkung der Zinsen.'}
                  {kategorie.kategorie === 'Abschluss' && 'Wichtige Punkte beim Vertragsabschluss und worauf Sie unbedingt achten sollten.'}
                </p>
                <Link
                  href={`#${kategorie.kategorie.toLowerCase()}`}
                  className="inline-flex items-center text-primary font-medium"
                >
                  <span>Mehr erfahren</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Tips Sections */}
      <section id="tipps" className="py-16 bg-gradient-to-br from-gray-50 via-green-50/10 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-green-500 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-400">Detaillierte Tipps</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Detaillierte Tipps für jeden Schritt</h2>
              <p className="text-gray-600 dark:text-gray-300">Folgen Sie unserer bewährten Schritt-für-Schritt Anleitung</p>
            </div>
            
            {tipps.map((kategorie, index) => {
              const isGreenCard = index % 2 === 1; // Alternating pattern
              return (
                <div key={index} id={kategorie.kategorie.toLowerCase()} className="mb-12">
                  <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-500/30 transform hover:-translate-y-1 p-8">
                    <div className="flex items-center mb-6">
                      <div className={`w-16 h-16 ${isGreenCard ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 text-primary' : 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 text-blue-600'} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`${kategorie.icon} text-2xl`}></i>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{kategorie.kategorie}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      {kategorie.tipps.map((tipp, tippIndex) => (
                        <div key={tippIndex} className="flex items-start group/item">
                          <div className={`w-3 h-3 ${isGreenCard ? 'bg-primary' : 'bg-blue-500'} rounded-full mt-2 mr-4 flex-shrink-0 group-hover/item:scale-125 transition-transform duration-300`}></div>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{tipp}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
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
              Antworten auf die wichtigsten Fragen rund um die Kreditaufnahme.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            {faqData.map((faq, index) => (
              <div key={index} className="mb-4">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left flex justify-between items-center border border-gray-100"
                >
                  <span className="font-semibold text-gray-800">{faq.question}</span>
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className={`ri-${openFaq === index ? 'subtract' : 'add'}-line`}></i>
                  </div>
                </button>
                {openFaq === index && (
                  <div className="bg-white px-6 pb-6 rounded-b-lg shadow-sm border-l border-r border-b border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklists Section */}
      <section id="checklisten" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kostenlose Checklisten</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Laden Sie unsere praktischen Checklisten herunter und behalten Sie den Überblick bei Ihrer Kreditaufnahme.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <i className="ri-file-list-3-line ri-2x"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Unterlagen-Checkliste</h3>
              <p className="text-gray-600 mb-6">Alle erforderlichen Dokumente für Ihren Kreditantrag im Überblick.</p>
              <button className="bg-primary hover:bg-green-500 text-white font-medium py-2 px-6 rounded-button transition-all">
                PDF herunterladen
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <i className="ri-calculator-line ri-2x"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Budgetplaner</h3>
              <p className="text-gray-600 mb-6">Berechnen Sie Ihre monatliche Belastbarkeit und planen Sie Ihr Budget.</p>
              <button className="bg-primary hover:bg-green-500 text-white font-medium py-2 px-6 rounded-button transition-all">
                PDF herunterladen
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                <i className="ri-scales-3-line ri-2x"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">Vergleichstabelle</h3>
              <p className="text-gray-600 mb-6">Vergleichen Sie verschiedene Kreditangebote systematisch miteinander.</p>
              <button className="bg-primary hover:bg-green-500 text-white font-medium py-2 px-6 rounded-button transition-all">
                PDF herunterladen
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bereit für Ihren optimalen Kredit?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nutzen Sie unser Wissen und finden Sie den perfekten Kredit zu den besten Konditionen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-white text-primary hover:bg-gray-100 font-medium py-3 px-8 rounded-button shadow-md transition-all inline-flex items-center justify-center"
            >
              <span>Jetzt Kredit vergleichen</span>
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
              <span>Kostenlose Beratung</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TippsKreditaufnahmePage