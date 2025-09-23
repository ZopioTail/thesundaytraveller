import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { media, users } from '@/lib/schema'
import { eq, desc, and, or, sql, ilike } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const folder = searchParams.get('folder')
    const search = searchParams.get('search')
    const mimeType = searchParams.get('type') // image, video, document
    const sort = searchParams.get('sort') || 'newest' // newest, oldest, size, name

    const offset = (page - 1) * limit

    let whereConditions = []

    // Filter by folder
    if (folder) {
      whereConditions.push(eq(media.folder, folder))
    }

    // Filter by mime type
    if (mimeType) {
      if (mimeType === 'image') {
        whereConditions.push(or(
          ilike(media.mimeType, 'image/%'),
          eq(media.mimeType, 'image/jpeg'),
          eq(media.mimeType, 'image/png'),
          eq(media.mimeType, 'image/gif'),
          eq(media.mimeType, 'image/webp')
        ))
      } else if (mimeType === 'video') {
        whereConditions.push(ilike(media.mimeType, 'video/%'))
      } else if (mimeType === 'document') {
        whereConditions.push(or(
          ilike(media.mimeType, 'application/%'),
          ilike(media.mimeType, 'text/%'),
          eq(media.mimeType, 'application/pdf')
        ))
      }
    }

    // Search in filename and original name
    if (search) {
      whereConditions.push(
        or(
          ilike(media.filename, `%${search}%`),
          ilike(media.originalName, `%${search}%`),
          ilike(media.alt, `%${search}%`),
          ilike(media.caption, `%${search}%`)
        )
      )
    }

    const orderBy = sort === 'oldest'
      ? media.createdAt
      : sort === 'size'
      ? desc(media.size)
      : sort === 'name'
      ? media.originalName
      : desc(media.createdAt)

    const mediaList = await db
      .select({
        id: media.id,
        filename: media.filename,
        originalName: media.originalName,
        url: media.url,
        thumbnailUrl: media.thumbnailUrl,
        mimeType: media.mimeType,
        size: media.size,
        width: media.width,
        height: media.height,
        alt: media.alt,
        caption: media.caption,
        folder: media.folder,
        createdAt: media.createdAt,
        uploadedBy: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          avatar: users.avatar,
        },
      })
      .from(media)
      .leftJoin(users, eq(media.uploadedBy, users.id))
      .where(and(...whereConditions))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset)

    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(media)
      .where(and(...whereConditions))

    const total = totalCount[0].count
    const totalPages = Math.ceil(total / limit)

    // Format file size
    const formattedMedia = mediaList.map(item => ({
      ...item,
      sizeFormatted: formatFileSize(item.size),
      isImage: item.mimeType.startsWith('image/'),
      isVideo: item.mimeType.startsWith('video/'),
      isDocument: !item.mimeType.startsWith('image/') && !item.mimeType.startsWith('video/'),
    }))

    return NextResponse.json({
      success: true,
      data: {
        media: formattedMedia,
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
    console.error('Error fetching media:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch media',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}