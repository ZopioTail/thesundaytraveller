'use client'

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback } from 'react'

// Notification Types
export type NotificationType =
  | 'comment'
  | 'like'
  | 'newsletter'
  | 'system'
  | 'admin'
  | 'social'
  | 'backup'
  | 'security'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  priority: NotificationPriority
  read: boolean
  createdAt: Date
  expiresAt?: Date
  actionUrl?: string
  metadata?: Record<string, any>
  userId?: string
  recipientId?: string
}

// Notification Context
interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAll: () => void
  subscribeToNotifications: (userId: string) => void
  unsubscribeFromNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

// Notification Provider Component
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [eventSource, setEventSource] = useState<EventSource | null>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const notification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      read: false,
    }

    setNotifications(prev => [notification, ...prev])

    // Auto-remove after expiry or after 24 hours
    if (notification.expiresAt) {
      const timeout = notification.expiresAt.getTime() - Date.now()
      if (timeout > 0) {
        setTimeout(() => {
          removeNotification(notification.id)
        }, timeout)
      }
    } else {
      // Default expiry after 24 hours
      setTimeout(() => {
        removeNotification(notification.id)
      }, 24 * 60 * 60 * 1000)
    }
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const subscribeToNotifications = useCallback((userId: string) => {
    if (eventSource) {
      eventSource.close()
    }

    const es = new EventSource(`/api/notifications/stream?userId=${userId}`)
    setEventSource(es)

    es.onmessage = (event) => {
      try {
        const notification: Notification = JSON.parse(event.data)
        addNotification(notification)
      } catch (error) {
        console.error('Error parsing notification:', error)
      }
    }

    es.onerror = (error) => {
      console.error('EventSource error:', error)
    }

    return () => {
      es.close()
      setEventSource(null)
    }
  }, [addNotification, eventSource])

  const unsubscribeFromNotifications = useCallback(() => {
    if (eventSource) {
      eventSource.close()
      setEventSource(null)
    }
  }, [eventSource])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSource) {
        eventSource.close()
      }
    }
  }, [eventSource])

  const contextValue: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    subscribeToNotifications,
    unsubscribeFromNotifications,
  }

  return React.createElement(NotificationContext.Provider, { value: contextValue }, children)
}

// Hook to use notifications
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Notification Manager Class
export class NotificationManager {
  private static instance: NotificationManager
  private listeners: Map<string, (notification: Notification) => void> = new Map()

  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager()
    }
    return NotificationManager.instance
  }

  subscribe(userId: string, callback: (notification: Notification) => void): () => void {
    const id = `user_${userId}`
    this.listeners.set(id, callback)

    return () => {
      this.listeners.delete(id)
    }
  }

  notify(notification: Notification) {
    // Notify all listeners
    this.listeners.forEach(callback => {
      try {
        callback(notification)
      } catch (error) {
        console.error('Error in notification listener:', error)
      }
    })
  }

  async sendToUser(userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
    const fullNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      read: false,
      recipientId: userId,
    }

    this.notify(fullNotification)

    // Send to API for persistence
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullNotification),
      })
    } catch (error) {
      console.error('Error sending notification to API:', error)
    }
  }

  async sendToAllUsers(notification: Omit<Notification, 'id' | 'createdAt' | 'read' | 'recipientId'>) {
    const fullNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      read: false,
    }

    this.notify(fullNotification)

    // Send to API for broadcast
    try {
      await fetch('/api/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullNotification),
      })
    } catch (error) {
      console.error('Error broadcasting notification:', error)
    }
  }
}

// Utility functions for creating notifications
export const NotificationUtils = {
  createCommentNotification: (postTitle: string, commentAuthor: string): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'comment',
    title: 'New Comment',
    message: `${commentAuthor} commented on "${postTitle}"`,
    priority: 'medium',
    actionUrl: `/blog/post-slug`, // Would be dynamic
  }),

  createLikeNotification: (postTitle: string, likeAuthor: string): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'like',
    title: 'New Like',
    message: `${likeAuthor} liked "${postTitle}"`,
    priority: 'low',
    actionUrl: `/blog/post-slug`,
  }),

  createNewsletterNotification: (subscriberEmail: string): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'newsletter',
    title: 'New Newsletter Subscriber',
    message: `${subscriberEmail} subscribed to the newsletter`,
    priority: 'medium',
  }),

  createSystemNotification: (title: string, message: string, priority: NotificationPriority = 'medium'): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'system',
    title,
    message,
    priority,
  }),

  createAdminNotification: (title: string, message: string, priority: NotificationPriority = 'high'): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'admin',
    title,
    message,
    priority,
  }),

  createSecurityNotification: (title: string, message: string): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'security',
    title,
    message,
    priority: 'urgent',
  }),
}