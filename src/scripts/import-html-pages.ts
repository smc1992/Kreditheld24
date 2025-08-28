import { getPayload } from 'payload'
import config from '@/payload.config'
import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'
import dotenv from 'dotenv'

// Umgebungsvariablen laden
dotenv.config()

interface PageData {
  title: string
  slug: string
  content: any[]
  hero?: any
  metaTitle?: string
  metaDescription?: string
}

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

function parseHtmlToBlocks(htmlContent: string): { hero: any, content: any[] } {
  const dom = new JSDOM(htmlContent)
  const document = dom.window.document
  
  // Hero-Section extrahieren
  const heroSection = document.querySelector('section:first-of-type, .hero, [class*="hero"]')
  let hero = null
  let heroTitle = ''
  
  if (heroSection) {
    heroTitle = heroSection.querySelector('h1')?.textContent?.trim() || ''
    const heroSubtitle = heroSection.querySelector('p')?.textContent?.trim()
    
    hero = {
      type: 'highImpact',
      richText: [
        {
          children: [
            {
              text: heroTitle || 'Hero Title',
              type: 'text'
            }
          ],
          type: 'h1'
        },
        {
          children: [
            {
              text: heroSubtitle || 'Hero Subtitle',
              type: 'text'
            }
          ],
          type: 'p'
        }
      ]
    }
  }
  
  // Content-Blöcke extrahieren
  const content: any[] = []
  
  // Kreditrechner-Block hinzufügen (falls vorhanden)
  const calculatorSection = document.querySelector('[class*="rechner"], [class*="calculator"], .bg-white.rounded-2xl')
  if (calculatorSection) {
    const kreditart = heroTitle?.toLowerCase().includes('auto') ? 'autokredit' : 
                     heroTitle?.toLowerCase().includes('umschuldung') ? 'umschuldung' : 'ratenkredit'
    
    content.push({
      blockType: 'kreditrechner',
      title: 'Kreditrechner',
      subtitle: 'Berechnen Sie Ihre monatliche Rate',
      kreditart,
      minBetrag: 3000,
      maxBetrag: 120000,
      defaultBetrag: 20000,
      minLaufzeit: 12,
      maxLaufzeit: 120,
      defaultLaufzeit: 48,
      zinssatz: kreditart === 'autokredit' ? 2.99 : kreditart === 'umschuldung' ? 3.49 : 3.99,
      buttonText: 'Kredit beantragen',
      buttonLink: '/kontakt'
    })
  }
  
  // Text-Content-Blöcke
  const sections = document.querySelectorAll('section')
  sections.forEach((section: Element, index: number) => {
    if (index === 0) return // Hero bereits verarbeitet
    
    const sectionTitle = section.querySelector('h2, h3')?.textContent?.trim()
    const sectionContent = section.querySelector('p')?.textContent?.trim()
    
    if (sectionTitle || sectionContent) {
      content.push({
        blockType: 'content',
        columns: [
          {
            size: 'full',
            richText: [
              ...(sectionTitle ? [{
                children: [{ text: sectionTitle, type: 'text' }],
                type: 'h2'
              }] : []),
              ...(sectionContent ? [{
                children: [{ text: sectionContent, type: 'text' }],
                type: 'p'
              }] : [])
            ]
          }
        ]
      })
    }
  })
  
  // Call-to-Action Block hinzufügen
  content.push({
    blockType: 'cta',
    richText: [
      {
        children: [
          {
            text: 'Bereit für Ihren Kredit?',
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
  
  return { hero, content }
}

function extractMetaData(htmlContent: string): { title?: string, description?: string } {
  const dom = new JSDOM(htmlContent)
  const document = dom.window.document
  
  const title = document.querySelector('title')?.textContent?.trim()
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content')?.trim()
  
  return { title, description }
}

async function importHtmlPages() {
  try {
    console.log('🚀 Starte HTML-Seiten Import...')
    
    const payload = await getPayload({ config })
    const baseDir = path.join(process.cwd(), '..')
    
    for (const pageInfo of htmlFiles) {
      const htmlPath = path.join(baseDir, pageInfo.file)
      
      if (!fs.existsSync(htmlPath)) {
        console.log(`⚠️  Datei nicht gefunden: ${pageInfo.file}`)
        continue
      }
      
      console.log(`📄 Verarbeite: ${pageInfo.file}`)
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
      const { hero, content } = parseHtmlToBlocks(htmlContent)
      const metaData = extractMetaData(htmlContent)
      
      // Prüfen ob Seite bereits existiert
      const existingPage = await payload.find({
        collection: 'pages',
        where: {
          slug: {
            equals: pageInfo.slug
          }
        }
      })
      
      const pageData: any = {
        title: pageInfo.title,
        slug: pageInfo.slug,
        hero,
        layout: content,
        meta: {
          title: metaData.title || pageInfo.title,
          description: metaData.description || `${pageInfo.title} - Kreditheld24`
        },
        publishedAt: new Date().toISOString()
      }
      
      if (existingPage.docs.length > 0) {
        // Seite aktualisieren
        await payload.update({
          collection: 'pages',
          id: existingPage.docs[0].id,
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
    
    console.log('🎉 HTML-Import abgeschlossen!')
    
  } catch (error) {
    console.error('❌ Fehler beim Import:', error)
  }
}

// Script ausführen
if (import.meta.url === `file://${process.argv[1]}`) {
  importHtmlPages()
}

export { importHtmlPages }