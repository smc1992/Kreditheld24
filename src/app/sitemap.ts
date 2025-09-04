import { MetadataRoute } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kreditheld24.de'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/ratenkredite`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/autokredit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/umschuldung`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/kredit-selbststaendige`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/schufa-neutral`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/sofortkredit`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/kreditarten`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tipps-kreditaufnahme`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/baufinanzierung`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/ueber-uns`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
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

  // Check if WordPress is configured
  const wordpressUrl = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL
  
  if (!wordpressUrl) {
    console.warn('WordPress URL not configured, returning static sitemap only')
    return staticRoutes
  }

  try {
    // Dynamic import to avoid build-time errors
    const { getAllPosts, getAllPages, getCustomPostType } = await import('../../lib/wordpress')
    
    const sitemapEntries: MetadataRoute.Sitemap = [...staticRoutes]

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
        const staticPaths = staticRoutes.map(route => new URL(route.url).pathname)
        if (!staticPaths.includes(`/${page.slug}`)) {
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
    console.warn('Failed to fetch WordPress data for sitemap:', error)
    // Return only static routes if WordPress is not available
    return staticRoutes
  }
}