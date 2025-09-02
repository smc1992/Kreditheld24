import { Request, Response, NextFunction } from 'express'

export const validateCronSecret = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization
  const expectedSecret = process.env.CRON_SECRET
  
  if (!expectedSecret) {
    res.status(500).json({ error: 'CRON_SECRET not configured' })
    return
  }
  
  if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  
  next()
}