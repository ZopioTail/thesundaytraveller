'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  NewspaperIcon,
  MapPinIcon,
  PhotoIcon,
  EyeIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline'

interface Stats {
  posts: number
  news: number
  destinations: number
  media: number
  views: number
  visitors: number
}

interface RecentActivity {
  id: string
  type: 'post' | 'news' | 'destination' | 'media'
  title: string
  action: string
  timestamp: string
  user: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    posts: 0,
    news: 0,
    destinations: 0,
    media: 0,
    views: 0,
    visitors: 0,
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        posts: 24,
        news: 12,
        destinations: 45,
        media: 156,
        views: 12543,
        visitors: 3421,
      })

      setRecentActivity([
        {
          id: '1',
          type: 'post',
          title: 'What Adventure Sports Taught This Soldier About Life',
          action: 'published',
          timestamp: '2 hours ago',
          user: 'Rabindra Sahu',
        },
        {
          id: '2',
          type: 'news',
          title: 'New Travel Guidelines for 2025',
          action: 'created',
          timestamp: '4 hours ago',
          user: 'Rabindra Sahu',
        },
        {
          id: '3',
          type: 'destination',
          title: 'Lisbon, Portugal',
          action: 'updated',
          timestamp: '1 day ago',
          user: 'Rabindra Sahu',
        },
        {
          id: '4',
          type: 'media',
          title: 'profession-img-2.jpg',
          action: 'uploaded',
          timestamp: '2 days ago',
          user: 'Rabindra Sahu',
        },
      ])

      setLoading(false)
    }, 1000)
  }, [])

  const statCards = [
    {
      name: 'Total Posts',
      value: stats.posts,
      icon: DocumentTextIcon,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'News Articles',
      value: stats.news,
      icon: NewspaperIcon,
      color: 'from-green-500 to-green-600',
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Destinations',
      value: stats.destinations,
      icon: MapPinIcon,
      color: 'from-purple-500 to-purple-600',
      change: '+5%',
      changeType: 'increase',
    },
    {
      name: 'Media Files',
      value: stats.media,
      icon: PhotoIcon,
      color: 'from-orange-500 to-orange-600',
      change: '+23%',
      changeType: 'increase',
    },
    {
      name: 'Total Views',
      value: stats.views.toLocaleString(),
      icon: EyeIcon,
      color: 'from-pink-500 to-pink-600',
      change: '+15%',
      changeType: 'increase',
    },
    {
      name: 'Visitors',
      value: stats.visitors.toLocaleString(),
      icon: UserGroupIcon,
      color: 'from-indigo-500 to-indigo-600',
      change: '+7%',
      changeType: 'increase',
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post':
        return DocumentTextIcon
      case 'news':
        return NewspaperIcon
      case 'destination':
        return MapPinIcon
      case 'media':
        return PhotoIcon
      default:
        return DocumentTextIcon
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'post':
        return 'text-blue-600 bg-blue-100'
      case 'news':
        return 'text-green-600 bg-green-100'
      case 'destination':
        return 'text-purple-600 bg-purple-100'
      case 'media':
        return 'text-orange-600 bg-orange-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Welcome back! Here's what's happening with your travel blog.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                        {card.name}
                      </p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {card.value}
                      </p>
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                      {card.change}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivity.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {index !== recentActivity.length - 1 && (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-600"
                            aria-hidden="true"
                          />
                        )}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${getActivityColor(activity.type)}`}>
                              <Icon className="w-4 h-4" />
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {activity.title}
                                </span>{' '}
                                was {activity.action}
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                              {activity.timestamp}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-lg"
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin/posts/new" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-400 transition-colors duration-200">
                <DocumentTextIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">New Post</span>
              </a>
              <a href="/admin/news/new" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-400 transition-colors duration-200">
                <NewspaperIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Add News</span>
              </a>
              <a href="/admin/destinations/new" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-400 transition-colors duration-200">
                <MapPinIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">New Destination</span>
              </a>
              <a href="/admin/media" className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-orange-500 dark:hover:border-orange-400 transition-colors duration-200">
                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Upload Media</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
