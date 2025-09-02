import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Kreditglossar - Alle wichtigen Begriffe erklärt | Kreditheld24',
  description: 'Verstehen Sie alle wichtigen Kreditbegriffe. Unser umfassendes Glossar erklärt Ihnen Fachbegriffe rund um Kredite, Zinsen und Finanzierung einfach und verständlich.',
  keywords: 'Kreditglossar, Kreditbegriffe, Finanzlexikon, Zinsen, Tilgung, SCHUFA, Bonität, Kreditwissen'
}

interface GlossaryTerm {
  term: string
  definition: string
  category: 'allgemein' | 'zinsen' | 'schufa' | 'tilgung' | 'sicherheiten'
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Annuität',
    definition: 'Die Annuität ist die gleichbleibende Rate, die aus Zinsen und Tilgung besteht und während der gesamten Laufzeit eines Kredits gezahlt wird.',
    category: 'tilgung'
  },
  {
    term: 'Bonität',
    definition: 'Die Bonität beschreibt die Kreditwürdigkeit einer Person. Sie wird anhand verschiedener Faktoren wie Einkommen, Ausgaben und SCHUFA-Score bewertet.',
    category: 'schufa'
  },
  {
    term: 'Effektiver Jahreszins',
    definition: 'Der effektive Jahreszins gibt die tatsächlichen jährlichen Kosten eines Kredits an, inklusive aller Nebenkosten und Gebühren.',
    category: 'zinsen'
  },
  {
    term: 'Nominalzins',
    definition: 'Der Nominalzins ist der reine Zinssatz ohne Berücksichtigung von Nebenkosten. Er ist meist niedriger als der effektive Jahreszins.',
    category: 'zinsen'
  },
  {
    term: 'SCHUFA',
    definition: 'Die SCHUFA (Schutzgemeinschaft für allgemeine Kreditsicherung) sammelt Daten über das Zahlungsverhalten von Verbrauchern und erstellt daraus einen Score.',
    category: 'schufa'
  },
  {
    term: 'SCHUFA-Score',
    definition: 'Der SCHUFA-Score ist eine Zahl zwischen 0 und 100, die die Wahrscheinlichkeit angibt, mit der ein Verbraucher seinen Zahlungsverpflichtungen nachkommt.',
    category: 'schufa'
  },
  {
    term: 'Tilgung',
    definition: 'Die Tilgung ist der Teil der Kreditrate, der zur Rückzahlung des geliehenen Betrags dient (ohne Zinsen).',
    category: 'tilgung'
  },
  {
    term: 'Sondertilgung',
    definition: 'Eine Sondertilgung ist eine zusätzliche Zahlung zur regulären Rate, um den Kredit schneller zurückzuzahlen und Zinsen zu sparen.',
    category: 'tilgung'
  },
  {
    term: 'Restschuld',
    definition: 'Die Restschuld ist der noch nicht zurückgezahlte Betrag eines Kredits zu einem bestimmten Zeitpunkt.',
    category: 'tilgung'
  },
  {
    term: 'Laufzeit',
    definition: 'Die Laufzeit ist der Zeitraum, in dem ein Kredit vollständig zurückgezahlt werden soll.',
    category: 'allgemein'
  },
  {
    term: 'Kreditsumme',
    definition: 'Die Kreditsumme ist der Betrag, den Sie von der Bank leihen möchten.',
    category: 'allgemein'
  },
  {
    term: 'Kreditwürdigkeit',
    definition: 'Die Kreditwürdigkeit beschreibt die Fähigkeit und Bereitschaft eines Kreditnehmers, den Kredit zurückzuzahlen.',
    category: 'schufa'
  },
  {
    term: 'Bürgschaft',
    definition: 'Eine Bürgschaft ist eine Sicherheit, bei der eine dritte Person für die Schulden des Kreditnehmers haftet.',
    category: 'sicherheiten'
  },
  {
    term: 'Sicherheiten',
    definition: 'Sicherheiten sind Vermögenswerte oder Garantien, die der Bank als Absicherung für den Kredit dienen.',
    category: 'sicherheiten'
  },
  {
    term: 'Vorfälligkeitsentschädigung',
    definition: 'Eine Gebühr, die bei vorzeitiger Kreditrückzahlung anfallen kann, um der Bank entgangene Zinserträge zu ersetzen.',
    category: 'zinsen'
  },
  {
    term: 'Umschuldung',
    definition: 'Bei einer Umschuldung wird ein bestehender Kredit durch einen neuen, meist günstigeren Kredit abgelöst.',
    category: 'allgemein'
  },
  {
    term: 'Konditionsanfrage',
    definition: 'Eine SCHUFA-neutrale Anfrage, um Kreditkonditionen zu erfahren, ohne den SCHUFA-Score zu beeinflussen.',
    category: 'schufa'
  },
  {
    term: 'Kreditantrag',
    definition: 'Ein verbindlicher Antrag auf einen Kredit, der sich auf den SCHUFA-Score auswirken kann.',
    category: 'schufa'
  }
]

const categories = {
  allgemein: 'Allgemeine Begriffe',
  zinsen: 'Zinsen & Kosten',
  schufa: 'SCHUFA & Bonität',
  tilgung: 'Tilgung & Rückzahlung',
  sicherheiten: 'Sicherheiten'
}

export default function GlossarPage() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('alle')
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesCategory = selectedCategory === 'alle' || term.category === selectedCategory
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Kreditglossar
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Alle wichtigen Kreditbegriffe einfach erklärt
              </p>
              <p className="text-lg opacity-80">
                Verstehen Sie die Fachsprache der Finanzwelt und treffen Sie informierte Entscheidungen
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Begriff suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                {/* Category Filter */}
                <div className="md:w-64">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="alle">Alle Kategorien</option>
                    {Object.entries(categories).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <p className="text-gray-600">
                {filteredTerms.length} Begriff{filteredTerms.length !== 1 ? 'e' : ''} gefunden
              </p>
            </div>
          </div>
        </section>

        {/* Glossary Terms */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6">
                {filteredTerms.map((term, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="md:w-1/3">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {term.term}
                        </h3>
                        <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {categories[term.category]}
                        </span>
                      </div>
                      <div className="md:w-2/3">
                        <p className="text-gray-700 leading-relaxed">
                          {term.definition}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredTerms.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Keine Begriffe gefunden. Versuchen Sie einen anderen Suchbegriff oder wählen Sie eine andere Kategorie.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Haben Sie noch Fragen?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Unser Expertenteam steht Ihnen gerne zur Verfügung und beantwortet alle Ihre Fragen rund um Kredite und Finanzierung.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/kontakt"
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button shadow-md hover:shadow-lg transition-all"
                >
                  Jetzt Kontakt aufnehmen
                </Link>
                <Link
                  href="/kreditanfrage"
                  className="bg-white hover:bg-gray-50 text-primary border-2 border-primary font-medium py-3 px-8 rounded-button shadow-md hover:shadow-lg transition-all"
                >
                  Unverbindliche Anfrage
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}