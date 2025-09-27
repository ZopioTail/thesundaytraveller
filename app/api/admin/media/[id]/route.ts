import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getMediaById, updateMedia, deleteMedia } from '@/lib/db'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { unlink } from 'fs/promises'
import { join } from 'path'
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

// GET /api/admin/media/[id] - Get single media file
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user as any, 'MEDIA_UPLOAD')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const mediaFile = await getMediaById(params.id)

    if (!mediaFile) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 })
    }

    return NextResponse.json(mediaFile)
  } catch (error) {
    console.error('Error fetching media file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/media/[id] - Update media file metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user as any, 'MEDIA_UPLOAD')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const mediaId = parseInt(params.id)

    if (isNaN(mediaId)) {
      return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 })
    }

    const body = await request.json()
    const { alt, caption, folder } = body

    // Check if media file exists
    const existingMedia = await getMediaById(params.id)

    if (!existingMedia) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: Timestamp.now(),
    }

    if (alt !== undefined) updateData.alt = alt
    if (caption !== undefined) updateData.caption = caption
    if (folder !== undefined) updateData.folder = folder

    const updatedMedia = await updateMedia(params.id, updateData)

    return NextResponse.json(updatedMedia)
  } catch (error) {
    console.error('Error updating media file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/media/[id] - Delete media file
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user as any, 'MEDIA_UPLOAD')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const mediaId = parseInt(params.id)

    if (isNaN(mediaId)) {
      return NextResponse.json({ error: 'Invalid media ID' }, { status: 400 })
    }

    // Check if media file exists
    const existingMedia = await getMediaById(params.id)

    if (!existingMedia) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 })
    }

    // Delete physical file
    try {
      // For now, skip file deletion as the data structure is not correct
      // This would need the actual media URL from the document
      console.log('Would delete file for media:', params.id)
    } catch (fileError) {
      console.error('Error deleting physical file:', fileError)
      // Continue with database deletion even if file deletion fails
    }

    // Delete from database
    const mediaRef = doc(firestoreDb, 'media', params.id)
    await deleteDoc(mediaRef)

    return NextResponse.json({ message: 'Media file deleted successfully' })
  } catch (error) {
    console.error('Error deleting media file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}