import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { news, users, categories, newsToCategories } from '@/lib/schema'
import { eq, desc, and, or, sql, ilike } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const breaking = searchParams.get('breaking') === 'true'
    const author = searchParams.get('author')
    const sort = searchParams.get('sort') || 'newest' // newest, oldest, popular

    const offset = (page - 1) * limit

    let whereConditions = []

    // Only get published news
    whereConditions.push(eq(news.status, 'published'))

    // Search in title and content
    if (search) {
      whereConditions.push(
        or(
          ilike(news.title, `%${search}%`),
          ilike(news.excerpt, `%${search}%`),
          ilike(news.content, `%${search}%`)
        )
      )
    }

    // Filter breaking news
    if (breaking) {
      whereConditions.push(eq(news.isBreaking, true))
    }

    // Filter by author
    if (author) {
      whereConditions.push(eq(news.authorId, parseInt(author)))
    }

    const orderBy = sort === 'oldest'
      ? news.createdAt
      : desc(news.publishedAt || news.createdAt)

    // Get news with author information
    const newsList = await db
      .select({
        id: news.id,
        title: news.title,
        slug: news.slug,
        excerpt: news.excerpt,
        content: news.content,
        featuredImage: news.featuredImage,
        status: news.status,
        isBreaking: news.isBreaking,
        viewCount: news.viewCount,
        createdAt: news.createdAt,
        updatedAt: news.updatedAt,
        publishedAt: news.publishedAt,
        seoTitle: news.seoTitle,
        seoDescription: news.seoDescription,
        author: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar,
        },
      })
      .from(news)
      .leftJoin(users, eq(news.authorId, users.id))
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(news)
      .where(and(...whereConditions))

    const total = totalCount[0].count
    const totalPages = Math.ceil(total / limit)

    // Get categories for each news item
    const newsWithCategories = await Promise.all(
      newsList.map(async (newsItem) => {
        const newsCategories = await db
          .select({
            id: categories.id,
            name: categories.name,
            slug: categories.slug,
            color: categories.color,
          })
          .from(newsToCategories)
          .leftJoin(categories, eq(newsToCategories.categoryId, categories.id))
          .where(eq(newsToCategories.newsId, newsItem.id))

        return {
          ...newsItem,
          categories: newsCategories,
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        news: newsWithCategories,
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
    console.error('Error fetching news:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}