'use client'
import React, { useState } from 'react'
import Link from 'next/link'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'allgemein' | 'antrag' | 'konditionen' | 'schufa' | 'sicherheit' | 'tilgung'
}

const faqItems: FAQItem[] = [
  // Allgemeine Fragen
  {
    id: '1',
    question: 'Wie funktioniert die Kreditvermittlung bei Kreditheld24?',
    answer: 'Kreditheld24 vermittelt Kredite zwischen Kreditnehmern und verschiedenen Banken. Wir vergleichen die Angebote und finden den passenden Kredit für Ihre Bedürfnisse. Unser Service ist für Sie kostenlos.',
    category: 'allgemein'
  },
  {
    id: '2',
    question: 'Ist die Nutzung von Kreditheld24 kostenlos?',
    answer: 'Ja, unsere Kreditvermittlung ist für Sie als Kunde vollständig kostenlos. Wir erhalten eine Provision von den Banken, wenn ein Kredit erfolgreich vermittelt wird.',
    category: 'allgemein'
  },
  {
    id: '3',
    question: 'Welche Kreditarten vermitteln Sie?',
    answer: 'Wir vermitteln Ratenkredite, Autokredite, Umschuldungen, Sofortkredite und Kredite für Selbstständige. Für jede Lebenssituation finden wir die passende Finanzierungslösung.',
    category: 'allgemein'
  },
  {
    id: '4',
    question: 'Wie seriös ist Kreditheld24?',
    answer: 'Kreditheld24 ist ein seriöser Kreditvermittler mit § 34c GewO Erlaubnis. Wir arbeiten nur mit renommierten Banken zusammen und halten alle gesetzlichen Bestimmungen ein.',
    category: 'allgemein'
  },
  
  // Antragsprozess
  {
    id: '5',
    question: 'Wie lange dauert die Kreditbearbeitung?',
    answer: 'Die Bearbeitung dauert in der Regel 1-3 Werktage. Bei Sofortkrediten kann die Auszahlung bereits am selben Tag erfolgen, wenn alle Unterlagen vollständig vorliegen.',
    category: 'antrag'
  },
  {
    id: '6',
    question: 'Welche Unterlagen benötige ich für den Kreditantrag?',
    answer: 'Sie benötigen: Personalausweis, aktuelle Gehaltsabrechnungen (3 Monate), Kontoauszüge und ggf. weitere Einkommensnachweise. Bei Selbstständigen zusätzlich BWA oder Steuerbescheid.',
    category: 'antrag'
  },
  {
    id: '7',
    question: 'Kann ich meinen Kreditantrag online stellen?',
    answer: 'Ja, Sie können Ihren Kreditantrag vollständig online stellen. Unser digitaler Antragsprozess ist sicher und dauert nur wenige Minuten.',
    category: 'antrag'
  },
  {
    id: '8',
    question: 'Was passiert nach dem Absenden des Antrags?',
    answer: 'Nach dem Absenden prüfen wir Ihre Angaben und leiten den Antrag an passende Banken weiter. Sie erhalten zeitnah Rückmeldung über mögliche Kreditangebote.',
    category: 'antrag'
  },
  {
    id: '9',
    question: 'Kann ich mehrere Kreditangebote erhalten?',
    answer: 'Ja, wir können Ihnen mehrere Angebote verschiedener Banken unterbreiten, damit Sie das beste Angebot für Ihre Situation auswählen können.',
    category: 'antrag'
  },
  
  // Konditionen
  {
    id: '10',
    question: 'Wie hoch sind die Zinsen für einen Kredit?',
    answer: 'Die Zinsen variieren je nach Kreditart, Laufzeit und Ihrer Bonität. Aktuelle Zinssätze finden Sie auf unserer Zinssätze-Seite. Wir vermitteln Kredite ab 0,68% eff. Jahreszins.',
    category: 'konditionen'
  },
  {
    id: '11',
    question: 'Welche Kreditsummen sind möglich?',
    answer: 'Je nach Kreditart vermitteln wir Kredite von 1.000 € bis 120.000 €. Die maximale Kreditsumme hängt von Ihrem Einkommen und Ihrer Bonität ab.',
    category: 'konditionen'
  },
  {
    id: '12',
    question: 'Welche Laufzeiten sind möglich?',
    answer: 'Die Laufzeiten variieren je nach Kreditart zwischen 12 und 120 Monaten. Längere Laufzeiten bedeuten niedrigere Raten, aber höhere Gesamtkosten.',
    category: 'konditionen'
  },
  {
    id: '13',
    question: 'Sind Sondertilgungen möglich?',
    answer: 'Ja, bei den meisten Krediten sind kostenlose Sondertilgungen möglich. Dies ermöglicht es Ihnen, den Kredit vorzeitig zurückzuzahlen und Zinsen zu sparen.',
    category: 'konditionen'
  },
  
  // SCHUFA
  {
    id: '14',
    question: 'Wird bei der Kreditanfrage mein SCHUFA-Score beeinflusst?',
    answer: 'Nein, unsere Kreditanfrage erfolgt SCHUFA-neutral als Konditionsanfrage. Ihr SCHUFA-Score wird dadurch nicht negativ beeinflusst.',
    category: 'schufa'
  },
  {
    id: '15',
    question: 'Bekomme ich einen Kredit trotz negativer SCHUFA?',
    answer: 'Das hängt von der Art und Schwere der SCHUFA-Einträge ab. Wir arbeiten auch mit Banken zusammen, die bei kleineren negativen Einträgen Kredite vergeben.',
    category: 'schufa'
  },
  {
    id: '16',
    question: 'Wie wichtig ist mein SCHUFA-Score für die Kreditvergabe?',
    answer: 'Der SCHUFA-Score ist ein wichtiger Faktor, aber nicht der einzige. Auch Ihr Einkommen, Ihre Ausgaben und die Stabilität Ihres Arbeitsverhältnisses spielen eine Rolle.',
    category: 'schufa'
  },
  {
    id: '17',
    question: 'Kann ich meinen SCHUFA-Score verbessern?',
    answer: 'Ja, durch pünktliche Zahlungen, das Begleichen offener Forderungen und die Reduzierung der Anzahl Ihrer Konten können Sie Ihren SCHUFA-Score langfristig verbessern.',
    category: 'schufa'
  },
  
  // Sicherheit
  {
    id: '18',
    question: 'Wie sicher sind meine Daten bei Kreditheld24?',
    answer: 'Ihre Daten sind bei uns absolut sicher. Wir verwenden SSL-Verschlüsselung und halten alle DSGVO-Bestimmungen ein. Ihre Daten werden nur für die Kreditvermittlung verwendet.',
    category: 'sicherheit'
  },
  {
    id: '19',
    question: 'Wer hat Zugriff auf meine Daten?',
    answer: 'Nur autorisierte Mitarbeiter und die Banken, bei denen wir Ihren Kreditantrag einreichen, haben Zugriff auf Ihre Daten. Wir geben keine Daten an Dritte weiter.',
    category: 'sicherheit'
  },
  {
    id: '20',
    question: 'Kann ich meine Daten löschen lassen?',
    answer: 'Ja, Sie haben jederzeit das Recht auf Löschung Ihrer Daten. Kontaktieren Sie uns einfach, und wir löschen Ihre Daten gemäß den gesetzlichen Bestimmungen.',
    category: 'sicherheit'
  },
  
  // Tilgung
  {
    id: '21',
    question: 'Was passiert, wenn ich eine Rate nicht zahlen kann?',
    answer: 'Kontaktieren Sie uns oder Ihre Bank sofort. Oft können Lösungen wie Ratenpausen oder Anpassungen der Laufzeit gefunden werden. Vermeiden Sie unbedingt Zahlungsausfälle.',
    category: 'tilgung'
  },
  {
    id: '22',
    question: 'Kann ich meinen Kredit vorzeitig zurückzahlen?',
    answer: 'Ja, Sie können Ihren Kredit jederzeit vorzeitig zurückzahlen. Bei Verbraucherkrediten darf maximal 1% der Restschuld als Vorfälligkeitsentschädigung berechnet werden.',
    category: 'tilgung'
  },
  {
    id: '23',
    question: 'Wie kann ich meine Kreditrate senken?',
    answer: 'Sie können die Rate durch Verlängerung der Laufzeit senken oder durch eine Umschuldung zu besseren Konditionen. Wir beraten Sie gerne zu den Möglichkeiten.',
    category: 'tilgung'
  },
  {
    id: '24',
    question: 'Was ist eine Umschuldung und wann macht sie Sinn?',
    answer: 'Bei einer Umschuldung lösen Sie bestehende teure Kredite durch einen günstigeren neuen Kredit ab. Das macht Sinn, wenn Sie dadurch Zinsen sparen oder Ihre monatliche Belastung reduzieren können.',
    category: 'tilgung'
  }
]

