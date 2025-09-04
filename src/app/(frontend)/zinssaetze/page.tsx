'use client'
import React, { useState, useEffect } from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

// Zinssatz-Datentyp
interface InterestRate {
  kreditart: string
  minZins: number
  maxZins: number
  repZins: number // Repräsentativer Zinssatz
  laufzeitMin: number
  laufzeitMax: number
  minSumme: number
  maxSumme: number
  lastUpdated: string
}

// Beispiel-Daten (in Produktion würden diese von einer API kommen)
const currentRates: InterestRate[] = [
  {
    kreditart: 'Ratenkredit',
    minZins: 2.99,
    maxZins: 9.99,
    repZins: 5.99,
    laufzeitMin: 12,
    laufzeitMax: 120,
    minSumme: 1000,
    maxSumme: 100000,
    lastUpdated: new Date().toISOString()
  },
  {
    kreditart: 'Autokredit',
    minZins: 1.99,
    maxZins: 7.99,
    repZins: 4.49,
    laufzeitMin: 12,
    laufzeitMax: 96,
    minSumme: 5000,
    maxSumme: 150000,
    lastUpdated: new Date().toISOString()
  },
  {
    kreditart: 'Umschuldung',
    minZins: 2.49,
    maxZins: 8.99,
    repZins: 5.49,
    laufzeitMin: 12,
    laufzeitMax: 144,
    minSumme: 3000,
    maxSumme: 120000,
    lastUpdated: new Date().toISOString()
  },
  {
    kreditart: 'Sofortkredit',
    minZins: 3.49,
    maxZins: 11.99,
    repZins: 6.99,
    laufzeitMin: 6,
    laufzeitMax: 84,
    minSumme: 500,
    maxSumme: 50000,
    lastUpdated: new Date().toISOString()
  },
  {
    kreditart: 'Kredit für Selbstständige',
    minZins: 4.99,
    maxZins: 14.99,
    repZins: 8.99,
    laufzeitMin: 12,
    laufzeitMax: 120,
    minSumme: 2000,
    maxSumme: 75000,
    lastUpdated: new Date().toISOString()
  }
]

export default function ZinssaetzePage() {
  const [rates, setRates] = useState<InterestRate[]>(currentRates)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(false)

  // Simuliere API-Aufruf für aktuelle Zinssätze
  const fetchCurrentRates = async () => {
    setIsLoading(true)
    try {
      // In Produktion würde hier ein echter API-Aufruf stattfinden
      // const response = await fetch('/api/current-rates')
      // const data = await response.json()
      
      // Simuliere Netzwerk-Delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simuliere leichte Zinssatz-Schwankungen
      const updatedRates = currentRates.map(rate => ({
        ...rate,
        minZins: Math.max(0.5, rate.minZins + (Math.random() - 0.5) * 0.2),
        maxZins: rate.maxZins + (Math.random() - 0.5) * 0.3,
        repZins: rate.repZins + (Math.random() - 0.5) * 0.25,
        lastUpdated: new Date().toISOString()
      }))
      
      setRates(updatedRates)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Fehler beim Laden der Zinssätze:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Automatische Aktualisierung alle 5 Minuten
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCurrentRates()
    }, 5 * 60 * 1000) // 5 Minuten

    return () => clearInterval(interval)
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (rate: number) => {
    return `${rate.toFixed(2)}%`
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pt-20 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900 text-white py-16 transition-colors duration-300 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-24 h-24 border border-green-300 rounded-full"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 border border-green-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-200 rounded-full"></div>
            <div className="absolute top-20 right-20 w-20 h-20 border border-green-300 rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm font-medium text-white">Aktuelle Zinssätze</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Aktuelle Zinssätze
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Immer die neuesten Konditionen im Überblick
              </p>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-sm opacity-80 mb-1">Letzte Aktualisierung:</p>
                <p className="font-semibold">{formatDate(lastUpdate)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Update Button */}
        <section className="py-6 bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div>
                <p className="text-gray-600">
                  Zinssätze werden automatisch alle 5 Minuten aktualisiert
                </p>
              </div>
              <button
                onClick={fetchCurrentRates}
                disabled={isLoading}
                className="bg-primary hover:bg-green-500 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Aktualisiere...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Jetzt aktualisieren
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Zinssätze Tabelle */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kreditart</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Repräsentativer Zinssatz</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Zinsspanne</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Laufzeit</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Kreditsumme</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Aktion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {rates.map((rate, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{rate.kreditart}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-2xl font-bold text-primary">
                              {formatPercent(rate.repZins)}
                            </div>
                            <div className="text-xs text-gray-500">eff. Jahreszins</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-sm text-gray-900">
                              {formatPercent(rate.minZins)} - {formatPercent(rate.maxZins)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-sm text-gray-900">
                              {rate.laufzeitMin} - {rate.laufzeitMax} Monate
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="text-sm text-gray-900">
                              {formatCurrency(rate.minSumme)} - {formatCurrency(rate.maxSumme)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Link
                              href="/kreditanfrage"
                              className="bg-primary hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Jetzt anfragen
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hinweise */}
              <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Wichtige Hinweise zu den Zinssätzen</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <p>
                    <strong>Repräsentativer Zinssatz:</strong> Der Zinssatz, den mindestens 2/3 aller Kunden bei diesem Kreditprodukt erhalten.
                  </p>
                  <p>
                    <strong>Zinsspanne:</strong> Die mögliche Bandbreite der Zinssätze je nach individueller Bonität und Kreditbedingungen.
                  </p>
                  <p>
                    <strong>Bonitätsabhängig:</strong> Ihr persönlicher Zinssatz hängt von Ihrer Kreditwürdigkeit, dem gewünschten Betrag und der Laufzeit ab.
                  </p>
                  <p>
                    <strong>Aktualität:</strong> Die Zinssätze werden regelmäßig aktualisiert, können sich aber täglich ändern.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gray-100 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Finden Sie Ihren persönlichen Zinssatz
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Stellen Sie eine unverbindliche Anfrage und erhalten Sie ein individuelles Angebot mit Ihrem persönlichen Zinssatz.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/kreditanfrage"
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-8 rounded-button shadow-md hover:shadow-lg transition-all"
                >
                  Jetzt Kreditanfrage stellen
                </Link>
                <Link
                  href="/kontakt"
                  className="bg-white hover:bg-gray-50 text-primary border-2 border-primary font-medium py-3 px-8 rounded-button shadow-md hover:shadow-lg transition-all"
                >
                  Persönliche Beratung
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}