import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

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

    const postRef = doc(firestoreDb, 'posts', params.id)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const post = postSnap.data()

    // Transform post to match expected format
    const transformedPost = {
      id: postSnap.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      status: post.status,
      isFeatured: post.isFeatured,
      publishedAt: post.publishedAt,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      seoTitle: post.seoTitle,
      seoDescription: post.seoDescription,
      seoKeywords: post.seoKeywords,
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      readingTime: post.readingTime,
      difficulty: post.difficulty,
      location: post.location,
      author: {
        id: post.authorId,
        name: 'Vineet Kumar', // Default for now
        email: 'admin@example.com',
        avatar: null,
      },
      categories: [], // Will be implemented later
    }

    return NextResponse.json(transformedPost)
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

    const body = await request.json()
    const {
      title,
      excerpt,
      content,
      featuredImage,
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
    const postRef = doc(firestoreDb, 'posts', params.id)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const existingPost = postSnap.data()

    // Generate new slug if title changed
    let slug = existingPost.slug
    if (title && title !== existingPost.title) {
      slug = generateSlug(title)
      // Note: Slug conflict checking would need to be implemented
    }

    const updateData: any = {
      updatedAt: Timestamp.now(),
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
    if (publishedAt !== undefined) updateData.publishedAt = status === 'published' ? Timestamp.fromDate(new Date(publishedAt)) : null
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (readingTime !== undefined) updateData.readingTime = readingTime
    if (difficulty !== undefined) updateData.difficulty = difficulty
    if (location !== undefined) updateData.location = location

    await updateDoc(postRef, updateData)

    const updatedPost = {
      id: params.id,
      ...existingPost,
      ...updateData,
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

    // Check if post exists
    const postRef = doc(firestoreDb, 'posts', params.id)
    const postSnap = await getDoc(postRef)

    if (!postSnap.exists()) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Delete the post
    await deleteDoc(postRef)

    return NextResponse.json({ message: 'Post deleted successfully' })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}