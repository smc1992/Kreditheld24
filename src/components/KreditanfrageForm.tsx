'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import DragDropFileUpload from '@/components/DragDropFileUpload'

interface FormData {
  // Persönliche Daten
  anrede: string
  vorname: string
  nachname: string
  geburtsdatum: string
  email: string
  telefon: string
  
  // Adresse
  strasse: string
  hausnummer: string
  plz: string
  ort: string
  
  // Kreditwunsch
  kreditart: string
  kreditsumme: string
  laufzeit: string
  gewuenschteRate: string
  verwendungszweck: string
  
  // Einkommen
  beschaeftigungsverhaeltnis: string
  arbeitgeber: string
  nettoEinkommen: string
  beschaeftigtSeit: string
  
  // Ausgaben
  miete: string
  sonstigeAusgaben: string
  bestehendeDarlehen: string
  
  // Zusätzliche Informationen
  bemerkungen: string
  datenschutz: boolean
  newsletter: boolean
  
  // Dokumenten-Upload
  gehaltsabrechnung1: File | null
  gehaltsabrechnung2: File | null
  personalausweisVorderseite: File | null
  personalausweisRueckseite: File | null
  bestehendeKredite: File | null
  kontoauszug: File | null
}

const initialFormData: FormData = {
  anrede: '',
  vorname: '',
  nachname: '',
  geburtsdatum: '',
  email: '',
  telefon: '',
  strasse: '',
  hausnummer: '',
  plz: '',
  ort: '',
  kreditart: '',
  kreditsumme: '',
  laufzeit: '',
  gewuenschteRate: '',
  verwendungszweck: '',
  beschaeftigungsverhaeltnis: '',
  arbeitgeber: '',
  nettoEinkommen: '',
  beschaeftigtSeit: '',
  miete: '',
  sonstigeAusgaben: '',
  bestehendeDarlehen: '',
  bemerkungen: '',
  datenschutz: false,
  newsletter: false,
  
  // Dokumenten-Upload
  gehaltsabrechnung1: null,
  gehaltsabrechnung2: null,
  personalausweisVorderseite: null,
  personalausweisRueckseite: null,
  bestehendeKredite: null,
  kontoauszug: null
}

