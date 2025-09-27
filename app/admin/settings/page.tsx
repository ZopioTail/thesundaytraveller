'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import {
  CogIcon,
  GlobeAltIcon,
  BellIcon,
  ShieldCheckIcon,
  PhotoIcon,
  DocumentTextIcon,
  UserIcon,
  CheckIcon,
} from '@heroicons/react/24/outline'
import { hasPermission, PERMISSIONS } from '@/lib/rbac'

interface Setting {
  id: string
  key: string
  value: any
  description: string
  category: string
  isPublic: boolean
}

interface SettingsGroup {
  id: string
  name: string
  description: string
  icon: any
  settings: Setting[]
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const { data: session } = useSession()

  // Check permissions
  const canUpdate = hasPermission(session?.user as any, PERMISSIONS.SETTINGS_UPDATE)

  const fetchSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        // Initialize with default settings
        initializeDefaultSettings()
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      initializeDefaultSettings()
    } finally {
      setLoading(false)
    }
  }, [])

 // Initialize settings on component mount
 useEffect(() => {
   fetchSettings()
 }, [fetchSettings])

 const initializeDefaultSettings = () => {
    const defaultSettings: SettingsGroup[] = [
      {
        id: 'general',
        name: 'General',
        description: 'Basic website configuration',
        icon: CogIcon,
        settings: [
          {
            id: 'site_title',
            key: 'siteTitle',
            value: 'The Sunday Traveller',
            description: 'Website title',
            category: 'general',
            isPublic: true,
          },
          {
            id: 'site_description',
            key: 'siteDescription',
            value: 'A travel blog sharing adventures and experiences from around the world.',
            description: 'Website description',
            category: 'general',
            isPublic: true,
          },
          {
            id: 'site_url',
            key: 'siteUrl',
            value: 'https://thesundaytraveller.com',
            description: 'Website URL',
            category: 'general',
            isPublic: true,
          },
          {
            id: 'admin_email',
            key: 'adminEmail',
            value: 'admin@thesundaytraveller.com',
            description: 'Admin email address',
            category: 'general',
            isPublic: false,
          },
        ],
      },
      {
        id: 'seo',
        name: 'SEO & Social',
        description: 'Search engine optimization and social media settings',
        icon: GlobeAltIcon,
        settings: [
          {
            id: 'meta_keywords',
            key: 'metaKeywords',
            value: 'travel, adventure, blog, photography, destinations',
            description: 'Default meta keywords',
            category: 'seo',
            isPublic: true,
          },
          {
            id: 'og_image',
            key: 'ogImage',
            value: '/images/optimized/hero-main.jpg',
            description: 'Default Open Graph image',
            category: 'seo',
            isPublic: true,
          },
          {
            id: 'twitter_handle',
            key: 'twitterHandle',
            value: '@thesundaytraveller',
            description: 'Twitter handle',
            category: 'seo',
            isPublic: true,
          },
          {
            id: 'facebook_page',
            key: 'facebookPage',
            value: 'https://facebook.com/thesundaytraveller',
            description: 'Facebook page URL',
            category: 'seo',
            isPublic: true,
          },
        ],
      },
      {
        id: 'content',
        name: 'Content',
        description: 'Content and publishing settings',
        icon: DocumentTextIcon,
        settings: [
          {
            id: 'posts_per_page',
            key: 'postsPerPage',
            value: 10,
            description: 'Number of posts per page',
            category: 'content',
            isPublic: true,
          },
          {
            id: 'excerpt_length',
            key: 'excerptLength',
            value: 150,
            description: 'Excerpt length in words',
            category: 'content',
            isPublic: true,
          },
          {
            id: 'auto_generate_excerpts',
            key: 'autoGenerateExcerpts',
            value: true,
            description: 'Auto-generate excerpts from content',
            category: 'content',
            isPublic: false,
          },
          {
            id: 'enable_comments',
            key: 'enableComments',
            value: true,
            description: 'Enable comments on posts',
            category: 'content',
            isPublic: true,
          },
        ],
      },
      {
        id: 'notifications',
        name: 'Notifications',
        description: 'Notification and alert settings',
        icon: BellIcon,
        settings: [
          {
            id: 'email_notifications',
            key: 'emailNotifications',
            value: true,
            description: 'Enable email notifications',
            category: 'notifications',
            isPublic: false,
          },
          {
            id: 'new_comment_notifications',
            key: 'newCommentNotifications',
            value: true,
            description: 'Notify on new comments',
            category: 'notifications',
            isPublic: false,
          },
          {
            id: 'new_user_notifications',
            key: 'newUserNotifications',
            value: true,
            description: 'Notify on new user registrations',
            category: 'notifications',
            isPublic: false,
          },
        ],
      },
    ]
    setSettings(defaultSettings)
  }

  const handleSettingChange = (groupId: string, settingId: string, value: any) => {
    setSettings(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          settings: group.settings.map(setting => {
            if (setting.id === settingId) {
              return { ...setting, value }
            }
            return setting
          })
        }
      }
      return group
    }))
  }

  const handleSave = async () => {
    if (!canUpdate) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: settings.flatMap(group => group.settings) }),
      })

      if (response.ok) {
        alert('Settings saved successfully!')
      } else {
        alert('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const renderSettingInput = (setting: Setting) => {
    switch (typeof setting.value) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={setting.value}
            onChange={(e) => handleSettingChange(setting.category, setting.id, e.target.checked)}
            className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.category, setting.id, parseInt(e.target.value))}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff2031] focus:border-[#ff2031] dark:bg-gray-700 dark:text-white"
          />
        )
      default:
        return (
          <input
            type={setting.key.includes('email') ? 'email' : setting.key.includes('url') ? 'url' : 'text'}
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.category, setting.id, e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
          />
        )
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Configure your website settings and preferences
          </p>
        </div>
        {canUpdate && (
          <div className="mt-4 sm:mt-0">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff2031] hover:bg-[#e01e2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff2031] disabled:opacity-50"
            >
              <CheckIcon className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <nav className="p-4">
              <ul className="space-y-2">
                {settings.map((group) => {
                  const Icon = group.icon
                  return (
                    <li key={group.id}>
                      <button
                        onClick={() => setActiveTab(group.id)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                          activeTab === group.id
                            ? 'bg-[#fddd5d] text-[#ff2031]'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {group.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {settings.map((group) => {
            if (group.id !== activeTab) return null

            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 shadow rounded-lg"
              >
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <group.icon className="w-6 h-6 text-[#ff2031] mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {group.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="space-y-6">
                    {group.settings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {setting.description}
                          </label>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Key: {setting.key}
                            {setting.isPublic && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                Public
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="ml-4 w-64">
                          {renderSettingInput(setting)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}