import { getPayload } from 'payload'
import config from '@/payload.config'
import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import dotenv from 'dotenv'

// Umgebungsvariablen laden
dotenv.config()

// Alle HTML-Dateien zu Payload-Seiten konvertieren
const htmlFiles = [
  { file: 'Startseite.html', slug: 'startseite', title: 'Startseite' },
  { file: 'Ratenkredite.html', slug: 'ratenkredite', title: 'Ratenkredite' },
  { file: 'Autokredit.html', slug: 'autokredit', title: 'Autokredit' },
  { file: 'Umschuldungskredite.html', slug: 'umschuldung', title: 'Umschuldung' },
  { file: 'Kontakt.html', slug: 'kontakt', title: 'Kontakt' },
  { file: 'Kredit-Selbstständige.html', slug: 'kredit-selbststaendige', title: 'Kredit für Selbstständige' },
  { file: 'Kreditarten-Übersicht.html', slug: 'kreditarten-uebersicht', title: 'Kreditarten Übersicht' },
  { file: 'Schufa-Neutral.html', slug: 'schufa-neutral', title: 'SCHUFA-neutral' },
  { file: 'Sofortkredit.html', slug: 'sofortkredit', title: 'Sofortkredit' },
  { file: 'Über uns.html', slug: 'ueber-uns', title: 'Über uns' },
  { file: 'Tipps für Kreditaufnahme.html', slug: 'tipps-kreditaufnahme', title: 'Tipps für Kreditaufnahme' },
]

function parseHtmlToPayload(htmlContent: string, pageTitle: string): { hero: any, layout: any[] } {
  const dom = new JSDOM(htmlContent)
  const document = dom.window.document
  
  // Hero-Section extrahieren
  const heroSection = document.querySelector('section:first-of-type')
  let hero = null
  
  if (heroSection) {
    const heroTitle = heroSection.querySelector('h1')?.textContent?.trim() || pageTitle
    const heroSubtitle = heroSection.querySelector('p')?.textContent?.trim() || `Willkommen bei ${pageTitle}`
    
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
  
  // Kreditrechner-Block hinzufügen
  if (pageTitle.toLowerCase().includes('kredit') || pageTitle.toLowerCase().includes('umschuldung')) {
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
  
  // Vorteile-Section extrahieren
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
  
  // Allgemeine Content-Sections
  const contentSections = document.querySelectorAll('section:not(:first-child)')
  contentSections.forEach((section: Element, index: number) => {
    if (index < 3) { // Nur die ersten 3 zusätzlichen Sections
      const sectionTitle = section.querySelector('h2, h3')?.textContent?.trim()
      const sectionText = section.querySelector('p')?.textContent?.trim()
      
      if (sectionTitle && sectionText) {
        layout.push({
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: [
                {
                  children: [
                    {
                      text: sectionTitle,
                      type: 'text'
                    }
                  ],
                  type: 'h2'
                },
                {
                  children: [
                    {
                      text: sectionText,
                      type: 'text'
                    }
                  ],
                  type: 'p'
                }
              ]
            }
          ]
        })
      }
    }
  })
  
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

async function importAllPages() {
  try {
    console.log('🚀 Starte Import aller HTML-Seiten...')
    
    const payload = await getPayload({ config })
    console.log('✅ Payload erfolgreich initialisiert')
    
    const baseDir = path.join(process.cwd(), '..')
    
    for (const pageInfo of htmlFiles) {
      const htmlPath = path.join(baseDir, pageInfo.file)
      
      if (!fs.existsSync(htmlPath)) {
        console.log(`⚠️  Datei nicht gefunden: ${pageInfo.file}`)
        continue
      }
      
      console.log(`📄 Importiere: ${pageInfo.file}`)
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
      const { hero, layout } = parseHtmlToPayload(htmlContent, pageInfo.title)
      
      // Prüfen ob Seite bereits existiert
      const existingPages = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: pageInfo.slug
          }
        },
        limit: 1
      })
      
      const pageData: any = {
        title: pageInfo.title,
        slug: pageInfo.slug,
        hero,
        layout,
        meta: {
          title: `${pageInfo.title} - Kreditheld24`,
          description: `${pageInfo.title} bei Kreditheld24 - Ihre vertrauensvolle Kreditlösung mit besten Konditionen.`
        },
        publishedAt: new Date().toISOString()
      }
      
      if (existingPages.docs.length > 0) {
        // Seite aktualisieren
        await payload.update({
          collection: 'pages',
          id: existingPages.docs[0].id,
          data: pageData
        })
        console.log(`✅ Seite aktualisiert: ${pageInfo.title}`)
      } else {
        // Neue Seite erstellen
        await payload.create({
          collection: 'pages',
          data: pageData
        })
        console.log(`✅ Seite erstellt: ${pageInfo.title}`)
      }
    }
    
    console.log('🎉 Import aller Seiten abgeschlossen!')
    console.log('📱 Alle 11 HTML-Seiten sind jetzt im Admin-Panel verfügbar')
    console.log('🌐 Besuchen Sie: http://localhost:3001/admin/collections/pages')
    
  } catch (error) {
    console.error('❌ Fehler beim Import:', error)
    process.exit(1)
  }
}

// Script ausführen
if (import.meta.url === `file://${process.argv[1]}`) {
  importAllPages()
}

export { importAllPages }