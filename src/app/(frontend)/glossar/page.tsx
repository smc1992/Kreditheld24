'use client'
import React from 'react'
import Link from 'next/link'

// Metadata wird in layout.tsx oder als separate metadata.ts Datei definiert

interface GlossaryTerm {
  term: string
  definition: string
  category: 'allgemein' | 'zinsen' | 'schufa' | 'tilgung' | 'sicherheiten' | 'kreditarten' | 'rechtliches' | 'banken'
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
  },
  // Erweiterte Begriffe - Kreditarten
  {
    term: 'Ratenkredit',
    definition: 'Ein Kredit, der in gleichbleibenden monatlichen Raten zurückgezahlt wird. Auch Verbraucherkredit oder Konsumentenkredit genannt.',
    category: 'kreditarten'
  },
  {
    term: 'Autokredit',
    definition: 'Ein zweckgebundener Kredit zur Finanzierung eines Fahrzeugs. Oft günstiger als ein freier Ratenkredit.',
    category: 'kreditarten'
  },
  {
    term: 'Baufinanzierung',
    definition: 'Langfristige Finanzierung zum Kauf oder Bau einer Immobilie, meist mit Grundschuld als Sicherheit.',
    category: 'kreditarten'
  },
  {
    term: 'Dispositionskredit',
    definition: 'Kurzfristige Überziehungsmöglichkeit des Girokontos. Meist mit hohen Zinsen verbunden.',
    category: 'kreditarten'
  },
  {
    term: 'Rahmenkredit',
    definition: 'Flexibler Kredit mit einem festen Kreditrahmen, aus dem nach Bedarf Geld abgerufen werden kann.',
    category: 'kreditarten'
  },
  {
    term: 'Sofortkredit',
    definition: 'Kredit mit besonders schneller Bearbeitung und Auszahlung, oft innerhalb weniger Stunden.',
    category: 'kreditarten'
  },
  {
    term: 'Kleinkredit',
    definition: 'Kredit mit geringer Kreditsumme, meist zwischen 500 und 5.000 Euro.',
    category: 'kreditarten'
  },
  {
    term: 'Modernisierungskredit',
    definition: 'Zweckgebundener Kredit für Renovierungs- und Modernisierungsmaßnahmen an Immobilien.',
    category: 'kreditarten'
  },
  // Rechtliche Begriffe
  {
    term: 'Widerrufsrecht',
    definition: 'Das Recht, einen Kreditvertrag innerhalb von 14 Tagen ohne Angabe von Gründen zu widerrufen.',
    category: 'rechtliches'
  },
  {
    term: 'Kreditvermittlung',
    definition: 'Dienstleistung zur Vermittlung von Krediten zwischen Kreditnehmern und Kreditgebern.',
    category: 'rechtliches'
  },
  {
    term: 'Verbraucherkreditgesetz',
    definition: 'Gesetz zum Schutz von Verbrauchern bei Kreditgeschäften mit besonderen Informations- und Widerrufspflichten.',
    category: 'rechtliches'
  },
  {
    term: 'Datenschutz',
    definition: 'Schutz personenbezogener Daten bei der Kreditbearbeitung nach DSGVO-Bestimmungen.',
    category: 'rechtliches'
  },
  {
    term: 'Impressumspflicht',
    definition: 'Gesetzliche Verpflichtung zur Angabe bestimmter Informationen auf Websites von Kreditvermittlern.',
    category: 'rechtliches'
  },
  // Banken & Institute
  {
    term: 'Direktbank',
    definition: 'Bank ohne Filialnetz, die ihre Dienstleistungen hauptsächlich online oder telefonisch anbietet.',
    category: 'banken'
  },
  {
    term: 'Filialbank',
    definition: 'Traditionelle Bank mit einem Netz von Geschäftsstellen für persönliche Beratung.',
    category: 'banken'
  },
  {
    term: 'Kreditinstitut',
    definition: 'Unternehmen, das gewerbsmäßig Bankgeschäfte betreibt und Kredite vergeben darf.',
    category: 'banken'
  },
  {
    term: 'Fintech',
    definition: 'Technologieunternehmen, das innovative Finanzdienstleistungen und Kreditprodukte anbietet.',
    category: 'banken'
  },
  {
    term: 'Peer-to-Peer-Kredit',
    definition: 'Kredit zwischen Privatpersonen über Online-Plattformen, ohne traditionelle Bank als Vermittler.',
    category: 'banken'
  },
  // Erweiterte Zinsen & Kosten
  {
    term: 'Sollzinsbindung',
    definition: 'Zeitraum, für den der Zinssatz eines Kredits festgeschrieben ist.',
    category: 'zinsen'
  },
  {
    term: 'Bearbeitungsgebühr',
    definition: 'Einmalige Gebühr für die Bearbeitung eines Kreditantrags. Bei Verbraucherkrediten meist unzulässig.',
    category: 'zinsen'
  },
  {
    term: 'Bereitstellungszinsen',
    definition: 'Zinsen, die anfallen, wenn ein bewilligter Kredit nicht sofort abgerufen wird.',
    category: 'zinsen'
  },
  {
    term: 'Disagio',
    definition: 'Abschlag vom Nominalbetrag eines Kredits. Der Kreditnehmer erhält weniger ausgezahlt, als er zurückzahlen muss.',
    category: 'zinsen'
  },
  {
    term: 'Zinssatz',
    definition: 'Preis für die Überlassung von Kapital, ausgedrückt als Prozentsatz des Kreditbetrags.',
    category: 'zinsen'
  },
  {
    term: 'Zinsbindung',
    definition: 'Vereinbarter Zeitraum, in dem der Zinssatz eines Kredits unverändert bleibt.',
    category: 'zinsen'
  },
  // Erweiterte SCHUFA & Bonität
  {
    term: 'Bonitätsprüfung',
    definition: 'Überprüfung der Kreditwürdigkeit eines Antragstellers durch die Bank vor Kreditvergabe.',
    category: 'schufa'
  },
  {
    term: 'Negativmerkmal',
    definition: 'Eintrag in der SCHUFA über nicht erfüllte Zahlungsverpflichtungen oder Kreditausfälle.',
    category: 'schufa'
  },
  {
    term: 'Selbstauskunft',
    definition: 'Kostenlose jährliche Auskunft über die bei der SCHUFA gespeicherten Daten.',
    category: 'schufa'
  },
  {
    term: 'Scoring',
    definition: 'Mathematisches Verfahren zur Bewertung der Kreditwürdigkeit anhand verschiedener Faktoren.',
    category: 'schufa'
  },
  {
    term: 'Löschung',
    definition: 'Entfernung von SCHUFA-Einträgen nach Ablauf bestimmter Fristen oder bei Erledigung.',
    category: 'schufa'
  },
  // Erweiterte Tilgung
  {
    term: 'Tilgungsplan',
    definition: 'Übersicht über die Aufteilung der Kreditraten in Zins- und Tilgungsanteil über die gesamte Laufzeit.',
    category: 'tilgung'
  },
  {
    term: 'Tilgungsaussetzung',
    definition: 'Vorübergehende Aussetzung der Tilgung bei finanziellen Schwierigkeiten, nur Zinszahlung.',
    category: 'tilgung'
  },
  {
    term: 'Tilgungsrate',
    definition: 'Der Teil der monatlichen Rate, der zur Rückzahlung der Kreditsumme dient.',
    category: 'tilgung'
  },
  {
    term: 'Endfälligkeit',
    definition: 'Zeitpunkt, zu dem ein Kredit vollständig zurückgezahlt sein muss.',
    category: 'tilgung'
  },
  {
    term: 'Ratenpause',
    definition: 'Möglichkeit, eine oder mehrere Kreditraten auszusetzen, meist gegen Gebühr.',
    category: 'tilgung'
  },
  // Erweiterte Sicherheiten
  {
    term: 'Grundschuld',
    definition: 'Dingliches Recht an einer Immobilie als Sicherheit für einen Kredit.',
    category: 'sicherheiten'
  },
  {
    term: 'Hypothek',
    definition: 'Pfandrecht an einer Immobilie, das mit der Tilgung des Kredits abnimmt.',
    category: 'sicherheiten'
  },
  {
    term: 'Sicherungsübereignung',
    definition: 'Übertragung des Eigentums an beweglichen Sachen zur Kreditsicherung.',
    category: 'sicherheiten'
  },
  {
    term: 'Abtretung',
    definition: 'Übertragung von Forderungen oder Rechten zur Sicherung eines Kredits.',
    category: 'sicherheiten'
  },
  {
    term: 'Pfandrecht',
    definition: 'Recht, eine Sache zur Befriedigung einer Forderung zu verwerten.',
    category: 'sicherheiten'
  },
  {
    term: 'Avalkredit',
    definition: 'Bürgschaft oder Garantie einer Bank für Verbindlichkeiten ihres Kunden.',
    category: 'sicherheiten'
  },
  // Allgemeine erweiterte Begriffe
  {
    term: 'Kreditlinie',
    definition: 'Maximaler Kreditbetrag, den eine Bank einem Kunden zur Verfügung stellt.',
    category: 'allgemein'
  },
  {
    term: 'Kreditwürdigkeit',
    definition: 'Fähigkeit und Bereitschaft eines Schuldners, aufgenommene Kredite zurückzuzahlen.',
    category: 'allgemein'
  },
  {
    term: 'Liquidität',
    definition: 'Verfügbarkeit von Geldmitteln zur Erfüllung von Zahlungsverpflichtungen.',
    category: 'allgemein'
  },
  {
    term: 'Verschuldungsgrad',
    definition: 'Verhältnis der Gesamtschulden zum verfügbaren Einkommen oder Vermögen.',
    category: 'allgemein'
  },
  {
    term: 'Kreditvolumen',
    definition: 'Gesamtbetrag aller von einer Bank oder einem Kreditnehmer vergebenen bzw. aufgenommenen Kredite.',
    category: 'allgemein'
  },
  {
    term: 'Refinanzierung',
    definition: 'Beschaffung von Mitteln durch Banken zur Finanzierung ihrer Kreditvergabe.',
    category: 'allgemein'
  }
]

