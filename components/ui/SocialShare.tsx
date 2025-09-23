'use client'

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShareIcon,
  LinkIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// Social Share Types
export interface SocialPlatform {
  name: string
  icon: ReactNode
  color: string
  bgColor: string
  shareUrl: (url: string, title?: string, description?: string) => string
}

export interface SocialShareProps {
  url: string
  title?: string
  description?: string
  image?: string
  hashtags?: string[]
  platforms?: SocialPlatform[]
  className?: string
  variant?: 'default' | 'compact' | 'floating' | 'inline'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  showLabels?: boolean
  showCount?: boolean
  onShare?: (platform: string) => void
}

// Default Social Platforms
const DEFAULT_PLATFORMS: SocialPlatform[] = [
  {
    name: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    color: 'text-white',
    bgColor: 'bg-blue-600 hover:bg-blue-700',
    shareUrl: (url: string, title?: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  },
  {
    name: 'Twitter',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    color: 'text-white',
    bgColor: 'bg-blue-400 hover:bg-blue-500',
    shareUrl: (url: string, title?: string, description?: string) => {
      const params = new URLSearchParams({
        url: url,
        text: title || description || ''
      })
      return `https://twitter.com/intent/tweet?${params.toString()}`
    }
  },
  {
    name: 'LinkedIn',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    color: 'text-white',
    bgColor: 'bg-blue-700 hover:bg-blue-800',
    shareUrl: (url: string, title?: string, description?: string) => {
      const params = new URLSearchParams({
        url: url,
        title: title || '',
        summary: description || ''
      })
      return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`
    }
  },
  {
    name: 'WhatsApp',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
      </svg>
    ),
    color: 'text-white',
    bgColor: 'bg-green-600 hover:bg-green-700',
    shareUrl: (url: string, title?: string, description?: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title || description} ${url}`)}`
  },
  {
    name: 'Reddit',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .051.5c0 2.658-3.134 4.108-6.668 4.108-3.53 0-6.668-1.45-6.668-4.108 0-.15.018-.296.051-.44a1.77 1.77 0 0 1-1.02-1.596c0-.968.786-1.754 1.754-1.754.476 0 .898.182 1.206.491 1.194-.856 2.85-1.418 4.674-1.488l.8-3.747-2.597.547a1.256 1.256 0 0 1-.156-.748c0-.688.561-1.25 1.25-1.25.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.5.057l2.597-.547.8 3.747c1.824-.07 3.48-.632 4.674-1.488.308.309.73.491 1.207.491z"/>
      </svg>
    ),
    color: 'text-white',
    bgColor: 'bg-orange-600 hover:bg-orange-700',
    shareUrl: (url: string, title?: string) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title || '')}`
  },
  {
    name: 'Email',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-white',
    bgColor: 'bg-gray-600 hover:bg-gray-700',
    shareUrl: (url: string, title?: string, description?: string) =>
      `mailto:?subject=${encodeURIComponent(title || '')}&body=${encodeURIComponent(`${description || ''} ${url}`)}`
  }
]

// Copy to Clipboard Hook
function useCopyToClipboard() {
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return { copied, copy }
}

// Social Share Button Component
interface SocialShareButtonProps {
  platform: SocialPlatform
  url: string
  title?: string
  description?: string
  showLabel?: boolean
  onShare?: (platform: string) => void
  className?: string
}

function SocialShareButton({
  platform,
  url,
  title,
  description,
  showLabel = false,
  onShare,
  className = ''
}: SocialShareButtonProps) {
  const handleClick = () => {
    const shareUrl = platform.shareUrl(url, title, description)
    window.open(shareUrl, '_blank', 'width=600,height=400')
    onShare?.(platform.name)
  }

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
        platform.bgColor,
        platform.color,
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="flex-shrink-0">{platform.icon}</span>
      {showLabel && (
        <span className="hidden sm:inline">{platform.name}</span>
      )}
    </motion.button>
  )
}

// Copy Link Button Component
interface CopyLinkButtonProps {
  url: string
  className?: string
}

