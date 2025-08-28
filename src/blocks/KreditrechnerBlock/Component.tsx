'use client'

import React, { useState, useEffect } from 'react'

type Props = {
  blockType: 'kreditrechner'
  title?: string
  subtitle?: string
  kreditart?: 'ratenkredit' | 'autokredit' | 'umschuldung'
  minBetrag?: number
  maxBetrag?: number
  defaultBetrag?: number
  minLaufzeit?: number
  maxLaufzeit?: number
  defaultLaufzeit?: number
  zinssatz?: number
  buttonText?: string
  buttonLink?: string
  disableInnerContainer?: boolean
}

export const KreditrechnerBlockComponent: React.FC<Props> = ({
  title,
  subtitle,
  kreditart,
  minBetrag,
  maxBetrag,
  defaultBetrag,
  minLaufzeit,
  maxLaufzeit,
  defaultLaufzeit,
  zinssatz,
  buttonText,
  buttonLink,
}) => {
  const [betrag, setBetrag] = useState(defaultBetrag || 20000)
  const [laufzeit, setLaufzeit] = useState(defaultLaufzeit || 48)
  const [anzahlung, setAnzahlung] = useState(0)
  const [monatlicheRate, setMonatlicheRate] = useState(0)

  // Berechnung der monatlichen Rate
  useEffect(() => {
    const kreditbetrag = kreditart === 'autokredit' ? betrag - anzahlung : betrag
    const monatszins = (zinssatz || 3.99) / 100 / 12
    const rate = (kreditbetrag * monatszins * Math.pow(1 + monatszins, laufzeit)) / (Math.pow(1 + monatszins, laufzeit) - 1)
    setMonatlicheRate(Math.round(rate * 100) / 100)
  }, [betrag, laufzeit, anzahlung, zinssatz, kreditart])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      <div className="space-y-6">
        {/* Kreditbetrag */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {kreditart === 'autokredit' ? 'Fahrzeugpreis' : kreditart === 'umschuldung' ? 'Aktuelle Kreditsumme' : 'Kreditbetrag'}: 
            <span className="text-green-500 font-bold ml-1">{formatCurrency(betrag)}</span>
          </label>
          <input
            type="range"
            min={minBetrag || 3000}
            max={maxBetrag || 120000}
            step="1000"
            value={betrag}
            onChange={(e) => setBetrag(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${((betrag - (minBetrag || 3000)) / ((maxBetrag || 120000) - (minBetrag || 3000))) * 100}%, #e5e7eb ${((betrag - (minBetrag || 3000)) / ((maxBetrag || 120000) - (minBetrag || 3000))) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formatCurrency(minBetrag || 3000)}</span>
            <span>{formatCurrency(maxBetrag || 120000)}</span>
          </div>
        </div>

        {/* Anzahlung (nur bei Autokredit) */}
        {kreditart === 'autokredit' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Anzahlung: <span className="text-green-500 font-bold">{formatCurrency(anzahlung)}</span>
            </label>
            <input
              type="range"
              min="0"
              max={betrag * 0.5}
              step="1000"
              value={anzahlung}
              onChange={(e) => setAnzahlung(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${(anzahlung / (betrag * 0.5)) * 100}%, #e5e7eb ${(anzahlung / (betrag * 0.5)) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0 €</span>
              <span>{formatCurrency(betrag * 0.5)}</span>
            </div>
          </div>
        )}

        {/* Laufzeit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Laufzeit: <span className="text-green-500 font-bold">{laufzeit} Monate</span>
          </label>
          <input
            type="range"
            min={minLaufzeit || 12}
            max={maxLaufzeit || 120}
            step="6"
            value={laufzeit}
            onChange={(e) => setLaufzeit(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${((laufzeit - (minLaufzeit || 12)) / ((maxLaufzeit || 120) - (minLaufzeit || 12))) * 100}%, #e5e7eb ${((laufzeit - (minLaufzeit || 12)) / ((maxLaufzeit || 120) - (minLaufzeit || 12))) * 100}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{minLaufzeit || 12} Monate</span>
            <span>{maxLaufzeit || 120} Monate</span>
          </div>
        </div>

        {/* Ergebnis */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-700 font-medium">Monatliche Rate:</span>
            <span className="text-2xl font-bold text-green-600">{formatCurrency(monatlicheRate)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Effektiver Jahreszins:</span>
            <span>ab {zinssatz}%</span>
          </div>
          {kreditart === 'autokredit' && (
            <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
              <span>Finanzierungsbetrag:</span>
              <span>{formatCurrency(betrag - anzahlung)}</span>
            </div>
          )}
        </div>

        {/* Button */}
        <a
          href={buttonLink || '/kontakt'}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors text-center block"
        >
          {buttonText || 'Kredit beantragen'}
        </a>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}