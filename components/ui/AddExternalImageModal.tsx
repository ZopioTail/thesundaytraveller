'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, PhotoIcon, LinkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface AddExternalImageModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AddExternalImageModal({ isOpen, onClose, onSuccess }: AddExternalImageModalProps) {
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [caption, setCaption] = useState('')
  const [folder, setFolder] = useState('external')
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim()) {
      alert('Please enter an image URL')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url.trim(),
          alt: alt.trim(),
          caption: caption.trim(),
          folder,
        }),
      })

      if (response.ok) {
        onSuccess()
        handleClose()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding external image:', error)
      alert('Error adding external image')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setUrl('')
    setAlt('')
    setCaption('')
    setFolder('external')
    setPreviewUrl('')
    onClose()
  }

  const handleUrlChange = (value: string) => {
    setUrl(value)
    // Basic URL validation for preview
    try {
      new URL(value)
      setPreviewUrl(value)
    } catch {
      setPreviewUrl('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Add External Image
                </h3>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image URL *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2031] focus:border-[#ff2031] dark:bg-gray-700 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                  </div>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Preview
                    </label>
                    <div className="border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-gray-50 dark:bg-gray-700">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded"
                        onError={() => setPreviewUrl('')}
                      />
                    </div>
                  </div>
                )}

                {/* Alt Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={alt}
                    onChange={(e) => setAlt(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Describe the image for accessibility"
                  />
                </div>

                {/* Caption */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Image caption (optional)"
                  />
                </div>

                {/* Folder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Folder
                  </label>
                  <select
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2031] focus:border-[#ff2031] dark:bg-gray-700 dark:text-white"
                  >
                    <option value="external">External Images</option>
                    <option value="blog">Blog Images</option>
                    <option value="gallery">Gallery</option>
                    <option value="hero">Hero Images</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff2031] hover:bg-[#e01e2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2031] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add Image'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}