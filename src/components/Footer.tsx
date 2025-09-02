import Link from 'next/link'
import { Logo } from '@/components/Logo/Logo'

const navigation = {
  main: [
    { name: 'Startseite', href: '/' },
    { name: 'Ratenkredite', href: '/ratenkredite' },
    { name: 'Autokredit', href: '/autokredit' },
    { name: 'Umschuldung', href: '/umschuldung' },
    { name: 'Kredit für Selbstständige', href: '/kredit-selbststaendige' },
    { name: 'Kreditarten', href: '/kreditarten' },
    { name: 'SCHUFA-neutral', href: '/schufa-neutral' },
    { name: 'Sofortkredit', href: '/sofortkredit' },
  ],
  service: [
    { name: 'Über uns', href: '/ueber-uns' },
    { name: 'Kontakt', href: '/kontakt' },
    { name: 'Tipps Kreditaufnahme', href: '/tipps-kreditaufnahme' },
    { name: 'Kreditanfrage', href: '/kreditanfrage' },
  ],
  legal: [
    { name: 'Impressum', href: '/impressum' },
    { name: 'Datenschutz', href: '/datenschutz' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo und Beschreibung */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-md">
              Kreditheld24 ist Ihr vertrauensvoller Partner für Kreditvergleiche. 
              Wir helfen Ihnen dabei, den passenden Kredit zu den besten Konditionen zu finden.
            </p>
            <div className="mt-6">
              <p className="text-gray-400 text-xs">
                © {new Date().getFullYear()} Kreditheld24. Alle Rechte vorbehalten.
              </p>
            </div>
          </div>

          {/* Kreditarten */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kreditarten
            </h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service & Rechtliches */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Service
            </h3>
            <ul className="space-y-2 mb-6">
              {navigation.service.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Rechtliches
            </h3>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trennlinie */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs">
              Kreditheld24 - Ihr Partner für günstige Kredite
            </p>
            <div className="mt-4 md:mt-0">
              <Link
                href="/kreditanfrage"
                className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200 text-sm"
              >
                Jetzt Kredit anfragen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}