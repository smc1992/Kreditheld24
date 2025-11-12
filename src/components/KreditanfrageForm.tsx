'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from './ui/button'
import DragDropFileUpload from './DragDropFileUpload'
import ProgressIndicator, { kreditanfrageSteps } from './ProgressIndicator'

interface FormData {
  // Persönliche Daten
  anrede: string
  vorname: string
  nachname: string
  geburtsdatum: string
  geburtsort: string
  familienstand: string
  staatsangehoerigkeit: string
  email: string
  telefon: string
  
  // Adresse
  strasse: string
  hausnummer: string
  plz: string
  ort: string
  
  // Kreditwunsch
  produktKategorie: 'privatkredit' | 'baufinanzierung'
  kreditart: string
  kreditsumme: string
  laufzeit: string
  gewuenschteRate: string
  verwendungszweck: string
  baufinanzierungArt: string
  kaufpreisBaukosten: string
  eigenkapital: string
  
  // Einkommen
  beschaeftigungsverhaeltnis: string
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
  gehaltsabrechnung3: File | null
  steuerbescheid1: File | null
  steuerbescheid2: File | null
  steuerbescheid3: File | null
  bwaGuV: File | null
  bestehendeKredite: File | null
  kontoauszug: File | null
  meldebescheinigung: File | null
  jahreskontoauszug: File | null
  baufinanzierungNachweis: File | null
  expose: File | null

  // Bedingungs-Flags
  hatBestehendeKredite: boolean
  hatBaufinanzierung: boolean

  // Objektdaten (Baufinanzierung)
  objektart: string
  baujahr: string
  grundstuecksgroesse: string
  wohnflaeche: string
  kaufpreis: string
  modernisierungen: string
}

