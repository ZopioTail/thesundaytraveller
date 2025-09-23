'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeftIcon, DocumentIcon, EyeIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import RichTextEditor from '@/components/ui/RichTextEditor'

interface PostFormData {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  status: 'draft' | 'published' | 'scheduled'
  publishedAt: string
  categoryId: string
  tags: string[]
  featuredImage: string
  seoTitle: string
  seoDescription: string
  seoKeywords: string
}

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [formData, setFormData] = useState<PostFormData | null>(null)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`)
      if (response.ok) {
        const post = await response.json()
        setFormData({
          ...post,
          publishedAt: new Date(post.publishedAt).toISOString().slice(0, 16)
        })
      } else {
        throw new Error('Failed to fetch post')
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('Error loading post. Please try again.')
      router.push('/admin/posts')
    }
  }

  const handleInputChange = (field: keyof PostFormData, value: any) => {
    if (!formData) return

    setFormData(prev => ({
      ...prev!,
      [field]: value
    }))

    // Auto-generate slug from title
    if (field === 'title' && !formData.slug) {
      setFormData(prev => ({
        ...prev!,
        slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/posts')
      } else {
        throw new Error('Failed to update post')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Error updating post. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/posts')
      } else {
        throw new Error('Failed to delete post')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Error deleting post. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  if (previewMode) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(false)}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Editor
            </Button>
            <Button
              onClick={() => setPreviewMode(false)}
            >
              Edit Post
            </Button>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            {formData.featuredImage && (
              <img
                src={formData.featuredImage}
                alt={formData.title}
                className="w-full h-64 object-cover"
              />
            )}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {formData.title || 'Untitled Post'}
              </h1>
              {formData.excerpt && (
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {formData.excerpt}
                </p>
              )}
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          </motion.article>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/posts')}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back to Posts
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Edit Post
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(true)}
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !formData.title}
            >
              <DocumentIcon className="h-4 w-4 mr-2" />
              {isLoading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter post title..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="post-slug"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Brief description of the post..."
              />
            </div>

            {/* Featured Image */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Status and Publishing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => handleInputChange('categoryId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select Category</option>
                  <option value="1">Travel</option>
                  <option value="2">Adventure</option>
                  <option value="3">Culture</option>
                  <option value="4">Food</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Published At
                </label>
                <input
                  type="datetime-local"
                  value={formData.publishedAt}
                  onChange={(e) => handleInputChange('publishedAt', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </motion.div>

          {/* Content Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Content
            </h2>
            <RichTextEditor
              content={formData.content}
              onChange={(content) => handleInputChange('content', content)}
              placeholder="Start writing your post content..."
              className="min-h-[500px]"
            />
          </motion.div>

          {/* SEO Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              SEO Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => handleInputChange('seoTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SEO Keywords
                </label>
                <input
                  type="text"
                  value={formData.seoKeywords}
                  onChange={(e) => handleInputChange('seoKeywords', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SEO Description
              </label>
              <textarea
                value={formData.seoDescription}
                onChange={(e) => handleInputChange('seoDescription', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="SEO optimized description..."
              />
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  )
}