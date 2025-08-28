'use client'

import React from 'react'
import Link from 'next/link'

const UeberUnsPage = () => {
  const werte = [
    {
      icon: "ri-check-line",
      title: "Transparenz",
      description: "Klare und verständliche Kommunikation aller Konditionen und Kosten"
    },
    {
      icon: "ri-shield-check-line",
      title: "Sicherheit",
      description: "Höchste Standards beim Datenschutz und der Informationssicherheit"
    },
    {
      icon: "ri-customer-service-2-line",
      title: "Service",
      description: "Persönliche Beratung und Unterstützung in jeder Phase"
    }
  ]

  const statistiken = [
    {
      zahl: "10+",
      beschreibung: "Jahre Erfahrung"
    },
    {
      zahl: "50.000+",
      beschreibung: "Zufriedene Kunden"
    },
    {
      zahl: "20+",
      beschreibung: "Partnerbanken"
    },
    {
      zahl: "98%",
      beschreibung: "Weiterempfehlungsrate"
    }
  ]

  const team = [
    {
      name: "Michael Weber",
      position: "Geschäftsführer",
      beschreibung: "Über 15 Jahre Erfahrung im Finanzwesen und Experte für Kreditvermittlung.",
      image: "https://readdy.ai/api/search-image?query=professional%20business%20man%20in%20suit%20smiling%20confident%20portrait%20office%20background&width=400&height=400&seq=team1&orientation=square"
    },
    {
      name: "Sarah Müller",
      position: "Leiterin Kundenberatung",
      beschreibung: "Spezialistin für individuelle Finanzlösungen und Kundenbetreuung.",
      image: "https://readdy.ai/api/search-image?query=professional%20business%20woman%20smiling%20confident%20portrait%20office%20background&width=400&height=400&seq=team2&orientation=square"
    },
    {
      name: "Thomas Klein",
      position: "Leiter IT & Digitalisierung",
      beschreibung: "Verantwortlich für unsere digitalen Lösungen und Sicherheitsstandards.",
      image: "https://readdy.ai/api/search-image?query=professional%20IT%20specialist%20man%20smiling%20confident%20portrait%20modern%20office&width=400&height=400&seq=team3&orientation=square"
    }
  ]

  const kontaktInfos = [
    {
      icon: "ri-phone-line",
      title: "Telefon",
      info: "0251 149 142 77",
      link: "tel:+4925114914277"
    },
    {
      icon: "ri-smartphone-line",
      title: "Mobil",
      info: "0179 51 04 859",
      link: "tel:+491795104859"
    },
    {
      icon: "ri-mail-line",
      title: "E-Mail",
      info: "info@kreditheld24.de",
      link: "mailto:info@kreditheld24.de"
    },
    {
      icon: "ri-map-pin-line",
      title: "Adresse",
      info: "Kreditheldenstraße 24\n10115 Berlin",
      link: null
    }
  ]

  return (
    <div className="font-sans text-gray-800 bg-white">

      {/* Hero Section */}
      <section className="relative w-full bg-gradient-to-r from-green-50 to-green-100 overflow-hidden">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: "url('https://readdy.ai/api/search-image?query=modern%20office%20building%20interior%20with%20glass%20walls%20and%20natural%20light%2C%20minimalist%20corporate%20environment%20with%20green%20plants%2C%20professional%20business%20atmosphere%2C%20architectural%20photography%2C%20soft%20lighting%2C%20no%20people%20visible%2C%20left%20side%20clear%20for%20text%20overlay&width=1920&height=600&seq=hero1&orientation=landscape')",
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            opacity: 0.9
          }}
        ></div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="max-w-2xl backdrop-blur-sm bg-white/30 p-6 md:p-8 rounded-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4 md:mb-6 leading-tight">
              Ihr vertrauenswürdiger Partner für Finanzlösungen
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 md:mb-8">
              Seit über 10 Jahren unterstützen wir Menschen dabei, ihre finanziellen Ziele zu erreichen. Mit Expertise, Transparenz und persönlicher Beratung stehen wir Ihnen zur Seite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/kontakt" 
                className="inline-flex items-center justify-center bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-lg transition-all backdrop-blur-sm"
              >
                <span>Jetzt beraten lassen</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center">
                  <i className="ri-arrow-right-line"></i>
                </div>
              </Link>
              <Link 
                href="#about" 
                className="inline-flex items-center justify-center bg-white/90 hover:bg-white text-primary hover:text-primary border-2 border-primary font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-lg transition-all backdrop-blur-sm"
              >
                <span>Mehr erfahren</span>
                <div className="w-5 h-5 ml-2 flex items-center justify-center">
                  <i className="ri-information-line"></i>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Unsere Mission & Vision</h2>
              <p className="text-gray-600 mb-6">
                Wir bei Kreditheld24 glauben daran, dass jeder Mensch Zugang zu fairen und transparenten Finanzierungslösungen haben sollte. Unsere Mission ist es, den Kreditvergleich so einfach und verständlich wie möglich zu gestalten.
              </p>
              <div className="space-y-4">
                {werte.map((wert, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                      <div className="w-5 h-5 flex items-center justify-center text-primary">
                        <i className={wert.icon}></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{wert.title}</h3>
                      <p className="text-gray-600">{wert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div 
                className="w-full h-96 bg-cover bg-center rounded-lg shadow-lg" 
                style={{
                  backgroundImage: "url('https://readdy.ai/api/search-image?query=modern%20professional%20office%20space%20with%20team%20meeting%20room%20glass%20walls%20natural%20light%20corporate%20environment&width=600&height=400&seq=office1&orientation=landscape')"
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiken */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kreditheld24 in Zahlen</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unsere Erfolgsgeschichte spricht für sich - vertrauen Sie auf unsere Erfahrung und Expertise.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {statistiken.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.zahl}</div>
                <div className="text-gray-600">{stat.beschreibung}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Unser Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lernen Sie die Menschen hinter Kreditheld24 kennen - Experten mit Leidenschaft für Finanzlösungen.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((mitarbeiter, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div 
                  className="w-full h-64 bg-cover bg-center" 
                  style={{ backgroundImage: `url('${mitarbeiter.image}')` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{mitarbeiter.name}</h3>
                  <p className="text-primary font-medium mb-3">{mitarbeiter.position}</p>
                  <p className="text-gray-600">{mitarbeiter.beschreibung}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Geschichte */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Unsere Geschichte</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Von der Gründung bis heute - eine Erfolgsgeschichte basierend auf Vertrauen und Kompetenz.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mr-6 shrink-0">
                  2014
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Gründung von Kreditheld24</h3>
                  <p className="text-gray-600">
                    Mit der Vision, Kreditvergleiche transparent und kundenfreundlich zu gestalten, wurde Kreditheld24 gegründet.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mr-6 shrink-0">
                  2018
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Digitale Transformation</h3>
                  <p className="text-gray-600">
                    Einführung unserer vollständig digitalen Plattform für noch schnellere und effizientere Kreditvergleiche.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mr-6 shrink-0">
                  2022
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Expansion des Partnernetzwerks</h3>
                  <p className="text-gray-600">
                    Erweiterung auf über 20 Partnerbanken für noch bessere Konditionen und mehr Auswahlmöglichkeiten.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mr-6 shrink-0">
                  2025
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Heute</h3>
                  <p className="text-gray-600">
                    Über 50.000 zufriedene Kunden vertrauen auf unsere Expertise und unseren erstklassigen Service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Kontaktieren Sie uns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Haben Sie Fragen oder möchten Sie mehr über unsere Dienstleistungen erfahren? Wir sind gerne für Sie da.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {kontaktInfos.map((kontakt, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className={kontakt.icon}></i>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">{kontakt.title}</h3>
                {kontakt.link ? (
                  <Link href={kontakt.link} className="text-gray-600 hover:text-primary">
                    {kontakt.info}
                  </Link>
                ) : (
                  <p className="text-gray-600 whitespace-pre-line">{kontakt.info}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Bereit für Ihre Finanzlösung?</h2>
            <p className="text-gray-600 text-lg mb-8">
              Lassen Sie uns gemeinsam die beste Finanzierungslösung für Ihre Bedürfnisse finden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/kreditvergleich" 
                className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
              >
                <span>Kreditvergleich starten</span>
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
                <span>Persönliche Beratung</span>
              </Link>
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
              <h4 className="font-medium text-lg mb-4">Kreditarten</h4>
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
                <li><Link href="/ueber-uns" className="text-gray-300 hover:text-primary">Unternehmen</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-primary">Geschäftsführung</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-primary">Presse</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-primary">Partnerprogramm</Link></li>
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
                <li className="flex flex-col">
                  <div className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                      <i className="ri-phone-line"></i>
                    </div>
                    <Link href="tel:+4925114914277" className="text-gray-300 hover:text-primary">
                      Tel: 0251 149 142 77
                    </Link>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                      <i className="ri-smartphone-line"></i>
                    </div>
                    <Link href="tel:+491795104859" className="text-gray-300 hover:text-primary">
                      Mobil: 0179 51 04 859
                    </Link>
                  </div>
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

export default UeberUnsPage