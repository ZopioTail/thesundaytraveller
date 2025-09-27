'use client'

import { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  UsersIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'
import { analytics } from '@/lib/analytics'

// Newsletter Types
export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained'
  subscriptionDate: Date
  unsubscribeDate?: Date
  source?: string
  tags?: string[]
  customFields?: Record<string, any>
  preferences?: {
    frequency?: 'daily' | 'weekly' | 'monthly'
    categories?: string[]
    format?: 'html' | 'text'
  }
  metadata?: Record<string, any>
}

export interface NewsletterCampaign {
  id: string
  name: string
  subject: string
  content: string
  htmlContent?: string
  textContent?: string
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused' | 'cancelled'
  scheduledDate?: Date
  sentDate?: Date
  senderName: string
  senderEmail: string
  recipientCount: number
  openedCount: number
  clickedCount: number
  unsubscribedCount: number
  bouncedCount: number
  complainedCount: number
  tags?: string[]
  template?: string
  metadata?: Record<string, any>
}

export interface NewsletterTemplate {
  id: string
  name: string
  description?: string
  thumbnail?: string
  htmlContent: string
  textContent?: string
  variables?: string[]
  category?: string
  isDefault?: boolean
  createdAt: Date
  updatedAt: Date
}

interface NewsletterProps {
  subscribers?: NewsletterSubscriber[]
  campaigns?: NewsletterCampaign[]
  templates?: NewsletterTemplate[]
  onSubscribe?: (data: { email: string; name?: string; preferences?: any }) => Promise<void>
  onUnsubscribe?: (email: string) => Promise<void>
  onCreateCampaign?: (campaign: Partial<NewsletterCampaign>) => Promise<void>
  onSendCampaign?: (campaignId: string) => Promise<void>
  onPauseCampaign?: (campaignId: string) => Promise<void>
  onCancelCampaign?: (campaignId: string) => Promise<void>
  onDeleteCampaign?: (campaignId: string) => Promise<void>
  onCreateTemplate?: (template: Partial<NewsletterTemplate>) => Promise<void>
  onUpdateTemplate?: (templateId: string, template: Partial<NewsletterTemplate>) => Promise<void>
  onDeleteTemplate?: (templateId: string) => Promise<void>
  className?: string
  variant?: 'subscription' | 'management' | 'campaigns' | 'analytics'
}

// Subscription Form Component
interface SubscriptionFormProps {
  onSubmit: (data: { email: string; name?: string; preferences?: any }) => Promise<void>
  className?: string
  showNameField?: boolean
  showPreferences?: boolean
  submitLabel?: string
  placeholder?: string
}

function SubscriptionForm({
  onSubmit,
  className = '',
  showNameField = false,
  showPreferences = false,
  submitLabel = 'Subscribe',
  placeholder = 'Enter your email address'
}: SubscriptionFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    preferences: {
      frequency: 'weekly' as const,
      categories: [] as string[],
      format: 'html' as 'html' | 'text'
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        email: formData.email.trim(),
        name: formData.name.trim() || undefined,
        preferences: showPreferences ? formData.preferences : undefined
      })

      // Track newsletter signup
      analytics.trackNewsletterSignup('website_form')

      setIsSuccess(true)
      setFormData({ email: '', name: '', preferences: formData.preferences })
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error('Subscription failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={cn(
          'text-center p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg',
          className
        )}
      >
        <CheckCircleIcon className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
          Welcome aboard! 🎉
        </h3>
        <p className="text-green-700 dark:text-green-300">
          Thank you for subscribing to our newsletter. Check your email for a confirmation link.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div className="flex flex-col sm:flex-row gap-3">
        {showNameField && (
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Your name"
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        )}
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder={placeholder}
          required
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2 whitespace-nowrap"
        >
          {isSubmitting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <span>{submitLabel}</span>
        </button>
      </div>

      {showPreferences && (
        <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              How often would you like to receive emails?
            </label>
            <select
              value={formData.preferences.frequency}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                preferences: { ...prev.preferences, frequency: e.target.value as any }
              }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email format preference
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="html"
                  checked={formData.preferences.format === 'html'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, format: e.target.value as 'html' | 'text' }
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">HTML (with images and styling)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value="text"
                  checked={formData.preferences.format === 'text'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, format: e.target.value as 'html' | 'text' }
                  }))}
                  className="mr-2"
                />
                <span className="text-sm">Plain text</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </form>
  )
}

// Subscriber Management Component
interface SubscriberManagementProps {
  subscribers: NewsletterSubscriber[]
  onStatusChange?: (subscriberId: string, status: NewsletterSubscriber['status']) => Promise<void>
  onDelete?: (subscriberId: string) => Promise<void>
  onExport?: () => Promise<void>
  className?: string
}

