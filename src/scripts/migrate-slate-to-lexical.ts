import { getPayload } from 'payload'
import config from '@/payload.config'
import { migrateSlateToLexical } from '@payloadcms/richtext-lexical/migrate'
import dotenv from 'dotenv'

// Umgebungsvariablen laden
dotenv.config()

async function migrateSlateDdata() {
  try {
    console.log('🚀 Starte Slate zu Lexical Migration...')
    
    // Payload initialisieren
    const payload = await getPayload({ config })
    console.log('✅ Payload erfolgreich initialisiert')
    
    // Migration ausführen
    console.log('📄 Migriere Slate-Daten zu Lexical...')
    await migrateSlateToLexical({ payload })
    
    console.log('🎉 Migration erfolgreich abgeschlossen!')
    console.log('🌐 Alle Rich Text Felder wurden von Slate zu Lexical konvertiert')
    
  } catch (error) {
    console.error('❌ Fehler bei der Migration:', error)
    process.exit(1)
  }
}

// Script ausführen
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateSlateDdata()
}

export { migrateSlateDdata }