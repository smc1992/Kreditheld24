/**
 * WordPress API Library for Kreditheld24
 * Based on next-wp template by 9d8dev
 * Provides type-safe WordPress REST API integration
 */

import { WordPressPost, WordPressPage, WordPressCategory, WordPressTag, WordPressAuthor, WordPressMedia } from './wordpress.d'

// WordPress API Error Class
class WordPressAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public statusText?: string
  ) {
    super(message)
    this.name = 'WordPressAPIError'
  }
}

// Default fetch options for all WordPress API calls
const defaultFetchOptions = {
  next: {
    tags: ['wordpress'],
    revalidate: 3600, // 1 hour cache
  },
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
}

// Base WordPress API URL
const WORDPRESS_URL = process.env.WORDPRESS_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL
const WORDPRESS_API_URL = `${WORDPRESS_URL}/wp-json/wp/v2`

if (!WORDPRESS_URL) {
  throw new Error('WORDPRESS_URL environment variable is required')
}

/**
 * Generic fetch function for WordPress API
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${WORDPRESS_API_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...defaultFetchOptions,
      ...options,
    })

    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof WordPressAPIError) {
      throw error
    }
    throw new WordPressAPIError(
      `Failed to fetch from WordPress API: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

// ============================================================================
// POSTS
// ============================================================================

/**
 * Get all posts with optional filtering
 * Limited to 100 posts for performance
 */
export async function getAllPosts(filterParams?: {
  author?: string
  tag?: string
  category?: string
  search?: string
}): Promise<WordPressPost[]> {
  let endpoint = '/posts?per_page=100&_embed'
  
  if (filterParams) {
    const params = new URLSearchParams()
    if (filterParams.author) params.append('author', filterParams.author)
    if (filterParams.tag) params.append('tags', filterParams.tag)
    if (filterParams.category) params.append('categories', filterParams.category)
    if (filterParams.search) params.append('search', filterParams.search)
    
    if (params.toString()) {
      endpoint += `&${params.toString()}`
    }
  }

  return fetchAPI(endpoint, {
    next: { tags: ['wordpress', 'posts'], revalidate: 3600 }
  })
}

/**
 * Get posts with pagination (recommended for large datasets)
 */
export async function getPostsPaginated(
  page: number = 1,
  perPage: number = 10,
  filterParams?: {
    author?: string
    tag?: string
    category?: string
    search?: string
  }
): Promise<{ posts: WordPressPost[]; totalPages: number; totalPosts: number }> {
  let endpoint = `/posts?page=${page}&per_page=${perPage}&_embed`
  
  if (filterParams) {
    const params = new URLSearchParams()
    if (filterParams.author) params.append('author', filterParams.author)
    if (filterParams.tag) params.append('tags', filterParams.tag)
    if (filterParams.category) params.append('categories', filterParams.category)
    if (filterParams.search) params.append('search', filterParams.search)
    
    if (params.toString()) {
      endpoint += `&${params.toString()}`
    }
  }

  const response = await fetch(`${WORDPRESS_API_URL}${endpoint}`, {
    ...defaultFetchOptions,
    next: { tags: ['wordpress', 'posts'], revalidate: 3600 }
  })

  if (!response.ok) {
    throw new WordPressAPIError(
      `Failed to fetch posts: ${response.statusText}`,
      response.status,
      response.statusText
    )
  }

  const posts = await response.json()
  const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0')
  const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0')

  return { posts, totalPages, totalPosts }
}

/**
 * Get a single post by ID
 */
export async function getPostById(id: number): Promise<WordPressPost> {
  return fetchAPI(`/posts/${id}?_embed`, {
    next: { tags: ['wordpress', 'posts', `post-${id}`], revalidate: 3600 }
  })
}

/**
 * Get a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<WordPressPost> {
  const posts = await fetchAPI(`/posts?slug=${slug}&_embed`, {
    next: { tags: ['wordpress', 'posts', `post-${slug}`], revalidate: 3600 }
  })
  
  if (!posts || posts.length === 0) {
    throw new WordPressAPIError(`Post with slug '${slug}' not found`, 404)
  }
  
  return posts[0]
}

// ============================================================================
// PAGES
// ============================================================================

/**
 * Get all pages
 */
export async function getAllPages(): Promise<WordPressPage[]> {
  return fetchAPI('/pages?per_page=100&_embed', {
    next: { tags: ['wordpress', 'pages'], revalidate: 3600 }
  })
}

/**
 * Get a single page by ID
 */
export async function getPageById(id: number): Promise<WordPressPage> {
  return fetchAPI(`/pages/${id}?_embed`, {
    next: { tags: ['wordpress', 'pages', `page-${id}`], revalidate: 3600 }
  })
}

/**
 * Get a single page by slug
 */
export async function getPageBySlug(slug: string): Promise<WordPressPage> {
  const pages = await fetchAPI(`/pages?slug=${slug}&_embed`, {
    next: { tags: ['wordpress', 'pages', `page-${slug}`], revalidate: 3600 }
  })
  
  if (!pages || pages.length === 0) {
    throw new WordPressAPIError(`Page with slug '${slug}' not found`, 404)
  }
  
  return pages[0]
}

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<WordPressCategory[]> {
  return fetchAPI('/categories?per_page=100', {
    next: { tags: ['wordpress', 'categories'], revalidate: 3600 }
  })
}

