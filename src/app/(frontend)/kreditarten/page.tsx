'use client'

import React from 'react'
import Link from 'next/link'
import UnverbindlichAnfragenButton from '../../../components/UnverbindlichAnfragenButton'

const KreditartenPage = () => {
  const kreditarten = [
    {
      title: "Ratenkredit",
      description: "Der klassische Kredit für alle Anschaffungen mit festen monatlichen Raten und planbaren Kosten.",
      features: ["Feste Zinssätze", "Flexible Laufzeiten", "Schnelle Auszahlung"],
      zinssatz: "ab 3,49%",
      laufzeit: "12-120 Monate",
      summe: "1.000 - 100.000 €",
      icon: "ri-money-euro-circle-line",
      link: "/ratenkredite",
      popular: true
    },
    {
      title: "Autokredit",
      description: "Günstige Fahrzeugfinanzierung für Neu- und Gebrauchtwagen mit attraktiven Konditionen.",
      features: ["Zweckgebunden", "Günstige Zinsen", "Ohne Anzahlung möglich"],
      zinssatz: "ab 2,99%",
      laufzeit: "12-84 Monate",
      summe: "3.000 - 100.000 €",
      icon: "ri-car-line",
      link: "/autokredit"
    },
    {
      title: "Umschuldung",
      description: "Bestehende Kredite zu besseren Konditionen zusammenfassen und Geld sparen.",
      features: ["Niedrigere Zinsen", "Eine Rate statt vieler", "Bessere Übersicht"],
      zinssatz: "ab 3,99%",
      laufzeit: "12-120 Monate",
      summe: "3.000 - 120.000 €",
      icon: "ri-refresh-line",
      link: "/umschuldung"
    },
    {
      title: "Sofortkredit",
      description: "Schnelle Finanzierung mit sofortiger Zusage und Auszahlung innerhalb von 24 Stunden.",
      features: ["Sofortige Zusage", "24h Auszahlung", "Online-Abwicklung"],
      zinssatz: "ab 4,49%",
      laufzeit: "12-84 Monate",
      summe: "1.000 - 50.000 €",
      icon: "ri-flashlight-line",
      link: "/sofortkredit"
    },
    {
      title: "Kredit für Selbstständige",
      description: "Speziell entwickelte Kreditlösungen für Unternehmer, Freiberufler und Gewerbetreibende.",
      features: ["Flexible Nachweise", "Individuelle Prüfung", "Geschäftszwecke"],
      zinssatz: "ab 4,99%",
      laufzeit: "12-120 Monate",
      summe: "5.000 - 250.000 €",
      icon: "ri-briefcase-line",
      link: "/kredit-selbststaendige"
    },
    {
      title: "Kredit trotz SCHUFA",
      description: "Finanzierungsmöglichkeiten auch bei negativen SCHUFA-Einträgen oder schlechter Bonität.",
      features: ["Ohne SCHUFA-Abfrage", "Faire Konditionen", "Diskrete Abwicklung"],
      zinssatz: "ab 7,99%",
      laufzeit: "12-84 Monate",
      summe: "1.000 - 25.000 €",
      icon: "ri-shield-check-line",
      link: "/schufa-neutral"
    }
  ]

  const statistiken = [
    {
      wert: "98%",
      beschreibung: "Zufriedene Kunden"
    },
    {
      wert: "24h",
      beschreibung: "Schnelle Auszahlung"
    },
    {
      wert: "0€",
      beschreibung: "Bearbeitungsgebühren"
    },
    {
      wert: "20+",
      beschreibung: "Banken im Vergleich"
    }
  ]

  return (
    <div className="font-sans text-gray-800 bg-white">

      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900 text-white transition-colors duration-300 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-center bg-no-repeat bg-cover opacity-30" 
          style={{
            backgroundImage: "url('/images/kreditarten-hero.webp')"
          }}
        ></div>
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
              <span className="text-sm font-medium text-white">Ratenkredite</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Unsere Ratenkredite im Überblick
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Entdecken Sie die verschiedenen Ratenkredite und finden Sie die passende Finanzierungslösung für Ihre individuellen Bedürfnisse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="#kreditarten" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
              >
                <span>Jetzt Kredit finden</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <UnverbindlichAnfragenButton variant="secondary" size="md" className="py-3 px-6" />
            </div>
          </div>
        </div>
      </section>

      {/* Kreditarten Grid */}
      <section id="kreditarten" className="py-16 bg-gradient-to-br from-gray-50 via-green-50/10 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-green-500 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Produktübersicht</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Ratenkredite für jeden Bedarf</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Wir bieten maßgeschneiderte Finanzierungslösungen für unterschiedliche Lebenssituationen – von der klassischen Anschaffung bis zur Umschuldung.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {kreditarten.map((kredit, index) => {
              const isGreenCard = index % 2 === 1; // Alternating pattern
              return (
                <div key={index} className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${isGreenCard ? 'hover:border-primary/30' : 'hover:border-blue-500/30'} transform hover:-translate-y-2 overflow-hidden relative ${kredit.popular ? 'ring-2 ring-primary' : ''}`}>
                  {kredit.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-xs font-medium rounded-bl-lg z-10">
                      Beliebt
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 ${isGreenCard ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 text-primary' : 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 text-blue-600'} rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                        <i className={`${kredit.icon} text-2xl`}></i>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{kredit.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{kredit.description}</p>
                    <ul className="space-y-2 mb-6">
                      {kredit.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm">
                          <div className={`w-4 h-4 flex items-center justify-center ${isGreenCard ? 'text-primary' : 'text-blue-600'} mr-2`}>
                            <i className="ri-check-line"></i>
                          </div>
                          <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Zinssatz:</span>
                        <span className={`font-semibold ${isGreenCard ? 'text-primary' : 'text-blue-600'}`}>{kredit.zinssatz}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Laufzeit:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{kredit.laufzeit}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Kreditsumme:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{kredit.summe}</span>
                      </div>
                    </div>
                    <Link 
                      href={kredit.link}
                      className={`block w-full ${isGreenCard ? 'bg-primary hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-3 px-6 rounded-button text-center transition-all`}
                    >
                      Mehr erfahren
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kreditheld24 in Zahlen</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Vertrauen Sie auf unsere Erfahrung und profitieren Sie von unserem umfangreichen Netzwerk.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {statistiken.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.wert}</div>
                <div className="text-gray-600">{stat.beschreibung}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Bereit für Ihren Wunschkredit?</h2>
            <p className="text-gray-600 text-lg mb-8">
              Vergleichen Sie jetzt unverbindlich und kostenlos die besten Angebote von über 20 Banken und sparen Sie bares Geld.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#kreditarten" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
              >
                <span>Jetzt Kredit finden</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <Link 
                href="/kontakt" 
                className="border border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-medium py-3 px-8 rounded-button whitespace-nowrap flex items-center justify-center transition-all"
              >
                <div className="w-5 h-5 mr-2 flex items-center justify-center">
                  <i className="ri-customer-service-2-line"></i>
                </div>
                <span>Beratung anfordern</span>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">100% kostenlos</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">SCHUFA-neutral</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">Unverbindlich</span>
              </div>
              <div className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-check-line"></i>
                </div>
                <span className="text-gray-600">Schnelle Auszahlung</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-['Pacifico'] text-primary mb-4">Kreditheld24</h3>
              <p className="text-gray-300 mb-4">
                Ihr unabhängiger Kreditvergleich für maßgeschneiderte Finanzierungslösungen zu Top-Konditionen.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-300 hover:text-primary">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-facebook-fill ri-lg"></i>
                  </div>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-twitter-fill ri-lg"></i>
                  </div>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-instagram-fill ri-lg"></i>
                  </div>
                </Link>
                <Link href="#" className="text-gray-300 hover:text-primary">
                  <div className="w-8 h-8 flex items-center justify-center">
                    <i className="ri-linkedin-fill ri-lg"></i>
                  </div>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Ratenkredite</h4>
              <ul className="space-y-2">
                <li><Link href="/ratenkredite" className="text-gray-300 hover:text-primary">Ratenkredit</Link></li>
                <li><Link href="/umschuldung" className="text-gray-300 hover:text-primary">Umschuldung</Link></li>
                <li><Link href="/schufa-neutral" className="text-gray-300 hover:text-primary">Kredit trotz SCHUFA</Link></li>
                <li><Link href="/sofortkredit" className="text-gray-300 hover:text-primary">Sofortkredit</Link></li>
                <li><Link href="/kredit-selbststaendige" className="text-gray-300 hover:text-primary">Kredit für Selbstständige</Link></li>
                <li><Link href="/autokredit" className="text-gray-300 hover:text-primary">Autokredit</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Über uns</h4>
              <ul className="space-y-2">
                <li><Link href="/unternehmen" className="text-gray-300 hover:text-primary">Unternehmen</Link></li>
                <li><Link href="/team" className="text-gray-300 hover:text-primary">Team</Link></li>
                <li><Link href="/karriere" className="text-gray-300 hover:text-primary">Karriere</Link></li>
                <li><Link href="/presse" className="text-gray-300 hover:text-primary">Presse</Link></li>
                <li><Link href="/partnerprogramm" className="text-gray-300 hover:text-primary">Partnerprogramm</Link></li>
                <li><Link href="/kontakt" className="text-gray-300 hover:text-primary">Kontakt</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-lg mb-4">Kontakt</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mr-2 mt-1">
                    <i className="ri-map-pin-line"></i>
                  </div>
                  <span className="text-gray-300">Kreditheldenstraße 24<br />10115 Berlin</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                    <i className="ri-phone-line"></i>
                  </div>
                  <Link href="tel:+4930123456789" className="text-gray-300 hover:text-primary">
                    030 / 123 456 789
                  </Link>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                    <i className="ri-mail-line"></i>
                  </div>
                  <Link href="mailto:info@kreditheld24.de" className="text-gray-300 hover:text-primary">
                    info@kreditheld24.de
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col md:flex-row md:justify-between">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-400 text-sm">&copy; 2025 Kreditheld24. Alle Rechte vorbehalten.</p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link href="/impressum" className="text-gray-400 text-sm hover:text-primary">Impressum</Link>
                <Link href="/datenschutz" className="text-gray-400 text-sm hover:text-primary">Datenschutz</Link>
                <Link href="/agb" className="text-gray-400 text-sm hover:text-primary">AGB</Link>
                <Link href="/cookie-einstellungen" className="text-gray-400 text-sm hover:text-primary">Cookie-Einstellungen</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default KreditartenPage