const initialFormData: FormData = {
  anrede: '',
  vorname: '',
  nachname: '',
  geburtsdatum: '',
  geburtsort: '',
  familienstand: '',
  staatsangehoerigkeit: '',
  email: '',
  telefon: '',
  strasse: '',
  hausnummer: '',
  plz: '',
  ort: '',
  produktKategorie: 'privatkredit',
  kreditart: '',
  kreditsumme: '',
  laufzeit: '',
  gewuenschteRate: '',
  verwendungszweck: '',
  baufinanzierungArt: '',
  kaufpreisBaukosten: '',
  eigenkapital: '',
  beschaeftigungsverhaeltnis: '',
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
  gehaltsabrechnung3: null,
  steuerbescheid1: null,
  steuerbescheid2: null,
  steuerbescheid3: null,
  bwaGuV: null,
  bestehendeKredite: null,
  kontoauszug: null,
  meldebescheinigung: null,
  jahreskontoauszug: null,
  baufinanzierungNachweis: null,
  expose: null,

  // Bedingungs-Flags
  hatBestehendeKredite: false,
  hatBaufinanzierung: false,

  // Objektdaten (Baufinanzierung)
  objektart: '',
  baujahr: '',
  grundstuecksgroesse: '',
  wohnflaeche: '',
  kaufpreis: '',
  modernisierungen: ''
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
  const [verificationUrl, setVerificationUrl] = useState<string | null>(null)
  const [urlMessage, setUrlMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [europaceCaseUrl, setEuropaceCaseUrl] = useState<string | null>(null)
  
  // Persistenz-Schlüssel
  const STORAGE_KEY = 'kh24_kreditanfrage_form_v1'
  const STORAGE_META_KEY = 'kh24_kreditanfrage_meta_v1'
  const FILE_KEYS: (keyof FormData)[] = [
    'gehaltsabrechnung1',
    'gehaltsabrechnung2',
    'gehaltsabrechnung3',
    'steuerbescheid1',
    'steuerbescheid2',
    'steuerbescheid3',
    'bwaGuV',
    'bestehendeKredite',
    'kontoauszug',
    'meldebescheinigung',
    'jahreskontoauszug',
    'baufinanzierungNachweis',
    'expose'
  ]

  const serializeFormData = (data: FormData): Record<string, any> => {
    const copy: Record<string, any> = {}
    Object.entries(data).forEach(([key, value]) => {
      if (!FILE_KEYS.includes(key as keyof FormData)) {
        copy[key] = value
      }
    })
    return copy
  }

  // Beim ersten Laden: aus localStorage wiederherstellen
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
      if (raw) {
        const saved = JSON.parse(raw)
        setFormData(prev => ({ ...prev, ...saved }))
      }
      const metaRaw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_META_KEY) : null
      if (metaRaw) {
        const meta = JSON.parse(metaRaw)
        if (typeof meta.currentStep === 'number') setCurrentStep(meta.currentStep)
        if (typeof meta.emailVerificationSent === 'boolean') setEmailVerificationSent(meta.emailVerificationSent)
        if (typeof meta.emailVerified === 'boolean') setEmailVerified(meta.emailVerified)
        if (typeof meta.verificationToken === 'string') setVerificationToken(meta.verificationToken)
      }
    } catch (e) {
      console.warn('Konnte gespeicherte Formularwerte nicht laden:', e)
    }
  }, [])

  // Änderungen kontinuierlich speichern (ohne Datei-Felder)
  useEffect(() => {
    try {
      const sanitized = serializeFormData(formData)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized))
      const meta = { currentStep, emailVerificationSent, emailVerified, verificationToken }
      localStorage.setItem(STORAGE_META_KEY, JSON.stringify(meta))
    } catch (e) {
      // Speichern ist optional, Fehler hier sind nicht kritisch
    }
  }, [formData, currentStep, emailVerificationSent, emailVerified, verificationToken])
  const totalSteps = 5

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

  const handleFileRemove = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: null
    }) as FormData)
  }

  // Kontoauszug 1 Monat ist generell erforderlich (Privatkredit, Selbständige und Baufinanzierung)
  const requiresKontoauszug = true
  // Dynamische Pflichtdokumente basierend auf Beschäftigungsverhältnis
  const isSelbststaendig = (formData.beschaeftigungsverhaeltnis || '').toLowerCase() === 'selbstständig' || (formData.beschaeftigungsverhaeltnis || '').toLowerCase() === 'selbststaendig'
  const requiredDocKeys = isSelbststaendig 
    ? ['steuerbescheid1', 'steuerbescheid2', 'steuerbescheid3'] 
    : ['gehaltsabrechnung1', 'gehaltsabrechnung2', 'gehaltsabrechnung3']
  const requiredSelectedCount = requiredDocKeys.filter((key) => (formData as any)[key]).length + (formData.kontoauszug ? 1 : 0)
  const requiredTotal = requiredDocKeys.length + (requiresKontoauszug ? 1 : 0)

  // Dynamische Liste der fehlenden Pflichtdokumente für klare Validierung
  const missingDocs: string[] = []
  if (isSelbststaendig) {
    if (!formData.steuerbescheid1) missingDocs.push('Steuerbescheid Jahr 1')
    if (!formData.steuerbescheid2) missingDocs.push('Steuerbescheid Jahr 2')
    if (!formData.steuerbescheid3) missingDocs.push('Steuerbescheid Jahr 3')
    // BWA optional
  } else {
    if (!formData.gehaltsabrechnung1) missingDocs.push('Gehaltsabrechnung 1')
    if (!formData.gehaltsabrechnung2) missingDocs.push('Gehaltsabrechnung 2')
    if (!formData.gehaltsabrechnung3) missingDocs.push('Gehaltsabrechnung 3')
  }
  if (!formData.kontoauszug) missingDocs.push('Kontoauszug letzter Monat')
  // Ausländische Staatsbürger: Meldebescheinigung
  if ((formData.staatsangehoerigkeit || '').toLowerCase() !== 'deutsch' && !formData.meldebescheinigung) {
    missingDocs.push('Meldebescheinigung')
  }
  // Bestehende Kredite/Baufinanzierung: Nachweise + Jahreskontoauszug
  if (formData.hatBestehendeKredite && !formData.bestehendeKredite) missingDocs.push('Nachweis bestehende Kredite')
  if (formData.hatBaufinanzierung && !formData.baufinanzierungNachweis) missingDocs.push('Nachweis bestehende Baufinanzierung')
  if ((formData.hatBestehendeKredite || formData.hatBaufinanzierung) && !formData.jahreskontoauszug) missingDocs.push('Jahreskontoauszug')
  // Baufinanzierung: Expose oder Objektdaten
  if (formData.produktKategorie === 'baufinanzierung') {
    const objektdatenOk = !!(formData.objektart && formData.baujahr && formData.grundstuecksgroesse && formData.wohnflaeche && formData.kaufpreis)
    if (!(formData.expose || objektdatenOk)) {
      missingDocs.push('Expose oder vollständige Objektdaten')
    }
  }

  // Handle URL parameters for email verification
  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    const tokenFromUrl = searchParams.get('token')
    
    if (success === 'email-verified' || success === 'already-verified') {
      setEmailVerified(true)
      setCurrentStep(5)
      setUrlMessage({ type: 'success', message: success === 'email-verified' ? 'E-Mail erfolgreich bestätigt! Sie können nun Ihre Dokumente hochladen.' : 'E-Mail bereits bestätigt. Sie können Ihre Dokumente hochladen.' })
      // Falls Token vorhanden: gespeicherte Formulardaten vom Server laden und zusammenführen
      if (tokenFromUrl) {
        setVerificationToken(tokenFromUrl)
        ;(async () => {
          try {
            const resp = await fetch(`/api/check-verification/${tokenFromUrl}`)
            if (resp.ok) {
              const data = await resp.json()
              if (data?.formData) {
                setFormData(prev => ({ ...prev, ...data.formData }))
              }
            }
          } catch (e) {
            console.warn('Konnte gespeicherte Formulardaten nicht laden:', e)
          }
        })()
      }
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
        const data = await response.json()
        if (data?.token) {
          setVerificationToken(data.token)
        }
        if (data?.verificationUrl) {
          setVerificationUrl(data.verificationUrl)
        } else {
          setVerificationUrl(null)
        }
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
          setCurrentStep(5) // Zu Dokumenten-Upload
        }
      }
    } catch (error) {
      console.error('Fehler beim Prüfen der E-Mail-Bestätigung:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Sicherheit: E-Mail muss verifiziert sein, bevor die Anfrage gesendet wird
    if (!emailVerified) {
      setSubmitStatus('error')
      setUrlMessage({ type: 'error', message: 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.' })
      return
    }

    setIsSubmitting(true)
    
    try {
      // FormData mit Feldern und Dateien erstellen
      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof File !== 'undefined' && value instanceof File) {
            payload.append(key, value)
          } else {
            payload.append(key, String(value))
          }
        }
      })
      // Verifizierungs-Token beilegen (Server prüft es)
      payload.append('verificationToken', verificationToken)

      const res = await fetch('/api/kreditanfrage', {
        method: 'POST',
        body: payload
      })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || 'Fehler beim Senden der Anfrage')
      }

      // Nach erfolgreicher lokalen Anfrage: Europace-Vorgang anlegen (ohne Dateien)
      setEuropaceCaseUrl(null)
      try {
        const leadRequest = {
          anrede: formData.anrede,
          vorname: formData.vorname,
          nachname: formData.nachname,
          email: formData.email,
          telefon: formData.telefon,
          strasse: formData.strasse,
          hausnummer: formData.hausnummer,
          plz: formData.plz,
          ort: formData.ort,
          kreditsumme: formData.kreditsumme,
          laufzeit: (formData.produktKategorie === 'baufinanzierung' ? (formData.laufzeit ? String(Number(formData.laufzeit) * 12) : '') : formData.laufzeit),
          verwendungszweck: formData.verwendungszweck,
        }
        const leadRes = await fetch('/api/europace/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadRequest),
        })
        if (leadRes.ok) {
          const leadData = await leadRes.json()
          if (leadData?.openUrl && leadData?.source === 'europace') {
            setEuropaceCaseUrl(leadData.openUrl)
          }
        }
      } catch (leadErr) {
        // Externe Verbindung kann fehlschlagen; wir behandeln dies nicht als Fehler für den Nutzer
        console.warn('Europace Lead konnte nicht angelegt werden:', leadErr)
      }

      setSubmitStatus('success')
      // Nach erfolgreichem finalem Absenden: lokale Speicherung aus Datenschutzgründen leeren
      try {
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(STORAGE_META_KEY)
      } catch {}
      setFormData(initialFormData)
      setCurrentStep(1)
      setEmailVerificationSent(false)
      setEmailVerified(false)
      setVerificationToken('')
    } catch (err) {
      console.error('Fehler beim Absenden:', err)
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
        return !!(formData.anrede && formData.vorname && formData.nachname && formData.email && formData.telefon && formData.familienstand && formData.staatsangehoerigkeit && formData.geburtsort && !isUnder18)
      case 2:
        return !!(formData.strasse && formData.hausnummer && formData.plz && formData.ort)
      case 3:
        if (formData.produktKategorie === 'baufinanzierung') {
          return !!(formData.baufinanzierungArt && formData.kaufpreisBaukosten && formData.eigenkapital && formData.miete && formData.datenschutz)
        }
        return !!(formData.kreditart && formData.kreditsumme && formData.laufzeit && formData.miete && formData.datenschutz)
      case 4:
        return emailVerified
      case 5:
        const baseDocsOk = isSelbststaendig
          ? !!(formData.steuerbescheid1 && formData.steuerbescheid2 && formData.steuerbescheid3)
          : !!(formData.gehaltsabrechnung1 && formData.gehaltsabrechnung2 && formData.gehaltsabrechnung3)
        const kontoauszugOk = !!formData.kontoauszug
        const meldeOk = (formData.staatsangehoerigkeit || '').toLowerCase() === 'deutsch' || !!formData.meldebescheinigung
        const krediteOk = !formData.hatBestehendeKredite || (!!formData.bestehendeKredite && !!formData.jahreskontoauszug)
        const baufinOk = !formData.hatBaufinanzierung || (!!formData.baufinanzierungNachweis && !!formData.jahreskontoauszug)
        let exposeObjektOk = true
        if (formData.produktKategorie === 'baufinanzierung') {
          const objektdatenOk = !!(formData.objektart && formData.baujahr && formData.grundstuecksgroesse && formData.wohnflaeche && formData.kaufpreis)
          exposeObjektOk = !!(formData.expose || objektdatenOk)
        }
        return baseDocsOk && kontoauszugOk && meldeOk && krediteOk && baufinOk && exposeObjektOk
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
        {europaceCaseUrl && (
          <p className="text-gray-700 mb-4">
            Vorgang in Europace erstellt. <a href={europaceCaseUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 underline">Vorgang öffnen</a>
          </p>
        )}
        <Button onClick={() => setSubmitStatus('idle')} className="bg-green-600 hover:bg-green-700">
          Neue Anfrage stellen
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <ProgressIndicator 
          steps={kreditanfrageSteps} 
          currentStep={currentStep - 1} 
        />
      </div>

      {/* Schnellzugriff: Upload-Bereich öffnen / Link kopieren */}
      {(verificationToken && (emailVerificationSent || emailVerified)) && (
        <div className="mb-6 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded px-4 py-3">
          <span className="text-sm text-yellow-800">Sie können jederzeit zum Dokumenten-Upload zurückkehren.</span>
          <div className="flex gap-2">
            <Button type="button" onClick={() => setCurrentStep(5)} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              Upload-Bereich öffnen
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const url = `${window.location.origin}/kreditanfrage?success=already-verified&token=${verificationToken}`
                navigator.clipboard.writeText(url)
              }}
            >
              Link kopieren
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Persönliche Daten */}
      {currentStep === 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-semibold text-gray-900">Persönliche Daten</h3>
            <p className="text-sm text-gray-600 mt-1">Bitte geben Sie Ihre persönlichen Informationen ein</p>
          </div>
          
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

          <div className="grid md:grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Geburtsort *</label>
              <input
                type="text"
                name="geburtsort"
                value={formData.geburtsort}
                onChange={handleInputChange}
                required
                placeholder="z.B. Berlin"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Familienstand *</label>
              <select
                name="familienstand"
                value={formData.familienstand}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Bitte wählen</option>
                <option value="ledig">Ledig</option>
                <option value="verheiratet">Verheiratet</option>
                <option value="geschieden">Geschieden</option>
                <option value="verwitwet">Verwitwet</option>
                <option value="lebenspartnerschaft">Eingetragene Lebenspartnerschaft</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staatsangehörigkeit *</label>
              <input
                type="text"
                name="staatsangehoerigkeit"
                value={formData.staatsangehoerigkeit}
                onChange={handleInputChange}
                required
                placeholder="z.B. Deutsch"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
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
                <option value="selbstständig">Selbstständig</option>
              </select>
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
          {/* Kategorie-Navigation */}
          <div className="flex gap-3 mb-2">
            <Button
              type="button"
              variant={formData.produktKategorie === 'privatkredit' ? 'default' : 'outline'}
              onClick={() => setFormData(prev => ({ ...prev, produktKategorie: 'privatkredit' }))}
            >
              Privatkredite
            </Button>
            <Button
              type="button"
              variant={formData.produktKategorie === 'baufinanzierung' ? 'default' : 'outline'}
              onClick={() => setFormData(prev => ({ ...prev, produktKategorie: 'baufinanzierung' }))}
            >
              Baufinanzierung
            </Button>
          </div>
          
          {formData.produktKategorie === 'privatkredit' ? (
            <>
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
                {/* Duplikate entfernt: Kreditsumme/Laufzeit werden im allgemeinen Bereich unten abgefragt */}
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
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Art der Baufinanzierung *</label>
                <select
                  name="baufinanzierungArt"
                  value={formData.baufinanzierungArt}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Bitte wählen</option>
                  <option value="neubau">Neubau</option>
                  <option value="kauf">Kauf</option>
                  <option value="modernisierung">Modernisierung</option>
                  <option value="anschlussfinanzierung">Anschlussfinanzierung</option>
                  <option value="kapitalbeschaffung">Kapitalbeschaffung</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kaufpreis/Baukosten *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="kaufpreisBaukosten"
                      value={formData.kaufpreisBaukosten}
                      onChange={handleInputChange}
                      placeholder="z.B. 350.000"
                      min="10000"
                      max="5000000"
                      step="1000"
                      required
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      €
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Eigenkapital *</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="eigenkapital"
                      value={formData.eigenkapital}
                      onChange={handleInputChange}
                      placeholder="z.B. 60.000"
                      min="0"
                      max="5000000"
                      step="1000"
                      required
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      €
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {formData.produktKategorie === 'baufinanzierung' ? 'Gewünschte Laufzeit (Jahre) *' : 'Gewünschte Laufzeit *'}
              </label>
              <select
                name="laufzeit"
                value={formData.laufzeit}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {formData.produktKategorie === 'baufinanzierung' ? (
                  <>
                    <option value="">Bitte wählen</option>
                    <option value="5">5 Jahre</option>
                    <option value="10">10 Jahre</option>
                    <option value="15">15 Jahre</option>
                    <option value="20">20 Jahre</option>
                    <option value="25">25 Jahre</option>
                    <option value="30">30 Jahre</option>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monatliche Miete *</label>
              <div className="relative">
                <input
                  type="number"
                  name="miete"
                  value={formData.miete}
                  onChange={handleInputChange}
                  placeholder="z.B. 850"
                  min="0"
                  max="10000"
                  step="10"
                  required
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                  €
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Ihre monatliche Miete inkl. Nebenkosten</p>
            </div>
          </div>

          {/* Bestehende Verbindlichkeiten: Flags zur späteren Upload-Pflicht */}
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="hatBestehendeKredite"
                checked={formData.hatBestehendeKredite}
                onChange={handleInputChange}
                className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Ich habe bestehende Kredite</label>
            </div>
            <div className="flex items-start">
              <input
                type="checkbox"
                name="hatBaufinanzierung"
                checked={formData.hatBaufinanzierung}
                onChange={handleInputChange}
                className="mt-1 mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Ich habe eine bestehende Baufinanzierung</label>
            </div>
          </div>

          {/* Objektdaten für Baufinanzierung */}
          {formData.produktKategorie === 'baufinanzierung' && (
            <div className="mt-6 space-y-4">
              <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Objektdaten</h4>
              <p className="text-sm text-gray-600">Sie können alternativ später ein Exposé hochladen.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objektart</label>
                  <select
                    name="objektart"
                    value={formData.objektart}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Bitte wählen</option>
                    <option value="einfamilienhaus">Einfamilienhaus</option>
                    <option value="reihenhaus">Reihenhaus</option>
                    <option value="doppelhaushälfte">Doppelhaushälfte</option>
                    <option value="doppelhaus">Doppelhaus</option>
                    <option value="eigentumswohnung">Eigentumswohnung</option>
                    <option value="sonstige">Sonstige</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Baujahr</label>
                  <input
                    type="text"
                    name="baujahr"
                    value={formData.baujahr}
                    onChange={handleInputChange}
                    placeholder="z.B. 1998"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grundstücksgröße (m²)</label>
                  <input
                    type="text"
                    name="grundstuecksgroesse"
                    value={formData.grundstuecksgroesse}
                    onChange={handleInputChange}
                    placeholder="z.B. 450"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Wohnfläche (m²)</label>
                  <input
                    type="text"
                    name="wohnflaeche"
                    value={formData.wohnflaeche}
                    onChange={handleInputChange}
                    placeholder="z.B. 120"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Kaufpreis (€)</label>
                  <input
                    type="text"
                    name="kaufpreis"
                    value={formData.kaufpreis}
                    onChange={handleInputChange}
                    placeholder="z.B. 350.000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Letzte Modernisierungen (mit Jahr)</label>
                  <input
                    type="text"
                    name="modernisierungen"
                    value={formData.modernisierungen}
                    onChange={handleInputChange}
                    placeholder="z.B. 2020 Bad, 2018 Dach"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Datenschutz & Newsletter: nach Kreditwunsch (Teil von Schritt 3) */}
      {currentStep === 3 && (
        <div className="space-y-6">
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

      {/* Step 4: E-Mail-Bestätigung */}
      {currentStep === 4 && (
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
              {verificationUrl && (
                <div className="text-sm text-gray-700 mb-4">
                  <p className="mb-2">Falls die E-Mail nicht ankommt, können Sie direkt bestätigen.</p>
                  <a
                    href={verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 underline"
                  >
                    Link zur E-Mail-Bestätigung öffnen
                  </a>
                </div>
              )}
                
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
                    setVerificationUrl(null)
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

      {/* Step 5: Dokumenten-Upload */}
      {currentStep === 5 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Erforderliche Dokumente</h3>
          {/* Beschäftigungsverhältnis wird in Schritt 1 abgefragt */}
          
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
                  <li>• Kontoauszug (letzter Monat) ist erforderlich</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pflichtdokumente */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h4 className="text-lg font-medium text-gray-800">Pflichtdokumente *</h4>
              <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                {requiredSelectedCount}/{requiredTotal} ausgewählt
              </span>
            </div>

            {/* Validierungshinweis: Zeigt klar, welche Pflichtdokumente fehlen */}
            {missingDocs.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800 mb-1">Bitte laden Sie die fehlenden Pflichtdokumente hoch:</p>
                <ul className="text-sm text-red-700 list-disc list-inside">
                  {missingDocs.map((doc) => (
                    <li key={doc}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Checkliste der erforderlichen Unterlagen */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-green-900 mb-2">
                Checkliste {formData.produktKategorie === 'baufinanzierung' ? 'Baufinanzierung' : 'Privatkredit'}
              </h4>
              <ul className="text-sm text-green-800 space-y-1">
                {isSelbststaendig ? (
                  <>
                    <li className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${formData.steuerbescheid1 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={formData.steuerbescheid1 ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                      </svg>
                      <span>Steuerbescheid Jahr 1</span>
                    </li>
                    <li className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${formData.steuerbescheid2 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={formData.steuerbescheid2 ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                      </svg>
                      <span>Steuerbescheid Jahr 2</span>
                    </li>
                    <li className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${formData.steuerbescheid3 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={formData.steuerbescheid3 ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                      </svg>
                      <span>Steuerbescheid Jahr 3</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${formData.gehaltsabrechnung1 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={formData.gehaltsabrechnung1 ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                      </svg>
                      <span>Gehaltsabrechnung 1</span>
                    </li>
                    <li className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${formData.gehaltsabrechnung2 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={formData.gehaltsabrechnung2 ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                      </svg>
                      <span>Gehaltsabrechnung 2</span>
                    </li>
                    <li className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${formData.gehaltsabrechnung3 ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={formData.gehaltsabrechnung3 ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                      </svg>
                      <span>Gehaltsabrechnung 3</span>
                    </li>
                  </>
                )}
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.kontoauszug ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d={formData.kontoauszug ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                  </svg>
                  <span>Kontoauszug (letzter Monat)</span>
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${formData.miete ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d={formData.miete ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                  </svg>
                  <span>Miete angegeben (Höhe)</span>
                </li>
                <li className="flex items-center">
                  <svg className={`w-4 h-4 mr-2 ${((formData.staatsangehoerigkeit || '').toLowerCase() === 'deutsch' || formData.meldebescheinigung) ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d={((formData.staatsangehoerigkeit || '').toLowerCase() === 'deutsch' || formData.meldebescheinigung) ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                  </svg>
                  <span>Meldebescheinigung (nur bei ausländischer Staatsbürgerschaft)</span>
                  {(formData.staatsangehoerigkeit || '').toLowerCase() === 'deutsch' && (
                    <span className="ml-2 text-xs text-gray-600">nicht erforderlich</span>
                  )}
                </li>
                {formData.produktKategorie === 'baufinanzierung' && (
                  <>
                    <li className="flex items-center">
                      <svg className={`w-4 h-4 mr-2 ${((formData.expose || (formData.objektart && formData.baujahr && formData.grundstuecksgroesse && formData.wohnflaeche && formData.kaufpreis))) ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d={((formData.expose || (formData.objektart && formData.baujahr && formData.grundstuecksgroesse && formData.wohnflaeche && formData.kaufpreis))) ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                      </svg>
                      <span>Exposé oder vollständige Objektdaten</span>
                    </li>
                    {formData.hatBaufinanzierung && (
                      <li className="flex items-center">
                        <svg className={`w-4 h-4 mr-2 ${formData.baufinanzierungNachweis ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={formData.baufinanzierungNachweis ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                        </svg>
                        <span>Nachweis bestehende Baufinanzierung</span>
                      </li>
                    )}
                    {(formData.hatBestehendeKredite || formData.hatBaufinanzierung) && (
                      <li className="flex items-center">
                        <svg className={`w-4 h-4 mr-2 ${formData.jahreskontoauszug ? 'text-green-600' : 'text-red-600'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d={formData.jahreskontoauszug ? 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' : 'M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 5.293a1 1 0 00-1.414-1.414L9 9.171 7.707 7.879a1 1 0 00-1.414 1.414L9 12l4.707-4.707z'} clipRule="evenodd" />
                        </svg>
                        <span>Jahreskontoauszug</span>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
            
            {isSelbststaendig ? (
              <div className="grid md:grid-cols-3 gap-6">
                <DragDropFileUpload
                  name="steuerbescheid1"
                  label="Steuerbescheid Jahr 1"
                  required
                  currentFile={formData.steuerbescheid1}
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                />
                <DragDropFileUpload
                  name="steuerbescheid2"
                  label="Steuerbescheid Jahr 2"
                  required
                  currentFile={formData.steuerbescheid2}
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                />
                <DragDropFileUpload
                  name="steuerbescheid3"
                  label="Steuerbescheid Jahr 3"
                  required
                  currentFile={formData.steuerbescheid3}
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                <DragDropFileUpload
                  name="gehaltsabrechnung1"
                  label="Gehaltsabrechnung 1"
                  required
                  currentFile={formData.gehaltsabrechnung1}
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                />
                <DragDropFileUpload
                  name="gehaltsabrechnung2"
                  label="Gehaltsabrechnung 2"
                  required
                  currentFile={formData.gehaltsabrechnung2}
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                />
                <DragDropFileUpload
                  name="gehaltsabrechnung3"
                  label="Gehaltsabrechnung 3"
                  required
                  currentFile={formData.gehaltsabrechnung3}
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                />
              </div>
            )}
          </div>

          {/* Weitere erforderliche/bedingte Dokumente */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-800 border-b border-gray-200 pb-2">Weitere Dokumente</h4>

            {/* Kontoauszug immer erforderlich */}
            <DragDropFileUpload
              name="kontoauszug"
              label="Kontoauszug letzter Monat"
              required
              currentFile={formData.kontoauszug}
              onChange={handleFileChange}
              onRemove={handleFileRemove}
            />

            {/* Meldebescheinigung für nicht-deutsche Staatsangehörigkeit */}
            {(formData.staatsangehoerigkeit || '').toLowerCase() !== 'deutsch' && (
              <DragDropFileUpload
                name="meldebescheinigung"
                label="Meldebescheinigung"
                required
                currentFile={formData.meldebescheinigung}
                onChange={handleFileChange}
                onRemove={handleFileRemove}
              />
            )}

            {/* Bestehende Kredite */}
            {formData.hatBestehendeKredite && (
              <>
                <DragDropFileUpload
                  name="bestehendeKredite"
                  label="Nachweis bestehende Kredite"
                  required
                  currentFile={formData.bestehendeKredite}
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                />
                <DragDropFileUpload
                  name="jahreskontoauszug"
                  label="Jahreskontoauszug"
                  required
                  currentFile={formData.jahreskontoauszug}
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                />
              </>
            )}

            {/* Bestehende Baufinanzierung */}
            {formData.hatBaufinanzierung && (
              <>
                <DragDropFileUpload
                  name="baufinanzierungNachweis"
                  label="Nachweis bestehende Baufinanzierung"
                  required
                  currentFile={formData.baufinanzierungNachweis}
                  onChange={handleFileChange}
                  onRemove={handleFileRemove}
                />
                {!formData.hatBestehendeKredite && (
                  <DragDropFileUpload
                    name="jahreskontoauszug"
                    label="Jahreskontoauszug"
                    required
                    currentFile={formData.jahreskontoauszug}
                    onChange={handleFileChange}
                    onRemove={handleFileRemove}
                  />
                )}
              </>
            )}

            {/* BWA optional für Selbstständige */}
            {isSelbststaendig && (
              <DragDropFileUpload
                name="bwaGuV"
                label="BWA/GuV (optional)"
                currentFile={formData.bwaGuV}
                onChange={handleFileChange}
                onRemove={handleFileRemove}
              />
            )}

            {/* Exposé Upload für Baufinanzierungen (Alternative zu Objektdaten) */}
            {formData.produktKategorie === 'baufinanzierung' && (
              <DragDropFileUpload
                name="expose"
                label="Exposé (optional – alternativ Objektdaten angeben)"
                currentFile={formData.expose}
                onChange={handleFileChange}
                onRemove={handleFileRemove}
              />
            )}
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
            currentStep === 3 ? (
              <Button
                type="button"
                onClick={() => {
                  if (isStepValid(currentStep)) {
                    sendEmailVerification()
                    setCurrentStep(4)
                  }
                }}
                disabled={!isStepValid(currentStep)}
                className="bg-green-600 hover:bg-green-700 px-6 py-2"
              >
                Daten bestätigen
              </Button>
            ) : currentStep === 4 ? (
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
              disabled={!isStepValid(currentStep) || !formData.datenschutz || isUnder18 || isSubmitting}
              className="bg-green-600 hover:bg-green-700 px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Hinweis für arbeitslos entfernt – Beschäftigungsdaten werden nicht mehr abgefragt */}

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