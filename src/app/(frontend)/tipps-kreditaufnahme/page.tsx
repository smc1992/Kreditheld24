'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

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
      <section className="relative w-full bg-gradient-to-r from-green-50 to-green-100 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=professional%2520financial%2520advisor%2520explaining%2520loan%2520documents%2520to%2520clients%252C%2520modern%2520office%2520setting%252C%2520bright%2520and%2520airy%2520environment%252C%2520professional%2520attire%252C%2520documents%2520with%2520charts%2520and%2520graphs%2520on%2520desk%252C%2520calculator%2520and%2520laptop%2520visible%252C%2520soft%2520natural%2520lighting%252C%2520left%2520side%2520clear%2520for%2520text%2520overlay%252C%2520professional%2520photography&width=1920&height=600&seq=tipps1&orientation=landscape')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: 0.85
          }}
        ></div>
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-2xl backdrop-blur-sm bg-white/30 p-6 md:p-8 rounded-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
              Tipps zur Kreditaufnahme
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8">
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
      <section id="tipps" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Detaillierte Tipps für jeden Schritt</h2>
            
            {tipps.map((kategorie, index) => (
              <div key={index} id={kategorie.kategorie.toLowerCase()} className="mb-12">
                <div className="bg-white rounded-lg shadow-md p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mr-4">
                      <i className={`${kategorie.icon} ri-lg`}></i>
                    </div>
                    <h3 className="text-2xl font-bold">{kategorie.kategorie}</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {kategorie.tipps.map((tipp, tippIndex) => (
                      <div key={tippIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className="text-gray-700">{tipp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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