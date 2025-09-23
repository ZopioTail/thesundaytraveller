'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  CogIcon
} from '@heroicons/react/24/outline'
import { Notification as NotificationType } from '@/lib/notifications'
import { useNotifications } from '@/lib/notifications'

interface NotificationProps {
  notification: NotificationType
  onClose: (id: string) => void
  onMarkAsRead: (id: string) => void
}

const NotificationIcon = ({ type, priority }: { type: NotificationType['type'], priority: NotificationType['priority'] }) => {
  const iconClass = "h-5 w-5"

  switch (type) {
    case 'comment':
      return <ChatBubbleLeftIcon className={`${iconClass} text-blue-500`} />
    case 'like':
      return <HeartIcon className={`${iconClass} text-red-500`} />
    case 'newsletter':
      return <EnvelopeIcon className={`${iconClass} text-green-500`} />
    case 'system':
      return <InformationCircleIcon className={`${iconClass} text-blue-500`} />
    case 'admin':
      return <CogIcon className={`${iconClass} text-purple-500`} />
    case 'social':
      return <BellIcon className={`${iconClass} text-pink-500`} />
    case 'backup':
      return <CheckCircleIcon className={`${iconClass} text-green-500`} />
    case 'security':
      return <ShieldCheckIcon className={`${iconClass} text-orange-500`} />
    default:
      return <BellIcon className={`${iconClass} text-gray-500`} />
  }
}

const NotificationPriority = ({ priority }: { priority: NotificationType['priority'] }) => {
  const getPriorityColor = () => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor()}`}>
      {priority.toUpperCase()}
    </span>
  )
}

export function NotificationItem({ notification, onClose, onMarkAsRead }: NotificationProps) {
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id)
    }
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={`
        flex items-start p-4 mb-3 rounded-lg border shadow-sm cursor-pointer transition-all duration-200
        ${notification.read
          ? 'bg-white border-gray-200 hover:bg-gray-50'
          : 'bg-blue-50 border-blue-200 hover:bg-blue-100'
        }
      `}
      onClick={handleClick}
    >
      <div className="flex-shrink-0 mr-3">
        <NotificationIcon type={notification.type} priority={notification.priority} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900 truncate">
            {notification.title}
          </p>
          <div className="flex items-center space-x-2">
            <NotificationPriority priority={notification.priority} />
            <button
              onClick={(e) => {
                e.stopPropagation()
                onClose(notification.id)
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {notification.message}
        </p>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            {new Date(notification.createdAt).toLocaleDateString()}
          </p>
          {!notification.read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, removeNotification, clearAll } = useNotifications()
  const [isOpen, setIsOpen] = React.useState(false)

  const recentNotifications = notifications.slice(0, 5)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Notifications
                </h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              ) : (
                <AnimatePresence>
                  {recentNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClose={removeNotification}
                      onMarkAsRead={markAsRead}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {notifications.length > 5 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  onClick={() => window.location.href = '/admin/notifications'}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  )
}

export function NotificationToast({ notification, onClose }: { notification: NotificationType, onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className="fixed top-4 right-4 z-50 max-w-sm w-full"
    >
      <div className={`
        p-4 rounded-lg shadow-lg border
        ${notification.priority === 'urgent' ? 'bg-red-50 border-red-200' :
          notification.priority === 'high' ? 'bg-orange-50 border-orange-200' :
          notification.priority === 'medium' ? 'bg-yellow-50 border-yellow-200' :
          'bg-blue-50 border-blue-200'
        }
      `}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <NotificationIcon type={notification.type} priority={notification.priority} />
          </div>

          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">
              {notification.title}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {notification.message}
            </p>
          </div>

          <div className="ml-4 flex-shrink-0">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}