import { getPayload } from 'payload'
import config from '@/payload.config'
import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import dotenv from 'dotenv'

// Umgebungsvariablen laden
dotenv.config()

// HTML-Dateien zu Payload-Seiten konvertieren
const htmlFiles = [
  { file: 'Ratenkredite.html', slug: 'ratenkredite-neu', title: 'Ratenkredite Vollständig' },
  { file: 'Autokredit.html', slug: 'autokredit-neu', title: 'Autokredit Vollständig' },
  { file: 'Umschuldungskredite.html', slug: 'umschuldung-neu', title: 'Umschuldung Vollständig' },
  { file: 'Kontakt.html', slug: 'kontakt-neu', title: 'Kontakt Vollständig' },
]

function parseCompleteHtml(htmlContent: string, pageTitle: string): { hero: any, layout: any[] } {
  const dom = new JSDOM(htmlContent)
  const document = dom.window.document
  
  // Hero-Section mit vollständigem Content
  const heroSection = document.querySelector('section:first-of-type')
  let hero = null
  
  if (heroSection) {
    const heroTitle = heroSection.querySelector('h1')?.textContent?.trim() || pageTitle
    const heroSubtitle = heroSection.querySelector('p')?.textContent?.trim() || ''
    
    hero = {
      type: 'lowImpact',
      richText: [
        {
          children: [
            {
              text: heroTitle,
              type: 'text'
            }
          ],
          type: 'h1'
        },
        {
          children: [
            {
              text: heroSubtitle,
              type: 'text'
            }
          ],
          type: 'p'
        }
      ]
    }
  }
  
  const layout: any[] = []
  
  // Kreditrechner-Block
  if (pageTitle.toLowerCase().includes('kredit')) {
    const kreditart = pageTitle.toLowerCase().includes('auto') ? 'autokredit' : 
                     pageTitle.toLowerCase().includes('umschuldung') ? 'umschuldung' : 'ratenkredit'
    
    layout.push({
      blockType: 'kreditrechner',
      title: 'Kreditrechner',
      subtitle: 'Berechnen Sie Ihre monatliche Rate',
      kreditart,
      minBetrag: 1000,
      maxBetrag: 100000,
      defaultBetrag: 10000,
      minLaufzeit: 12,
      maxLaufzeit: 120,
      defaultLaufzeit: 60,
      zinssatz: kreditart === 'autokredit' ? 2.99 : kreditart === 'umschuldung' ? 3.49 : 3.99,
      buttonText: 'Kredit beantragen',
      buttonLink: '/kontakt'
    })
  }
  
  // Vorteile-Section aus HTML extrahieren
  const benefitItems = document.querySelectorAll('.grid > div, .bg-white')
  const validBenefitItems = Array.from(benefitItems).filter(item => 
    item.querySelector('i[class*="ri-"]') && item.querySelector('h3')
  )
  
  if (validBenefitItems.length > 0) {
    const benefitsRichText = []
    
    benefitsRichText.push({
      children: [
        {
          text: 'Ihre Vorteile',
          type: 'text'
        }
      ],
      type: 'h2'
    })
    
    validBenefitItems.slice(0, 6).forEach((item: Element) => {
      const title = item.querySelector('h3')?.textContent?.trim() || ''
      const description = item.querySelector('p')?.textContent?.trim() || ''
      const iconElement = item.querySelector('i[class*="ri-"]')
      let icon = '✓'
      
      if (iconElement) {
        const iconClass = iconElement.className
        if (iconClass.includes('percent')) icon = '💰'
        else if (iconClass.includes('calendar')) icon = '📅'
        else if (iconClass.includes('money') || iconClass.includes('euro')) icon = '💶'
        else if (iconClass.includes('timer') || iconClass.includes('flash')) icon = '⚡'
        else if (iconClass.includes('refund')) icon = '🔄'
        else if (iconClass.includes('shield')) icon = '🛡️'
      }
      
      if (title && description) {
        benefitsRichText.push({
          children: [
            {
              text: `${icon} ${title}`,
              type: 'text',
              bold: true
            }
          ],
          type: 'h3'
        })
        
        benefitsRichText.push({
          children: [
            {
              text: description,
              type: 'text'
            }
          ],
          type: 'p'
        })
      }
    })
    
    layout.push({
      blockType: 'content',
      columns: [
        {
          size: 'full',
          richText: benefitsRichText
        }
      ]
    })
  }
  
  // FAQ-Section extrahieren
  const faqSection = document.querySelector('#faq')
  if (faqSection) {
    const faqItems = faqSection.querySelectorAll('[id*="faq-"]')
    
    if (faqItems.length > 0) {
      const faqRichText = []
      
      faqRichText.push({
        children: [
          {
            text: 'Häufig gestellte Fragen',
            type: 'text'
          }
        ],
        type: 'h2'
      })
      
      Array.from(faqItems).slice(0, 8).forEach((item: Element) => {
        const button = item.querySelector('button')
        const content = item.querySelector('[id*="content"]')
        
        if (button && content) {
          const question = button.textContent?.trim() || ''
          const answer = content.textContent?.trim() || ''
          
          if (question && answer) {
            faqRichText.push({
              children: [
                {
                  text: `❓ ${question}`,
                  type: 'text',
                  bold: true
                }
              ],
              type: 'h3'
            })
            
            faqRichText.push({
              children: [
                {
                  text: answer,
                  type: 'text'
                }
              ],
              type: 'p'
            })
          }
        }
      })
      
      layout.push({
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: faqRichText
          }
        ]
      })
    }
  }
  
  // Prozess-Section extrahieren
  const processSection = document.querySelector('#process')
  if (processSection) {
    const processSteps = processSection.querySelectorAll('.step, [class*="step-"]')
    
    if (processSteps.length > 0) {
      const processRichText = []
      
      processRichText.push({
        children: [
          {
            text: 'So funktioniert es',
            type: 'text'
          }
        ],
        type: 'h2'
      })
      
      Array.from(processSteps).forEach((step: Element, index: number) => {
        const title = step.querySelector('h3')?.textContent?.trim() || ''
        const description = step.querySelector('p')?.textContent?.trim() || ''
        
        if (title && description) {
          processRichText.push({
            children: [
              {
                text: `${index + 1}. ${title}`,
                type: 'text',
                bold: true
              }
            ],
            type: 'h3'
          })
          
          processRichText.push({
            children: [
              {
                text: description,
                type: 'text'
              }
            ],
            type: 'p'
          })
        }
      })
      
      layout.push({
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: processRichText
          }
        ]
      })
    }
  }
  
  // Testimonials-Section extrahieren
  const testimonialsSection = document.querySelector('section:has(.ri-star-fill)')
  if (testimonialsSection) {
    const testimonials = testimonialsSection.querySelectorAll('.bg-white.p-6')
    
    if (testimonials.length > 0) {
      const testimonialsRichText = []
      
      testimonialsRichText.push({
        children: [
          {
            text: 'Kundenbewertungen',
            type: 'text'
          }
        ],
        type: 'h2'
      })
      
      Array.from(testimonials).slice(0, 3).forEach((testimonial: Element) => {
        const text = testimonial.querySelector('p')?.textContent?.trim() || ''
        const author = testimonial.querySelector('h4')?.textContent?.trim() || ''
        const stars = testimonial.querySelectorAll('.ri-star-fill').length
        
        if (text && author) {
          testimonialsRichText.push({
            children: [
              {
                text: `${'⭐'.repeat(stars)} "${text}" - ${author}`,
                type: 'text'
              }
            ],
            type: 'p'
          })
        }
      })
      
      layout.push({
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: testimonialsRichText
          }
        ]
      })
    }
  }
  
  // Call-to-Action Block
  layout.push({
    blockType: 'cta',
    richText: [
      {
        children: [
          {
            text: `Bereit für Ihren ${pageTitle}?`,
            type: 'text'
          }
        ],
        type: 'h2'
      },
      {
        children: [
          {
            text: 'Starten Sie jetzt Ihre Kreditanfrage und erhalten Sie schnell eine Antwort.',
            type: 'text'
          }
        ],
        type: 'p'
      }
    ],
    links: [
      {
        link: {
          type: 'custom',
          url: '/kontakt',
          label: 'Jetzt anfragen'
        }
      }
    ]
  })
  
  return { hero, layout }
}

