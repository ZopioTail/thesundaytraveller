import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { comments, posts, news, users } from '@/lib/schema'
import { eq, desc, and, or, sql } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const newsId = searchParams.get('newsId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || 'approved'

    const offset = (page - 1) * limit

    let whereConditions = []

    // Filter by post or news
    if (postId) {
      whereConditions.push(eq(comments.postId, parseInt(postId)))
    } else if (newsId) {
      whereConditions.push(eq(comments.newsId, parseInt(newsId)))
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing content ID',
          message: 'Either postId or newsId is required',
        },
        { status: 400 }
      )
    }

    // Filter by status
    if (status !== 'all') {
      whereConditions.push(eq(comments.status, status))
    }

    const commentsList = await db
      .select({
        id: comments.id,
        content: comments.content,
        authorName: comments.authorName,
        authorEmail: comments.authorEmail,
        authorWebsite: comments.authorWebsite,
        postId: comments.postId,
        newsId: comments.newsId,
        parentId: comments.parentId,
        status: comments.status,
        isAnonymous: comments.isAnonymous,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        // Get post title if it's a post comment
        postTitle: posts.title,
        postSlug: posts.slug,
        // Get news title if it's a news comment
        newsTitle: news.title,
        newsSlug: news.slug,
      })
      .from(comments)
      .leftJoin(posts, eq(comments.postId, posts.id))
      .leftJoin(news, eq(comments.newsId, news.id))
      .where(and(...whereConditions))
      .orderBy(desc(comments.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(comments)
      .where(and(...whereConditions))

    const total = totalCount[0].count
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        comments: commentsList,
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
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch comments',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      content,
      authorName,
      authorEmail,
      authorWebsite,
      postId,
      newsId,
      parentId,
      isAnonymous = false
    } = body

    // Validation
    if (!content || !authorName || !authorEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Content, author name, and email are required',
        },
        { status: 400 }
      )
    }

    if (!postId && !newsId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing content reference',
          message: 'Either postId or newsId is required',
        },
        { status: 400 }
      )
    }

    // Create comment
    const newComment = await db
      .insert(comments)
      .values({
        content,
        authorName,
        authorEmail,
        authorWebsite,
        postId: postId ? parseInt(postId) : null,
        newsId: newsId ? parseInt(newsId) : null,
        parentId: parentId ? parseInt(parentId) : null,
        status: 'pending', // Comments need approval by default
        isAnonymous,
        ipAddress: request.headers.get('x-forwarded-for') ||
                  request.headers.get('x-real-ip') ||
                  'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      })
      .returning()

    // Update comment count for the related content
    if (postId) {
      await db
        .update(posts)
        .set({
          commentCount: sql`${posts.commentCount} + 1`,
        })
        .where(eq(posts.id, parseInt(postId)))
    } else if (newsId) {
      await db
        .update(news)
        .set({
          viewCount: sql`${news.viewCount} + 1`, // Using viewCount as there's no commentCount in news schema
        })
        .where(eq(news.id, parseInt(newsId)))
    }

    return NextResponse.json({
      success: true,
      message: 'Comment submitted successfully and is pending approval',
      data: {
        comment: newComment[0],
      },
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create comment',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}