const categories = {
  allgemein: 'Allgemeine Begriffe',
  zinsen: 'Zinsen & Kosten',
  schufa: 'SCHUFA & Bonität',
  tilgung: 'Tilgung & Rückzahlung',
  sicherheiten: 'Sicherheiten',
  kreditarten: 'Kreditarten',
  rechtliches: 'Rechtliches',
  banken: 'Banken & Institute'
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900 text-white py-16 transition-colors duration-300 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-24 h-24 border border-green-300 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 border border-green-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-200 rounded-full"></div>
            <div className="absolute top-20 right-20 w-20 h-20 border border-green-300 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-white">Kreditglossar</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Kreditglossar
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-100">
                Alle wichtigen Kreditbegriffe einfach erklärt
              </p>
              <p className="text-lg text-green-200">
                Verstehen Sie die Fachsprache der Finanzwelt und treffen Sie informierte Entscheidungen
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-12 bg-gradient-to-br from-white via-blue-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 border border-blue-500 rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border border-primary rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-blue-400 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700 mb-6">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Suche & Filter</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Finden Sie den gesuchten Begriff</h2>
                <p className="text-gray-600 dark:text-gray-300">Nutzen Sie die Suche oder wählen Sie eine Kategorie aus</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Search */}
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Begriff suchen..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <div className="md:w-64">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300"
                    >
                      <option value="alle">Alle Kategorien</option>
                      {Object.entries(categories).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {filteredTerms.length} Begriff{filteredTerms.length !== 1 ? 'e' : ''} gefunden
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Glossary Terms */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-green-50/10 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
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
                  <span className="text-sm font-medium text-green-700 dark:text-green-400">Begriffe A-Z</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Alle Kreditbegriffe im Überblick</h2>
                <p className="text-gray-600 dark:text-gray-300">Erweitern Sie Ihr Finanzwissen mit unseren detaillierten Erklärungen</p>
              </div>
              
              <div className="grid gap-6">
                {filteredTerms.map((term, index) => {
                  const getCategoryColor = (category: string) => {
                    const colors = {
                      allgemein: 'from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-600',
                      zinsen: 'from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-700 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-600',
                      schufa: 'from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-600',
                      tilgung: 'from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 text-green-700 dark:text-green-300 border-green-200 dark:border-green-600',
                      sicherheiten: 'from-red-100 to-red-200 dark:from-red-800 dark:to-red-700 text-red-700 dark:text-red-300 border-red-200 dark:border-red-600',
                      kreditarten: 'from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-600',
                      rechtliches: 'from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600',
                      banken: 'from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-700 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-600'
                    }
                    return colors[category as keyof typeof colors] || colors.allgemein
                  }
                  
                  return (
                    <div key={index} className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-500/30 transform hover:-translate-y-1 p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="md:w-1/3">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                            {term.term}
                          </h3>
                          <span className={`inline-block px-4 py-2 bg-gradient-to-r ${getCategoryColor(term.category)} text-sm rounded-full border transition-all duration-300 group-hover:scale-105`}>
                            {categories[term.category]}
                          </span>
                        </div>
                        <div className="md:w-2/3">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {term.definition}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              {filteredTerms.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
                      Keine Begriffe gefunden
                    </p>
                    <p className="text-gray-400 dark:text-gray-500">
                      Versuchen Sie einen anderen Suchbegriff oder wählen Sie eine andere Kategorie.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 dark:bg-gray-800 py-16 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Haben Sie noch Fragen?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
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
                  className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-primary dark:text-green-400 border-2 border-primary dark:border-green-400 font-medium py-3 px-8 rounded-button shadow-md hover:shadow-lg transition-all"
                >
                  Individueller Service
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}