async function simpleHtmlImport() {
  try {
    console.log('🚀 Starte vereinfachten HTML-Import...')
    
    const payload = await getPayload({ config })
    console.log('✅ Payload erfolgreich initialisiert')
    
    const baseDir = path.join(process.cwd(), '..')
    
    for (const pageInfo of htmlFiles) {
      const htmlPath = path.join(baseDir, pageInfo.file)
      
      if (!fs.existsSync(htmlPath)) {
        console.log(`⚠️  Datei nicht gefunden: ${pageInfo.file}`)
        continue
      }
      
      console.log(`📄 Importiere vollständig: ${pageInfo.file}`)
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
      const { hero, layout } = parseCompleteHtml(htmlContent, pageInfo.title)
      
      const pageData: any = {
        title: pageInfo.title,
        slug: pageInfo.slug,
        hero,
        layout,
        meta: {
          title: `${pageInfo.title} - Kreditheld24`,
          description: `${pageInfo.title} bei Kreditheld24 - Vollständiger Content mit allen Details.`
        },
        publishedAt: new Date().toISOString()
      }
      
      await payload.create({
        collection: 'pages',
        data: pageData
      })
      
      console.log(`✅ Vollständige Seite erstellt: ${pageInfo.title} (${layout.length} Content-Blöcke)`)
    }
    
    console.log('🎉 Vollständiger Import abgeschlossen!')
    console.log('📱 Alle Seiten mit komplettem Content, Icons und Layout verfügbar')
    
  } catch (error) {
    console.error('❌ Fehler beim Import:', error)
    process.exit(1)
  }
}

// Script ausführen
if (import.meta.url === `file://${process.argv[1]}`) {
  simpleHtmlImport()
}

export { simpleHtmlImport }