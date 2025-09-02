import express, { Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cron from 'node-cron'
import { config } from 'dotenv'
import { logger } from './utils/logger'
import { scrapeAllSources } from './scrapers/rateScraper'
import { saveRatesToDatabase } from './database/rateStorage'
import { validateCronSecret } from './middleware/auth'

// Load environment variables
config()

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'kreditheld24-scraper'
  })
})

// Manual scraping trigger (protected)
app.post('/api/scrape', validateCronSecret, async (req: Request, res: Response) => {
  try {
    logger.info('Manual scraping triggered')
    const results = await scrapeAllSources()
    await saveRatesToDatabase(results)
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: results.map(r => ({
        source: r.source,
        success: r.success,
        rateCount: r.rates?.length || 0,
        error: r.error
      }))
    })
  } catch (error) {
    logger.error('Manual scraping failed:', error)
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
  }
})

// Get last scraping results
app.get('/api/status', (req: Request, res: Response) => {
  // TODO: Implement status endpoint
  res.json({ 
    message: 'Status endpoint - TODO: Implement database query for last results' 
  })
})

// Schedule daily scraping at 6:00 AM
if (process.env.NODE_ENV === 'production') {
  cron.schedule('0 6 * * *', async () => {
    try {
      logger.info('Starting scheduled daily scraping')
      const results = await scrapeAllSources()
      await saveRatesToDatabase(results)
      logger.info('Daily scraping completed successfully')
    } catch (error) {
      logger.error('Scheduled scraping failed:', error)
    }
  }, {
    timezone: 'Europe/Berlin'
  })
  
  logger.info('Cron job scheduled: Daily scraping at 6:00 AM (Europe/Berlin)')
}

// Start server
app.listen(PORT, () => {
  logger.info(`Scraper service started on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
  
  if (process.env.NODE_ENV !== 'production') {
    logger.info('Development mode: Cron jobs disabled')
    logger.info('Use POST /api/scrape to trigger manual scraping')
  }
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully')
  process.exit(0)
})