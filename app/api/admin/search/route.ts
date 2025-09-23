import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { searchPostsAdvanced, getSearchSuggestions } from '@/lib/db'
import { hasPermission } from '@/lib/rbac'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to search posts
    if (!hasPermission(session.user as any, 'POST_READ')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const categoryId = searchParams.get('categoryId')
    const tagIds = searchParams.get('tagIds')?.split(',').filter(Boolean)
    const status = searchParams.get('status')
    const authorId = searchParams.get('authorId')
    const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined
    const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined
    const sortBy = searchParams.get('sortBy') as 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'relevance' | null
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | null
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const suggestions = searchParams.get('suggestions') === 'true'

    // If suggestions requested, return autocomplete suggestions
    if (suggestions && query) {
      const suggestionResults = await getSearchSuggestions(query, 10)
      return NextResponse.json({
        suggestions: suggestionResults,
        total: suggestionResults.length
      })
    }

    // Perform advanced search
    const searchResults = await searchPostsAdvanced({
      query: query || undefined,
      categoryId: categoryId || undefined,
      tagIds: tagIds || undefined,
      status: status || undefined,
      authorId: authorId || undefined,
      dateFrom,
      dateTo,
      sortBy: sortBy || 'relevance',
      sortOrder: sortOrder || 'desc',
      limit,
      offset
    })

    return NextResponse.json({
      posts: searchResults,
      total: searchResults.length,
      pagination: {
        limit,
        offset,
        hasMore: searchResults.length === limit
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has permission to search posts
    if (!hasPermission(session.user as any, 'POST_READ')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const {
      query,
      categoryId,
      tagIds,
      status,
      authorId,
      dateFrom,
      dateTo,
      sortBy = 'relevance',
      sortOrder = 'desc',
      limit = 20,
      offset = 0
    } = body

    const searchResults = await searchPostsAdvanced({
      query,
      categoryId,
      tagIds,
      status,
      authorId,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
      sortBy,
      sortOrder,
      limit,
      offset
    })

    return NextResponse.json({
      posts: searchResults,
      total: searchResults.length,
      pagination: {
        limit,
        offset,
        hasMore: searchResults.length === limit
      }
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}