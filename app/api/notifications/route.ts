import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createNotification, getNotificationsByUser } from '@/lib/db'
import { NotificationManager } from '@/lib/notifications'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

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
      createdAt: Timestamp.now(),
    }

    // Save to database
    const savedNotificationId = await createNotification(notificationData)
    const savedNotification = {
      id: savedNotificationId,
      ...notificationData
    }

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
    const limitCount = parseInt(searchParams.get('limit') || '20')
    const type = searchParams.get('type')
    const read = searchParams.get('read')

    const offset = (page - 1) * limitCount

    // Build where conditions for Firestore
    const whereConditions: Array<{ field: string; operator: any; value: any }> = []

    if (type) {
      whereConditions.push({ field: 'type', operator: '==', value: type })
    }

    if (read !== null) {
      whereConditions.push({ field: 'read', operator: '==', value: read === 'true' })
    }

    const userNotifications = await getNotificationsByUser(session.user.id, {
      where: whereConditions,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      limit: limitCount,
      offset
    })

    // Get total count
    const notificationsRef = collection(firestoreDb, 'notifications')
    let countQuery = query(
      notificationsRef,
      where('recipientId', '==', session.user.id)
    )

    if (type) {
      countQuery = query(countQuery, where('type', '==', type))
    }

    if (read !== null) {
      countQuery = query(countQuery, where('read', '==', read === 'true'))
    }

    const countSnapshot = await getDocs(countQuery)
    const total = countSnapshot.size

    return NextResponse.json({
      notifications: userNotifications,
      pagination: {
        page,
        limit: limitCount,
        total,
        pages: Math.ceil(total / limitCount)
      }
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}