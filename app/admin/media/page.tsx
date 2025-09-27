'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  LinkIcon,
  CalendarIcon,
  UserIcon,
  FolderIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { hasPermission, PERMISSIONS } from '@/lib/rbac'
import AddExternalImageModal from '@/components/ui/AddExternalImageModal'

interface MediaItem {
  id: string
  filename: string
  originalName: string
  url: string
  thumbnailUrl?: string
  mimeType: string
  size: number
  alt?: string
  caption?: string
  folder: string
  uploadedBy: string
  createdAt: string
}

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [folderFilter, setFolderFilter] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showAddModal, setShowAddModal] = useState(false)
  const { data: session } = useSession()

  // Check permissions
  const canCreate = hasPermission(session?.user as any, PERMISSIONS.MEDIA_UPLOAD)
  const canDelete = hasPermission(session?.user as any, PERMISSIONS.MEDIA_DELETE)

  useEffect(() => {
    fetchMediaItems()
  }, [])

  const fetchMediaItems = async () => {
    try {
      const response = await fetch('/api/admin/media')
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data)
      } else {
        setMediaItems([])
      }
    } catch (error) {
      console.error('Failed to fetch media items:', error)
      setMediaItems([])
    } finally {
      setLoading(false)
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return PhotoIcon
    }
    return PhotoIcon // Default icon
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch =
      item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.alt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.caption?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFolder = folderFilter === 'all' || item.folder === folderFilter

    return matchesSearch && matchesFolder
  })

  const folders = Array.from(new Set(mediaItems.map(item => item.folder)))

  const handleItemSelect = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!canDelete) return

    if (!confirm('Are you sure you want to delete this media item?')) return

    try {
      const response = await fetch(`/api/admin/media/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchMediaItems()
      } else {
        alert('Failed to delete media item')
      }
    } catch (error) {
      console.error('Error deleting media item:', error)
      alert('Error deleting media item')
    }
  }

  const handleBulkDelete = async () => {
    if (!canDelete) return

    if (!confirm(`Are you sure you want to delete ${selectedItems.length} media items?`)) return

    try {
      // Implement bulk delete
      console.log('Deleting media items:', selectedItems)
      setSelectedItems([])
      await fetchMediaItems()
    } catch (error) {
      console.error('Error bulk deleting media items:', error)
      alert('Error deleting media items')
    }
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('URL copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy URL:', error)
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="h-24 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Media Library</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage external images and media files
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-[#fddd5d] text-[#ff2031]' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM9 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM9 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2zM15 4a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1V4zM15 10a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 01-1 1h-2a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-[#fddd5d] text-[#ff2031]' : 'text-gray-400 hover:text-gray-500'}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 000 2h14a1 1 0 100-2H3zM3 8a1 1 0 000 2h14a1 1 0 100-2H3zM3 12a1 1 0 100 2h14a1 1 0 100-2H3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          {selectedItems.length > 0 && canDelete && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="w-4 h-4 mr-2" />
              Delete ({selectedItems.length})
            </button>
          )}
          {canCreate && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff2031] hover:bg-[#e01e2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2031]"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add External Image
            </button>
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
                placeholder="Search media files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff2031] focus:border-[#ff2031]"
              />
            </div>
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#ff2031] focus:border-[#ff2031]"
            >
              <option value="all">All Folders</option>
              {folders.map(folder => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Media Items */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="h-4 w-4 text-[#ff2031] focus:ring-[#ff2031] border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select All
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredItems.map((item, index) => {
                const Icon = getFileIcon(item.mimeType)
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden ${
                      selectedItems.includes(item.id)
                        ? 'border-[#ff2031]'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#fddd5d]'
                    }`}
                    onClick={() => handleItemSelect(item.id, !selectedItems.includes(item.id))}
                  >
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      {item.mimeType.startsWith('image/') ? (
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.alt || item.originalName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(item.url)
                          }}
                          className="p-2 bg-white rounded-full text-gray-700 hover:text-gray-900 mr-2"
                        >
                          <LinkIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(item.url, '_blank')
                          }}
                          className="p-2 bg-white rounded-full text-gray-700 hover:text-gray-900"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                        {item.originalName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(item.size)}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredItems.map((item, index) => {
              const Icon = getFileIcon(item.mimeType)
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                        className="h-4 w-4 text-[#ff2031] focus:ring-[#ff2031] border-gray-300 rounded"
                      />
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        {item.mimeType.startsWith('image/') ? (
                          <img
                            src={item.thumbnailUrl || item.url}
                            alt={item.alt || item.originalName}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <Icon className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.originalName}
                          </h3>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{formatFileSize(item.size)}</span>
                            <span>{item.mimeType}</span>
                            <div className="flex items-center">
                              <FolderIcon className="w-3 h-3 mr-1" />
                              {item.folder}
                            </div>
                            <div className="flex items-center">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => copyToClipboard(item.url)}
                            className="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            title="Copy URL"
                          >
                            <LinkIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(item.url, '_blank')}
                            className="p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200"
                            title="View"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                              title="Delete"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No media items found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || folderFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Add your first external image to get started'}
          </p>
        </div>
      )}

      {/* Add External Image Modal */}
      <AddExternalImageModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          fetchMediaItems()
          setShowAddModal(false)
        }}
      />
    </div>
  )
}
