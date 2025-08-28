'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  TagIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  status: 'draft' | 'published' | 'archived'
  author: {
    name: string
    avatar: string
  }
  categories: Array<{
    name: string
    color: string
  }>
  featuredImage: string
  viewCount: number
  publishedAt: string
  createdAt: string
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setPosts([
        {
          id: '1',
          title: 'What Adventure Sports Taught This Soldier About Life',
          slug: 'what-adventure-sports-taught-this-soldier-about-life',
          excerpt: 'The crisp salute, the well-creased uniform, the structured life of the armed forces – these have been my constants for years...',
          status: 'published',
          author: {
            name: 'Rabindra Sahu',
            avatar: '/images/avatar.jpg'
          },
          categories: [
            { name: 'Profession', color: '#8b5cf6' }
          ],
          featuredImage: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
          viewCount: 1234,
          publishedAt: '2025-08-28T10:00:00Z',
          createdAt: '2025-08-27T15:30:00Z'
        },
        {
          id: '2',
          title: 'Life Beyond the Uniform: Curtains, Coffee & Calm',
          slug: 'life-beyond-the-uniform-curtains-coffee-calm',
          excerpt: 'They say a uniform defines you. It speaks of duty, discipline, and perhaps a certain seriousness...',
          status: 'published',
          author: {
            name: 'Rabindra Sahu',
            avatar: '/images/avatar.jpg'
          },
          categories: [
            { name: 'Art & Lifestyle', color: '#f59e0b' }
          ],
          featuredImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
          viewCount: 892,
          publishedAt: '2025-08-26T14:00:00Z',
          createdAt: '2025-08-25T09:15:00Z'
        },
        {
          id: '3',
          title: 'Flying Drones, Teaching Peace & Trading Stocks',
          slug: 'flying-drones-teaching-peace-trading-stocks',
          excerpt: 'Most days, you\'ll find me in uniform, focused on the critical responsibilities that come with serving...',
          status: 'draft',
          author: {
            name: 'Rabindra Sahu',
            avatar: '/images/avatar.jpg'
          },
          categories: [
            { name: 'Profession', color: '#8b5cf6' }
          ],
          featuredImage: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
          viewCount: 0,
          publishedAt: '',
          createdAt: '2025-08-28T08:45:00Z'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || 
                           post.categories.some(cat => cat.name.toLowerCase() === categoryFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
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
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your blog posts and articles
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            New Post
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Categories</option>
              <option value="travel">Travel</option>
              <option value="art & lifestyle">Art & Lifestyle</option>
              <option value="profession">Profession</option>
              <option value="adventure">Adventure</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-start space-x-4">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {post.excerpt}
                      </p>
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-5 h-5 rounded-full mr-2"
                          />
                          {post.author.name}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {post.viewCount.toLocaleString()} views
                        </div>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(post.status)}`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        {post.categories.map((category) => (
                          <span
                            key={category.name}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ backgroundColor: category.color + '20', color: category.color }}
                          >
                            <TagIcon className="w-3 h-3 mr-1" />
                            {category.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first post'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
