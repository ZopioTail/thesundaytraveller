'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  GlobeAltIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  EyeIcon,
  LinkIcon,
  HashtagIcon
} from '@heroicons/react/24/outline'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface SEOData {
  title: string
  slug: string
  metaDescription: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  canonicalUrl: string
  structuredData: any
  focusKeyword: string
  readabilityScore: number
  seoScore: number
}

interface SEOAnalysis {
  title: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  description: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  keywords: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  url: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  images: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  overall: {
    score: number
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
    issues: string[]
    suggestions: string[]
  }
}

interface SEOOptimizerProps {
  content: string
  seoData: SEOData
  onChange: (data: SEOData) => void
  className?: string
}

export default function SEOOptimizer({
  content,
  seoData,
  onChange,
  className = ''
}: SEOOptimizerProps) {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced' | 'analysis'>('basic')

  const analyzeSEO = useCallback(() => {
    setIsAnalyzing(true)

    // Simulate SEO analysis
    setTimeout(() => {
      const titleScore = analyzeTitle(seoData.title)
      const titleIssues = titleScore < 80 ? ['Title is too short or too long'] : []
      const titleSuggestions = titleScore < 80 ? ['Optimize title length (50-60 characters)'] : []

      // Description analysis
      const descScore = analyzeDescription(seoData.metaDescription)
      const descIssues = descScore < 80 ? ['Meta description is too short or too long'] : []
      const descSuggestions = descScore < 80 ? ['Write compelling meta description (150-160 characters)'] : []

      // Keywords analysis
      const keywordScore = analyzeKeywords(seoData.keywords, content)
      const keywordIssues = keywordScore < 80 ? ['Keywords not well optimized'] : []
      const keywordSuggestions = keywordScore < 80 ? ['Include focus keyword in title and description'] : []

      // URL analysis
      const urlScore = analyzeURL(seoData.slug)
      const urlIssues = urlScore < 80 ? ['URL structure could be improved'] : []
      const urlSuggestions = urlScore < 80 ? ['Use SEO-friendly URL structure'] : []

      // Images analysis
      const imageScore = analyzeImages(content)
      const imageIssues = imageScore < 80 ? ['Missing alt text or image optimization'] : []
      const imageSuggestions = imageScore < 80 ? ['Add alt text to all images'] : []

      // Overall score
      const overallScore = Math.round((titleScore + descScore + keywordScore + urlScore + imageScore) / 5)
      const grade = overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B' : overallScore >= 70 ? 'C' : overallScore >= 60 ? 'D' : 'F'

      const newAnalysis: SEOAnalysis = {
        title: { score: titleScore, issues: titleIssues, suggestions: titleSuggestions },
        description: { score: descScore, issues: descIssues, suggestions: descSuggestions },
        keywords: { score: keywordScore, issues: keywordIssues, suggestions: keywordSuggestions },
        url: { score: urlScore, issues: urlIssues, suggestions: urlSuggestions },
        images: { score: imageScore, issues: imageIssues, suggestions: imageSuggestions },
        overall: {
          score: overallScore,
          grade,
          issues: [...titleIssues, ...descIssues, ...keywordIssues, ...urlIssues, ...imageIssues],
          suggestions: [...titleSuggestions, ...descSuggestions, ...keywordSuggestions, ...urlSuggestions, ...imageSuggestions]
        }
      }

      setAnalysis(newAnalysis)
      setIsAnalyzing(false)
    }, 1000)
  }, [content, seoData])

  // Analyze SEO when content or SEO data changes
  useEffect(() => {
    analyzeSEO()
  }, [analyzeSEO])

  const analyzeTitle = (title: string): number => {
    if (!title) return 0
    const length = title.length
    if (length >= 50 && length <= 60) return 100
    if (length >= 40 && length <= 70) return 80
    if (length >= 30 && length <= 80) return 60
    return 30
  }

  const analyzeDescription = (description: string): number => {
    if (!description) return 0
    const length = description.length
    if (length >= 150 && length <= 160) return 100
    if (length >= 120 && length <= 180) return 80
    if (length >= 100 && length <= 200) return 60
    return 30
  }

  const analyzeKeywords = (keywords: string[], content: string): number => {
    if (!keywords.length) return 0
    const contentLower = content.toLowerCase()
    const foundKeywords = keywords.filter(keyword =>
      contentLower.includes(keyword.toLowerCase())
    )
    return Math.round((foundKeywords.length / keywords.length) * 100)
  }

  const analyzeURL = (slug: string): number => {
    if (!slug) return 0
    if (slug.length <= 60 && !slug.includes('_') && slug.includes('-')) return 100
    if (slug.length <= 80 && slug.includes('-')) return 80
    return 60
  }

  const analyzeImages = (content: string): number => {
    const imgRegex = /<img[^>]+alt="[^"]*"[^>]*>/g
    const imagesWithAlt = content.match(imgRegex)
    const totalImages = content.match(/<img[^>]*>/g) || []

    if (totalImages.length === 0) return 100 // No images is fine
    if (imagesWithAlt && imagesWithAlt.length === totalImages.length) return 100
    if (imagesWithAlt && imagesWithAlt.length > 0) return 60
    return 20
  }

  const handleInputChange = (field: keyof SEOData, value: any) => {
    onChange({
      ...seoData,
      [field]: value
    })
  }

  const handleKeywordAdd = (keyword: string) => {
    if (keyword.trim() && !seoData.keywords.includes(keyword.trim())) {
      handleInputChange('keywords', [...seoData.keywords, keyword.trim()])
    }
  }

  const handleKeywordRemove = (index: number) => {
    const newKeywords = seoData.keywords.filter((_, i) => i !== index)
    handleInputChange('keywords', newKeywords)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

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

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <GlobeAltIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              SEO Optimizer
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Optimize your content for search engines
            </p>
          </div>
        </div>

        <Button
          onClick={analyzeSEO}
          disabled={isAnalyzing}
          variant="outline"
          size="sm"
        >
          <ArrowPathIcon className={cn('h-4 w-4 mr-2', isAnalyzing && 'animate-spin')} />
          {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
        </Button>
      </div>

      {/* SEO Score Overview */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              SEO Score
            </h3>
            <div className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              getScoreBgColor(analysis.overall.score)
            )}>
              <span className={getScoreColor(analysis.overall.score)}>
                {analysis.overall.grade} ({analysis.overall.score}/100)
              </span>
            </div>
          </div>

          {/* Score Bars */}
          <div className="space-y-3">
            {[
              { label: 'Title', score: analysis.title.score },
              { label: 'Description', score: analysis.description.score },
              { label: 'Keywords', score: analysis.keywords.score },
              { label: 'URL', score: analysis.url.score },
              { label: 'Images', score: analysis.images.score }
            ].map((item) => (
              <div key={item.label} className="flex items-center space-x-3">
                <span className="w-20 text-sm text-gray-600 dark:text-gray-400">
                  {item.label}
                </span>
                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={cn(
                      'h-2 rounded-full transition-all duration-500',
                      item.score >= 80 ? 'bg-green-500' :
                      item.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    )}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className={cn('w-12 text-sm font-medium', getScoreColor(item.score))}>
                  {item.score}
                </span>
              </div>
            ))}
          </div>

          {/* Issues and Suggestions */}
          {(analysis.overall.issues.length > 0 || analysis.overall.suggestions.length > 0) && (
            <div className="mt-6 space-y-4">
              {analysis.overall.issues.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2 flex items-center">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    Issues to Fix
                  </h4>
                  <ul className="space-y-1">
                    {analysis.overall.issues.map((issue, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.overall.suggestions.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center">
                    <InformationCircleIcon className="h-4 w-4 mr-1" />
                    Suggestions
                  </h4>
                  <ul className="space-y-1">
                    {analysis.overall.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'basic', label: 'Basic SEO', icon: DocumentTextIcon },
              { id: 'social', label: 'Social Media', icon: ChartBarIcon },
              { id: 'advanced', label: 'Advanced', icon: GlobeAltIcon },
              { id: 'analysis', label: 'Analysis', icon: EyeIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic SEO Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter SEO title..."
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {seoData.title.length}/60 characters (recommended: 50-60)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL Slug
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">/</span>
                    <input
                      type="text"
                      value={seoData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="url-slug"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInputChange('slug', generateSlug(seoData.title))}
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta Description
                </label>
                <textarea
                  value={seoData.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter meta description..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {seoData.metaDescription.length}/160 characters (recommended: 150-160)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Focus Keywords
                </label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add keyword..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleKeywordAdd(e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (input.value.trim()) {
                        handleKeywordAdd(input.value)
                        input.value = ''
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>

                {seoData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {seoData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        <HashtagIcon className="h-3 w-3 mr-1" />
                        {keyword}
                        <button
                          onClick={() => handleKeywordRemove(index)}
                          className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Media Tab */}
          {activeTab === 'social' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Open Graph Title
                  </label>
                  <input
                    type="text"
                    value={seoData.ogTitle}
                    onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Open Graph title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    value={seoData.twitterTitle}
                    onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Twitter title..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Open Graph Description
                </label>
                <textarea
                  value={seoData.ogDescription}
                  onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Open Graph description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Twitter Description
                </label>
                <textarea
                  value={seoData.twitterDescription}
                  onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Twitter description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Open Graph Image URL
                  </label>
                  <input
                    type="url"
                    value={seoData.ogImage}
                    onChange={(e) => handleInputChange('ogImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter Image URL
                  </label>
                  <input
                    type="url"
                    value={seoData.twitterImage}
                    onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={seoData.canonicalUrl}
                  onChange={(e) => handleInputChange('canonicalUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com/canonical-url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Structured Data (JSON-LD)
                </label>
                <textarea
                  value={JSON.stringify(seoData.structuredData, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value)
                      handleInputChange('structuredData', parsed)
                    } catch (error) {
                      // Invalid JSON, don't update
                    }
                  }}
                  rows={10}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder="Enter JSON-LD structured data..."
                />
              </div>
            </div>
          )}

          {/* Analysis Tab */}
          {activeTab === 'analysis' && analysis && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: 'Title Optimization', score: analysis.title.score, details: analysis.title },
                  { label: 'Meta Description', score: analysis.description.score, details: analysis.description },
                  { label: 'Keyword Usage', score: analysis.keywords.score, details: analysis.keywords },
                  { label: 'URL Structure', score: analysis.url.score, details: analysis.url },
                  { label: 'Image SEO', score: analysis.images.score, details: analysis.images }
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.label}
                      </span>
                      <span className={cn('text-sm font-bold', getScoreColor(item.score))}>
                        {item.score}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      {item.details.issues.length > 0 && (
                        <div>
                          <p className="text-xs text-red-600 dark:text-red-400 font-medium">Issues:</p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400">
                            {item.details.issues.map((issue, idx) => (
                              <li key={idx}>• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {item.details.suggestions.length > 0 && (
                        <div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Suggestions:</p>
                          <ul className="text-xs text-gray-600 dark:text-gray-400">
                            {item.details.suggestions.map((suggestion, idx) => (
                              <li key={idx}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}