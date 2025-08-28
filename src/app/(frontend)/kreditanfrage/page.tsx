import React from 'react'
import { Metadata } from 'next'
import KreditanfrageForm from '@/components/KreditanfrageForm'

export const metadata: Metadata = {
  title: 'Unverbindliche Kreditanfrage - Kreditheld24',
  description: 'Stellen Sie eine unverbindliche Kreditanfrage und erhalten Sie ein maßgeschneidertes Angebot von Kreditheld24. Schnell, sicher und kostenlos.',
  keywords: 'Kreditanfrage, unverbindlich, Kredit beantragen, Kreditheld24, maßgeschneidertes Angebot'
}

export default function KreditanfragePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Unverbindliche Kreditanfrage
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Erhalten Sie Ihr maßgeschneidertes Kreditangebot in wenigen Minuten
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-left">
                <h3 className="text-lg font-semibold mb-4">Warum sollten Sie unser Formular ausfüllen?</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Individuelle Kreditkonditionen basierend auf Ihrer Situation
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Kostenlose und unverbindliche Beratung
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Schnelle Rückmeldung innerhalb von 24 Stunden
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-300 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Vergleich verschiedener Kreditanbieter für beste Konditionen
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Ihre Kreditanfrage
                  </h2>
                  <p className="text-gray-600">
                    Füllen Sie das Formular aus und erhalten Sie Ihr persönliches Kreditangebot
                  </p>
                </div>
                
                <KreditanfrageForm />
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Vertrauen Sie auf unsere Expertise
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">100% Sicher</h4>
                  <p className="text-gray-600">Ihre Daten werden SSL-verschlüsselt übertragen und vertraulich behandelt.</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Schnelle Zusage</h4>
                  <p className="text-gray-600">Erhalten Sie innerhalb von 24 Stunden eine Rückmeldung zu Ihrer Anfrage.</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Beste Konditionen</h4>
                  <p className="text-gray-600">Wir vergleichen für Sie verschiedene Anbieter und finden die besten Zinsen.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Formular Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <KreditanfrageForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}