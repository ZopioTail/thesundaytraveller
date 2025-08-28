'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  CloudArrowUpIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TrashIcon,
  EyeIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline'

interface MediaFile {
  id: string
  filename: string
  originalName: string
  url: string
  thumbnailUrl?: string
  mimeType: string
  size: number
  folder: string
  uploadedAt: string
  alt?: string
  caption?: string
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [folderFilter, setFolderFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMediaFiles([
        {
          id: '1',
          filename: 'hero-image-1.jpg',
          originalName: 'Beautiful Mountain Landscape.jpg',
          url: '/assets/images/gallery/hero-image-1.jpg',
          thumbnailUrl: '/assets/images/gallery/hero-image-1.jpg',
          mimeType: 'image/jpeg',
          size: 2048576,
          folder: 'gallery',
          uploadedAt: '2025-08-28T10:00:00Z',
          alt: 'Beautiful mountain landscape at sunset',
          caption: 'Captured during my trek in the Himalayas'
        },
        {
          id: '2',
          filename: 'profession-img-1.jpg',
          originalName: 'Military Training.jpg',
          url: '/assets/images/blog/profession-img-1.jpg',
          thumbnailUrl: '/assets/images/blog/profession-img-1.jpg',
          mimeType: 'image/jpeg',
          size: 1536000,
          folder: 'blog',
          uploadedAt: '2025-08-27T15:30:00Z',
          alt: 'Military training exercise',
          caption: 'From my days in the armed forces'
        },
        {
          id: '3',
          filename: 'travel-video-1.mp4',
          originalName: 'Portugal Travel Vlog.mp4',
          url: '/assets/videos/travel-video-1.mp4',
          mimeType: 'video/mp4',
          size: 52428800,
          folder: 'videos',
          uploadedAt: '2025-08-26T09:15:00Z',
          caption: 'My recent trip to Lisbon, Portugal'
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = (files: FileList) => {
    setUploading(true)
    // Simulate file upload
    setTimeout(() => {
      setUploading(false)
      // Add uploaded files to the list
      console.log('Files uploaded:', files)
    }, 2000)
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return PhotoIcon
    if (mimeType.startsWith('video/')) return VideoCameraIcon
    return DocumentIcon
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = folderFilter === 'all' || file.folder === folderFilter
    const matchesType = typeFilter === 'all' || file.mimeType.startsWith(typeFilter)
    
    return matchesSearch && matchesFolder && matchesType
  })

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    // Show toast notification
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
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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
            Upload and manage your images, videos, and documents
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 mb-6 transition-colors duration-200 ${
          dragActive
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                Drop files here or click to upload
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, GIF, MP4, PDF up to 10MB
            </p>
          </div>
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
            </div>
          </div>
        )}
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
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <select
              value={folderFilter}
              onChange={(e) => setFolderFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Folders</option>
              <option value="blog">Blog</option>
              <option value="news">News</option>
              <option value="destinations">Destinations</option>
              <option value="gallery">Gallery</option>
              <option value="videos">Videos</option>
              <option value="documents">Documents</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="application">Documents</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredFiles.map((file, index) => {
          const FileIcon = getFileIcon(file.mimeType)
          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden group"
            >
              <div className="aspect-square relative">
                {file.mimeType.startsWith('image/') ? (
                  <img
                    src={file.thumbnailUrl || file.url}
                    alt={file.alt || file.originalName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                    <FileIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <ClipboardDocumentIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors duration-200">
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.originalName}
                </h3>
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{formatFileSize(file.size)}</span>
                  <span className="capitalize">{file.folder}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No media files found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery || folderFilter !== 'all' || typeFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Upload your first file to get started'}
          </p>
        </div>
      )}
    </div>
  )
}
