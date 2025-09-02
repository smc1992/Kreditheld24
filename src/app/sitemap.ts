import { MetadataRoute } from 'next'
import { getAllPosts, getAllPages, getCustomPostType } from '../../lib/wordpress'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kreditheld24.de'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const sitemapEntries: MetadataRoute.Sitemap = []

    // Static pages
    const staticPages = [
      '',
      '/impressum',
      '/datenschutz',
      '/kontakt',
      '/ueber-uns',
      '/kreditanfrage',
      '/ratenkredite',
      '/autokredit',
      '/umschuldung',
      '/kredit-selbststaendige',
      '/kreditarten',
      '/schufa-neutral',
      '/sofortkredit',
      '/tipps-kreditaufnahme',
    ]

    // Add static pages to sitemap
    staticPages.forEach((path) => {
      sitemapEntries.push({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1 : 0.8,
      })
    })

    try {
      // Fetch WordPress posts
      const posts = await getAllPosts()
      posts.forEach((post) => {
        sitemapEntries.push({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: new Date(post.modified),
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      })
    } catch (error) {
      console.warn('Could not fetch WordPress posts for sitemap:', error)
    }

    try {
      // Fetch WordPress pages
      const pages = await getAllPages()
      pages.forEach((page) => {
        // Skip pages that are already in static pages
        if (!staticPages.includes(`/${page.slug}`)) {
          sitemapEntries.push({
            url: `${SITE_URL}/${page.slug}`,
            lastModified: new Date(page.modified),
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        }
      })
    } catch (error) {
      console.warn('Could not fetch WordPress pages for sitemap:', error)
    }

    try {
      // Fetch custom post types (Kreditarten)
      const kreditarten = await getCustomPostType('kreditarten')
      if (Array.isArray(kreditarten)) {
        kreditarten.forEach((kreditart) => {
          sitemapEntries.push({
            url: `${SITE_URL}/kreditarten/${kreditart.slug}`,
            lastModified: new Date(kreditart.modified || new Date()),
            changeFrequency: 'monthly',
            priority: 0.7,
          })
        })
      }
    } catch (error) {
      console.warn('Could not fetch Kreditarten for sitemap:', error)
    }

    try {
      // Fetch custom post types (Services)
      const services = await getCustomPostType('services')
      if (Array.isArray(services)) {
        services.forEach((service) => {
          sitemapEntries.push({
            url: `${SITE_URL}/services/${service.slug}`,
            lastModified: new Date(service.modified || new Date()),
            changeFrequency: 'monthly',
            priority: 0.6,
          })
        })
      }
    } catch (error) {
      console.warn('Could not fetch Services for sitemap:', error)
    }

    return sitemapEntries
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return minimal sitemap with static pages only
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${SITE_URL}/impressum`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${SITE_URL}/datenschutz`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ]
  }
}