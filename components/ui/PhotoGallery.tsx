'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  FolderIcon,
  TrashIcon,
  PencilIcon,
  EyeIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  HeartIcon,
  ShareIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface MediaFile {
  id: number
  filename: string
  originalName: string
  mimeType: string
  size: number
  folder: string
  alt: string
  caption: string
  uploadedBy: number
  url: string
  width: number
  height: number
  createdAt: string
  updatedAt: string
}

interface PhotoGalleryProps {
  mediaFiles: MediaFile[]
  onUpload?: (files: FileList) => void
  onDelete?: (id: number) => void
  onEdit?: (media: MediaFile) => void
  onSelect?: (media: MediaFile) => void
  selectedIds?: number[]
  multiple?: boolean
  showUpload?: boolean
  showFolders?: boolean
  folders?: string[]
  currentFolder?: string
  onFolderChange?: (folder: string) => void
  className?: string
}

export default function PhotoGallery({
  mediaFiles,
  onUpload,
  onDelete,
  onEdit,
  onSelect,
  selectedIds = [],
  multiple = false,
  showUpload = true,
  showFolders = true,
  folders = ['gallery', 'blog', 'news', 'destinations'],
  currentFolder = 'gallery',
  onFolderChange,
  className = ''
}: PhotoGalleryProps) {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [favorites, setFavorites] = useState<Set<number>>(new Set())

  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadAreaRef = useRef<HTMLDivElement>(null)

  // Filter media files based on search query
  const filteredFiles = mediaFiles.filter(file =>
    file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.caption.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (files && onUpload) {
      onUpload(files)
    }
  }, [onUpload])

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files)
    }
  }, [handleFileSelect])

  // Handle image click for lightbox
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  // Navigate lightbox
  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => prev > 0 ? prev - 1 : filteredFiles.length - 1)
    } else {
      setCurrentImageIndex(prev => prev < filteredFiles.length - 1 ? prev + 1 : 0)
    }
  }

  // Toggle favorite
  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(id)) {
        newFavorites.delete(id)
      } else {
        newFavorites.add(id)
      }
      return newFavorites
    })
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-l-lg transition-colors',
                viewMode === 'grid'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <PhotoIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-r-lg transition-colors',
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <ArrowsRightLeftIcon className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Upload Area */}
        {showUpload && (
          <div className="flex items-center space-x-4">
            {/* Folder Selection */}
            {showFolders && (
              <select
                value={currentFolder}
                onChange={(e) => onFolderChange?.(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {folders.map(folder => (
                  <option key={folder} value={folder}>
                    {folder.charAt(0).toUpperCase() + folder.slice(1)}
                  </option>
                ))}
              </select>
            )}

            {/* Upload Button */}
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2"
            >
              <CloudArrowUpIcon className="h-4 w-4" />
              <span>Upload</span>
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        )}
      </div>

      {/* Upload Drop Zone */}
      {showUpload && (
        <div
          ref={uploadAreaRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          )}
        >
          <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Drag and drop images here, or click the upload button
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Supports: JPG, PNG, GIF, WebP (max 5MB each)
          </p>
        </div>
      )}

      {/* Gallery Content */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <PhotoIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No images found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search terms' : 'Upload some images to get started'}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className={cn(
            'grid gap-4',
            viewMode === 'grid'
              ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'
              : 'grid-cols-1'
          )}
        >
          <AnimatePresence>
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden',
                  viewMode === 'grid' ? 'aspect-square' : 'flex items-center space-x-4 p-4'
                )}
              >
                {/* Selection Checkbox */}
                {onSelect && (
                  <div className="absolute top-2 left-2 z-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(file.id)}
                      onChange={() => onSelect(file)}
                      className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Image */}
                <div
                  className={cn(
                    'relative cursor-pointer overflow-hidden',
                    viewMode === 'grid' ? 'w-full h-full' : 'w-20 h-20 flex-shrink-0'
                  )}
                  onClick={() => handleImageClick(index)}
                >
                  <Image
                    src={file.url}
                    alt={file.alt || file.originalName}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
                      <Button size="sm" variant="secondary">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Favorite indicator */}
                  {favorites.has(file.id) && (
                    <div className="absolute top-2 right-2">
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                </div>

                {/* Image Info */}
                {viewMode === 'list' && (
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {file.originalName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(file.createdAt)}
                    </p>
                    {file.caption && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {file.caption}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col space-y-1">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(file.id)
                    }}
                  >
                    <HeartIcon className="h-3 w-3" />
                  </Button>
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(file)
                      }}
                    >
                      <PencilIcon className="h-3 w-3" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete(file.id)
                      }}
                    >
                      <TrashIcon className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Image Caption (Grid View) */}
                {viewMode === 'grid' && file.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                    <p className="text-white text-sm line-clamp-2">
                      {file.caption}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && filteredFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <div className="relative max-w-4xl max-h-full flex items-center justify-center">
              {/* Close Button */}
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-4 right-4 z-10"
                onClick={() => setLightboxOpen(false)}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>

              {/* Navigation Buttons */}
              {filteredFiles.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute left-4 z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateLightbox('prev')
                    }}
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute right-4 z-10"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateLightbox('next')
                    }}
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Main Image */}
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                src={filteredFiles[currentImageIndex]?.url}
                alt={filteredFiles[currentImageIndex]?.alt || filteredFiles[currentImageIndex]?.originalName}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="text-white">
                  <h3 className="text-lg font-semibold mb-1">
                    {filteredFiles[currentImageIndex]?.originalName}
                  </h3>
                  {filteredFiles[currentImageIndex]?.caption && (
                    <p className="text-sm mb-2">
                      {filteredFiles[currentImageIndex]?.caption}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      {filteredFiles[currentImageIndex] &&
                        formatFileSize(filteredFiles[currentImageIndex].size)
                      }
                    </span>
                    <span>
                      {currentImageIndex + 1} of {filteredFiles.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}