function SubscriberManagement({
  subscribers,
  onStatusChange,
  onDelete,
  onExport,
  className = ''
}: SubscriberManagementProps) {
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed' | 'bounced'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesFilter = filter === 'all' || subscriber.status === filter
    const matchesSearch = !searchTerm ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.name?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getStatusColor = (status: NewsletterSubscriber['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'unsubscribed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'bounced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'complained':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    }
  }

  const getStatusIcon = (status: NewsletterSubscriber['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'unsubscribed':
        return <UserIcon className="w-4 h-4" />
      case 'bounced':
        return <ExclamationCircleIcon className="w-4 h-4" />
      case 'complained':
        return <ExclamationCircleIcon className="w-4 h-4" />
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {subscribers.filter(s => s.status === 'active').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Active Subscribers</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {subscribers.filter(s => s.status === 'unsubscribed').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Unsubscribed</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {subscribers.filter(s => s.status === 'bounced').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Bounced</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {subscribers.filter(s => s.status === 'complained').length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Complained</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'unsubscribed', label: 'Unsubscribed' },
            { key: 'bounced', label: 'Bounced' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={cn(
                'px-3 py-1 text-sm rounded-full transition-colors duration-200',
                filter === key
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          {onExport && (
            <button
              onClick={onExport}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <ArrowDownTrayIcon className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>

      {/* Subscribers List */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subscriber
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subscription Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {subscriber.name || 'Anonymous'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {subscriber.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getStatusColor(subscriber.status)
                    )}>
                      {getStatusIcon(subscriber.status)}
                      <span className="ml-1 capitalize">{subscriber.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {subscriber.subscriptionDate.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {subscriber.source || 'Website'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {onStatusChange && subscriber.status === 'active' && (
                        <button
                          onClick={() => onStatusChange(subscriber.id, 'unsubscribed')}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Unsubscribe"
                        >
                          <UserIcon className="w-4 h-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(subscriber.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Campaign Management Component
interface CampaignManagementProps {
  campaigns: NewsletterCampaign[]
  onCreate: (campaign: Partial<NewsletterCampaign>) => Promise<void>
  onSend: (campaignId: string) => Promise<void>
  onPause: (campaignId: string) => Promise<void>
  onCancel: (campaignId: string) => Promise<void>
  onDelete: (campaignId: string) => Promise<void>
  className?: string
}

function CampaignManagement({
  campaigns,
  onCreate,
  onSend,
  onPause,
  onCancel,
  onDelete,
  className = ''
}: CampaignManagementProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filter, setFilter] = useState<'all' | 'draft' | 'scheduled' | 'sent'>('all')

  const filteredCampaigns = campaigns.filter(campaign =>
    filter === 'all' || campaign.status === filter
  )

  const getStatusColor = (status: NewsletterCampaign['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'sending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'sent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'paused':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }
  }

  const getStatusIcon = (status: NewsletterCampaign['status']) => {
    switch (status) {
      case 'draft':
        return <DocumentTextIcon className="w-4 h-4" />
      case 'scheduled':
        return <ClockIcon className="w-4 h-4" />
      case 'sending':
        return <EnvelopeIcon className="w-4 h-4" />
      case 'sent':
        return <CheckCircleIcon className="w-4 h-4" />
      case 'paused':
        return <ClockIcon className="w-4 h-4" />
      case 'cancelled':
        return <ExclamationCircleIcon className="w-4 h-4" />
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Newsletter Campaigns</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <EnvelopeIcon className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'draft', label: 'Drafts' },
          { key: 'scheduled', label: 'Scheduled' },
          { key: 'sent', label: 'Sent' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={cn(
              'px-3 py-1 text-sm rounded-full transition-colors duration-200',
              filter === key
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Campaigns List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {campaign.name}
                  </h3>
                  <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    getStatusColor(campaign.status)
                  )}>
                    {getStatusIcon(campaign.status)}
                    <span className="ml-1 capitalize">{campaign.status}</span>
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {campaign.subject}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Recipients:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {campaign.recipientCount.toLocaleString()}
                    </span>
                  </div>
                  {campaign.sentDate && (
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Sent:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {campaign.sentDate.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Opened:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {campaign.openedCount} ({((campaign.openedCount / campaign.recipientCount) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Clicked:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">
                      {campaign.clickedCount} ({((campaign.clickedCount / campaign.recipientCount) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {campaign.status === 'draft' && (
                  <button
                    onClick={() => onSend(campaign.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 text-sm"
                  >
                    Send Now
                  </button>
                )}
                {campaign.status === 'scheduled' && (
                  <button
                    onClick={() => onPause(campaign.id)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-200 text-sm"
                  >
                    Pause
                  </button>
                )}
                {campaign.status === 'sending' && (
                  <button
                    onClick={() => onCancel(campaign.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-sm"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => onDelete(campaign.id)}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CampaignCreateModal
            onSubmit={onCreate}
            onClose={() => setShowCreateModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Campaign Create Modal Component
interface CampaignCreateModalProps {
  onSubmit: (campaign: Partial<NewsletterCampaign>) => Promise<void>
  onClose: () => void
}

function CampaignCreateModal({ onSubmit, onClose }: CampaignCreateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    senderName: 'The Sunday Traveller',
    senderEmail: 'newsletter@thesundaytraveller.com',
    scheduledDate: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.subject.trim() || !formData.content.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
        status: 'draft',
        recipientCount: 0,
        openedCount: 0,
        clickedCount: 0,
        unsubscribedCount: 0,
        bouncedCount: 0,
        complainedCount: 0
      })
      onClose()
    } catch (error) {
      console.error('Failed to create campaign:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Create Newsletter Campaign
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Weekly Travel Newsletter #1"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Enter compelling subject line"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sender Name
              </label>
              <input
                type="text"
                value={formData.senderName}
                onChange={(e) => setFormData(prev => ({ ...prev, senderName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sender Email
              </label>
              <input
                type="email"
                value={formData.senderEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, senderEmail: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to send immediately
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your newsletter content here..."
                rows={10}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {isSubmitting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>Create Campaign</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

// Main Newsletter Component
export function Newsletter({
  subscribers = [],
  campaigns = [],
  templates = [],
  onSubscribe,
  onUnsubscribe,
  onCreateCampaign,
  onSendCampaign,
  onPauseCampaign,
  onCancelCampaign,
  onDeleteCampaign,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  className = '',
  variant = 'subscription'
}: NewsletterProps) {
  const [activeTab, setActiveTab] = useState<'subscription' | 'management' | 'campaigns' | 'analytics'>(
    variant === 'subscription' ? 'subscription' : 'management'
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'subscription':
        return onSubscribe ? (
          <SubscriptionForm
            onSubmit={async (data) => {
              try {
                const response = await fetch('/api/newsletter', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                })

                if (!response.ok) {
                  throw new Error('Failed to subscribe')
                }

                const result = await response.json()
                console.log('Newsletter subscription successful:', result)

                // Call the original onSubscribe if provided
                if (onSubscribe) {
                  await onSubscribe(data)
                }
              } catch (error) {
                console.error('Newsletter subscription failed:', error)
                throw error
              }
            }}
            showNameField={true}
            showPreferences={true}
            submitLabel="Subscribe to Newsletter"
            placeholder="Enter your email to get travel updates"
          />
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <EnvelopeIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Newsletter subscription is not available at the moment.</p>
          </div>
        )

      case 'management':
        return (
          <SubscriberManagement
            subscribers={subscribers}
            onStatusChange={async (id, status) => {
              // Handle status change
              console.log('Change status:', id, status)
            }}
            onDelete={async (id) => {
              // Handle delete
              console.log('Delete subscriber:', id)
            }}
            onExport={async () => {
              // Handle export
              console.log('Export subscribers')
            }}
          />
        )

      case 'campaigns':
        return onCreateCampaign ? (
          <CampaignManagement
            campaigns={campaigns}
            onCreate={onCreateCampaign}
            onSend={onSendCampaign || (async () => {})}
            onPause={onPauseCampaign || (async () => {})}
            onCancel={onCancelCampaign || (async () => {})}
            onDelete={onDeleteCampaign || (async () => {})}
          />
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <DocumentTextIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Campaign management is not available.</p>
          </div>
        )

      case 'analytics':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <UsersIcon className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {subscribers.filter(s => s.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {campaigns.filter(c => c.status === 'sent').length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Campaigns Sent</div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <ChartBarIcon className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {campaigns.length > 0
                        ? Math.round(campaigns.reduce((acc, c) => acc + c.openedCount, 0) / campaigns.length)
                        : 0
                      }%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Open Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Campaigns</h3>
              {campaigns.slice(0, 5).map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{campaign.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{campaign.subject}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {campaign.openedCount} opened
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {((campaign.openedCount / campaign.recipientCount) * 100).toFixed(1)}% open rate
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (variant === 'subscription') {
    return (
      <div className={cn('max-w-md mx-auto', className)}>
        <div className="text-center mb-8">
          <EnvelopeIcon className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Stay Updated
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Get the latest travel stories and adventures delivered to your inbox.
          </p>
        </div>
        {renderContent()}
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8">
          {[
            { id: 'subscription', label: 'Subscription', icon: EnvelopeIcon },
            { id: 'management', label: 'Subscribers', icon: UsersIcon },
            { id: 'campaigns', label: 'Campaigns', icon: DocumentTextIcon },
            { id: 'analytics', label: 'Analytics', icon: ChartBarIcon }
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

      {/* Content */}
      {renderContent()}
    </div>
  )
}