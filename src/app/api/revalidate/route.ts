import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

/**
 * WordPress Webhook Handler for Content Revalidation
 * This endpoint is called by WordPress when content is updated
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret
    const authHeader = request.headers.get('authorization')
    const webhookSecret = process.env.WORDPRESS_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('WORDPRESS_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { message: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    if (!authHeader || authHeader !== `Bearer ${webhookSecret}`) {
      console.error('Invalid webhook authorization')
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the webhook payload
    const body = await request.json()
    const { post_type, post_id, action, slug } = body

    console.log('WordPress webhook received:', {
      post_type,
      post_id,
      action,
      slug,
    })

    // Revalidate relevant cache tags based on the content type
    const tagsToRevalidate = ['wordpress']

    switch (post_type) {
      case 'post':
        tagsToRevalidate.push('posts', `post-${post_id}`, `post-${slug}`)
        break
      case 'page':
        tagsToRevalidate.push('pages', `page-${post_id}`, `page-${slug}`)
        break
      case 'kreditart':
        tagsToRevalidate.push('kreditarten', `kreditart-${post_id}`, `kreditart-${slug}`)
        break
      case 'service':
        tagsToRevalidate.push('services', `service-${post_id}`, `service-${slug}`)
        break
      default:
        tagsToRevalidate.push(post_type, `${post_type}-${post_id}`, `${post_type}-${slug}`)
    }

    // Revalidate all relevant tags
    for (const tag of tagsToRevalidate) {
      if (tag) {
        revalidateTag(tag)
        console.log(`Revalidated cache tag: ${tag}`)
      }
    }

    // For critical content changes, also revalidate the homepage
    if (['page', 'kreditart', 'service'].includes(post_type)) {
      revalidateTag('homepage')
      console.log('Revalidated homepage cache')
    }

    return NextResponse.json({
      message: 'Cache revalidated successfully',
      revalidated_tags: tagsToRevalidate,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Webhook revalidation error:', error)
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Manual revalidation endpoint (for testing)
 * Usage: GET /api/revalidate?secret=your-secret&tag=wordpress
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')
    const tag = searchParams.get('tag') || 'wordpress'

    // Verify the revalidation secret
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: 'Invalid secret' },
        { status: 401 }
      )
    }

    // Revalidate the specified tag
    revalidateTag(tag)
    console.log(`Manual revalidation of tag: ${tag}`)

    return NextResponse.json({
      message: `Cache tag '${tag}' revalidated successfully`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Manual revalidation error:', error)
    return NextResponse.json(
      {
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}