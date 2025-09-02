import Link from 'next/link'

const kreditarten = [
  { name: 'Ratenkredit', href: '/ratenkredite' },
  { name: 'Umschuldung', href: '/umschuldung' },
  { name: 'Kredit trotz SCHUFA', href: '/schufa-neutral' },
  { name: 'Sofortkredit', href: '/sofortkredit' },
  { name: 'Kredit für Selbstständige', href: '/kredit-selbststaendige' },
  { name: 'Autokredit', href: '/autokredit' },
]

const ueberUns = [
  { name: 'Unternehmen', href: '/ueber-uns' },
  { name: 'Team', href: '/team' },
  { name: 'Kontakt', href: '/kontakt' },
]

const rechtliches = [
  { name: 'Impressum', href: '/impressum' },
  { name: 'Datenschutz', href: '/datenschutz' },
  { name: 'AGB', href: '/agb' },
  { name: 'Cookie-Einstellungen', href: '/cookie-einstellungen' },
]

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-['Pacifico'] text-primary mb-4">
              Kreditheld24
            </h3>
            <p className="text-gray-300 mb-4">
              Ihr unabhängiger Kreditvergleich für maßgeschneiderte
              Finanzierungslösungen zu Top-Konditionen.
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
              {kreditarten.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-300 hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Über uns</h4>
            <ul className="space-y-2">
              {ueberUns.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-300 hover:text-primary">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Kontakt</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2 mt-1">
                  <i className="ri-map-pin-line"></i>
                </div>
                <span className="text-gray-300">
                  Brockmannstr. 204<br />48163 Münster<br /><br />Besucheranschrift:<br />Glücksburger Str. 13<br />49477 Ibbenbüren
                </span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-phone-line"></i>
                </div>
                <Link href="tel:+492511491427" className="text-gray-300 hover:text-primary">
                  0251. 149 142 77
                </Link>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 flex items-center justify-center text-primary mr-2">
                  <i className="ri-smartphone-line"></i>
                </div>
                <Link href="tel:+491795104859" className="text-gray-300 hover:text-primary">
                  0179. 51 04 859
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
              <p className="text-gray-400 text-sm">
                &copy; 2025 Kreditheld24. Alle Rechte vorbehalten.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              {rechtliches.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 text-sm hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}