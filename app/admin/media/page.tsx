'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PhotoGallery from '@/components/ui/PhotoGallery'

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

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentFolder, setCurrentFolder] = useState('gallery')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  useEffect(() => {
    fetchMediaFiles()
  }, [currentFolder])

  const fetchMediaFiles = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/media?folder=${currentFolder}`)
      if (response.ok) {
        const data = await response.json()
        setMediaFiles(data.media || [])
      }
    } catch (error) {
      console.error('Error fetching media files:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (files: FileList) => {
    const formData = new FormData()
    Array.from(files).forEach(file => {
      formData.append('file', file)
    })
    formData.append('folder', currentFolder)

    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        fetchMediaFiles() // Refresh the list
        setSelectedIds([]) // Clear selection
      } else {
        const error = await response.json()
        alert(`Upload failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchMediaFiles() // Refresh the list
        setSelectedIds(prev => prev.filter(selectedId => selectedId !== id))
      } else {
        const error = await response.json()
        alert(`Delete failed: ${error.error}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Delete failed')
    }
  }

  const handleEdit = (media: MediaFile) => {
    // Open edit modal or navigate to edit page
    console.log('Edit media:', media)
    // For now, just show an alert
    alert(`Edit functionality for ${media.originalName} - Coming soon!`)
  }

  const handleSelect = (media: MediaFile) => {
    setSelectedIds(prev => {
      if (prev.includes(media.id)) {
        return prev.filter(id => id !== media.id)
      } else {
        return [...prev, media.id]
      }
    })
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.length} files?`)) return

    try {
      const deletePromises = selectedIds.map(id =>
        fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
      )

      const results = await Promise.all(deletePromises)
      const failed = results.filter(result => !result.ok).length

      if (failed === 0) {
        fetchMediaFiles()
        setSelectedIds([])
        alert('All files deleted successfully')
      } else {
        alert(`${failed} files could not be deleted`)
        fetchMediaFiles()
      }
    } catch (error) {
      console.error('Bulk delete error:', error)
      alert('Bulk delete failed')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Media Gallery
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your images and media files with advanced gallery features
          </p>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                {selectedIds.length} file{selectedIds.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  Clear selection
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                >
                  Delete selected
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Photo Gallery */}
        <PhotoGallery
          mediaFiles={mediaFiles}
          onUpload={handleFileUpload}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSelect={handleSelect}
          selectedIds={selectedIds}
          multiple={true}
          showUpload={true}
          showFolders={true}
          folders={['gallery', 'blog', 'news', 'destinations', 'uploads']}
          currentFolder={currentFolder}
          onFolderChange={setCurrentFolder}
        />
      </div>
    </div>
  )
}
