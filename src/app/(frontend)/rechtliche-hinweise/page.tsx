import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Rechtliche Hinweise - Widerrufsrecht & Kreditvermittlung | Kreditheld24',
  description: 'Alle wichtigen rechtlichen Informationen zu Widerrufsrecht, Kreditvermittlung nach § 34c GewO und SCHUFA-Hinweise. Transparent und verständlich erklärt.',
  keywords: 'Widerrufsrecht, § 34c GewO, Kreditvermittlung, SCHUFA, rechtliche Hinweise, Verbraucherschutz'
}

export default function RechtlicheHinweisePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white py-16 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Rechtliche Hinweise
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Transparenz und Verbraucherschutz stehen bei uns an erster Stelle
              </p>
              <p className="text-lg opacity-80">
                Alle wichtigen Informationen zu Ihren Rechten und unseren Pflichten
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
              
              {/* Widerrufsrecht */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Widerrufsrecht</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-6">
                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-300 mb-3">Wichtiger Hinweis zum Widerrufsrecht</h3>
                    <p className="text-red-700 font-medium">
                      Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Widerrufsfrist</h4>
                    <p className="text-gray-700 mb-4">
                      Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses. 
                      Bei Verbraucherdarlehensverträgen beginnt die Frist erst zu laufen, wenn Sie 
                      alle erforderlichen Informationen erhalten haben.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Widerrufsfolgen</h4>
                    <p className="text-gray-700 mb-4">
                      Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von 
                      Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem 
                      Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags 
                      bei uns eingegangen ist.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Muster-Widerrufsformular</h4>
                    <div className="bg-white p-4 border border-gray-200 rounded">
                      <p className="text-sm text-gray-700 mb-4">
                        Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück:
                      </p>
                      <div className="text-sm text-gray-600 space-y-2">
                        <p>An: Kreditheld24, E-Mail: info@kreditheld24.de</p>
                        <p>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:</p>
                        <p>Bestellt am (*)/erhalten am (*):</p>
                        <p>Name des/der Verbraucher(s):</p>
                        <p>Anschrift des/der Verbraucher(s):</p>
                        <p>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
                        <p>Datum:</p>
                        <p className="text-xs">(*) Unzutreffendes streichen.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* § 34c GewO Hinweise */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Kreditvermittlung nach § 34c GewO</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
                    <h3 className="text-xl font-semibold text-blue-800 mb-3">Erlaubnis zur Kreditvermittlung</h3>
                    <p className="text-blue-700">
                      Kreditheld24 verfügt über die erforderliche Erlaubnis zur Kreditvermittlung nach § 34c der Gewerbeordnung (GewO).
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Unsere Rolle als Kreditvermittler</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Wir vermitteln Kredite verschiedener Partnerbanken
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Wir sind nicht selbst Kreditgeber
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Wir prüfen und vergleichen Angebote für Sie
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Wir unterstützen Sie bei der Antragstellung
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Vergütung</h4>
                    <p className="text-gray-700 mb-4">
                      Unsere Dienstleistung ist für Sie kostenfrei. Wir erhalten eine Provision von den 
                      Partnerbanken, wenn ein Kreditvertrag zustande kommt. Diese Provision hat keinen 
                      Einfluss auf die Konditionen Ihres Kredits.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Unsere Partnerbanken</h4>
                    <p className="text-gray-700 mb-4">
                      Wir arbeiten mit verschiedenen renommierten Banken und Kreditinstituten zusammen, 
                      um Ihnen die besten Konditionen anbieten zu können. Eine aktuelle Liste unserer 
                      Partner finden Sie auf Anfrage.
                    </p>
                  </div>
                </div>
              </div>

              {/* SCHUFA Informationen */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">SCHUFA-Informationen</h2>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-green-50 border-l-4 border-green-400 p-6">
                    <h3 className="text-xl font-semibold text-green-800 mb-3">SCHUFA-neutrale Anfrage</h3>
                    <p className="text-green-700">
                      Unsere Kreditanfrage ist zu 100% SCHUFA-neutral und beeinflusst Ihren SCHUFA-Score nicht.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Was ist die SCHUFA?</h4>
                    <p className="text-gray-700 mb-4">
                      Die SCHUFA (Schutzgemeinschaft für allgemeine Kreditsicherung) ist Deutschlands 
                      führende Auskunftei. Sie sammelt und speichert Daten über das Zahlungsverhalten 
                      von Verbrauchern und Unternehmen.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">SCHUFA-Score</h4>
                    <p className="text-gray-700 mb-4">
                      Der SCHUFA-Score ist eine Zahl zwischen 0 und 100, die die Wahrscheinlichkeit 
                      angibt, mit der Sie Ihren Zahlungsverpflichtungen nachkommen werden. Je höher 
                      der Score, desto besser Ihre Kreditwürdigkeit.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-900 mb-2">Score-Bereiche:</h5>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• 97,5% - 100%: Sehr geringes Risiko</li>
                        <li>• 95% - 97,5%: Geringes bis überschaubares Risiko</li>
                        <li>• 90% - 95%: Zufriedenstellendes bis erhöhtes Risiko</li>
                        <li>• 80% - 90%: Deutlich erhöhtes bis hohes Risiko</li>
                        <li>• 50% - 80%: Sehr hohes Risiko</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Konditionsanfrage vs. Kreditanfrage</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-green-800 mb-2">Konditionsanfrage (SCHUFA-neutral)</h5>
                        <ul className="space-y-1 text-sm text-green-700">
                          <li>• Beeinflusst SCHUFA-Score nicht</li>
                          <li>• Nur für Sie sichtbar</li>
                          <li>• Unverbindliche Konditionen</li>
                          <li>• Beliebig oft möglich</li>
                        </ul>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h5 className="font-semibold text-orange-800 mb-2">Kreditanfrage</h5>
                        <ul className="space-y-1 text-sm text-orange-700">
                          <li>• Kann SCHUFA-Score beeinflussen</li>
                          <li>• Für andere Banken sichtbar</li>
                          <li>• Verbindlicher Kreditantrag</li>
                          <li>• Sollte sparsam verwendet werden</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Ihre Rechte bei der SCHUFA</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Kostenlose Selbstauskunft einmal jährlich
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Recht auf Korrektur falscher Daten
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Recht auf Löschung veralteter Einträge
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Information über Datenverwendung
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verbraucherschutz */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Verbraucherschutz</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Unsere Verpflichtungen</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Transparente Darstellung aller Kosten und Konditionen
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Umfassende Beratung und Aufklärung
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Schutz Ihrer persönlichen Daten
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2 mt-1">✓</span>
                        Faire und ehrliche Vermittlung
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Beschwerden und Streitbeilegung</h4>
                    <p className="text-gray-700 mb-4">
                      Bei Beschwerden wenden Sie sich zunächst an unseren Kundenservice. Sollte keine 
                      zufriedenstellende Lösung gefunden werden, können Sie sich an die zuständige 
                      Aufsichtsbehörde oder an eine Verbraucherschlichtungsstelle wenden.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Haben Sie Fragen zu Ihren Rechten?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Unser Kundenservice steht Ihnen gerne zur Verfügung und beantwortet alle Ihre Fragen 
                zu rechtlichen Aspekten und Verbraucherschutz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/kontakt"
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button shadow-md hover:shadow-lg transition-all"
                >
                  Jetzt Kontakt aufnehmen
                </Link>
                <Link
                  href="/datenschutz"
                  className="bg-white hover:bg-gray-50 text-primary border-2 border-primary font-medium py-3 px-8 rounded-button shadow-md hover:shadow-lg transition-all"
                >
                  Datenschutzerklärung
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}