export default function KreditanfrageForm() {
  const searchParams = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [currentStep, setCurrentStep] = useState(1)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationToken, setVerificationToken] = useState('')
  const [urlMessage, setUrlMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const totalSteps = 6

  const calculateAge = (birthDate: string): number => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const isUnder18 = formData.geburtsdatum ? calculateAge(formData.geburtsdatum) < 18 : false

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }) as FormData)
    }
  }

  const kreditsummeNumber = parseFloat(formData.kreditsumme) || 0
  const requiresKontoauszug = kreditsummeNumber >= 20000

  // Handle URL parameters for email verification
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    
    if (success === 'email-verified') {
      setEmailVerified(true)
      setCurrentStep(6)
      setUrlMessage({ type: 'success', message: 'E-Mail erfolgreich bestätigt! Sie können nun Ihre Dokumente hochladen.' })
    } else if (success === 'already-verified') {
      setEmailVerified(true)
      setCurrentStep(6)
      setUrlMessage({ type: 'success', message: 'E-Mail bereits bestätigt. Sie können Ihre Dokumente hochladen.' })
    } else if (error) {
      let errorMessage = 'Ein Fehler ist aufgetreten.'
      switch (error) {
        case 'invalid-token':
          errorMessage = 'Ungültiger Bestätigungslink.'
          break
        case 'token-not-found':
          errorMessage = 'Bestätigungslink nicht gefunden.'
          break
        case 'token-expired':
          errorMessage = 'Bestätigungslink ist abgelaufen. Bitte fordern Sie einen neuen an.'
          break
        case 'verification-failed':
          errorMessage = 'E-Mail-Bestätigung fehlgeschlagen. Bitte versuchen Sie es erneut.'
          break
      }
      setUrlMessage({ type: 'error', message: errorMessage })
    }
  }, [searchParams])

  const sendEmailVerification = async () => {
    try {
      // Hier würde die E-Mail-Bestätigung an den Server gesendet werden
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, formData })
      })
      
      if (response.ok) {
        const { token } = await response.json()
        setVerificationToken(token)
        setEmailVerificationSent(true)
      }
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail-Bestätigung:', error)
    }
  }

  const checkEmailVerification = async () => {
    try {
      const response = await fetch(`/api/check-verification/${verificationToken}`)
      if (response.ok) {
        const { verified } = await response.json()
        if (verified) {
          setEmailVerified(true)
          setCurrentStep(6) // Zu Dokumenten-Upload
        }
      }
    } catch (error) {
      console.error('Fehler beim Prüfen der E-Mail-Bestätigung:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Hier würde die API-Anfrage an den Server gesendet werden
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulation
      setSubmitStatus('success')
      setFormData(initialFormData)
      setCurrentStep(1)
      setEmailVerificationSent(false)
      setEmailVerified(false)
      setVerificationToken('')
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.anrede && formData.vorname && formData.nachname && formData.email && formData.telefon && !isUnder18)
      case 2:
        return !!(formData.strasse && formData.hausnummer && formData.plz && formData.ort)
      case 3:
        return !!(formData.kreditart && formData.kreditsumme && formData.laufzeit)
      case 4:
        return !!(formData.beschaeftigungsverhaeltnis && formData.beschaeftigungsverhaeltnis !== 'arbeitslos' && formData.nettoEinkommen)
      case 5:
        return emailVerified
      case 6:
        const requiredDocs = !!(formData.gehaltsabrechnung1 && formData.gehaltsabrechnung2 && 
                               formData.personalausweisVorderseite && formData.personalausweisRueckseite)
        const kontoauszugOk = !requiresKontoauszug || !!formData.kontoauszug
        return requiredDocs && kontoauszugOk
      default:
        return false
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-12">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Vielen Dank für Ihre Anfrage!</h3>
        <p className="text-gray-600 mb-6">
          Wir haben Ihre Kreditanfrage erhalten und werden uns innerhalb von 24 Stunden bei Ihnen melden.
        </p>
        <Button onClick={() => setSubmitStatus('idle')} className="bg-green-600 hover:bg-green-700">
          Neue Anfrage stellen
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Schritt {currentStep} von {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% abgeschlossen</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step 1: Persönliche Daten */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Persönliche Daten</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anrede *</label>
              <select
                name="anrede"
                value={formData.anrede}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Bitte wählen</option>
                <option value="herr">Herr</option>
                <option value="frau">Frau</option>
                <option value="divers">Divers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Vorname *</label>
              <input
                type="text"
                name="vorname"
                value={formData.vorname}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nachname *</label>
              <input
                type="text"
                name="nachname"
                value={formData.nachname}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsdatum</label>
              <input
                type="date"
                name="geburtsdatum"
                value={formData.geburtsdatum}
                onChange={handleInputChange}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  isUnder18 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'
                }`}
              />
              {isUnder18 && (
                <p className="text-red-600 text-sm mt-1">
                  Personen unter 18 Jahren dürfen keinen Kreditvertrag abschließen.
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail-Adresse *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefonnummer *</label>
              <input
                type="tel"
                name="telefon"
                value={formData.telefon}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Adresse */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Adresse</h3>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Straße *</label>
              <input
                type="text"
                name="strasse"
                value={formData.strasse}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hausnummer *</label>
              <input
                type="text"
                name="hausnummer"
                value={formData.hausnummer}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PLZ *</label>
              <input
                type="text"
                name="plz"
                value={formData.plz}
                onChange={handleInputChange}
                required
                pattern="[0-9]{5}"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ort *</label>
              <input
                type="text"
                name="ort"
                value={formData.ort}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Kreditwunsch */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Ihr Kreditwunsch</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kreditart *</label>
            <select
              name="kreditart"
              value={formData.kreditart}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Bitte wählen</option>
              <option value="ratenkredit">Ratenkredit</option>
              <option value="autokredit">Autokredit</option>
              <option value="umschuldung">Umschuldungskredit</option>
              <option value="sofortkredit">Sofortkredit</option>
              <option value="selbststaendige">Kredit für Selbstständige</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gewünschte Kreditsumme *</label>
              <div className="relative">
                <input
                  type="number"
                  name="kreditsumme"
                  value={formData.kreditsumme}
                  onChange={handleInputChange}
                  placeholder="z.B. 15.000"
                  min="1000"
                  max="500000"
                  step="100"
                  required
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  €
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gewünschte Laufzeit *</label>
              <select
                name="laufzeit"
                value={formData.laufzeit}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Bitte wählen</option>
                <option value="12">12 Monate</option>
                <option value="24">24 Monate</option>
                <option value="36">36 Monate</option>
                <option value="48">48 Monate</option>
                <option value="60">60 Monate</option>
                <option value="72">72 Monate</option>
                <option value="84">84 Monate</option>
                <option value="96">96 Monate</option>
                <option value="120">120 Monate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gewünschte monatliche Rate (optional)</label>
              <div className="relative">
                <input
                  type="number"
                  name="gewuenschteRate"
                  value={formData.gewuenschteRate}
                  onChange={handleInputChange}
                  placeholder="z.B. 250"
                  min="50"
                  max="5000"
                  step="10"
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  €
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Falls Sie eine bestimmte Rate im Kopf haben</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Verwendungszweck</label>
            <select
              name="verwendungszweck"
              value={formData.verwendungszweck}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Bitte wählen</option>
              <option value="auto">Autokauf</option>
              <option value="umschuldung">Umschuldung</option>
              <option value="renovierung">Renovierung/Modernisierung</option>
              <option value="moebel">Möbel/Einrichtung</option>
              <option value="urlaub">Urlaub/Reise</option>
              <option value="hochzeit">Hochzeit</option>
              <option value="ausbildung">Ausbildung/Weiterbildung</option>
              <option value="sonstiges">Sonstiges</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 4: Einkommen und Ausgaben */}
      {currentStep === 4 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Einkommen und Ausgaben</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Beschäftigungsverhältnis *</label>
            <select
              name="beschaeftigungsverhaeltnis"
              value={formData.beschaeftigungsverhaeltnis}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Bitte wählen</option>
              <option value="angestellt">Angestellt</option>
              <option value="beamter">Beamter</option>
              <option value="selbststaendig">Selbstständig</option>
              <option value="freiberufler">Freiberufler</option>
              <option value="rentner">Rentner</option>
              <option value="arbeitslos">Arbeitslos</option>
              <option value="student">Student</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Arbeitgeber</label>
              <input
                type="text"
                name="arbeitgeber"
                value={formData.arbeitgeber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Beschäftigt seit</label>
              <input
                type="month"
                name="beschaeftigtSeit"
                value={formData.beschaeftigtSeit}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Monatliches Nettoeinkommen *</label>
            <select
              name="nettoEinkommen"
              value={formData.nettoEinkommen}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Bitte wählen</option>
              <option value="unter-1000">unter 1.000 €</option>
              <option value="1000-1500">1.000 € - 1.500 €</option>
              <option value="1500-2000">1.500 € - 2.000 €</option>
              <option value="2000-2500">2.000 € - 2.500 €</option>
              <option value="2500-3000">2.500 € - 3.000 €</option>
              <option value="3000-4000">3.000 € - 4.000 €</option>
              <option value="4000-5000">4.000 € - 5.000 €</option>
              <option value="ueber-5000">über 5.000 €</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="datenschutz"
                checked={formData.datenschutz}
                onChange={handleInputChange}
                required
                className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                <a href="/datenschutz" className="text-green-600 hover:underline" target="_blank">
                  Datenschutzerklärung
                </a>{' '}
                zu. *
              </label>
            </div>
            <div className="flex items-start">
              <input
                type="checkbox"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleInputChange}
                className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                Ich möchte den Newsletter mit aktuellen Kreditangeboten und Finanzierungstipps erhalten.
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: E-Mail-Bestätigung */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">E-Mail-Bestätigung erforderlich</h3>
          
          {!emailVerificationSent ? (
            <div className="text-center space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-blue-900 mb-2">Bestätigen Sie Ihre E-Mail-Adresse</h4>
                <p className="text-blue-800 mb-4">
                  Um fortzufahren, müssen Sie Ihre E-Mail-Adresse bestätigen. Wir senden Ihnen einen Bestätigungslink an:
                </p>
                <p className="font-semibold text-blue-900 text-lg">{formData.email}</p>
              </div>
              
              <button
                onClick={sendEmailVerification}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg shadow-md transition-all"
              >
                E-Mail-Bestätigung senden
              </button>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-green-900 mb-2">E-Mail wurde gesendet!</h4>
                <p className="text-green-800 mb-4">
                  Wir haben eine Bestätigungs-E-Mail an <strong>{formData.email}</strong> gesendet.
                </p>
                <p className="text-green-700 text-sm mb-6">
                  Bitte prüfen Sie Ihr E-Mail-Postfach und klicken Sie auf den Bestätigungslink.
                  Die Seite wird automatisch aktualisiert, sobald Sie Ihre E-Mail bestätigt haben.
                </p>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-green-700 text-sm">Warten auf Bestätigung...</span>
                </div>
                
                <button
                  onClick={checkEmailVerification}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-all"
                >
                  Status prüfen
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>E-Mail nicht erhalten?</p>
                <button
                  onClick={() => {
                    setEmailVerificationSent(false)
                    sendEmailVerification()
                  }}
                  className="text-green-600 hover:text-green-700 underline"
                >
                  Erneut senden
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 6: Dokumenten-Upload */}
      {currentStep === 6 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Erforderliche Dokumente</h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Wichtige Hinweise zum Dokumenten-Upload:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Alle Dokumente müssen gut lesbar und vollständig sein</li>
                  <li>• Akzeptierte Formate: PDF, JPG, PNG (max. 5MB pro Datei)</li>
                  <li>• Persönliche Daten werden verschlüsselt übertragen und sicher gespeichert</li>
                  {requiresKontoauszug && (
                    <li>• Bei Kreditsummen ab 20.000 € ist ein Kontoauszug erforderlich</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Pflichtdokumente */}
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Pflichtdokumente *</h4>
            
            <div className="grid md:grid-cols-2 gap-6">
              <DragDropFileUpload
                name="gehaltsabrechnung1"
                label="Gehaltsabrechnung 1 (vorletzter Monat)"
                required
                currentFile={formData.gehaltsabrechnung1}
                onChange={handleFileChange}
              />
              
              <DragDropFileUpload
                name="gehaltsabrechnung2"
                label="Gehaltsabrechnung 2 (letzter Monat)"
                required
                currentFile={formData.gehaltsabrechnung2}
                onChange={handleFileChange}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <DragDropFileUpload
                name="personalausweisVorderseite"
                label="Personalausweis Vorderseite"
                required
                currentFile={formData.personalausweisVorderseite}
                onChange={handleFileChange}
              />
              
              <DragDropFileUpload
                name="personalausweisRueckseite"
                label="Personalausweis Rückseite"
                required
                currentFile={formData.personalausweisRueckseite}
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Bedingte Dokumente */}
          {requiresKontoauszug && (
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">
                Zusätzlich erforderlich (Kreditsumme ≥ 20.000 €)
              </h4>
              
              <DragDropFileUpload
                name="kontoauszug"
                label="Kontoauszug letzter Monat"
                required
                currentFile={formData.kontoauszug}
                onChange={handleFileChange}
                helpText="Erforderlich bei Kreditsummen ab 20.000 € zur Einkommensprüfung"
              />
            </div>
          )}

          {/* Optionale Dokumente */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Optionale Dokumente</h4>
            
            <DragDropFileUpload
              name="bestehendeKredite"
              label="Bestehende Kredite (falls vorhanden)"
              currentFile={formData.bestehendeKredite}
              onChange={handleFileChange}
              helpText="Kreditverträge oder Übersichten bestehender Verbindlichkeiten"
            />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gray-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Datenschutz & Sicherheit</h4>
                <p className="text-sm text-gray-600">
                  Ihre Dokumente werden verschlüsselt übertragen und gemäß DSGVO verarbeitet. 
                  Nach Abschluss der Kreditprüfung werden alle Dokumente sicher gelöscht oder archiviert.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t">
        <div>
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={prevStep}
              variant="outline"
              className="px-6 py-2"
            >
              Zurück
            </Button>
          )}
        </div>
        
        <div>
          {currentStep < totalSteps ? (
            currentStep === 4 ? (
              <Button
                type="button"
                onClick={() => {
                  if (isStepValid(currentStep)) {
                    sendEmailVerification()
                    setCurrentStep(5)
                  }
                }}
                disabled={!isStepValid(currentStep)}
                className="bg-green-600 hover:bg-green-700 px-6 py-2"
              >
                Daten bestätigen
              </Button>
            ) : currentStep === 5 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!emailVerified}
                className="bg-green-600 hover:bg-green-700 px-6 py-2"
              >
                Zu den Dokumenten
              </Button>
            ) : (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid(currentStep)}
                className="bg-green-600 hover:bg-green-700 px-6 py-2"
              >
                Weiter
              </Button>
            )
          ) : (
            <Button
              type="submit"
              disabled={!isStepValid(currentStep) || !formData.datenschutz || formData.beschaeftigungsverhaeltnis === 'arbeitslos' || isUnder18 || isSubmitting}
              className="bg-green-600 hover:bg-green-700 px-8 py-2"
            >
              {isSubmitting ? 'Wird gesendet...' : 'Anfrage absenden'}
            </Button>
          )}
        </div>
      </div>

      {submitStatus === 'error' && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.
        </div>
      )}

      {urlMessage && (
        <div className={`border px-4 py-3 rounded mt-4 ${
          urlMessage.type === 'success' 
            ? 'bg-green-100 border-green-400 text-green-700' 
            : 'bg-red-100 border-red-400 text-red-700'
        }`}>
          <div className="flex items-center">
            <svg className={`w-5 h-5 mr-2 ${
              urlMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              {urlMessage.type === 'success' ? (
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              )}
            </svg>
            <span>{urlMessage.message}</span>
          </div>
          <button
            onClick={() => setUrlMessage(null)}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Schließen
          </button>
        </div>
      )}

      {formData.beschaeftigungsverhaeltnis === 'arbeitslos' && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mt-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Hinweis:</span>
          </div>
          <p className="mt-1">
            Leider können wir Ihnen als arbeitslose Person keinen Kredit anbieten. Für eine Kreditvergabe ist ein regelmäßiges Einkommen erforderlich.
          </p>
        </div>
      )}

      {isUnder18 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Nicht berechtigt:</span>
          </div>
          <p className="mt-1">
            Personen unter 18 Jahren dürfen keinen Kreditvertrag abschließen. Sie müssen volljährig sein, um einen Kredit zu beantragen.
          </p>
        </div>
      )}
    </form>
  )
}