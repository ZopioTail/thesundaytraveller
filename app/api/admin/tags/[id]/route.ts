import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getTagById, updateTag, deleteTag } from '@/lib/db'
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

// PUT /api/admin/tags/[id] - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tagId = parseInt(params.id)

    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, color } = body

    // Check if tag exists
    const tagRef = doc(firestoreDb, 'tags', params.id)
    const tagSnap = await getDoc(tagRef)

    if (!tagSnap.exists()) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    const existingTag = tagSnap.data()

    // Generate new slug if name changed
    let slug = existingTag.slug
    if (name && name !== existingTag.name) {
      slug = generateSlug(name)
      // For now, skip slug conflict check as it requires complex querying
    }

    const updateData: any = {
      updatedAt: Timestamp.now(),
    }

    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (color !== undefined) updateData.color = color

    await updateDoc(tagRef, updateData)

    return NextResponse.json({
      id: params.id,
      ...updateData
    })
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/tags/[id] - Delete tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_DELETE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tagId = parseInt(params.id)

    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 })
    }

    // Check if tag exists
    const tagRef = doc(firestoreDb, 'tags', params.id)
    const tagSnap = await getDoc(tagRef)

    if (!tagSnap.exists()) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Delete the tag
    await deleteDoc(tagRef)

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}