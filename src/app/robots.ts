import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kreditheld24.de'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/private/',
        '/temp/',
        '*.json',
        '/kreditanfrage/success',
        '/kontakt/success'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  }
}