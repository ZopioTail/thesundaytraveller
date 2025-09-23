import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { posts, categories, users, postsToCategories } from '@/lib/schema'
import { eq, desc, and, sql } from 'drizzle-orm'
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
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const author = searchParams.get('author')

    const offset = (page - 1) * limit

    let whereConditions = []

    if (status) {
      whereConditions.push(eq(posts.status, status))
    }

    if (search) {
      whereConditions.push(
        sql`${posts.title} ILIKE ${`%${search}%`} OR ${posts.excerpt} ILIKE ${`%${search}%`}`
      )
    }

    if (author) {
      whereConditions.push(eq(posts.authorId, parseInt(author)))
    }

    const whereClause = whereConditions.length > 0 ? and(...whereConditions) : undefined

    const postsList = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        status: posts.status,
        featuredImage: posts.featuredImage,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        viewCount: posts.viewCount,
        likeCount: posts.likeCount,
        author: {
          id: users.id,
          name: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(whereClause)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(whereClause)

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
      posts: postsWithCategories,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit),
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

    // Check if slug already exists
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.slug, slug))
      .limit(1)

    if (existingPost.length > 0) {
      return NextResponse.json({ error: 'Post with this title already exists' }, { status: 409 })
    }

    const authorId = parseInt(session.user.id)

    const [newPost] = await db
      .insert(posts)
      .values({
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
      })
      .returning()

    // Add categories if provided
    if (categoryIds && categoryIds.length > 0) {
      const categoryRelations = categoryIds.map((categoryId: number) => ({
        postId: newPost.id,
        categoryId,
      }))

      await db.insert(postsToCategories).values(categoryRelations)
    }

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}