'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/Button'
import RichTextEditor from '@/components/ui/RichTextEditor'
import {
  ArrowLeftIcon,
  DocumentIcon,
  GlobeAltIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import { hasPermission, PERMISSIONS } from '@/lib/rbac'

export default function NewPagePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [isHomepage, setIsHomepage] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')

  // Check permissions
  const canCreate = hasPermission(session?.user as any, PERMISSIONS.POST_CREATE)
  const canPublish = hasPermission(session?.user as any, PERMISSIONS.POST_PUBLISH)

  const handleSubmit = async (publish = false) => {
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required')
      return
    }

    setLoading(true)
    try {
      const pageData = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        content,
        excerpt: excerpt.trim() || undefined,
        status: publish ? 'published' : 'draft',
        isHomepage,
        isPublic,
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDescription.trim() || excerpt.trim(),
        publishedAt: publish ? new Date().toISOString() : null,
      }

      const response = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData),
      })

      if (response.ok) {
        const newPage = await response.json()
        router.push(`/admin/pages/${newPage.id}/edit`)
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Error creating page')
    } finally {
      setLoading(false)
    }
  }

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generatedSlug)
    }
  }

  if (!canCreate) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You don&#39;t have permission to create pages.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Create New Page
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create a new static page or content section
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={loading}
            >
              <DocumentIcon className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            {canPublish && (
              <Button
                onClick={() => handleSubmit(true)}
                disabled={loading}
              >
                <GlobeAltIcon className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter page title..."
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="page-slug (auto-generated from title)"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              placeholder="Brief description of the page..."
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your page content..."
              showWordCount={true}
              autoSave={true}
              autoSaveDelay={5000}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Status & Visibility
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="draft"
                      checked={status === 'draft'}
                      onChange={(e) => setStatus(e.target.value as 'draft')}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Draft
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="published"
                      checked={status === 'published'}
                      onChange={(e) => setStatus(e.target.value as 'published')}
                      disabled={!canPublish}
                      className="text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Published
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isHomepage"
                  checked={isHomepage}
                  onChange={(e) => setIsHomepage(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isHomepage" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Set as Homepage
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Public Page
                </label>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              SEO Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SEO Title
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="SEO optimized title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SEO Description
                </label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                  placeholder="SEO description"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}