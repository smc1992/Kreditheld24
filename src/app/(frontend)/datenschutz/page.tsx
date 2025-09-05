import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung - Kreditheld24',
  description: 'Datenschutzerklärung von Kreditheld24 gemäß DSGVO (Datenschutz-Grundverordnung) - Informationen zur Datenverarbeitung',
  robots: 'index, follow'
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      <main className="pt-20 pb-16">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 dark:from-green-700 dark:to-green-800 text-white py-16 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Datenschutzerklärung
              </h1>
              <p className="text-xl md:text-2xl opacity-90">
                Informationen zur Datenverarbeitung gemäß DSGVO
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-colors duration-300">
                
                {/* Inhaltsverzeichnis */}
                <div className="mb-12 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-300">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Inhaltsverzeichnis</h2>
                  <ul className="space-y-2 text-sm">
                    <li><a href="#verantwortlicher" className="text-primary hover:underline">1. Verantwortlicher</a></li>
                    <li><a href="#datenverarbeitung" className="text-primary hover:underline">2. Allgemeine Hinweise zur Datenverarbeitung</a></li>
                    <li><a href="#rechtsgrundlagen" className="text-primary hover:underline">3. Rechtsgrundlagen</a></li>
                    <li><a href="#website" className="text-primary hover:underline">4. Datenverarbeitung auf unserer Website</a></li>
                    <li><a href="#kontaktformular" className="text-primary hover:underline">5. Kontaktformular und E-Mail-Kontakt</a></li>
                    <li><a href="#kreditanfrage" className="text-primary hover:underline">6. Kreditanfrage und Vermittlung</a></li>
                    <li><a href="#cookies" className="text-primary hover:underline">7. Cookies und Tracking</a></li>
                    <li><a href="#betroffenenrechte" className="text-primary hover:underline">8. Rechte der betroffenen Person</a></li>
                    <li><a href="#speicherdauer" className="text-primary hover:underline">9. Speicherdauer</a></li>
                    <li><a href="#datensicherheit" className="text-primary hover:underline">10. Datensicherheit</a></li>
                    <li><a href="#aenderungen" className="text-primary hover:underline">11. Änderungen der Datenschutzerklärung</a></li>
                  </ul>
                </div>

                {/* 1. Verantwortlicher */}
                <div id="verantwortlicher" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">1. Verantwortlicher</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded transition-colors duration-300">
                    <p className="text-gray-700 dark:text-gray-300">
                      Viktor Stephan<br />
                      Brockmannstr. 204<br />
                      48163 Münster<br />
                      Deutschland<br /><br />
                      Telefon: 0251 149 142 77<br />
                      E-Mail: <a href="mailto:info@kreditheld24.de" className="text-primary hover:underline">info@kreditheld24.de</a>
                    </p>
                  </div>
                </div>

                {/* 2. Allgemeine Hinweise zur Datenverarbeitung */}
                <div id="datenverarbeitung" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">2. Allgemeine Hinweise zur Datenverarbeitung</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Umfang der Verarbeitung personenbezogener Daten</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Wir verarbeiten personenbezogene Daten unserer Nutzer grundsätzlich nur, soweit dies zur Bereitstellung 
                        einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung 
                        personenbezogener Daten unserer Nutzer erfolgt regelmäßig nur nach Einwilligung des Nutzers.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Zweck der Datenverarbeitung</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Die Verarbeitung personenbezogener Daten erfolgt zu folgenden Zwecken:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mt-2 space-y-1">
                        <li>Bereitstellung und Betrieb der Website</li>
                        <li>Bearbeitung von Kreditanfragen und Vermittlung</li>
                        <li>Kommunikation mit Interessenten und Kunden</li>
                        <li>Erfüllung rechtlicher Verpflichtungen</li>
                        <li>Verbesserung unserer Dienstleistungen</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 3. Rechtsgrundlagen */}
                <div id="rechtsgrundlagen" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">3. Rechtsgrundlagen der Verarbeitung</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Die Verarbeitung personenbezogener Daten erfolgt auf Grundlage der folgenden Rechtsgrundlagen der DSGVO:
                  </p>
                  <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                    <li><strong>Art. 6 Abs. 1 lit. a DSGVO:</strong> Einwilligung der betroffenen Person</li>
                    <li><strong>Art. 6 Abs. 1 lit. b DSGVO:</strong> Verarbeitung zur Erfüllung eines Vertrags oder zur Durchführung vorvertraglicher Maßnahmen</li>
                    <li><strong>Art. 6 Abs. 1 lit. c DSGVO:</strong> Verarbeitung zur Erfüllung einer rechtlichen Verpflichtung</li>
                    <li><strong>Art. 6 Abs. 1 lit. f DSGVO:</strong> Verarbeitung zur Wahrung berechtigter Interessen</li>
                  </ul>
                </div>

                {/* 4. Datenverarbeitung auf unserer Website */}
                <div id="website" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">4. Datenverarbeitung auf unserer Website</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Logfiles</h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">
                        Bei jedem Aufruf unserer Website erfasst unser System automatisiert Daten und Informationen vom 
                        Computersystem des aufrufenden Rechners. Folgende Daten werden hierbei erhoben:
                      </p>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                        <li>IP-Adresse des Nutzers</li>
                        <li>Datum und Uhrzeit des Zugriffs</li>
                        <li>Aufgerufene Seiten und Dateien</li>
                        <li>Übertragene Datenmenge</li>
                        <li>Browser-Typ und Version</li>
                        <li>Betriebssystem des Nutzers</li>
                        <li>Referrer URL</li>
                      </ul>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">
                        <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Systemsicherheit)
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">SSL-Verschlüsselung</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine 
                        SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des 
                        Browsers von &quot;http://&quot; auf &quot;https://&quot; wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 5. Kontaktformular und E-Mail-Kontakt */}
                <div id="kontaktformular" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">5. Kontaktformular und E-Mail-Kontakt</h2>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      Bei der Kontaktaufnahme mit uns (z.B. per Kontaktformular oder E-Mail) werden die von Ihnen 
                      mitgeteilten Daten von uns gespeichert, um Ihre Fragen zu bearbeiten und mögliche Anschlussfragen 
                      zu beantworten.
                    </p>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Verarbeitete Daten:</h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Name und Vorname</li>
                        <li>E-Mail-Adresse</li>
                        <li>Telefonnummer (optional)</li>
                        <li>Nachrichteninhalt</li>
                        <li>Zeitpunkt der Kontaktaufnahme</li>
                      </ul>
                    </div>
                    
                    <p className="text-gray-700">
                      <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bearbeitung von Anfragen)
                    </p>
                  </div>
                </div>

                {/* 6. Kreditanfrage und Vermittlung */}
                <div id="kreditanfrage" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">6. Kreditanfrage und Vermittlung</h2>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Für die Bearbeitung Ihrer Kreditanfrage und die Vermittlung geeigneter Kreditangebote verarbeiten 
                      wir umfangreiche personenbezogene Daten.
                    </p>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Verarbeitete Daten:</h3>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                        <li>Persönliche Daten (Name, Adresse, Geburtsdatum)</li>
                        <li>Kontaktdaten (E-Mail, Telefon)</li>
                        <li>Einkommensdaten und Beschäftigungsverhältnis</li>
                        <li>Ausgaben und finanzielle Verpflichtungen</li>
                        <li>Kreditwunsch und Verwendungszweck</li>
                        <li>Hochgeladene Dokumente (Gehaltsabrechnungen, Ausweise etc.)</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Weitergabe an Kreditinstitute:</h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        Ihre Daten werden zur Prüfung und Bearbeitung Ihrer Kreditanfrage an geeignete Kreditinstitute 
                        und Finanzdienstleister weitergegeben. Diese Weitergabe erfolgt nur mit Ihrer ausdrücklichen 
                        Einwilligung.
                      </p>
                    </div>
                    
                    <p className="text-gray-700">
                      <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung) und Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
                    </p>
                  </div>
                </div>

                {/* 7. Cookies und Tracking */}
                <div id="cookies" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">7. Cookies und Tracking</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Was sind Cookies?</h3>
                      <p className="text-gray-700">
                        Cookies sind kleine Textdateien, die beim Besuch einer Website auf Ihrem Computer gespeichert werden. 
                        Sie ermöglichen es, Sie bei einem erneuten Besuch wiederzuerkennen.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Verwendete Cookies:</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li><strong>Technisch notwendige Cookies:</strong> Für die Grundfunktionen der Website</li>
                        <li><strong>Funktionale Cookies:</strong> Für erweiterte Funktionen und Benutzerfreundlichkeit</li>
                        <li><strong>Analyse-Cookies:</strong> Zur Verbesserung der Website (nur mit Einwilligung)</li>
                      </ul>
                    </div>
                    
                    <p className="text-gray-700">
                      Sie können Ihre Browser-Einstellungen so konfigurieren, dass Cookies blockiert oder Sie über 
                      das Setzen von Cookies informiert werden.
                    </p>
                  </div>
                </div>

                {/* 8. Rechte der betroffenen Person */}
                <div id="betroffenenrechte" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">8. Rechte der betroffenen Person</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Sie haben folgende Rechte bezüglich Ihrer personenbezogenen Daten:
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Recht auf Auskunft (Art. 15 DSGVO)</h3>
                      <p className="text-gray-700">
                        Sie haben das Recht, Auskunft über die von uns verarbeiteten personenbezogenen Daten zu verlangen.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Recht auf Berichtigung (Art. 16 DSGVO)</h3>
                      <p className="text-gray-700">
                        Sie haben das Recht, die Berichtigung unrichtiger oder die Vervollständigung unvollständiger 
                        personenbezogener Daten zu verlangen.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Recht auf Löschung (Art. 17 DSGVO)</h3>
                      <p className="text-gray-700">
                        Sie haben das Recht, die Löschung Ihrer personenbezogenen Daten zu verlangen, sofern keine 
                        gesetzlichen Aufbewahrungspflichten entgegenstehen.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Recht auf Einschränkung (Art. 18 DSGVO)</h3>
                      <p className="text-gray-700">
                        Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten zu verlangen.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</h3>
                      <p className="text-gray-700">
                        Sie haben das Recht, die Sie betreffenden personenbezogenen Daten in einem strukturierten, 
                        gängigen und maschinenlesbaren Format zu erhalten.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Widerspruchsrecht (Art. 21 DSGVO)</h3>
                      <p className="text-gray-700">
                        Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit 
                        gegen die Verarbeitung Sie betreffender personenbezogener Daten Widerspruch einzulegen.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Recht auf Widerruf der Einwilligung</h3>
                      <p className="text-gray-700">
                        Sie haben das Recht, eine erteilte Einwilligung zur Verarbeitung personenbezogener Daten 
                        jederzeit zu widerrufen. Der Widerruf berührt nicht die Rechtmäßigkeit der bis zum Widerruf 
                        erfolgten Verarbeitung.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Beschwerderecht</h3>
                      <p className="text-gray-700">
                        Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer 
                        personenbezogenen Daten durch uns zu beschweren.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 9. Speicherdauer */}
                <div id="speicherdauer" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">9. Speicherdauer</h2>
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Wir speichern personenbezogene Daten nur so lange, wie es für die Erfüllung der Zwecke, 
                      für die sie erhoben wurden, erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.
                    </p>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Konkrete Speicherfristen:</h3>
                      <ul className="list-disc list-inside text-gray-700 space-y-1">
                        <li><strong>Kontaktanfragen:</strong> 3 Jahre nach Abschluss der Korrespondenz</li>
                        <li><strong>Kreditanfragen:</strong> 10 Jahre gemäß handelsrechtlichen Aufbewahrungspflichten</li>
                        <li><strong>Logfiles:</strong> 7 Tage</li>
                        <li><strong>Cookies:</strong> Je nach Typ zwischen Session-Ende und 2 Jahren</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 10. Datensicherheit */}
                <div id="datensicherheit" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">10. Datensicherheit</h2>
                  <p className="text-gray-700 mb-4">
                    Wir verwenden geeignete technische und organisatorische Sicherheitsmaßnahmen, um Ihre Daten 
                    gegen zufällige oder vorsätzliche Manipulationen, teilweisen oder vollständigen Verlust, 
                    Zerstörung oder gegen den unbefugten Zugriff Dritter zu schützen.
                  </p>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Sicherheitsmaßnahmen:</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>SSL/TLS-Verschlüsselung für die Datenübertragung</li>
                      <li>Regelmäßige Sicherheitsupdates</li>
                      <li>Zugriffsbeschränkungen und Berechtigungskonzepte</li>
                      <li>Regelmäßige Datensicherungen</li>
                      <li>Schulung der Mitarbeiter im Datenschutz</li>
                    </ul>
                  </div>
                </div>

                {/* 11. Änderungen der Datenschutzerklärung */}
                <div id="aenderungen" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">11. Änderungen der Datenschutzerklärung</h2>
                  <p className="text-gray-700">
                    Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den aktuellen 
                    rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen in der 
                    Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue Datenschutzerklärung.
                  </p>
                </div>

                {/* Kontakt Datenschutz */}
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-8 transition-colors duration-300">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Fragen zum Datenschutz?</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    Wenn Sie Fragen zu dieser Datenschutzerklärung haben oder Ihre Rechte als betroffene Person 
                    ausüben möchten, wenden Sie sich gerne an uns:
                  </p>
                  <p className="text-gray-700">
                    E-Mail: <a href="mailto:datenschutz@kreditheld24.de" className="text-primary hover:underline">datenschutz@kreditheld24.de</a><br />
                    Telefon: 0251 149 142 77
                  </p>
                </div>

                {/* Stand */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg transition-colors duration-300">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Stand dieser Datenschutzerklärung:</strong> Januar 2025<br />
                    Diese Datenschutzerklärung wurde erstellt unter Berücksichtigung der aktuellen Anforderungen 
                    der Datenschutz-Grundverordnung (DSGVO).
                  </p>
                </div>

                {/* Navigation Links */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex flex-wrap gap-4 justify-center">
                    <Link href="/" className="text-primary hover:underline">
                      Zur Startseite
                    </Link>
                    <Link href="/impressum" className="text-primary hover:underline">
                      Impressum
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