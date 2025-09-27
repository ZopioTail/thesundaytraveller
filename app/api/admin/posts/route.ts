import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getPublishedPosts, createPost } from '@/lib/db'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'

// GET /api/admin/posts - Get all posts with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // For now, get all posts and filter in memory
    // In a production app, you'd want to implement proper filtering in Firestore
    const allPosts = await getPublishedPosts(1000, 0)

    // Apply filters
    let filteredPosts = allPosts

    if (status) {
      filteredPosts = filteredPosts.filter((post: any) => post.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPosts = filteredPosts.filter((post: any) =>
        post.title?.toLowerCase().includes(searchLower) ||
        post.excerpt?.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const total = filteredPosts.length
    const startIndex = (page - 1) * limit
    const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit)

    // Transform posts to match expected format
    const transformedPosts = paginatedPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      status: post.status,
      featuredImage: post.featuredImage,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      author: {
        id: post.authorId,
        name: 'Vineet Kumar', // Default for now
        email: 'admin@example.com',
        avatar: null,
      },
      categories: [], // Will be implemented later
    }))

    return NextResponse.json({
      posts: transformedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/posts - Create new post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_CREATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      featuredImage,
      categories: categoryIds,
      status = 'draft',
      seoTitle,
      seoDescription,
      seoKeywords,
      publishedAt,
    } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const slug = generateSlug(title)

    // Check if slug already exists (simplified for Firestore)
    const existingPosts = await getPublishedPosts(1000, 0)
    const slugExists = existingPosts.some((post: any) => post.slug === slug)

    if (slugExists) {
      return NextResponse.json({ error: 'Post with this title already exists' }, { status: 409 })
    }

    const authorId = session.user.id || 'default-user'

    const newPostData = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      authorId,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
      publishedAt: status === 'published' && publishedAt ? new Date(publishedAt) : null,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      readingTime: 5,
      difficulty: 'Beginner',
      location: '',
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const newPostId = await createPost(newPostData)

    const newPost = {
      id: newPostId,
      ...newPostData,
    }

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}