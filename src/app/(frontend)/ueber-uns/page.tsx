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
      zahl: "2025",
      beschreibung: "Gegründet"
    },
    {
      zahl: "1.000+",
      beschreibung: "Zufriedene Kunden"
    },
    {
      zahl: "20+",
      beschreibung: "Partnerbanken"
    },
    {
      zahl: "100%",
      beschreibung: "Digital"
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
    <div className="font-sans text-gray-800 bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">

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
              <span className="text-sm font-medium text-white">Über Kreditheld24</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ihr vertrauenswürdiger Partner für Finanzlösungen
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Als innovatives Online-Portal unterstützen wir Menschen dabei, ihre finanziellen Ziele zu erreichen. Mit Expertise, Transparenz und persönlicher Beratung stehen wir Ihnen zur Seite.
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
      <section id="about" className="py-16 bg-gradient-to-br from-white via-blue-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
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
              <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Mission & Vision</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Unsere Mission & Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Wir bei Kreditheld24 glauben daran, dass jeder Mensch Zugang zu fairen und transparenten Finanzierungslösungen haben sollte.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Unsere Werte</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Unsere Mission ist es, den Kreditvergleich so einfach und verständlich wie möglich zu gestalten.
              </p>
              <div className="space-y-6">
                {werte.map((wert, index) => {
                  const isGreenCard = index === 1; // Alternating pattern
                  return (
                    <div key={index} className="flex items-start group">
                      <div className={`w-12 h-12 ${isGreenCard ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700' : 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700'} rounded-xl flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                        <div className={`w-6 h-6 flex items-center justify-center ${isGreenCard ? 'text-primary' : 'text-blue-600'}`}>
                          <i className={`${wert.icon} text-xl`}></i>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">{wert.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{wert.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Warum Kreditheld24?</h3>
              <div className="space-y-4">
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 flex items-center justify-center text-primary">
                      <i className="ri-award-line text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Expertise</h4>
                    <p className="text-gray-600 dark:text-gray-300">Langjährige Erfahrung im Finanzbereich und tiefes Marktverständnis</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 flex items-center justify-center text-blue-600">
                      <i className="ri-team-line text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Persönlich</h4>
                    <p className="text-gray-600 dark:text-gray-300">Individuelle Beratung und maßgeschneiderte Lösungen für jeden Kunden</p>
                  </div>
                </div>
                <div className="flex items-start group">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 flex items-center justify-center text-primary">
                      <i className="ri-rocket-line text-xl"></i>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Innovation</h4>
                    <p className="text-gray-600 dark:text-gray-300">Modernste Technologie für schnelle und effiziente Kreditvermittlung</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiken */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-green-50/20 to-gray-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-primary rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Unsere Erfolge</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Kreditheld24 in Zahlen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Unsere Erfolgsgeschichte spricht für sich - vertrauen Sie auf unsere Erfahrung und Expertise.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {statistiken.map((stat, index) => {
              const isGreenCard = index % 2 === 1; // Alternating pattern
              return (
                <div key={index} className={`group bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 ${isGreenCard ? 'hover:border-primary/30' : 'hover:border-blue-500/30'} transform hover:-translate-y-2 text-center`}>
                  <div className={`text-4xl font-bold mb-2 ${isGreenCard ? 'text-primary' : 'text-blue-600'} group-hover:scale-110 transition-transform duration-300`}>{stat.zahl}</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.beschreibung}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* Geschichte */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Unsere Geschichte</h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Von der Gründung bis heute - eine Erfolgsgeschichte basierend auf Vertrauen und Kompetenz.
              </p>
            </div>
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mr-6 shrink-0">
                  2025
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Gründung von Kreditheld24</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Mit der Vision, Kreditvergleiche transparent und kundenfreundlich zu gestalten, wurde Kreditheld24 als innovatives Online-Portal gegründet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kontakt */}
      <section id="contact" className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Kontaktieren Sie uns</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Haben Sie Fragen oder möchten Sie mehr über unsere Dienstleistungen erfahren? Wir sind gerne für Sie da.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {kontaktInfos.map((kontakt, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 flex items-center justify-center text-primary">
                    <i className={kontakt.icon}></i>
                  </div>
                </div>
                <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{kontakt.title}</h3>
                {kontakt.link ? (
                  <Link href={kontakt.link} className="text-gray-600 dark:text-gray-300 hover:text-primary">
                    {kontakt.info}
                  </Link>
                ) : (
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{kontakt.info}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-green-50 dark:bg-green-900/20 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Bereit für Ihre Finanzlösung?</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
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
                className="border border-gray-300 dark:border-gray-600 hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary font-medium py-3 px-8 rounded-button whitespace-nowrap flex items-center justify-center transition-all"
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


    </div>
  )
}

export default UeberUnsPage