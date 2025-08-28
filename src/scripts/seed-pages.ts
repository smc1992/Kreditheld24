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
  hero?: any
  layout: any[]
  meta: {
    title: string
    description: string
  }
  publishedAt: string
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

function parseHtmlToBlocks(htmlContent: string, pageTitle: string): { hero: any, layout: any[] } {
  const dom = new JSDOM(htmlContent)
  const document = dom.window.document
  
  // Hero-Section erstellen
  const hero = {
    type: 'lowImpact',
    richText: [
      {
        children: [
          {
            text: pageTitle,
            type: 'text'
          }
        ],
        type: 'h1'
      },
      {
        children: [
          {
            text: `Willkommen bei ${pageTitle} - Ihre vertrauensvolle Kreditlösung`,
            type: 'text'
          }
        ],
        type: 'p'
      }
    ]
  }
  
  // Layout-Blöcke erstellen
  const layout: any[] = []
  
  // Kreditrechner-Block hinzufügen (falls relevant)
  if (pageTitle.toLowerCase().includes('kredit') || pageTitle.toLowerCase().includes('umschuldung')) {
    const kreditart = pageTitle.toLowerCase().includes('auto') ? 'autokredit' : 
                     pageTitle.toLowerCase().includes('umschuldung') ? 'umschuldung' : 'ratenkredit'
    
    layout.push({
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
  
  // Content-Block hinzufügen
  layout.push({
    blockType: 'content',
    columns: [
      {
        size: 'full',
        richText: [
          {
            children: [
              {
                text: `Informationen zu ${pageTitle}`,
                type: 'text'
              }
            ],
            type: 'h2'
          },
          {
            children: [
              {
                text: `Hier finden Sie alle wichtigen Informationen zu ${pageTitle}. Unser Team steht Ihnen gerne zur Verfügung, um Ihnen bei der Auswahl der besten Kreditlösung zu helfen.`,
                type: 'text'
              }
            ],
            type: 'p'
          }
        ]
      }
    ]
  })
  
  // Call-to-Action Block hinzufügen
  layout.push({
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
  
  return { hero, layout }
}

async function seedPages() {
  try {
    console.log('🚀 Starte Payload Seeding...')
    
    // Payload initialisieren
    const payload = await getPayload({ config })
    console.log('✅ Payload erfolgreich initialisiert')
    
    const baseDir = path.join(process.cwd(), '..')
    
    for (const pageInfo of htmlFiles) {
      const htmlPath = path.join(baseDir, pageInfo.file)
      
      if (!fs.existsSync(htmlPath)) {
        console.log(`⚠️  Datei nicht gefunden: ${pageInfo.file}`)
        continue
      }
      
      console.log(`📄 Verarbeite: ${pageInfo.file}`)
      
      const htmlContent = fs.readFileSync(htmlPath, 'utf-8')
      const { hero, layout } = parseHtmlToBlocks(htmlContent, pageInfo.title)
      
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
    
    // Header-Global seeden
    console.log('📄 Seeding Header Global...')
    await payload.updateGlobal({
      slug: 'header',
      data: {
        logo: {
          text: 'Kreditheld24',
          fontFamily: 'Pacifico, cursive'
        },
        navItems: [
          {
            link: {
              type: 'custom',
              url: '/ratenkredite',
              label: 'Ratenkredite'
            }
          },
          {
            link: {
              type: 'custom',
              url: '/autokredit',
              label: 'Autokredit'
            }
          },
          {
            link: {
              type: 'custom',
              url: '/umschuldung',
              label: 'Umschuldung'
            }
          },
          {
            link: {
              type: 'custom',
              url: '/kontakt',
              label: 'Kontakt'
            }
          }
        ]
      }
    })
    console.log('✅ Header Global aktualisiert')
    
    console.log('🎉 Seeding erfolgreich abgeschlossen!')
    console.log('🌐 Besuchen Sie http://localhost:3001/admin um die Seiten zu verwalten')
    
  } catch (error) {
    console.error('❌ Fehler beim Seeding:', error)
    process.exit(1)
  }
}

// Script ausführen
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPages()
}

export { seedPages }