import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { destinations, users } from '@/lib/schema'
import { eq, desc, and, or, sql, ilike } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const country = searchParams.get('country')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'
    const author = searchParams.get('author')
    const sort = searchParams.get('sort') || 'newest' // newest, oldest, popular, rating

    const offset = (page - 1) * limit

    let whereConditions = []

    // Only get published destinations
    whereConditions.push(eq(destinations.status, 'published'))

    // Filter by country
    if (country) {
      whereConditions.push(eq(destinations.country, country))
    }

    // Search in title and description
    if (search) {
      whereConditions.push(
        or(
          ilike(destinations.name, `%${search}%`),
          ilike(destinations.description, `%${search}%`),
          ilike(destinations.longDescription, `%${search}%`),
          ilike(destinations.country, `%${search}%`),
          ilike(destinations.region, `%${search}%`)
        )
      )
    }

    // Filter featured destinations
    if (featured) {
      whereConditions.push(eq(destinations.isFeatured, true))
    }

    // Filter by author
    if (author) {
      whereConditions.push(eq(destinations.authorId, parseInt(author)))
    }

    const orderBy = sort === 'oldest'
      ? destinations.createdAt
      : sort === 'popular'
      ? desc(destinations.viewCount)
      : sort === 'rating'
      ? desc(destinations.rating || 0)
      : desc(destinations.publishedAt || destinations.createdAt)

    const destinationsList = await db
      .select({
        id: destinations.id,
        name: destinations.name,
        slug: destinations.slug,
        description: destinations.description,
        longDescription: destinations.longDescription,
        country: destinations.country,
        region: destinations.region,
        coordinates: destinations.coordinates,
        featuredImage: destinations.featuredImage,
        images: destinations.images,
        bestTimeToVisit: destinations.bestTimeToVisit,
        currency: destinations.currency,
        language: destinations.language,
        timezone: destinations.timezone,
        visaInfo: destinations.visaInfo,
        status: destinations.status,
        isFeatured: destinations.isFeatured,
        viewCount: destinations.viewCount,
        rating: destinations.rating,
        createdAt: destinations.createdAt,
        updatedAt: destinations.updatedAt,
        publishedAt: destinations.publishedAt,
        seoTitle: destinations.seoTitle,
        seoDescription: destinations.seoDescription,
        seoKeywords: destinations.seoKeywords,
        author: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar,
        },
      })
      .from(destinations)
      .leftJoin(users, eq(destinations.authorId, users.id))
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(destinations)
      .where(and(...whereConditions))

    const total = totalCount[0].count
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        destinations: destinationsList,
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
    console.error('Error fetching destinations:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch destinations',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}