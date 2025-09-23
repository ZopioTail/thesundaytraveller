'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  GlobeAltIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftIcon,
  DocumentIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import SEOOptimizer from '@/components/ui/SEOOptimizer'
import { cn } from '@/lib/utils'

interface SEOSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  defaultTitle: string
  defaultDescription: string
  defaultKeywords: string[]
  ogImage: string
  twitterHandle: string
  twitterSite: string
  googleAnalyticsId: string
  googleSearchConsole: string
  robotsContent: string
  sitemapUrl: string
  structuredDataDefaults: any
}

interface PostSEOData {
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

export default function SEOPage() {
  const [settings, setSettings] = useState<SEOSettings>({
    siteName: 'The Sunday Traveller',
    siteDescription: 'Travel blog by Vineet Kumar - Adventures, destinations, and travel tips',
    siteUrl: 'https://thesundaytraveller.com',
    defaultTitle: 'The Sunday Traveller - Travel Blog',
    defaultDescription: 'Discover amazing destinations, travel tips, and adventure stories from around the world',
    defaultKeywords: ['travel', 'adventure', 'blog', 'destinations', 'travel tips'],
    ogImage: '/images/og-default.jpg',
    twitterHandle: '@thesundaytraveller',
    twitterSite: '@thesundaytraveller',
    googleAnalyticsId: '',
    googleSearchConsole: '',
    robotsContent: 'User-agent: *\nAllow: /\n\nSitemap: https://thesundaytraveller.com/sitemap.xml',
    sitemapUrl: 'https://thesundaytraveller.com/sitemap.xml',
    structuredDataDefaults: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "The Sunday Traveller",
      "url": "https://thesundaytraveller.com"
    }
  })

  const [currentPost, setCurrentPost] = useState<PostSEOData>({
    title: '',
    slug: '',
    metaDescription: '',
    keywords: [],
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    structuredData: {},
    focusKeyword: '',
    readabilityScore: 0,
    seoScore: 0
  })

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'settings' | 'optimizer' | 'sitemap' | 'analytics'>('settings')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      // Load SEO settings from API
      const response = await fetch('/api/admin/seo/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error('Error loading SEO settings:', error)
    }
  }

  const saveSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/seo/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        alert('SEO settings saved successfully!')
      } else {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving SEO settings:', error)
      alert('Error saving settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const generateSitemap = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/seo/sitemap', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        alert(`Sitemap generated successfully! ${data.urls} URLs included.`)
      } else {
        throw new Error('Failed to generate sitemap')
      }
    } catch (error) {
      console.error('Error generating sitemap:', error)
      alert('Error generating sitemap. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const testSEO = async () => {
    try {
      const response = await fetch('/api/admin/seo/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: settings.siteUrl }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`SEO Test Results:\nTitle: ${data.title}\nDescription: ${data.description}\nStatus: ${data.status}`)
      } else {
        throw new Error('Failed to test SEO')
      }
    } catch (error) {
      console.error('Error testing SEO:', error)
      alert('Error testing SEO. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => window.history.back()}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  SEO Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Optimize your site for search engines and social media
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={testSEO}
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Test SEO
              </Button>
              <Button
                onClick={saveSettings}
                disabled={isLoading}
              >
                <DocumentIcon className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {[
                { id: 'settings', label: 'General Settings', icon: CogIcon },
                { id: 'optimizer', label: 'Content Optimizer', icon: DocumentTextIcon },
                { id: 'sitemap', label: 'Sitemap & Robots', icon: GlobeAltIcon },
                { id: 'analytics', label: 'Analytics', icon: ChartBarIcon }
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
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* General Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Site Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://yoursite.com"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Default SEO Settings
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Title
                    </label>
                    <input
                      type="text"
                      value={settings.defaultTitle}
                      onChange={(e) => setSettings(prev => ({ ...prev, defaultTitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Open Graph Image
                    </label>
                    <input
                      type="url"
                      value={settings.ogImage}
                      onChange={(e) => setSettings(prev => ({ ...prev, ogImage: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://yoursite.com/og-image.jpg"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Description
                  </label>
                  <textarea
                    value={settings.defaultDescription}
                    onChange={(e) => setSettings(prev => ({ ...prev, defaultDescription: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Default Keywords
                  </label>
                  <textarea
                    value={settings.defaultKeywords.join(', ')}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      defaultKeywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                    }))}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Social Media
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter Handle
                    </label>
                    <input
                      type="text"
                      value={settings.twitterHandle}
                      onChange={(e) => setSettings(prev => ({ ...prev, twitterHandle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="@yourusername"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Twitter Site
                    </label>
                    <input
                      type="text"
                      value={settings.twitterSite}
                      onChange={(e) => setSettings(prev => ({ ...prev, twitterSite: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="@yoursite"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Optimizer Tab */}
          {activeTab === 'optimizer' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Content SEO Optimizer
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Optimize individual posts and pages for search engines
                </p>

                <SEOOptimizer
                  content={currentPost.title + ' ' + currentPost.metaDescription}
                  seoData={currentPost}
                  onChange={setCurrentPost}
                />
              </div>
            </div>
          )}

          {/* Sitemap & Robots Tab */}
          {activeTab === 'sitemap' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Sitemap & Robots.txt
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sitemap URL
                    </label>
                    <input
                      type="url"
                      value={settings.sitemapUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, sitemapUrl: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Robots.txt Content
                    </label>
                    <textarea
                      value={settings.robotsContent}
                      onChange={(e) => setSettings(prev => ({ ...prev, robotsContent: e.target.value }))}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Generate and update your sitemap automatically
                    </div>
                    <Button
                      onClick={generateSitemap}
                      disabled={isLoading}
                      variant="outline"
                    >
                      {isLoading ? 'Generating...' : 'Generate Sitemap'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Analytics & Search Console
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={settings.googleAnalyticsId}
                      onChange={(e) => setSettings(prev => ({ ...prev, googleAnalyticsId: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="GA-XXXXXXXXX"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your Google Analytics tracking ID
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Google Search Console
                    </label>
                    <input
                      type="url"
                      value={settings.googleSearchConsole}
                      onChange={(e) => setSettings(prev => ({ ...prev, googleSearchConsole: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="https://search.google.com/search-console"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your Google Search Console verification URL
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Structured Data Defaults (JSON-LD)
                    </label>
                    <textarea
                      value={JSON.stringify(settings.structuredDataDefaults, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value)
                          setSettings(prev => ({ ...prev, structuredDataDefaults: parsed }))
                        } catch (error) {
                          // Invalid JSON, don't update
                        }
                      }}
                      rows={10}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}