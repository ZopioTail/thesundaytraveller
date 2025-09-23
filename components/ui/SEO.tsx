'use client'

import { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GlobeAltIcon,
  DocumentTextIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// SEO Types
export interface SEOMetadata {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  structuredData?: Record<string, any>
  robots?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export interface SEOAnalysis {
  score: number
  issues: SEOIssue[]
  recommendations: string[]
  strengths: string[]
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info'
  title: string
  description: string
  field?: string
  suggestion?: string
}

interface SEOProps {
  metadata: SEOMetadata
  onMetadataChange: (metadata: SEOMetadata) => void
  analysis?: SEOAnalysis
  className?: string
  preview?: boolean
}

// SEO Score Component
interface SEOScoreProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function SEOScore({ score, size = 'md', showLabel = true, className = '' }: SEOScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20'
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20'
    return 'bg-red-100 dark:bg-red-900/20'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Improvement'
  }

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl'
  }

  return (
    <div className={cn('flex flex-col items-center space-y-2', className)}>
      <div className={cn(
        'rounded-full flex items-center justify-center font-bold',
        sizeClasses[size],
        getScoreBgColor(score),
        getScoreColor(score)
      )}>
        {score}
      </div>
      {showLabel && (
        <div className={cn('text-sm font-medium', getScoreColor(score))}>
          {getScoreLabel(score)}
        </div>
      )}
    </div>
  )
}

// SEO Issue Component
interface SEOMessageProps {
  issue: SEOIssue
  onFix?: (issue: SEOIssue) => void
  className?: string
}

