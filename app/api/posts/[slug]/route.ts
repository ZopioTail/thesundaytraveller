import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/lib/db'

// Helper function to safely extract properties with defaults
function getProperty(obj: any, property: string, defaultValue: string = ''): string {
  return obj && obj[property] ? obj[property] : defaultValue
}

function getNumberProperty(obj: any, property: string, defaultValue: number = 0): number {
  return obj && obj[property] ? Number(obj[property]) : defaultValue
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPostBySlug(params.slug)

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Transform post to match the expected format for the client component
    const transformedPost = {
      id: post.id || '',
      title: getProperty(post, 'title', 'Untitled Post'),
      slug: getProperty(post, 'slug', ''),
      excerpt: getProperty(post, 'excerpt', ''),
      content: getProperty(post, 'content', ''),
      image: getProperty(post, 'featuredImage', '/images/placeholder.jpg'),
      category: 'Uncategorized', // Will be updated when categories are implemented
      tags: [], // Will be updated when tags are implemented
      author: 'Vineet Kumar', // Default author for now
      publishedAt: post.publishedAt || post.createdAt,
      readTime: getNumberProperty(post, 'readingTime', 5),
      views: getNumberProperty(post, 'viewCount', 0),
      likes: getNumberProperty(post, 'likeCount', 0),
      difficulty: getProperty(post, 'difficulty', 'Beginner'),
      location: getProperty(post, 'location', '')
    }

    return NextResponse.json(transformedPost)
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}