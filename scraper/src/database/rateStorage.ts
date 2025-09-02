import { ScrapingResult, InterestRate } from '../scrapers/rateScraper'

// Simulierte Datenbank-Speicherung
export const saveRatesToDatabase = async (results: ScrapingResult[]): Promise<void> => {
  console.log('Saving scraping results to database...')
  
  for (const result of results) {
    if (result.success && result.rates) {
      console.log(`Saving ${result.rates.length} rates from ${result.source}`)
      
      // TODO: Implementiere echte Datenbank-Speicherung
      // Beispiel mit PostgreSQL:
      /*
      const client = new Client({
        connectionString: process.env.DATABASE_URL
      })
      
      await client.connect()
      
      for (const rate of result.rates) {
        await client.query(`
          INSERT INTO interest_rates (
            source, kreditart, bank, min_zins, max_zins, rep_zins,
            laufzeit_min, laufzeit_max, min_summe, max_summe, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          result.source,
          rate.kreditart,
          rate.bank,
          rate.minZins,
          rate.maxZins,
          rate.repZins,
          rate.laufzeitMin,
          rate.laufzeitMax,
          rate.minSumme,
          rate.maxSumme,
          new Date()
        ])
      }
      
      await client.end()
      */
      
      // Für Demo: Speichere in JSON-Datei
      const fs = require('fs')
      const path = require('path')
      
      const dataDir = path.join(__dirname, '../../data')
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true })
      }
      
      const filename = `rates_${result.source}_${new Date().toISOString().split('T')[0]}.json`
      const filepath = path.join(dataDir, filename)
      
      fs.writeFileSync(filepath, JSON.stringify({
        source: result.source,
        timestamp: result.timestamp,
        rates: result.rates
      }, null, 2))
      
      console.log(`Saved ${result.source} rates to ${filepath}`)
    } else {
      console.error(`Failed to save rates from ${result.source}: ${result.error}`)
    }
  }
  
  console.log('Database save operation completed')
}

// Lade letzte Zinssätze aus der Datenbank
export const getLatestRates = async (): Promise<InterestRate[]> => {
  // TODO: Implementiere echte Datenbank-Abfrage
  console.log('Loading latest rates from database...')
  
  // Für Demo: Lade aus JSON-Dateien
  const fs = require('fs')
  const path = require('path')
  
  const dataDir = path.join(__dirname, '../../data')
  if (!fs.existsSync(dataDir)) {
    return []
  }
  
  const files = fs.readdirSync(dataDir)
    .filter((file: string) => file.startsWith('rates_') && file.endsWith('.json'))
    .sort()
    .reverse() // Neueste zuerst
  
  const allRates: InterestRate[] = []
  
  for (const file of files.slice(0, 3)) { // Nur die 3 neuesten Dateien
    try {
      const filepath = path.join(dataDir, file)
      const data = JSON.parse(fs.readFileSync(filepath, 'utf8'))
      if (data.rates) {
        allRates.push(...data.rates)
      }
    } catch (error) {
      console.error(`Error reading ${file}:`, error)
    }
  }
  
  return allRates
}