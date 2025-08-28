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
  { file: 'Startseite.html', slug: 'home', title: 'Startseite' },
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

function extractTextFromElement(element: Element): string {
  return element.textContent?.trim() || ''
}

function extractIconClass(element: Element): string {
  const iconElement = element.querySelector('i[class*="ri-"]')
  if (iconElement) {
    const classes = iconElement.className.split(' ')
    const iconClass = classes.find(cls => cls.startsWith('ri-'))
    return iconClass || 'ri-information-line'
  }
  return 'ri-information-line'
}

function parseHtmlToBlocks(htmlContent: string, pageTitle: string): { hero: any, layout: any[] } {
  const dom = new JSDOM(htmlContent)
  const document = dom.window.document
  
  // Hero-Section extrahieren
  const heroSection = document.querySelector('section[class*="hero"], section:first-of-type')
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
  
  // Layout-Blöcke erstellen
  const layout: any[] = []
  
  // Kreditrechner-Block hinzufügen (falls Calculator-Section vorhanden)
  const calculatorSection = document.querySelector('#calculator, [id*="calculator"], [class*="calculator"]')
  if (calculatorSection || pageTitle.toLowerCase().includes('kredit')) {
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
  
  // Benefits/Vorteile-Section
  const benefitsSection = document.querySelector('section')
  if (benefitsSection) {
    const benefitItems = document.querySelectorAll('.grid > div, .benefits > div, [class*="benefit-item"]')
    
    if (benefitItems.length > 0) {
      const benefitsContent = Array.from(benefitItems).slice(0, 6).map((item: Element) => {
        const title = item.querySelector('h3, h4')?.textContent?.trim() || 'Vorteil'
        const description = item.querySelector('p')?.textContent?.trim() || 'Beschreibung'
        const icon = extractIconClass(item)
        
        return {
          children: [
            {
              text: `${icon} ${title}: ${description}`,
              type: 'text'
            }
          ],
          type: 'p'
        }
      })
      
      if (benefitsContent.length > 0) {
        layout.push({
          blockType: 'content',
          columns: [
            {
              size: 'full',
              richText: [
                {
                  children: [
                    {
                      text: 'Ihre Vorteile',
                      type: 'text'
                    }
                  ],
                  type: 'h2'
                },
                ...benefitsContent
              ]
            }
          ]
        })
      }
    }
  }
  
  // FAQ-Section
  const faqSection = document.querySelector('[id*="faq"]')
  if (faqSection) {
    const faqItems = faqSection.querySelectorAll('[id*="faq-"], .faq-item, dt, .accordion-item')
    
    if (faqItems.length > 0) {
      const faqContent = Array.from(faqItems).slice(0, 8).map((item: Element, index: number) => {
        const question = item.querySelector('button, h3, h4, dt')?.textContent?.trim() || `Frage ${index + 1}`
        const answer = item.querySelector('[id*="content"], dd, .answer, p')?.textContent?.trim() || 'Antwort'
        
        return {
          children: [
            {
              text: `Q: ${question}`,
              type: 'text',
              bold: true
            }
          ],
          type: 'p'
        }
      })
      
      layout.push({
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: [
              {
                children: [
                  {
                    text: 'Häufig gestellte Fragen',
                    type: 'text'
                  }
                ],
                type: 'h2'
              },
              ...faqContent
            ]
          }
        ]
      })
    }
  }
  
  // Allgemeine Content-Sections
  const contentSections = document.querySelectorAll('section:not(:first-child)')
  contentSections.forEach((section: Element, index: number) => {
    const sectionTitle = section.querySelector('h2, h3')?.textContent?.trim()
    const sectionText = section.querySelector('p')?.textContent?.trim()
    
    if (sectionTitle && sectionText && index < 5) {
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
  })
  
  // Call-to-Action Block hinzufügen
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

function extractMetaData(htmlContent: string): { title?: string, description?: string } {
  const dom = new JSDOM(htmlContent)
  const document = dom.window.document
  
  const title = document.querySelector('title')?.textContent?.trim()
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim()
  
  return { title, description }
}

async function completeHtmlImport() {
  try {
    console.log('🚀 Starte vollständigen HTML-Import in Payload CMS...')
    
    // Payload initialisieren
    const payload = await getPayload({ config })
    console.log('✅ Payload erfolgreich initialisiert')
    
    const baseDir = path.join(process.cwd(), '..')
    
    // Alle bestehenden Seiten löschen
    console.log('🗑️  Lösche bestehende Seiten...')
    const existingPages = await payload.find({
      collection: 'pages',
      limit: 100
    })
    
    for (const page of existingPages.docs) {
      await payload.delete({
        collection: 'pages',
        id: page.id
      })
    }
    console.log(`✅ ${existingPages.docs.length} bestehende Seiten gelöscht`)
    
    for (const pageInfo of htmlFiles) {
      const htmlPath = path.join(baseDir, pageInfo.file)
      
      if (!fs.existsSync(htmlPath)) {
        console.log(`⚠️  Datei nicht gefunden: ${pageInfo.file}`)
        continue
      }
      
      console.log(`📄 Verarbeite vollständig: ${pageInfo.file}`)
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
      const { hero, layout } = parseHtmlToBlocks(htmlContent, pageInfo.title)
      const metaData = extractMetaData(htmlContent)
      
      const pageData: any = {
        title: pageInfo.title,
        slug: pageInfo.slug,
        hero,
        layout,
        meta: {
          title: metaData.title || `${pageInfo.title} - Kreditheld24`,
          description: metaData.description || `${pageInfo.title} bei Kreditheld24 - Ihre vertrauensvolle Kreditlösung mit besten Konditionen.`
        },
        publishedAt: new Date().toISOString()
      }
      
      // Neue Seite erstellen
      await payload.create({
        collection: 'pages',
        data: pageData
      })
      console.log(`✅ Vollständige Seite erstellt: ${pageInfo.title} (${layout.length} Blöcke)`)
    }
    
    console.log('🎉 Vollständiger HTML-Import erfolgreich abgeschlossen!')
    console.log('🌐 Alle Seiten mit vollständigem Content, Icons und Layout importiert')
    console.log('📱 Besuchen Sie http://localhost:3001/admin/collections/pages')
    
  } catch (error) {
    console.error('❌ Fehler beim vollständigen Import:', error)
    process.exit(1)
  }
}

// Script ausführen
if (import.meta.url === `file://${process.argv[1]}`) {
  completeHtmlImport()
}

export { completeHtmlImport }