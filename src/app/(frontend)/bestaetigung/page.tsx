import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: 'Bestätigung – Kreditheld24',
  description: 'Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt.'
}

export default function BestaetigungPage() {
  return (
    <div>
      {/* Hero / Confirmation */}
      <section className="relative py-20 bg-gradient-to-br from-green-50 via-blue-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-48 h-48 border border-green-400 rounded-full"></div>
          <div className="absolute bottom-16 right-24 w-32 h-32 border border-blue-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-300 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
              <i className="ri-checkbox-circle-line text-green-600 dark:text-green-400 mr-2"></i>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Bestätigung</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Vielen Dank! Ihre Anfrage ist bei uns eingegangen.</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
              Wir haben Ihre Angaben erhalten und melden uns zeitnah bei Ihnen. Bei Fragen erreichen Sie uns jederzeit über den Kontaktbereich.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-button hover:bg-green-500 transition-all shadow-md hover:shadow-lg"
              >
                <i className="ri-home-4-line mr-2"></i>
                Zur Startseite
              </Link>
              <Link 
                href="/kreditanfrage"
                className="inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 text-primary dark:text-green-400 border-2 border-primary dark:border-green-400 font-semibold rounded-button hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg"
              >
                <i className="ri-calculator-line mr-2"></i>
                Individueller Service
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Info / Next Steps */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <i className="ri-time-line ri-2x"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Wann melden wir uns?</h3>
              <p className="text-gray-600 dark:text-gray-300">In der Regel erhalten Sie innerhalb eines Werktags eine Rückmeldung mit den nächsten Schritten.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <i className="ri-file-list-3-line ri-2x"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Unterlagen vorbereiten</h3>
              <p className="text-gray-600 dark:text-gray-300">Halten Sie ggf. aktuelle Gehaltsabrechnungen und Identitätsnachweise bereit – wir informieren Sie, welche Dokumente benötigt werden.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                <i className="ri-customer-service-2-line ri-2x"></i>
              </div>
              <h3 className="text-lg font-semibold mb-2">Kontakt aufnehmen</h3>
              <p className="text-gray-600 dark:text-gray-300">Bei Fragen sind wir für Sie da: Nutzen Sie unser <Link href="/kontakt" className="text-primary hover:underline">Kontaktformular</Link>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}