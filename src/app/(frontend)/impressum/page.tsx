import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Impressum - Kreditheld24',
  description: 'Impressum und Anbieterkennzeichnung von Kreditheld24 gemäß § 5 DDG (Digitale-Dienste-Gesetz)',
  robots: 'index, follow'
}

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <main className="pt-20 pb-16">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white py-16 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Impressum
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Anbieterkennzeichnung gemäß § 5 DDG
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-300">
                
                {/* Angaben gemäß § 5 DDG */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Angaben gemäß § 5 DDG</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Verantwortlich für den Inhalt:</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Viktor Stephan<br />
                        Brockmannstr. 204<br />
                        48163 Münster<br />
                        Deutschland
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Kontakt:</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Telefon: 0251 149 142 77<br />
                        E-Mail: <a href="mailto:info@kreditheld24.de" className="text-primary hover:underline">info@kreditheld24.de</a>
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Steuernummer:</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        St.Nr. 33652010811
                      </p>
                    </div>
                  </div>
                </div>

                {/* Berufsrechtliche Angaben */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Berufsrechtliche Angaben</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Tätigkeit:</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Kreditvermittlung und Finanzberatung
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Gewerbeerlaubnis:</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Gewerbeerlaubnis nach § 34c GewO. Diese Erlaubnis wurde erteilt durch das Ordnungsamt der Stadt Münster.<br /><br />
                        <strong>Zuständige Aufsichtsbehörde gem. § 34c GewO:</strong><br />
                        Ordnungsamt Münster<br />
                        Klemensstr. 10<br />
                        48143 Münster<br />
                        Tel: 0251 / 492-0
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Immobiliardarlehensvermittlung:</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Gewerbeerlaubnis als Immobiliardarlehensvermittler gem. §34i<br />
                        Registrierungsnummer: D-W-156-7TXP-35<br />
                        Aufsichtsbehörde: IHK Nord Westfalen
                      </p>
                    </div>
                  </div>
                </div>

                {/* Redaktionell Verantwortlicher */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Redaktionell Verantwortlicher</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Viktor Stephan<br />
                    Brockmannstr. 204<br />
                    48163 Münster<br />
                    Deutschland
                  </p>
                </div>

                {/* EU-Streitschlichtung */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">EU-Streitschlichtung</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                    <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Unsere E-Mail-Adresse finden Sie oben im Impressum.
                  </p>
                </div>

                {/* Verbraucherstreitbeilegung */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
                  <p className="text-gray-700">
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>

                {/* Haftung für Inhalte */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Haftung für Inhalte</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 DDG für eigene Inhalte auf diesen Seiten nach den 
                    allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht 
                    unter der Verpflichtung, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach 
                    Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                  <p className="text-gray-700">
                    Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen 
                    Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der 
                    Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen 
                    werden wir diese Inhalte umgehend entfernen.
                  </p>
                </div>

                {/* Haftung für Links */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Haftung für Links</h2>
                  <p className="text-gray-700 mb-4">
                    Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
                    Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
                    Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                  </p>
                  <p className="text-gray-700">
                    Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. 
                    Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche 
                    Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. 
                    Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
                  </p>
                </div>

                {/* Urheberrecht */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Urheberrecht</h2>
                  <p className="text-gray-700 mb-4">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
                    Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
                    Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                  </p>
                  <p className="text-gray-700">
                    Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. 
                    Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter 
                    beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine 
                    Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden 
                    von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
                  </p>
                </div>

                {/* Rechtliche Hinweise */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-300">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Rechtliche Hinweise</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <strong>Hinweis:</strong> Dieses Impressum wurde erstellt gemäß den Anforderungen des 
                    Digitale-Dienste-Gesetzes (DDG), welches am 14. Mai 2024 das Telemediengesetz (TMG) abgelöst hat.
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stand: Januar 2025
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/" className="text-primary hover:underline">
                      Zur Startseite
                    </Link>
                    <Link href="/datenschutz" className="text-primary hover:underline">
                      Datenschutzerklärung
                    </Link>
                    <Link href="/kontakt" className="text-primary hover:underline">
                      Kontakt
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}