function CopyLinkButton({ url, className = '' }: CopyLinkButtonProps) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <motion.button
      onClick={() => copy(url)}
      className={cn(
        'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
        'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        'hover:bg-gray-200 dark:hover:bg-gray-700',
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="copied"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center space-x-2"
          >
            <CheckIcon className="w-5 h-5 text-green-600" />
            <span>Copied!</span>
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="flex items-center space-x-2"
          >
            <DocumentDuplicateIcon className="w-5 h-5" />
            <span>Copy Link</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

// Floating Share Button Component
interface FloatingShareButtonProps {
  url: string
  title?: string
  description?: string
  platforms?: SocialPlatform[]
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  className?: string
}

function FloatingShareButton({
  url,
  title,
  description,
  platforms = DEFAULT_PLATFORMS,
  position = 'bottom-right',
  className = ''
}: FloatingShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  }

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 flex flex-col space-y-2"
          >
            {platforms.map((platform) => (
              <SocialShareButton
                key={platform.name}
                platform={platform}
                url={url}
                title={title}
                description={description}
                className="shadow-lg"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-full shadow-lg',
          'bg-orange-500 hover:bg-orange-600 text-white',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500',
          'transition-all duration-200'
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
            >
              <XMarkIcon className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
            >
              <ShareIcon className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

// Main Social Share Component
export function SocialShare({
  url,
  title,
  description,
  image,
  hashtags = [],
  platforms = DEFAULT_PLATFORMS,
  className = '',
  variant = 'default',
  position = 'bottom-right',
  showLabels = false,
  showCount = false,
  onShare
}: SocialShareProps) {
  const [shareCount, setShareCount] = useState<Record<string, number>>({})

  const handleShare = (platform: string) => {
    setShareCount(prev => ({
      ...prev,
      [platform]: (prev[platform] || 0) + 1
    }))
    onShare?.(platform)
  }

  // Generate share URL with metadata
  const enhancedUrl = useState(() => {
    const urlObj = new URL(url)
    if (title) urlObj.searchParams.set('title', title)
    if (description) urlObj.searchParams.set('description', description)
    if (image) urlObj.searchParams.set('image', image)
    if (hashtags.length > 0) urlObj.searchParams.set('hashtags', hashtags.join(','))
    return urlObj.toString()
  })[0]

  if (variant === 'floating') {
    return (
      <FloatingShareButton
        url={enhancedUrl}
        title={title}
        description={description}
        platforms={platforms}
        position={position}
      />
    )
  }

  const containerClasses = {
    default: 'flex flex-wrap gap-3',
    compact: 'flex flex-wrap gap-2',
    inline: 'inline-flex items-center space-x-2'
  }

  return (
    <div className={cn(containerClasses[variant], className)}>
      {platforms.map((platform) => (
        <div key={platform.name} className="relative">
          <SocialShareButton
            platform={platform}
            url={enhancedUrl}
            title={title}
            description={description}
            showLabel={showLabels}
            onShare={handleShare}
          />
          {showCount && shareCount[platform.name] > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {shareCount[platform.name]}
            </div>
          )}
        </div>
      ))}

      <CopyLinkButton url={enhancedUrl} />
    </div>
  )
}

// Social Share Modal Component
interface SocialShareModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title?: string
  description?: string
  image?: string
  hashtags?: string[]
  platforms?: SocialPlatform[]
  onShare?: (platform: string) => void
}

export function SocialShareModal({
  isOpen,
  onClose,
  url,
  title,
  description,
  image,
  hashtags = [],
  platforms = DEFAULT_PLATFORMS,
  onShare
}: SocialShareModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Share this content
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  {title || 'Share this content'}
                </h3>
                {description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>

              <SocialShare
                url={url}
                title={title}
                description={description}
                image={image}
                hashtags={hashtags}
                platforms={platforms}
                variant="default"
                showLabels={true}
                onShare={onShare}
                className="justify-center"
              />

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <LinkIcon className="w-4 h-4" />
                  <span className="break-all">{url}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Social Share Widget for Blog Posts
interface SocialShareWidgetProps {
  url: string
  title: string
  description?: string
  image?: string
  hashtags?: string[]
  className?: string
  showFloating?: boolean
}

export function SocialShareWidget({
  url,
  title,
  description,
  image,
  hashtags = ['travel', 'adventure', 'blog'],
  className = '',
  showFloating = true
}: SocialShareWidgetProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div className={cn('space-y-4', className)}>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Share this post
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Help others discover this amazing content!
          </p>
        </div>

        <SocialShare
          url={url}
          title={title}
          description={description}
          image={image}
          hashtags={hashtags}
          variant="default"
          showLabels={true}
          className="justify-center"
        />

        <div className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
          >
            More sharing options
          </button>
        </div>
      </div>

      {showFloating && (
        <FloatingShareButton
          url={url}
          title={title}
          description={description}
          position="bottom-right"
        />
      )}

      <SocialShareModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        url={url}
        title={title}
        description={description}
        image={image}
        hashtags={hashtags}
      />
    </>
  )
}