import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { posts, categories, users, postsToCategories } from '@/lib/schema'
import { eq, and, sql } from 'drizzle-orm'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'

// GET /api/admin/posts/[id] - Get single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const postId = parseInt(params.id)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
    }

    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        featuredImage: posts.featuredImage,
        status: posts.status,
        isFeatured: posts.isFeatured,
        publishedAt: posts.publishedAt,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        seoTitle: posts.seoTitle,
        seoDescription: posts.seoDescription,
        seoKeywords: posts.seoKeywords,
        viewCount: posts.viewCount,
        likeCount: posts.likeCount,
        commentCount: posts.commentCount,
        readingTime: posts.readingTime,
        difficulty: posts.difficulty,
        location: posts.location,
        author: {
          id: users.id,
          name: sql<string>`${users.firstName} || ' ' || ${users.lastName}`,
          email: users.email,
          avatar: users.avatar,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, postId))
      .limit(1)

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Get categories for the post
    const postCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        color: categories.color,
      })
      .from(postsToCategories)
      .leftJoin(categories, eq(postsToCategories.categoryId, categories.id))
      .where(eq(postsToCategories.postId, postId))

    return NextResponse.json({
      ...post,
      categories: postCategories,
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/posts/[id] - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const postId = parseInt(params.id)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
    }

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      featuredImage,
      categories: categoryIds,
      status,
      seoTitle,
      seoDescription,
      seoKeywords,
      publishedAt,
      isFeatured,
      readingTime,
      difficulty,
      location,
    } = body

    // Check if post exists
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1)

    if (existingPost.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Generate new slug if title changed
    let slug = existingPost[0].slug
    if (title && title !== existingPost[0].title) {
      slug = generateSlug(title)

      // Check if new slug conflicts with other posts
      const slugConflict = await db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, slug), sql`${posts.id} != ${postId}`))
        .limit(1)

      if (slugConflict.length > 0) {
        return NextResponse.json({ error: 'Post with this title already exists' }, { status: 409 })
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (content !== undefined) updateData.content = content
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage
    if (status !== undefined) updateData.status = status
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription
    if (seoKeywords !== undefined) updateData.seoKeywords = seoKeywords
    if (publishedAt !== undefined) updateData.publishedAt = status === 'published' ? new Date(publishedAt) : null
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (readingTime !== undefined) updateData.readingTime = readingTime
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (location !== undefined) updateData.location = location

    const [updatedPost] = await db
      .update(posts)
      .set(updateData)
      .where(eq(posts.id, postId))
      .returning()

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Remove existing categories
      await db
        .delete(postsToCategories)
        .where(eq(postsToCategories.postId, postId))

      // Add new categories
      if (categoryIds.length > 0) {
        const categoryRelations = categoryIds.map((categoryId: number) => ({
          postId,
          categoryId,
        }))

        await db.insert(postsToCategories).values(categoryRelations)
      }
    }

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/posts/[id] - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_DELETE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const postId = parseInt(params.id)

    if (isNaN(postId)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 })
    }

    // Check if post exists
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1)

    if (existingPost.length === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Delete post categories first
    await db
      .delete(postsToCategories)
      .where(eq(postsToCategories.postId, postId))

    // Delete the post
    await db
      .delete(posts)
      .where(eq(posts.id, postId))

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}