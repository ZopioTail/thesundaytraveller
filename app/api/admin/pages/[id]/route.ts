import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

// GET /api/admin/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pageRef = doc(firestoreDb, 'pages', params.id)
    const pageSnap = await getDoc(pageRef)

    if (!pageSnap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const page = pageSnap.data()

    const transformedPage = {
      id: pageSnap.id,
      title: page.title,
      slug: page.slug,
      content: page.content,
      excerpt: page.excerpt,
      status: page.status,
      isHomepage: page.isHomepage,
      isPublic: page.isPublic,
      seoTitle: page.seoTitle,
      seoDescription: page.seoDescription,
      viewCount: page.viewCount,
      publishedAt: page.publishedAt,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
      author: {
        name: 'Admin User', // Default for now
        email: session.user.email || '',
      }
    }

    return NextResponse.json(transformedPage)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/pages/[id] - Update page
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
      content,
      excerpt,
      slug,
      status,
      isHomepage,
      isPublic,
      seoTitle,
      seoDescription,
      publishedAt,
    } = body

    // Check if page exists
    const pageRef = doc(firestoreDb, 'pages', params.id)
    const pageSnap = await getDoc(pageRef)

    if (!pageSnap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    const existingPage = pageSnap.data()

    // Generate new slug if title changed
    let finalSlug = existingPage.slug
    if (title && title !== existingPage.title) {
      finalSlug = slug || generateSlug(title)

      // Check if new slug already exists
      const pagesRef = collection(firestoreDb, 'pages')
      const existingSlugQuery = query(
        pagesRef,
        where('slug', '==', finalSlug),
        where('__name__', '!=', params.id)
      )
      const existingSlugSnap = await getDocs(existingSlugQuery)

      if (!existingSlugSnap.empty) {
        return NextResponse.json({ error: 'Page with this slug already exists' }, { status: 409 })
      }
    }

    const updateData: any = {
      updatedAt: Timestamp.now(),
    }

    if (title !== undefined) updateData.title = title
    if (finalSlug !== undefined) updateData.slug = finalSlug
    if (content !== undefined) updateData.content = content
    if (excerpt !== undefined) updateData.excerpt = excerpt
    if (status !== undefined) updateData.status = status
    if (isHomepage !== undefined) updateData.isHomepage = isHomepage
    if (isPublic !== undefined) updateData.isPublic = isPublic
    if (seoTitle !== undefined) updateData.seoTitle = seoTitle
    if (seoDescription !== undefined) updateData.seoDescription = seoDescription
    if (publishedAt !== undefined) updateData.publishedAt = status === 'published' ? Timestamp.fromDate(new Date(publishedAt)) : null

    await updateDoc(pageRef, updateData)

    const updatedPage = {
      id: params.id,
      ...existingPage,
      ...updateData,
    }

    return NextResponse.json(updatedPage)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/pages/[id] - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_DELETE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if page exists
    const pageRef = doc(firestoreDb, 'pages', params.id)
    const pageSnap = await getDoc(pageRef)

    if (!pageSnap.exists()) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    // Don't allow deletion of homepage
    const page = pageSnap.data()
    if (page.isHomepage) {
      return NextResponse.json({ error: 'Cannot delete homepage' }, { status: 400 })
    }

    // Delete the page
    await deleteDoc(pageRef)

    return NextResponse.json({ message: 'Page deleted successfully' })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}