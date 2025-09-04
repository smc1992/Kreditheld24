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
    <div className="font-sans text-gray-800 bg-white">



      {/* Page Title */}
      <section className="py-12 bg-green-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Kontaktieren Sie uns</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Haben Sie Fragen zu unseren Kreditangeboten oder benötigen Sie Hilfe bei Ihrer Finanzierung? Unser Team steht Ihnen gerne zur Verfügung.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Unsere Kontaktdaten</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center text-primary">
                      <i className="ri-map-pin-line"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Geschäftsadresse</h3>
                    <p className="text-gray-600">Brockmannstr. 204<br />48163 Münster</p>
                  </div>
                </div>


                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 shrink-0">
                    <div className="w-5 h-5 flex items-center justify-center text-primary">
                      <i className="ri-mail-line"></i>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">E-Mail</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@kreditheld24.de" className="hover:text-primary">info@kreditheld24.de</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">Öffnungszeiten</h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">Montag - Freitag</td>
                        <td className="py-3 px-4 text-right">09:00 - 18:00 Uhr</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-4 font-medium">Samstag</td>
                        <td className="py-3 px-4 text-right">10:00 - 14:00 Uhr</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-medium">Sonntag</td>
                        <td className="py-3 px-4 text-right">Geschlossen</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-bold mb-4">Folgen Sie uns</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-facebook-fill"></i>
                    </div>
                  </a>
                  <a href="#" className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-twitter-fill"></i>
                    </div>
                  </a>
                  <a href="#" className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-instagram-fill"></i>
                    </div>
                  </a>
                  <a href="#" className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <i className="ri-linkedin-fill"></i>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Kontaktformular</h2>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Anrede*</label>
                    <div className="relative">
                      <select 
                        name="salutation" 
                        value={formData.salutation}
                        onChange={handleInputChange}
                        className="w-full appearance-none border border-gray-300 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                      >
                        <option value="herr">Herr</option>
                        <option value="frau">Frau</option>
                        <option value="divers">Divers</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <i className="ri-arrow-down-s-line"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Vorname*</label>
                    <input 
                      type="text" 
                      name="firstname" 
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Nachname*</label>
                    <input 
                      type="text" 
                      name="lastname" 
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">E-Mail*</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Telefon</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Betreff*</label>
                  <div className="relative">
                    <select 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full appearance-none border border-gray-300 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    >
                      <option value="allgemeine-anfrage">Allgemeine Anfrage</option>
                      <option value="kreditanfrage">Kreditanfrage</option>
                      <option value="beratungstermin">Beratungstermin vereinbaren</option>
                      <option value="beschwerde">Beschwerde</option>
                      <option value="sonstiges">Sonstiges</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <i className="ri-arrow-down-s-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Ihre Nachricht*</label>
                  <textarea 
                    name="message" 
                    rows={5} 
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
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
                    <span className="text-gray-700 text-sm">
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
                <p className="text-sm text-gray-500">* Pflichtfelder</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">So finden Sie uns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kontaktieren Sie uns gerne per E-Mail oder über unser Kontaktformular. Wir freuen uns auf Ihre Nachricht!
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-96 relative">
              <div className="bg-gray-100 rounded-lg p-8 text-center h-full flex flex-col justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-map-pin-line text-white text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-2">Geschäftsadresse</h3>
                <p className="text-gray-600">Brockmannstr. 204<br />48163 Münster</p>
                <p className="text-sm text-gray-500 mt-4">
                  Kontaktieren Sie uns gerne per E-Mail oder Telefon für alle Ihre Fragen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alternative Contact Options */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Weitere Kontaktmöglichkeiten</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 flex items-center justify-center text-primary">
                    <i className="ri-whatsapp-line ri-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">Schreiben Sie uns direkt eine Nachricht über WhatsApp.</p>
                <a href="https://wa.me/491795104859" className="text-primary font-medium hover:underline flex items-center justify-center">
                  <span>Jetzt chatten</span>
                  <div className="w-5 h-5 ml-1 flex items-center justify-center">
                    <i className="ri-arrow-right-line"></i>
                  </div>
                </a>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-8 h-8 flex items-center justify-center text-primary">
                    <i className="ri-calendar-check-line ri-xl"></i>
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Rückruf</h3>
                <p className="text-gray-600 mb-4">Wir rufen Sie zu Ihrer Wunschzeit zurück.</p>
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Häufig gestellte Fragen</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hier finden Sie Antworten auf die häufigsten Fragen zu unseren Dienstleistungen.
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqData.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <button 
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left px-6 py-4 font-medium flex justify-between items-center"
                  >
                    <span>{faq.question}</span>
                    <div className={`w-5 h-5 flex items-center justify-center text-primary transform transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                      <i className="ri-arrow-down-s-line"></i>
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 border-t border-gray-100">
                      <p className="text-gray-600">{faq.answer}</p>
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
          <div className="bg-white rounded-lg max-w-md w-full mx-4 relative">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setShowCallbackModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <i className="ri-close-line ri-lg"></i>
                </div>
              </button>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-bold mb-6">Rückruf vereinbaren</h3>
              <form onSubmit={handleCallbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name*</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={callbackData.name}
                    onChange={handleCallbackChange}
                    className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Telefonnummer*</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={callbackData.phone}
                    onChange={handleCallbackChange}
                    className="w-full border border-gray-300 rounded py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Wunschtermin*</label>
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
                  <label className="block text-gray-700 font-medium mb-2">Uhrzeit*</label>
                  <div className="relative">
                    <select 
                      name="time" 
                      value={callbackData.time}
                      onChange={handleCallbackChange}
                      className="w-full appearance-none border border-gray-300 rounded py-3 px-4 pr-8 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
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
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
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
                    <span className="text-gray-700 text-sm">
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