const categories = {
  allgemein: 'Allgemeine Fragen',
  antrag: 'Antragsprozess',
  konditionen: 'Konditionen & Zinsen',
  schufa: 'SCHUFA & Bonität',
  sicherheit: 'Datenschutz & Sicherheit',
  tilgung: 'Tilgung & Rückzahlung'
}

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('alle')
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState('')

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  const filteredItems = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'alle' || item.category === selectedCategory
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900 text-white py-16 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border border-green-300 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-green-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-200 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-white">FAQ Center</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Häufig gestellte Fragen
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Finden Sie schnell Antworten auf die wichtigsten Fragen rund um Kredite und unsere Dienstleistungen
            </p>
            
            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Frage suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 rounded-lg border-0 shadow-lg focus:ring-4 focus:ring-green-300 dark:focus:ring-green-500 focus:outline-none text-lg transition-colors duration-300"
                />
                <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Category Filter */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setSelectedCategory('alle')}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === 'alle'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                }`}
              >
                Alle Fragen ({faqItems.length})
              </button>
              {Object.entries(categories).map(([key, label]) => {
                const count = faqItems.filter(item => item.category === key).length
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                      selectedCategory === key
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {label} ({count})
                  </button>
                )
              })}
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.175C5.25 12.09 5.25 11.91 5.25 11.91V6.375c0-1.036.84-1.875 1.875-1.875h8.25c1.035 0 1.875.84 1.875 1.875v5.535z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Keine Fragen gefunden</h3>
                <p className="text-gray-600 dark:text-gray-300">Versuchen Sie andere Suchbegriffe oder wählen Sie eine andere Kategorie.</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                        {item.question}
                      </h3>
                      <div className={`flex-shrink-0 transform transition-transform duration-200 ${
                        openItems.has(item.id) ? 'rotate-180' : ''
                      }`}>
                        <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                  
                  {openItems.has(item.id) && (
                    <div className="px-6 pb-5 border-t border-gray-100 dark:border-gray-700">
                      <div className="pt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item.answer}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900 rounded-2xl p-8 text-white text-center transition-colors duration-300 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-16 h-16 border border-green-300 rounded-full"></div>
              <div className="absolute bottom-4 right-4 w-20 h-20 border border-green-400 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 w-12 h-12 border border-green-200 rounded-full"></div>
            </div>
            
            <div className="relative z-10">
               <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-4">
                 <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                 <span className="text-sm font-medium text-white">Persönliche Beratung</span>
               </div>
               <h2 className="text-2xl font-bold mb-4">Ihre Frage war nicht dabei?</h2>
               <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                 Kein Problem! Unser Expertenteam steht Ihnen gerne zur Verfügung und beantwortet alle Ihre Fragen rund um Kredite und Finanzierungen.
               </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/kontakt"
                      className="inline-flex items-center justify-center px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Kontakt aufnehmen
                    </Link>
                    <Link
                      href="/kreditanfrage"
                      className="inline-flex items-center justify-center px-8 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Individueller Service
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }