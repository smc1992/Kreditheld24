import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'

// Social Media Icon Mapping
const getSocialIcon = (platform: string) => {
  const icons: Record<string, string> = {
    facebook: 'ri-facebook-fill',
    twitter: 'ri-twitter-fill',
    instagram: 'ri-instagram-fill',
    linkedin: 'ri-linkedin-fill',
    youtube: 'ri-youtube-fill',
  }
  return icons[platform] || 'ri-link'
}

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const {
    company,
    contact,
    kreditarten,
    serviceLinks,
    legalLinks,
    socialMedia,
    copyright
  } = (footerData as Footer) || {}

  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-['Pacifico'] text-primary mb-4">
              {company?.name || 'Kreditheld24'}
            </h3>
            <p className="text-gray-300 mb-4">
              {company?.description || 'Ihr unabhängiger Kreditvergleich für maßgeschneiderte Finanzierungslösungen zu Top-Konditionen.'}
            </p>
            
            {/* Social Media Links */}
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

          {/* Kreditarten */}
          <div>
            <h4 className="font-medium text-lg mb-4">Kreditarten</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/ratenkredite" className="text-gray-300 hover:text-primary">Ratenkredit</Link>
              </li>
              <li>
                <Link href="/umschuldung" className="text-gray-300 hover:text-primary">Umschuldung</Link>
              </li>
              <li>
                <Link href="/schufa-neutral" className="text-gray-300 hover:text-primary">Kredit trotz SCHUFA</Link>
              </li>
              <li>
                <Link href="/sofortkredit" className="text-gray-300 hover:text-primary">Sofortkredit</Link>
              </li>
              <li>
                <Link href="/kredit-selbststaendige" className="text-gray-300 hover:text-primary">Kredit für Selbstständige</Link>
              </li>
              <li>
                <Link href="/autokredit" className="text-gray-300 hover:text-primary">Autokredit</Link>
              </li>
            </ul>
          </div>

          {/* Service Links */}
          <div>
            <h4 className="font-medium text-lg mb-4">Über uns</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/ueber-uns" className="text-gray-300 hover:text-primary">Unternehmen</Link>
              </li>
              <li>
                <Link href="/ueber-uns" className="text-gray-300 hover:text-primary">Team</Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-gray-300 hover:text-primary">Kontakt</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
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

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                {copyright || '© 2025 Kreditheld24. Alle Rechte vorbehalten.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/impressum" className="text-gray-400 text-sm hover:text-primary">
                Impressum
              </Link>
              <Link href="/datenschutz" className="text-gray-400 text-sm hover:text-primary">
                Datenschutz
              </Link>
              <Link href="/agb" className="text-gray-400 text-sm hover:text-primary">
                AGB
              </Link>
              <Link href="/cookie-einstellungen" className="text-gray-400 text-sm hover:text-primary">
                Cookie-Einstellungen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