function SEOMessage({ issue, onFix, className = '' }: SEOMessageProps) {
  const getIcon = () => {
    switch (issue.type) {
      case 'error':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <InformationCircleIcon className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (issue.type) {
      case 'error':
        return 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800'
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-lg border',
        getBgColor(),
        className
      )}
    >
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            {issue.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {issue.description}
          </p>
          {issue.suggestion && (
            <p className="text-sm text-gray-500 dark:text-gray-500 italic">
              💡 {issue.suggestion}
            </p>
          )}
        </div>
        {onFix && (
          <button
            onClick={() => onFix(issue)}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <PencilIcon className="w-4 h-4" />
            <span>Fix</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}

// SEO Preview Component
interface SEOPreviewProps {
  metadata: SEOMetadata
  url: string
  className?: string
}

function SEOPreview({ metadata, url, className = '' }: SEOPreviewProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Google Search Result Preview */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Google Search Result</h3>
        <div className="space-y-1">
          <div className="text-green-600 dark:text-green-400 text-sm truncate">{url}</div>
          <div className="text-blue-600 dark:text-blue-400 text-xl font-medium hover:underline cursor-pointer">
            {metadata.title || 'Page Title'}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
            {metadata.description || 'Page description will appear here...'}
          </div>
        </div>
      </div>

      {/* Social Media Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Facebook Preview */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Facebook Share</h3>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {metadata.ogImage && (
              <img
                src={metadata.ogImage}
                alt="Open Graph preview"
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-3">
              <div className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                {metadata.ogTitle || metadata.title || 'Open Graph Title'}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                {metadata.ogDescription || metadata.description || 'Open Graph description...'}
              </div>
            </div>
          </div>
        </div>

        {/* Twitter Preview */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Twitter Card</h3>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            {metadata.twitterImage && (
              <img
                src={metadata.twitterImage}
                alt="Twitter card preview"
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-3">
              <div className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                {metadata.twitterTitle || metadata.title || 'Twitter Card Title'}
              </div>
              <div className="text-gray-600 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                {metadata.twitterDescription || metadata.description || 'Twitter card description...'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main SEO Component
export function SEO({
  metadata,
  onMetadataChange,
  analysis,
  className = '',
  preview = false
}: SEOProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced' | 'analysis'>('basic')
  const [localMetadata, setLocalMetadata] = useState<SEOMetadata>(metadata)

  useEffect(() => {
    setLocalMetadata(metadata)
  }, [metadata])

  const updateMetadata = (updates: Partial<SEOMetadata>) => {
    const newMetadata = { ...localMetadata, ...updates }
    setLocalMetadata(newMetadata)
    onMetadataChange(newMetadata)
  }

  const handleFixIssue = (issue: SEOIssue) => {
    // Auto-fix common SEO issues
    switch (issue.field) {
      case 'title':
        if (!localMetadata.title || localMetadata.title.length < 30) {
          updateMetadata({ title: 'Optimized Title - The Sunday Traveller' })
        }
        break
      case 'description':
        if (!localMetadata.description || localMetadata.description.length < 120) {
          updateMetadata({
            description: 'Discover amazing travel stories, destinations, and adventures from around the world. Join The Sunday Traveller for inspiring journey experiences.'
          })
        }
        break
      case 'ogImage':
        updateMetadata({
          ogImage: '/images/optimized/hero-main.jpg',
          twitterImage: '/images/optimized/hero-main.jpg'
        })
        break
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with Score */}
      {analysis && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Optimization</h2>
            <p className="text-gray-600 dark:text-gray-400">Optimize your content for search engines</p>
          </div>
          <SEOScore score={analysis.score} size="lg" />
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'basic', label: 'Basic SEO', icon: DocumentTextIcon },
            { id: 'social', label: 'Social Media', icon: GlobeAltIcon },
            { id: 'advanced', label: 'Advanced', icon: ChartBarIcon },
            { id: 'analysis', label: 'Analysis', icon: EyeIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'basic' && (
          <motion.div
            key="basic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={localMetadata.title || ''}
                    onChange={(e) => updateMetadata({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter SEO-optimized title (30-60 characters)"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {localMetadata.title?.length || 0}/60 characters
                    </span>
                    {localMetadata.title && localMetadata.title.length > 60 && (
                      <span className="text-xs text-red-500">Title too long</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description *
                  </label>
                  <textarea
                    value={localMetadata.description || ''}
                    onChange={(e) => updateMetadata({ description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Enter compelling description (120-160 characters)"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500">
                      {localMetadata.description?.length || 0}/160 characters
                    </span>
                    {localMetadata.description && localMetadata.description.length > 160 && (
                      <span className="text-xs text-red-500">Description too long</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={localMetadata.keywords?.join(', ') || ''}
                    onChange={(e) => updateMetadata({
                      keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="travel, adventure, destinations, blog"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Separate keywords with commas
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Canonical URL
                  </label>
                  <input
                    type="url"
                    value={localMetadata.canonical || ''}
                    onChange={(e) => updateMetadata({ canonical: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://thesundaytraveller.com/blog/post-slug"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={localMetadata.author || ''}
                    onChange={(e) => updateMetadata({ author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Vineet Kumar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Robots
                  </label>
                  <select
                    value={localMetadata.robots || 'index,follow'}
                    onChange={(e) => updateMetadata({ robots: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="index,follow">Index & Follow</option>
                    <option value="noindex,nofollow">No Index & No Follow</option>
                    <option value="index,nofollow">Index & No Follow</option>
                    <option value="noindex,follow">No Index & Follow</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'social' && (
          <motion.div
            key="social"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Open Graph (Facebook)</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={localMetadata.ogTitle || ''}
                    onChange={(e) => updateMetadata({ ogTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Title for social media sharing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    OG Description
                  </label>
                  <textarea
                    value={localMetadata.ogDescription || ''}
                    onChange={(e) => updateMetadata({ ogDescription: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Description for social media sharing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    OG Image URL
                  </label>
                  <input
                    type="url"
                    value={localMetadata.ogImage || ''}
                    onChange={(e) => updateMetadata({ ogImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    OG Type
                  </label>
                  <select
                    value={localMetadata.ogType || 'article'}
                    onChange={(e) => updateMetadata({ ogType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="blog">Blog</option>
                    <option value="profile">Profile</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Twitter Cards</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter Card Type
                  </label>
                  <select
                    value={localMetadata.twitterCard || 'summary_large_image'}
                    onChange={(e) => updateMetadata({ twitterCard: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                    <option value="app">App</option>
                    <option value="player">Player</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    value={localMetadata.twitterTitle || ''}
                    onChange={(e) => updateMetadata({ twitterTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Title for Twitter sharing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter Description
                  </label>
                  <textarea
                    value={localMetadata.twitterDescription || ''}
                    onChange={(e) => updateMetadata({ twitterDescription: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Description for Twitter sharing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter Image URL
                  </label>
                  <input
                    type="url"
                    value={localMetadata.twitterImage || ''}
                    onChange={(e) => updateMetadata({ twitterImage: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'advanced' && (
          <motion.div
            key="advanced"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Structured Data</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content Type
                  </label>
                  <select
                    value={localMetadata.structuredData?.['@type'] || 'Article'}
                    onChange={(e) => updateMetadata({
                      structuredData: {
                        ...localMetadata.structuredData,
                        '@type': e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Article">Article</option>
                    <option value="BlogPosting">Blog Posting</option>
                    <option value="NewsArticle">News Article</option>
                    <option value="WebPage">Web Page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Published Date
                  </label>
                  <input
                    type="datetime-local"
                    value={localMetadata.publishedTime ? new Date(localMetadata.publishedTime).toISOString().slice(0, 16) : ''}
                    onChange={(e) => updateMetadata({ publishedTime: new Date(e.target.value).toISOString() })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Modified Date
                  </label>
                  <input
                    type="datetime-local"
                    value={localMetadata.modifiedTime ? new Date(localMetadata.modifiedTime).toISOString().slice(0, 16) : ''}
                    onChange={(e) => updateMetadata({ modifiedTime: new Date(e.target.value).toISOString() })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Additional Tags</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Section/Category
                  </label>
                  <input
                    type="text"
                    value={localMetadata.section || ''}
                    onChange={(e) => updateMetadata({ section: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Travel, Adventure, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={localMetadata.tags?.join(', ') || ''}
                    onChange={(e) => updateMetadata({
                      tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="travel, adventure, photography"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Custom JSON-LD
                  </label>
                  <textarea
                    value={localMetadata.structuredData ? JSON.stringify(localMetadata.structuredData, null, 2) : ''}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        updateMetadata({ structuredData: parsed })
                      } catch (error) {
                        // Invalid JSON, don't update
                      }
                    }}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-xs"
                    placeholder="Paste custom JSON-LD structured data here"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analysis' && analysis && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Analysis Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">SEO Score</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{analysis.score}/100</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Issues Found</div>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{analysis.issues.length}</div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Strengths</div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{analysis.strengths.length}</div>
              </div>
            </div>

            {/* Issues */}
            {analysis.issues.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Issues to Fix</h3>
                {analysis.issues.map((issue, index) => (
                  <SEOMessage
                    key={index}
                    issue={issue}
                    onFix={handleFixIssue}
                  />
                ))}
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recommendations</h3>
                <div className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Strengths</h3>
                <div className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview */}
      {preview && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Preview</h3>
          <SEOPreview
            metadata={localMetadata}
            url="https://thesundaytraveller.com/blog/sample-post"
          />
        </div>
      )}
    </div>
  )
}

// SEO Head Component for Next.js
interface SEOHeadProps {
  metadata: SEOMetadata
}

export function SEOHead({ metadata }: SEOHeadProps) {
  const jsonLd = metadata.structuredData ? JSON.stringify(metadata.structuredData) : null

  return (
    <>
      {/* Basic Meta Tags */}
      {metadata.title && <title>{metadata.title}</title>}
      {metadata.description && <meta name="description" content={metadata.description} />}
      {metadata.keywords && metadata.keywords.length > 0 && (
        <meta name="keywords" content={metadata.keywords.join(', ')} />
      )}
      {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}
      {metadata.robots && <meta name="robots" content={metadata.robots} />}
      {metadata.author && <meta name="author" content={metadata.author} />}

      {/* Open Graph Tags */}
      {metadata.ogTitle && <meta property="og:title" content={metadata.ogTitle} />}
      {metadata.ogDescription && <meta property="og:description" content={metadata.ogDescription} />}
      {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}
      {metadata.ogType && <meta property="og:type" content={metadata.ogType} />}

      {/* Twitter Card Tags */}
      {metadata.twitterCard && <meta name="twitter:card" content={metadata.twitterCard} />}
      {metadata.twitterTitle && <meta name="twitter:title" content={metadata.twitterTitle} />}
      {metadata.twitterDescription && <meta name="twitter:description" content={metadata.twitterDescription} />}
      {metadata.twitterImage && <meta name="twitter:image" content={metadata.twitterImage} />}

      {/* Article Specific Tags */}
      {metadata.publishedTime && <meta property="article:published_time" content={metadata.publishedTime} />}
      {metadata.modifiedTime && <meta property="article:modified_time" content={metadata.modifiedTime} />}
      {metadata.author && <meta property="article:author" content={metadata.author} />}
      {metadata.section && <meta property="article:section" content={metadata.section} />}
      {metadata.tags && metadata.tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}

      {/* Structured Data */}
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}
    </>
  )
}