import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { notifications, users } from '@/lib/schema'
import { NotificationManager } from '@/lib/notifications'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 401 })
    }

    const body = await request.json()
    const { type, title, message, priority, actionUrl, metadata } = body

    // Validate required fields
    if (!type || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const notificationData = {
      type,
      title,
      message,
      priority: priority || 'medium',
      actionUrl,
      metadata: metadata ? JSON.stringify(metadata) : null,
      userId: session.user.id,
      read: false,
      createdAt: new Date(),
    }

    // Save to database for all users (no recipientId means broadcast)
    const savedNotifications = []

    // Get all active users
    const users = await db.select().from(require('@/lib/schema').users).where(
      require('@/lib/schema').users.isActive.eq(true)
    )

    // Create notification for each user
    for (const user of users) {
      const userNotification = {
        ...notificationData,
        recipientId: user.id,
        userId: parseInt(session.user.id),
      }

      const [savedNotification] = await db.insert(notifications).values(userNotification).returning()
      savedNotifications.push(savedNotification)
    }

    // Send real-time notification to all users
    const notificationManager = NotificationManager.getInstance()
    await notificationManager.sendToAllUsers({
      type,
      title,
      message,
      priority: priority || 'medium',
      actionUrl,
      metadata,
    })

    return NextResponse.json({
      success: true,
      notifications: savedNotifications,
      broadcastCount: savedNotifications.length
    })

  } catch (error) {
    console.error('Error broadcasting notification:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}