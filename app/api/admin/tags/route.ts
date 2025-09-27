import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTags } from '@/lib/db'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

// GET /api/admin/tags - Get all tags
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tagsList = await getTags()
    return NextResponse.json(tagsList)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/tags - Create new tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, color } = body

    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 })
    }

    const slug = generateSlug(name)

    // For now, skip slug conflict check as it requires complex querying
    // This would need a more sophisticated implementation with Firestore

    const newTagData = {
      name,
      slug,
      color: color || '#10b981',
      usageCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const tagsRef = collection(firestoreDb, 'tags')
    const docRef = await addDoc(tagsRef, newTagData)

    return NextResponse.json({
      id: docRef.id,
      ...newTagData
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}