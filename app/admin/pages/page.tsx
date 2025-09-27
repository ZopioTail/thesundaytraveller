'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  EyeIcon,
  GlobeAltIcon,
  CalendarIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import { hasPermission, PERMISSIONS } from '@/lib/rbac'

interface Page {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  status: 'draft' | 'published' | 'archived'
  author: {
    name: string
    email: string
  }
  isHomepage?: boolean
  isPublic: boolean
  seoTitle?: string
  seoDescription?: string
  viewCount: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPages, setSelectedPages] = useState<string[]>([])
  const { data: session } = useSession()

  // Check permissions
  const canCreate = hasPermission(session?.user as any, PERMISSIONS.POST_CREATE)
  const canUpdate = hasPermission(session?.user as any, PERMISSIONS.POST_UPDATE)
  const canDelete = hasPermission(session?.user as any, PERMISSIONS.POST_DELETE)
  const canPublish = hasPermission(session?.user as any, PERMISSIONS.POST_PUBLISH)

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      } else {
        setPages([])
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error)
      setPages([])
    } finally {
      setLoading(false)
    }
  }

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

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handlePageSelect = (pageId: string, checked: boolean) => {
    if (checked) {
      setSelectedPages([...selectedPages, pageId])
    } else {
      setSelectedPages(selectedPages.filter(id => id !== pageId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPages(filteredPages.map(page => page.id))
    } else {
      setSelectedPages([])
    }
  }

  const handleDeletePage = async (pageId: string) => {
    if (!canDelete) return

    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      const response = await fetch(`/api/admin/pages/${pageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchPages()
      } else {
        alert('Failed to delete page')
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Error deleting page')
    }
  }

  const handleBulkDelete = async () => {
    if (!canDelete) return

    if (!confirm(`Are you sure you want to delete ${selectedPages.length} pages?`)) return

    try {
      // Implement bulk delete
      console.log('Deleting pages:', selectedPages)
      setSelectedPages([])
      await fetchPages()
    } catch (error) {
      console.error('Error bulk deleting pages:', error)
      alert('Error deleting pages')
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pages</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage static pages and content sections
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          {selectedPages.length > 0 && canDelete && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete ({selectedPages.length})
            </button>
          )}
          {canCreate && (
            <Link
              href="/admin/pages/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              New Page
            </Link>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search pages..."
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
          </div>
        </div>
      </div>

      {/* Pages List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedPages.length === filteredPages.length && filteredPages.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredPages.length} page{filteredPages.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page.id)}
                    onChange={(e) => handlePageSelect(page.id, e.target.checked)}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {page.title}
                        </h3>
                        {page.isHomepage && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            <GlobeAltIcon className="w-3 h-3 mr-1" />
                            Homepage
                          </span>
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(page.status)}`}>
                          {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        /{page.slug}
                      </p>

                      {page.excerpt && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                          {page.excerpt}
                        </p>
                      )}

                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <UserIcon className="w-4 h-4 mr-1" />
                          {page.author.name}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="w-4 h-4 mr-1" />
                          {new Date(page.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <EyeIcon className="w-4 h-4 mr-1" />
                          {page.viewCount.toLocaleString()} views
                        </div>
                        {page.publishedAt && (
                          <div className="flex items-center">
                            <GlobeAltIcon className="w-4 h-4 mr-1" />
                            Published {new Date(page.publishedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>
                      {canDelete && (
                        <button
                          onClick={() => handleDeletePage(page.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {filteredPages.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No pages found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first page'}
          </p>
        </div>
      )}
    </div>
  )
}