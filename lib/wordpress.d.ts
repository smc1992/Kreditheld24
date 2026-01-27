/**
 * TypeScript type definitions for WordPress REST API
 * Based on WordPress REST API v2 schema
 */

export interface WordPressPost {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private'
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  comment_status: 'open' | 'closed'
  ping_status: 'open' | 'closed'
  sticky: boolean
  template: string
  format: string
  meta: Record<string, any>
  categories: number[]
  tags: number[]
  _embedded?: {
    author?: WordPressAuthor[]
    'wp:featuredmedia'?: WordPressMedia[]
    'wp:term'?: Array<WordPressCategory[] | WordPressTag[]>
  }
}

export interface WordPressPage {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: 'publish' | 'future' | 'draft' | 'pending' | 'private'
  type: string
  link: string
  title: {
    rendered: string
  }
  content: {
    rendered: string
    protected: boolean
  }
  excerpt: {
    rendered: string
    protected: boolean
  }
  author: number
  featured_media: number
  parent: number
  menu_order: number
  comment_status: 'open' | 'closed'
  ping_status: 'open' | 'closed'
  template: string
  meta: Record<string, any>
  _embedded?: {
    author?: WordPressAuthor[]
    'wp:featuredmedia'?: WordPressMedia[]
  }
}

export interface WordPressCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: 'category'
  parent: number
  meta: Record<string, any>
}

export interface WordPressTag {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: 'post_tag'
  meta: Record<string, any>
}

export interface WordPressAuthor {
  id: number
  name: string
  url: string
  description: string
  link: string
  slug: string
  avatar_urls: {
    '24': string
    '48': string
    '96': string
  }
  meta: Record<string, any>
}

export interface WordPressMedia {
  id: number
  date: string
  date_gmt: string
  guid: {
    rendered: string
  }
  modified: string
  modified_gmt: string
  slug: string
  status: 'inherit' | 'private'
  type: 'attachment'
  link: string
  title: {
    rendered: string
  }
  author: number
  comment_status: 'open' | 'closed'
  ping_status: 'open' | 'closed'
  template: string
  meta: Record<string, any>
  description: {
    rendered: string
  }
  caption: {
    rendered: string
  }
  alt_text: string
  media_type: 'image' | 'file'
  mime_type: string
  media_details: {
    width?: number
    height?: number
    file?: string
    sizes?: {
      [key: string]: {
        file: string
        width: number
        height: number
        mime_type: string
        source_url: string
      }
    }
    image_meta?: {
      aperture: string
      credit: string
      camera: string
      caption: string
      created_timestamp: string
      copyright: string
      focal_length: string
      iso: string
      shutter_speed: string
      title: string
      orientation: string
      keywords: string[]
    }
  }
  post: number | null
  source_url: string
}

// Custom Post Types for Kreditheld24
export interface KreditartPost {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  slug: string
  featured_media: number
  meta: {
    zinssatz_von?: string
    zinssatz_bis?: string
    laufzeit_min?: string
    laufzeit_max?: string
    kreditsumme_min?: string
    kreditsumme_max?: string
    besonderheiten?: string[]
    voraussetzungen?: string[]
  }
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[]
  }
}

export interface ServicePost {
  id: number
  title: {
    rendered: string
  }
  content: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  slug: string
  featured_media: number
  meta: {
    service_icon?: string
    service_features?: string[]
    service_benefits?: string[]
  }
  _embedded?: {
    'wp:featuredmedia'?: WordPressMedia[]
  }
}

// API Response Types
export interface WordPressAPIResponse<T> {
  data: T
  headers: {
    'X-WP-Total'?: string
    'X-WP-TotalPages'?: string
  }
}

export interface PaginatedResponse<T> {
  posts: T[]
  totalPages: number
  totalPosts: number
}

// Filter Parameters
export interface PostFilterParams {
  author?: string
  tag?: string
  category?: string
  search?: string
  per_page?: number
  page?: number
  orderby?: 'date' | 'id' | 'include' | 'title' | 'slug'
  order?: 'asc' | 'desc'
}

// WordPress API Error
export interface WordPressAPIErrorResponse {
  code: string
  message: string
  data: {
    status: number
  }
}