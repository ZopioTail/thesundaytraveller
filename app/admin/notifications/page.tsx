'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BellIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'
import { Notification as NotificationType } from '@/lib/notifications'
import { useNotifications } from '@/lib/notifications'
import { NotificationItem } from '@/components/ui/Notification'

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  } = useNotifications()

  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterPriority, setFilterPriority] = useState<string>('all')
  const [filterRead, setFilterRead] = useState<string>('all')

  // Filter notifications based on search and filters
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority
    const matchesRead = filterRead === 'all' ||
                       (filterRead === 'read' && notification.read) ||
                       (filterRead === 'unread' && !notification.read)

    return matchesSearch && matchesType && matchesPriority && matchesRead
  })

  const handleMarkAsRead = (id: string) => {
    markAsRead(id)
  }

  const handleRemoveNotification = (id: string) => {
    removeNotification(id)
  }

  const handleBulkMarkAsRead = () => {
    const unreadNotifications = filteredNotifications.filter(n => !n.read)
    unreadNotifications.forEach(notification => markAsRead(notification.id))
  }

  const handleBulkDelete = () => {
    filteredNotifications.forEach(notification => removeNotification(notification.id))
  }

  const getNotificationStats = () => {
    const total = notifications.length
    const read = notifications.filter(n => n.read).length
    const unread = total - read
    const byType = notifications.reduce((acc, n) => {
      acc[n.type] = (acc[n.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { total, read, unread, byType }
  }

  const stats = getNotificationStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Manage your notifications and stay updated</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">Unread</p>
            <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BellIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <EyeIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Read</p>
              <p className="text-xl font-semibold">{stats.read}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <EyeSlashIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Unread</p>
              <p className="text-xl font-semibold">{stats.unread}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Types</p>
              <p className="text-xl font-semibold">{Object.keys(stats.byType).length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="comment">Comments</option>
              <option value="like">Likes</option>
              <option value="newsletter">Newsletter</option>
              <option value="system">System</option>
              <option value="admin">Admin</option>
              <option value="social">Social</option>
              <option value="backup">Backup</option>
              <option value="security">Security</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={filterRead}
              onChange={(e) => setFilterRead(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="read">Read</option>
              <option value="unread">Unread</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={handleBulkMarkAsRead}
              disabled={filteredNotifications.filter(n => !n.read).length === 0}
              className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Mark Selected as Read
            </button>

            <button
              onClick={handleBulkDelete}
              disabled={filteredNotifications.length === 0}
              className="flex items-center px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete Selected
            </button>
          </div>

          <div className="text-sm text-gray-500">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <BellIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' || filterPriority !== 'all' || filterRead !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClose={handleRemoveNotification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}