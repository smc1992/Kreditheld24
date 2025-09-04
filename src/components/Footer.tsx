import Link from 'next/link'

const kreditarten = [
  { name: 'Ratenkredit', href: '/ratenkredite' },
  { name: 'Umschuldung', href: '/umschuldung' },
  { name: 'Kredit trotz SCHUFA', href: '/schufa-neutral' },
  { name: 'Sofortkredit', href: '/sofortkredit' },
  { name: 'Kredit für Selbstständige', href: '/kredit-selbststaendige' },
  { name: 'Autokredit', href: '/autokredit' },
  { name: 'Baufinanzierung', href: '/baufinanzierung' },
]

const ueberUns = [
  { name: 'Unternehmen', href: '/ueber-uns' },
  { name: 'Kontakt', href: '/kontakt' },
  { name: 'Tipps & Ratgeber', href: '/tipps-kreditaufnahme' },
  { name: 'Kreditanfrage', href: '/kreditanfrage' },
]

const rechtliches = [
  { name: 'Impressum', href: '/impressum' },
  { name: 'Datenschutz', href: '/datenschutz' },
]

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-['Pacifico'] text-primary mb-4">
              Kreditheld24
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Ihr unabhängiger Kreditvergleich für maßgeschneiderte
              Finanzierungslösungen zu Top-Konditionen.
            </p>
            <div className="flex space-x-3">
              <Link href="#" className="group">
                <div className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                  <i className="ri-facebook-fill text-lg text-gray-300 group-hover:text-white"></i>
                </div>
              </Link>
              <Link href="#" className="group">
                <div className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                  <i className="ri-twitter-fill text-lg text-gray-300 group-hover:text-white"></i>
                </div>
              </Link>
              <Link href="#" className="group">
                <div className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                  <i className="ri-instagram-fill text-lg text-gray-300 group-hover:text-white"></i>
                </div>
              </Link>
              <Link href="#" className="group">
                <div className="w-10 h-10 bg-gray-700 hover:bg-primary rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                  <i className="ri-linkedin-fill text-lg text-gray-300 group-hover:text-white"></i>
                </div>
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Kreditarten</h4>
            <ul className="space-y-3">
              {kreditarten.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-300 hover:text-primary transition-colors duration-200 flex items-center group">
                    <i className="ri-arrow-right-s-line text-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Service</h4>
            <ul className="space-y-3">
              {ueberUns.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-300 hover:text-primary transition-colors duration-200 flex items-center group">
                    <i className="ri-arrow-right-s-line text-primary mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></i>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Kontakt</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center text-primary mr-3 mt-0.5 flex-shrink-0">
                  <i className="ri-map-pin-line text-sm"></i>
                </div>
                <div className="text-gray-300 text-sm leading-relaxed">
                  <div className="font-medium text-white mb-1">Geschäftsadresse:</div>
                  Brockmannstr. 204<br />48163 Münster
                  <div className="font-medium text-white mt-3 mb-1">Besucheranschrift:</div>
                  Glücksburger Str. 13<br />49477 Ibbenbüren
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center text-primary mr-3 flex-shrink-0">
                  <i className="ri-phone-line text-sm"></i>
                </div>
                <Link href="tel:+492511491427" className="text-gray-300 hover:text-primary transition-colors duration-200">
                  0251. 149 142 77
                </Link>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center text-primary mr-3 flex-shrink-0">
                  <i className="ri-smartphone-line text-sm"></i>
                </div>
                <Link href="tel:+491795104859" className="text-gray-300 hover:text-primary transition-colors duration-200">
                  0179. 51 04 859
                </Link>
              </div>
              
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary/20 rounded-lg flex items-center justify-center text-primary mr-3 flex-shrink-0">
                  <i className="ri-mail-line text-sm"></i>
                </div>
                <Link href="mailto:info@kreditheld24.de" className="text-gray-300 hover:text-primary transition-colors duration-200">
                  info@kreditheld24.de
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-6 md:mb-0">
              <p className="text-gray-400 text-sm mb-2">
                &copy; 2025 Kreditheld24. Alle Rechte vorbehalten.
              </p>
              <p className="text-gray-500 text-xs">
                Ihr vertrauensvoller Partner für Kreditvergleiche
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex flex-wrap gap-6">
                {rechtliches.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 text-sm hover:text-primary transition-colors duration-200 flex items-center group"
                  >
                    <i className="ri-shield-check-line text-primary mr-2 opacity-60 group-hover:opacity-100 transition-opacity duration-200"></i>
                    {item.name}
                  </Link>
                ))}
              </div>
              
              <Link
                href="/kreditanfrage"
                className="inline-flex items-center px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <i className="ri-calculator-line mr-2"></i>
                Jetzt anfragen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}