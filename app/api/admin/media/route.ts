import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { uploadMedia, getMediaFiles } from '@/lib/db'
import { hasPermission } from '@/lib/rbac'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user as any, 'MEDIA_UPLOAD')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const folder = searchParams.get('folder') || undefined

    const mediaFiles = await getMediaFiles(limit, offset, folder)

    return NextResponse.json({
      media: mediaFiles,
      pagination: {
        limit,
        offset,
        hasMore: mediaFiles.length === limit
      }
    })

  } catch (error) {
    console.error('Media fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.user as any, 'MEDIA_UPLOAD')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      return handleFileUpload(request, session)
    } else if (contentType.includes('application/json')) {
      // Handle external URL
      return handleExternalUrl(request, session)
    } else {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 })
    }

  } catch (error) {
    console.error('Media upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function handleFileUpload(request: NextRequest, session: any) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  const folder = formData.get('folder') as string || 'uploads'
  const alt = formData.get('alt') as string || ''
  const caption = formData.get('caption') as string || ''

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  // Validate file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }

  // Generate unique filename
  const fileExtension = file.name.split('.').pop()
  const fileName = `${uuidv4()}.${fileExtension}`
  const uploadPath = join(process.cwd(), 'public', 'uploads', folder)

  // Ensure directory exists
  await mkdir(uploadPath, { recursive: true })

  // Convert file to buffer and save
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filePath = join(uploadPath, fileName)

  await writeFile(filePath, buffer)

  // Save to database
  const mediaData = {
    filename: fileName,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    folder,
    alt,
    caption,
    uploadedBy: (session.user as any).id || 1,
    url: `/uploads/${folder}/${fileName}`,
    width: 0, // Would need image processing to get dimensions
    height: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const savedMedia = await uploadMedia(mediaData)

  return NextResponse.json({
    message: 'File uploaded successfully',
    media: savedMedia[0]
  })
}

async function handleExternalUrl(request: NextRequest, session: any) {
  const body = await request.json()
  const { url, folder = 'external', alt = '', caption = '' } = body

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 })
  }

  // Basic URL validation
  try {
    new URL(url)
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  // Check if it's an image URL
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
  const isImageUrl = imageExtensions.some(ext => url.toLowerCase().includes(ext))

  if (!isImageUrl) {
    return NextResponse.json({ error: 'URL must point to an image file' }, { status: 400 })
  }

  // Generate a filename from the URL
  const urlParts = url.split('/')
  const originalName = urlParts[urlParts.length - 1] || 'external-image'
  const fileName = `${uuidv4()}-${originalName}`

  // Save to database
  const mediaData = {
    filename: fileName,
    originalName,
    mimeType: 'image/external',
    size: 0, // Unknown size for external images
    folder,
    alt,
    caption,
    uploadedBy: (session.user as any).id || 1,
    url,
    width: 0,
    height: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const savedMedia = await uploadMedia(mediaData)

  return NextResponse.json({
    message: 'External image added successfully',
    media: savedMedia[0]
  })
}