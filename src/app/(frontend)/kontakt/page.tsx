'use client'

import React, { useState } from 'react'
import Link from 'next/link'

const KontaktPage = () => {
  const [formData, setFormData] = useState({
    salutation: 'herr',
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    subject: 'allgemeine-anfrage',
    message: '',
    privacy: false
  })

  const [callbackData, setCallbackData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '09:00',
    privacy: false
  })

  const [showCallbackModal, setShowCallbackModal] = useState(false)

  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleCallbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setCallbackData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.')
    setFormData({
      salutation: 'herr',
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      subject: 'allgemeine-anfrage',
      message: '',
      privacy: false
    })
  }

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Vielen Dank! Wir werden Sie zum gewünschten Termin zurückrufen.')
    setCallbackData({
      name: '',
      phone: '',
      date: '',
      time: '09:00',
      privacy: false
    })
    setShowCallbackModal(false)
  }




  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqData = [
    {
      question: "Wie kann ich einen Kredit beantragen?",
      answer: "Sie können einen Kredit ganz einfach über unsere Website beantragen. Nutzen Sie unseren Kreditrechner, um Ihre Wunschkonditionen einzugeben und starten Sie dann Ihre unverbindliche Anfrage. Alternativ können Sie uns auch telefonisch oder per E-Mail kontaktieren."
    },
    {
      question: "Ist eine Kreditanfrage bei Kreditheld24 SCHUFA-neutral?",
      answer: "Ja, unsere Vorabanfrage ist zu 100% SCHUFA-neutral. Das bedeutet, dass Ihre Anfrage keinen Einfluss auf Ihren SCHUFA-Score hat. Erst wenn Sie sich für ein konkretes Angebot entscheiden und den Kreditvertrag unterschreiben, erfolgt eine Meldung an die SCHUFA."
    },
    {
      question: "Welche Unterlagen benötige ich für einen Kreditantrag?",
      answer: "Für einen Kreditantrag benötigen Sie in der Regel folgende Unterlagen: Personalausweis oder Reisepass, Einkommensnachweise der letzten 2-3 Monate, Kontoauszüge und ggf. weitere Nachweise je nach Kreditart und -höhe. Wir informieren Sie im Laufe des Antragsprozesses genau, welche Unterlagen für Ihren individuellen Fall benötigt werden."
    },
    {
      question: "Wie lange dauert die Bearbeitung meines Kreditantrags?",
      answer: "Nach Eingang aller erforderlichen Unterlagen erhalten Sie in der Regel innerhalb von 24-48 Stunden eine Kreditentscheidung. Bei positiver Entscheidung erfolgt die Auszahlung des Kredits meist innerhalb von 1-3 Werktagen auf Ihr Konto."
    }
  ]

  return (
    <div className="font-sans text-gray-800 bg-white dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">



      {/* Page Title */}
      <section className="py-16 bg-gradient-to-br from-green-600 via-green-700 to-green-800 dark:from-green-700 dark:via-green-800 dark:to-green-900 text-white transition-colors duration-300 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-right bg-no-repeat bg-contain opacity-20 sm:opacity-40 md:opacity-60 lg:opacity-90" 
          style={{
            backgroundImage: "url('/images/kontakt-hero.webp')"
          }}
        ></div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 border border-green-300 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-green-400 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-16 h-16 border border-green-200 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 mb-6">
            <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-white">Kontakt & Support</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Kontaktieren Sie uns</h1>
          <p className="text-green-100 max-w-2xl mx-auto">
            Haben Sie Fragen zu unseren Kreditangeboten oder benötigen Sie Hilfe bei Ihrer Finanzierung? Unser Team steht Ihnen gerne zur Verfügung.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-br from-white via-green-50/20 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-green-500 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-blue-500 rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-green-400 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-green-200 dark:border-green-700 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Kontakt Informationen</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Wir sind für Sie da</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Erreichen Sie uns über verschiedene Kanäle oder nutzen Sie unser Kontaktformular für eine schnelle Antwort.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Unsere Kontaktdaten</h3>
              <div className="space-y-6">
                  <div className="flex items-start group">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 rounded-xl flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-6 h-6 flex items-center justify-center text-primary">
                        <i className="ri-map-pin-line text-xl"></i>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">Geschäftsadresse</h4>
                      <p className="text-gray-600 dark:text-gray-300">Brockmannstr. 204<br />48163 Münster</p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <div className="w-6 h-6 flex items-center justify-center text-blue-600">
                        <i className="ri-mail-line text-xl"></i>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">E-Mail</h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        <a href="mailto:info@kreditheld24.de" className="hover:text-primary transition-colors">info@kreditheld24.de</a>
                      </p>
                    </div>
                  </div>
                </div>

              <div className="mt-10">
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Öffnungszeiten</h4>
                <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden transition-colors duration-300">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Montag - Freitag</td>
                        <td className="py-4 px-6 text-right text-gray-700 dark:text-gray-300">09:00 - 18:00 Uhr</td>
                      </tr>
                      <tr className="border-b border-gray-100 dark:border-gray-600">
                        <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Samstag</td>
                        <td className="py-4 px-6 text-right text-gray-700 dark:text-gray-300">10:00 - 14:00 Uhr</td>
                      </tr>
                      <tr>
                        <td className="py-4 px-6 font-medium text-gray-900 dark:text-gray-100">Sonntag</td>
                        <td className="py-4 px-6 text-right text-red-600 dark:text-red-400">Geschlossen</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-10">
                <h4 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Folgen Sie uns</h4>
                <div className="flex space-x-4">
                  <a href="#" className="group w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 rounded-xl flex items-center justify-center text-blue-600 hover:from-blue-600 hover:to-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-facebook-fill text-xl"></i>
                    </div>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-800 dark:to-sky-700 rounded-xl flex items-center justify-center text-sky-600 hover:from-sky-600 hover:to-sky-700 hover:text-white transition-all duration-300 transform hover:scale-110">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-twitter-fill text-xl"></i>
                    </div>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-700 rounded-xl flex items-center justify-center text-pink-600 hover:from-pink-600 hover:to-pink-700 hover:text-white transition-all duration-300 transform hover:scale-110">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-instagram-fill text-xl"></i>
                    </div>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800 dark:to-indigo-700 rounded-xl flex items-center justify-center text-indigo-600 hover:from-indigo-600 hover:to-indigo-700 hover:text-white transition-all duration-300 transform hover:scale-110">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <i className="ri-linkedin-fill text-xl"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Kontaktformular</h3>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Anrede*</label>
                    <div className="relative">
                      <select 
                        name="salutation" 
                        value={formData.salutation}
                        onChange={handleInputChange}
                        className="w-full appearance-none border border-gray-300 dark:border-gray-600 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                      >
                        <option value="herr">Herr</option>
                        <option value="frau">Frau</option>
                        <option value="divers">Divers</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-arrow-down-s-line"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Vorname*</label>
                    <input 
                      type="text" 
                      name="firstname" 
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nachname*</label>
                    <input 
                      type="text" 
                      name="lastname" 
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">E-Mail*</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Telefon</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Betreff*</label>
                  <div className="relative">
                    <select 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full appearance-none border border-gray-300 dark:border-gray-600 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                    >
                      <option value="allgemeine-anfrage">Allgemeine Anfrage</option>
                      <option value="kreditanfrage">Kreditanfrage</option>
                      <option value="beratungstermin">Beratungstermin vereinbaren</option>
                      <option value="beschwerde">Beschwerde</option>
                      <option value="sonstiges">Sonstiges</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Ihre Nachricht*</label>
                  <textarea 
                    name="message" 
                    rows={5} 
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="flex items-start">
                    <input 
                      type="checkbox" 
                      name="privacy" 
                      checked={formData.privacy}
                      onChange={handleInputChange}
                      className="mt-1 mr-3" 
                      required
                    />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Ich habe die <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link> gelesen und stimme der Verarbeitung meiner Daten zu.*
                    </span>
                  </label>
                </div>
                <button 
                  type="submit" 
                  className="bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
                >
                  <span>Nachricht senden</span>
                  <div className="w-5 h-5 ml-2 flex items-center justify-center">
                    <i className="ri-send-plane-line"></i>
                  </div>
                </button>
                <p className="text-sm text-gray-500 dark:text-gray-400">* Pflichtfelder</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">So finden Sie uns</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Kontaktieren Sie uns gerne per E-Mail oder über unser Kontaktformular. Wir freuen uns auf Ihre Nachricht!
            </p>
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
            <div className="h-96 relative">
              <div className="bg-gray-100 dark:bg-gray-600 rounded-lg p-8 text-center h-full flex flex-col justify-center transition-colors duration-300">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-map-pin-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Geschäftsadresse</h3>
                <p className="text-gray-600 dark:text-gray-300">Brockmannstr. 204<br />48163 Münster</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Kontaktieren Sie uns gerne per E-Mail oder Telefon für alle Ihre Fragen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Options */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-green-50 dark:bg-green-900/20 rounded-lg p-8 transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Weitere Kontaktmöglichkeiten</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center transition-colors duration-300">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 flex items-center justify-center text-primary">
                    <i className="ri-whatsapp-line ri-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">WhatsApp</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Schreiben Sie uns direkt eine Nachricht über WhatsApp.</p>
                <a href="https://wa.me/491795104859" className="text-primary font-medium hover:underline flex items-center justify-center">
                  <span>Jetzt chatten</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </a>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center transition-colors duration-300">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 flex items-center justify-center text-primary">
                    <i className="ri-calendar-check-line ri-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">Rückruf</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Wir rufen Sie zu Ihrer Wunschzeit zurück.</p>
                <button 
                  onClick={() => setShowCallbackModal(true)}
                  className="text-primary font-medium hover:underline flex items-center justify-center"
                >
                  <span>Rückruf vereinbaren</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Hier finden Sie Antworten auf die häufigsten Fragen zu unseren Dienstleistungen.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden transition-colors duration-300">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-6 py-4 font-medium flex justify-between items-center text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <div className={`w-5 h-5 flex items-center justify-center text-primary transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-600">
                      <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Callback Modal */}
      {showCallbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full mx-4 relative transition-colors duration-300">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowCallbackModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-close-line ri-lg"></i>
                </div>
              </button>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Rückruf vereinbaren</h3>
              <form onSubmit={handleCallbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Name*</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={callbackData.name}
                    onChange={handleCallbackChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Telefonnummer*</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={callbackData.phone}
                    onChange={handleCallbackChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded py-3 px-4 bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Wunschtermin*</label>
                  <input 
                    type="date" 
                    name="date" 
                    value={callbackData.date}
                    onChange={handleCallbackChange}
                    className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Uhrzeit*</label>
                  <div className="relative">
                    <select 
                      name="time" 
                      value={callbackData.time}
                      onChange={handleCallbackChange}
                      className="w-full appearance-none border border-gray-300 dark:border-gray-600 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100"
                    >
                      <option value="09:00">09:00 - 10:00 Uhr</option>
                      <option value="10:00">10:00 - 11:00 Uhr</option>
                      <option value="11:00">11:00 - 12:00 Uhr</option>
                      <option value="12:00">12:00 - 13:00 Uhr</option>
                      <option value="13:00">13:00 - 14:00 Uhr</option>
                      <option value="14:00">14:00 - 15:00 Uhr</option>
                      <option value="15:00">15:00 - 16:00 Uhr</option>
                      <option value="16:00">16:00 - 17:00 Uhr</option>
                      <option value="17:00">17:00 - 18:00 Uhr</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500 dark:text-gray-400">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="flex items-start">
                    <input 
                      type="checkbox" 
                      name="privacy" 
                      checked={callbackData.privacy}
                      onChange={handleCallbackChange}
                      className="mt-1 mr-3" 
                      required
                    />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      Ich habe die <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</Link> gelesen und stimme der Verarbeitung meiner Daten zu.*
                    </span>
                  </label>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-green-500 text-white font-medium py-3 px-6 rounded-button whitespace-nowrap shadow-md transition-all flex items-center justify-center"
                >
                  <span>Rückruf anfordern</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}




    </div>
  )
}

export default KontaktPage