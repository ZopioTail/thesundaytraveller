import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { notifications } from '@/lib/schema'
import { NotificationManager } from '@/lib/notifications'
import { eq, desc, count } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, message, priority, actionUrl, metadata, userId, recipientId } = body

    // Validate required fields
    if (!type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user has permission to send notifications
    if (userId && userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const notificationData = {
      type,
      title,
      message,
      priority: priority || 'medium',
      actionUrl,
      metadata: metadata ? JSON.stringify(metadata) : null,
      userId: userId || session.user.id,
      recipientId: recipientId || session.user.id,
      read: false,
      createdAt: new Date(),
    }

    // Save to database
    const [savedNotification] = await db.insert(notifications).values(notificationData).returning()

    // Send real-time notification
    const notificationManager = NotificationManager.getInstance()
    await notificationManager.sendToUser(recipientId || session.user.id, {
      type,
      title,
      message,
      priority: priority || 'medium',
      actionUrl,
      metadata,
    })

    return NextResponse.json({
      success: true,
      notification: savedNotification
    })

  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const read = searchParams.get('read')

    const offset = (page - 1) * limit

    let whereConditions = [eq(notifications.recipientId, parseInt(session.user.id))]

    if (type) {
      whereConditions.push(eq(notifications.type, type))
    }

    if (read !== null) {
      whereConditions.push(eq(notifications.read, read === 'true'))
    }

    const query = db.select().from(notifications).where(and(...whereConditions))

    const result = await query.orderBy(desc(notifications.createdAt)).limit(limit).offset(offset)

    const userNotifications = await query

    const totalCount = await db.select({ count: count() }).from(notifications)
      .where(eq(notifications.recipientId, parseInt(session.user.id)))

    return NextResponse.json({
      notifications: userNotifications,
      pagination: {
        page,
        limit,
        total: totalCount[0].count,
        pages: Math.ceil(totalCount[0].count / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}