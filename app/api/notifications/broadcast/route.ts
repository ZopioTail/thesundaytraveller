import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getActiveUsers } from '@/lib/db'
import { NotificationManager } from '@/lib/notifications'
import {
  collection,
  addDoc,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

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
      createdAt: Timestamp.now(),
    }

    // Save to database for all users (no recipientId means broadcast)
    const savedNotifications = []

    // Get all active users
    const users = await getActiveUsers()

    // Create notification for each user
    const notificationsRef = collection(firestoreDb, 'notifications')

    for (const user of users) {
      const userNotification = {
        ...notificationData,
        recipientId: user.id,
        userId: session.user.id,
      }

      const docRef = await addDoc(notificationsRef, userNotification)
      savedNotifications.push({
        id: docRef.id,
        ...userNotification
      })
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