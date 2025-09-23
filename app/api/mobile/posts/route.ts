import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, categories, tags, users, postsToCategories, postsToTags } from '@/lib/schema'
import { eq, desc, and, or, sql, ilike } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'
    const author = searchParams.get('author')
    const sort = searchParams.get('sort') || 'newest' // newest, oldest, popular

    const offset = (page - 1) * limit

    let whereConditions = []

    // Only get published posts
    whereConditions.push(eq(posts.status, 'published'))

    // Search in title and content
    if (search) {
      whereConditions.push(
        or(
          ilike(posts.title, `%${search}%`),
          ilike(posts.excerpt, `%${search}%`),
          ilike(posts.content, `%${search}%`)
        )
      )
    }

    // Filter featured posts
    if (featured) {
      whereConditions.push(eq(posts.isFeatured, true))
    }

    // Filter by author
    if (author) {
      whereConditions.push(eq(posts.authorId, parseInt(author)))
    }

    const orderBy = sort === 'oldest'
      ? posts.createdAt
      : sort === 'popular'
      ? desc(sql`${posts.viewCount} + ${posts.likeCount} + ${posts.commentCount}`)
      : desc(posts.publishedAt || posts.createdAt)

    // Get posts with author information
    const postsList = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        featuredImage: posts.featuredImage,
        status: posts.status,
        isFeatured: posts.isFeatured,
        viewCount: posts.viewCount,
        likeCount: posts.likeCount,
        commentCount: posts.commentCount,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        publishedAt: posts.publishedAt,
        seoTitle: posts.seoTitle,
        seoDescription: posts.seoDescription,
        readingTime: posts.readingTime,
        difficulty: posts.difficulty,
        location: posts.location,
        author: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(and(...whereConditions))

    const total = totalCount[0].count
    const totalPages = Math.ceil(total / limit)

    // Get categories for each post
    const postsWithCategories = await Promise.all(
      postsList.map(async (post) => {
        const postCategories = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            color: categories.color,
          })
          .from(postsToCategories)
          .leftJoin(categories, eq(postsToCategories.categoryId, categories.id))
          .where(eq(postsToCategories.postId, post.id))

        return {
          ...post,
          categories: postCategories,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        posts: postsWithCategories,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}