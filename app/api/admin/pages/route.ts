import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

// GET /api/admin/pages - Get all pages
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const pagesRef = collection(firestoreDb, 'pages')
    let q = query(pagesRef)

    // Add status filter if provided
    if (status && status !== 'all') {
      q = query(q, where('status', '==', status))
    }

    const querySnapshot = await getDocs(q)
    let pages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt,
      publishedAt: doc.data().publishedAt?.toDate ? doc.data().publishedAt.toDate() : doc.data().publishedAt,
    }))

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      pages = pages.filter((page: any) =>
        page.title?.toLowerCase().includes(searchLower) ||
        page.slug?.toLowerCase().includes(searchLower) ||
        page.excerpt?.toLowerCase().includes(searchLower)
      )
    }

    // Sort by creation date (newest first)
    pages.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_CREATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      content,
      excerpt,
      slug,
      status = 'draft',
      isHomepage = false,
      isPublic = true,
      seoTitle,
      seoDescription,
      publishedAt,
    } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const finalSlug = slug || generateSlug(title)

    // Check if slug already exists
    const pagesRef = collection(firestoreDb, 'pages')
    const existingSlugQuery = query(pagesRef, where('slug', '==', finalSlug))
    const existingSlugSnap = await getDocs(existingSlugQuery)

    if (!existingSlugSnap.empty) {
      return NextResponse.json({ error: 'Page with this slug already exists' }, { status: 409 })
    }

    const authorId = session.user.id || 'default-user'

    const newPageData = {
      title,
      slug: finalSlug,
      content,
      excerpt,
      status,
      authorId,
      isHomepage,
      isPublic,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      viewCount: 0,
      publishedAt: status === 'published' && publishedAt ? Timestamp.fromDate(new Date(publishedAt)) : null,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(pagesRef, newPageData)

    const newPage = {
      id: docRef.id,
      ...newPageData,
      author: {
        name: session.user.name || 'Unknown',
        email: session.user.email || '',
      }
    }

    return NextResponse.json(newPage, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}