import { getPayload } from 'payload'
import config from '@payload-config'

const deleteDuplicatePages = async () => {
  const payload = await getPayload({ config })

  try {
    console.log('🗑️  Lösche duplizierte Pages aus Payload CMS...')

    // Alle Pages abrufen
    const pages = await payload.find({
      collection: 'pages',
      limit: 1000,
    })

    console.log(`📄 Gefunden: ${pages.docs.length} Pages`)

    // Pages löschen
    for (const page of pages.docs) {
      try {
        await payload.delete({
          collection: 'pages',
          id: page.id,
        })
        console.log(`✅ Gelöscht: ${page.title} (${page.slug})`)
      } catch (error) {
        console.error(`❌ Fehler beim Löschen von ${page.title}:`, error)
      }
    }

    console.log('🎉 Alle duplizierten Pages wurden erfolgreich gelöscht!')
    console.log('💡 Die Next.js Seiten sind weiterhin verfügbar und nutzen jetzt Payload Globals für editierbare Inhalte.')
    
  } catch (error) {
    console.error('❌ Fehler beim Löschen der Pages:', error)
  }

  process.exit(0)
}

deleteDuplicatePages()