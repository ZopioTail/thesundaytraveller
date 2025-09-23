import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, news, destinations, users } from '@/lib/schema'
import { eq, desc, and, or, ilike, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // posts, news, destinations, all
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Search query is required',
        },
        { status: 400 }
      )
    }

    const offset = (page - 1) * limit
    const searchTerm = `%${query}%`

    let results: any[] = []
    let totalCount = 0

    // Search based on type
    if (type === 'posts' || type === 'all' || !type) {
      const [postsResults, postsCount] = await Promise.all([
        db
          .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            excerpt: posts.excerpt,
            type: sql<string>`'post'`,
            url: sql<string>`concat('/blog/', ${posts.slug})`,
            author: {
              id: users.id,
              username: users.username,
              firstName: users.firstName,
              lastName: users.lastName,
            },
            createdAt: posts.createdAt,
            status: posts.status,
          })
          .from(posts)
          .leftJoin(users, eq(posts.authorId, users.id))
          .where(
            and(
              eq(posts.status, 'published'),
              or(
                ilike(posts.title, searchTerm),
                ilike(posts.excerpt, searchTerm),
                ilike(posts.content, searchTerm)
              )
            )
          )
          .orderBy(desc(posts.createdAt))
          .limit(type === 'posts' ? limit : Math.floor(limit / 3))
          .offset(type === 'posts' ? offset : 0),
        db
          .select({ count: sql<number>`count(*)` })
          .from(posts)
          .where(
            and(
              eq(posts.status, 'published'),
              or(
                ilike(posts.title, searchTerm),
                ilike(posts.excerpt, searchTerm),
                ilike(posts.content, searchTerm)
              )
            )
          )
      ])

      results.push(...postsResults)
      totalCount += postsCount[0].count
    }

    if (type === 'news' || type === 'all' || !type) {
      const [newsResults, newsCount] = await Promise.all([
        db
          .select({
            id: news.id,
            title: news.title,
            slug: news.slug,
            excerpt: news.excerpt,
            type: sql<string>`'news'`,
            url: sql<string>`concat('/news/', ${news.slug})`,
            author: {
              id: users.id,
              username: users.username,
              firstName: users.firstName,
              lastName: users.lastName,
            },
            createdAt: news.createdAt,
            status: news.status,
          })
          .from(news)
          .leftJoin(users, eq(news.authorId, users.id))
          .where(
            and(
              eq(news.status, 'published'),
              or(
                ilike(news.title, searchTerm),
                ilike(news.excerpt, searchTerm),
                ilike(news.content, searchTerm)
              )
            )
          )
          .orderBy(desc(news.createdAt))
          .limit(type === 'news' ? limit : Math.floor(limit / 3))
          .offset(type === 'news' ? offset : 0),
        db
          .select({ count: sql<number>`count(*)` })
          .from(news)
          .where(
            and(
              eq(news.status, 'published'),
              or(
                ilike(news.title, searchTerm),
                ilike(news.excerpt, searchTerm),
                ilike(news.content, searchTerm)
              )
            )
          )
      ])

      results.push(...newsResults)
      totalCount += newsCount[0].count
    }

    if (type === 'destinations' || type === 'all' || !type) {
      const [destinationsResults, destinationsCount] = await Promise.all([
        db
          .select({
            id: destinations.id,
            title: destinations.name,
            slug: destinations.slug,
            excerpt: destinations.description,
            type: sql<string>`'destination'`,
            url: sql<string>`concat('/destinations/', ${destinations.slug})`,
            author: {
              id: users.id,
              username: users.username,
              firstName: users.firstName,
              lastName: users.lastName,
            },
            createdAt: destinations.createdAt,
            status: destinations.status,
            country: destinations.country,
          })
          .from(destinations)
          .leftJoin(users, eq(destinations.authorId, users.id))
          .where(
            and(
              eq(destinations.status, 'published'),
              or(
                ilike(destinations.name, searchTerm),
                ilike(destinations.description, searchTerm),
                ilike(destinations.longDescription, searchTerm),
                ilike(destinations.country, searchTerm),
                ilike(destinations.region, searchTerm)
              )
            )
          )
          .orderBy(desc(destinations.createdAt))
          .limit(type === 'destinations' ? limit : Math.floor(limit / 3))
          .offset(type === 'destinations' ? offset : 0),
        db
          .select({ count: sql<number>`count(*)` })
          .from(destinations)
          .where(
            and(
              eq(destinations.status, 'published'),
              or(
                ilike(destinations.name, searchTerm),
                ilike(destinations.description, searchTerm),
                ilike(destinations.longDescription, searchTerm),
                ilike(destinations.country, searchTerm),
                ilike(destinations.region, searchTerm)
              )
            )
          )
      ])

      results.push(...destinationsResults)
      totalCount += destinationsCount[0].count
    }

    // Sort combined results by date
    results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Apply pagination to combined results
    const paginatedResults = results.slice(offset, offset + limit)
    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      success: true,
      data: {
        results: paginatedResults,
        searchInfo: {
          query,
          type: type || 'all',
          totalResults: totalCount,
        },
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    })
  } catch (error) {
    console.error('Error searching:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}