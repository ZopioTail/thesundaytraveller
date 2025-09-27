'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
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
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline'
import { hasPermission, PERMISSIONS } from '@/lib/rbac'

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
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const { data: session, status } = useSession()

  // Check permissions
  const canCreate = hasPermission(session?.user as any, PERMISSIONS.POST_CREATE)
  const canUpdate = hasPermission(session?.user as any, PERMISSIONS.POST_UPDATE)
  const canDelete = hasPermission(session?.user as any, PERMISSIONS.POST_DELETE)
  const canPublish = hasPermission(session?.user as any, PERMISSIONS.POST_PUBLISH)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/admin/posts')
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        } else {
          // Show empty state if API fails
          setPosts([])
        }
      } catch (error) {
        console.error('Failed to fetch posts:', error)
        // Show empty state on error
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
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

  const handleBulkDelete = async () => {
    if (!canDelete) return

    if (confirm(`Are you sure you want to delete ${selectedPosts.length} posts?`)) {
      try {
        // Implement bulk delete API call
        console.log('Deleting posts:', selectedPosts)
        setSelectedPosts([])
      } catch (error) {
        console.error('Error deleting posts:', error)
      }
    }
  }

  const handleBulkPublish = async () => {
    if (!canPublish) return

    try {
      // Implement bulk publish API call
      console.log('Publishing posts:', selectedPosts)
      setSelectedPosts([])
    } catch (error) {
      console.error('Error publishing posts:', error)
    }
  }

  const handleExport = async () => {
    try {
      const dataToExport = filteredPosts.map(post => ({
        title: post.title,
        excerpt: post.excerpt,
        status: post.status,
        author: post.author.name,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount,
        categories: post.categories.map(cat => cat.name).join(', ')
      }))

      const csvContent = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `posts-export-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting posts:', error)
    }
  }

  const handlePostSelect = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId])
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(filteredPosts.map(post => post.id))
    } else {
      setSelectedPosts([])
    }
  }

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
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {selectedPosts.length > 0 && (
            <div className="flex space-x-2">
              {canDelete && (
                <button
                  onClick={() => handleBulkDelete()}
                  className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Delete ({selectedPosts.length})
                </button>
              )}
              {canPublish && (
                <button
                  onClick={() => handleBulkPublish()}
                  className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                  Publish ({selectedPosts.length})
                </button>
              )}
              <button
                onClick={() => handleExport()}
                className="inline-flex items-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          )}
          {canCreate && (
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Post
            </Link>
          )}
        </div>
      </div>

      {/* Bulk Select All */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>
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
        {/* Bulk Actions Header */}
        {selectedPosts.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {selectedPosts.length} post{selectedPosts.length !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={() => setSelectedPosts([])}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                Clear selection
              </button>
            </div>
          </div>
        )}

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
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedPosts.includes(post.id)}
                    onChange={(e) => handlePostSelect(post.id, e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={80}
                  height={80}
                  className="object-cover rounded-lg flex-shrink-0"
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
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            width={20}
                            height={20}
                            className="rounded-full mr-2"
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