/**
 * Get a single category by ID
 */
export async function getCategoryById(id: number): Promise<WordPressCategory> {
  return fetchAPI(`/categories/${id}`, {
    next: { tags: ['wordpress', 'categories', `category-${id}`], revalidate: 3600 }
  })
}

/**
 * Get a single category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<WordPressCategory> {
  const categories = await fetchAPI(`/categories?slug=${slug}`, {
    next: { tags: ['wordpress', 'categories', `category-${slug}`], revalidate: 3600 }
  })
  
  if (!categories || categories.length === 0) {
    throw new WordPressAPIError(`Category with slug '${slug}' not found`, 404)
  }
  
  return categories[0]
}

/**
 * Get posts by category ID
 */
export async function getPostsByCategory(categoryId: number): Promise<WordPressPost[]> {
  return fetchAPI(`/posts?categories=${categoryId}&_embed`, {
    next: { tags: ['wordpress', 'posts', `category-${categoryId}`], revalidate: 3600 }
  })
}

// ============================================================================
// TAGS
// ============================================================================

/**
 * Get all tags
 */
export async function getAllTags(): Promise<WordPressTag[]> {
  return fetchAPI('/tags?per_page=100', {
    next: { tags: ['wordpress', 'tags'], revalidate: 3600 }
  })
}

/**
 * Get a single tag by ID
 */
export async function getTagById(id: number): Promise<WordPressTag> {
  return fetchAPI(`/tags/${id}`, {
    next: { tags: ['wordpress', 'tags', `tag-${id}`], revalidate: 3600 }
  })
}

/**
 * Get a single tag by slug
 */
export async function getTagBySlug(slug: string): Promise<WordPressTag> {
  const tags = await fetchAPI(`/tags?slug=${slug}`, {
    next: { tags: ['wordpress', 'tags', `tag-${slug}`], revalidate: 3600 }
  })
  
  if (!tags || tags.length === 0) {
    throw new WordPressAPIError(`Tag with slug '${slug}' not found`, 404)
  }
  
  return tags[0]
}

/**
 * Get posts by tag ID
 */
export async function getPostsByTag(tagId: number): Promise<WordPressPost[]> {
  return fetchAPI(`/posts?tags=${tagId}&_embed`, {
    next: { tags: ['wordpress', 'posts', `tag-${tagId}`], revalidate: 3600 }
  })
}

// ============================================================================
// AUTHORS
// ============================================================================

/**
 * Get all authors
 */
export async function getAllAuthors(): Promise<WordPressAuthor[]> {
  return fetchAPI('/users?per_page=100', {
    next: { tags: ['wordpress', 'authors'], revalidate: 3600 }
  })
}

/**
 * Get a single author by ID
 */
export async function getAuthorById(id: number): Promise<WordPressAuthor> {
  return fetchAPI(`/users/${id}`, {
    next: { tags: ['wordpress', 'authors', `author-${id}`], revalidate: 3600 }
  })
}

/**
 * Get posts by author ID
 */
export async function getPostsByAuthor(authorId: number): Promise<WordPressPost[]> {
  return fetchAPI(`/posts?author=${authorId}&_embed`, {
    next: { tags: ['wordpress', 'posts', `author-${authorId}`], revalidate: 3600 }
  })
}

// ============================================================================
// MEDIA
// ============================================================================

/**
 * Get featured media by ID
 */
export async function getFeaturedMediaById(id: number): Promise<WordPressMedia> {
  return fetchAPI(`/media/${id}`, {
    next: { tags: ['wordpress', 'media', `media-${id}`], revalidate: 3600 }
  })
}

// ============================================================================
// CUSTOM POST TYPES (for Kreditheld24)
// ============================================================================

/**
 * Get custom post type data (e.g., Kreditarten, Services)
 * This will be used once custom post types are set up in WordPress
 */
export async function getCustomPostType(postType: string, slug?: string): Promise<any> {
  let endpoint = `/${postType}?_embed`
  
  if (slug) {
    endpoint += `&slug=${slug}`
  }
  
  const data = await fetchAPI(endpoint, {
    next: { tags: ['wordpress', postType, slug ? `${postType}-${slug}` : ''], revalidate: 3600 }
  })
  
  if (slug && (!data || data.length === 0)) {
    throw new WordPressAPIError(`${postType} with slug '${slug}' not found`, 404)
  }
  
  return slug ? data[0] : data
}

// ============================================================================
// REVALIDATION
// ============================================================================

/**
 * Revalidate WordPress cache tags
 */
export async function revalidateWordPressCache(tags: string[] = ['wordpress']) {
  if (typeof window === 'undefined') {
    const { revalidateTag } = await import('next/cache')
    tags.forEach(tag => revalidateTag(tag))
  }
}

export { WordPressAPIError }