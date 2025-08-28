import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('🚀 Starte HTML-Seiten Import in Payload CMS...')

try {
  // TypeScript-Datei kompilieren und ausführen
  execSync('npx tsx src/scripts/seed-pages.ts', {
    stdio: 'inherit',
    cwd: __dirname
  })
  
  console.log('✅ Import erfolgreich abgeschlossen!')
} catch (error) {
  console.error('❌ Fehler beim Import:', error.message)
  process.exit(1)
}