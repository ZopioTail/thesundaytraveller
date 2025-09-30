'use client'

import React, { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void
    dataLayer: any[]
  }
}

export interface AnalyticsEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export interface PageViewData {
  page_title?: string
  page_location?: string
  page_path?: string
}

class AnalyticsService {
  private isInitialized = false
  private trackingId: string | null = null

  getIsInitialized(): boolean {
    return this.isInitialized
  }

  initialize(trackingId: string) {
    if (this.isInitialized || typeof window === 'undefined') return

    this.trackingId = trackingId
    this.isInitialized = true

    // Load Google Analytics script
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=' + trackingId
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        send_page_view: false,
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });
    `
    document.head.appendChild(script2)
  }

  trackPageView(pageData?: PageViewData) {
    if (!this.isInitialized || !this.trackingId) return

    const data = {
      page_title: pageData?.page_title || document.title,
      page_location: pageData?.page_location || window.location.href,
      page_path: pageData?.page_path || window.location.pathname,
      ...pageData
    }

    window.gtag('config', this.trackingId, data)
  }

  trackEvent(event: AnalyticsEvent) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', event.action, {
      event_category: event.category,
      event_label: event.label,
      value: event.value
    })
  }

  trackCustomEvent(eventName: string, parameters?: Record<string, any>) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', eventName, parameters)
  }

  trackUserEngagement(engagementTime: number, pageValue?: number) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', 'user_engagement', {
      engagement_time: engagementTime,
      page_value: pageValue
    })
  }

  trackConversion(conversionName: string, value?: number) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', 'conversion', {
      send_to: `${this.trackingId}/${conversionName}`,
      value: value,
      currency: 'USD'
    })
  }

  trackSearch(searchTerm: string, resultsCount?: number) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', 'search', {
      search_term: searchTerm,
      results_count: resultsCount
    })
  }

  trackNewsletterSignup(method: string) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', 'newsletter_signup', {
      method: method
    })
  }

  trackSocialShare(platform: string, contentType: string, contentId?: string) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', 'share', {
      method: platform,
      content_type: contentType,
      content_id: contentId
    })
  }

  trackContactFormSubmission(method: string) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', 'contact_form_submission', {
      method: method
    })
  }

  trackBlogPostRead(postId: string, postTitle: string, readTime?: number) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', 'blog_post_read', {
      post_id: postId,
      post_title: postTitle,
      read_time: readTime
    })
  }

  trackMediaView(mediaType: string, mediaId: string, mediaTitle?: string) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', 'media_view', {
      media_type: mediaType,
      media_id: mediaId,
      media_title: mediaTitle
    })
  }

  trackAdminAction(action: string, resource: string, resourceId?: string) {
    if (!this.isInitialized || !this.trackingId) return

    window.gtag('event', 'admin_action', {
      admin_action: action,
      resource_type: resource,
      resource_id: resourceId
    })
  }
}

// Create singleton instance
export const analytics = new AnalyticsService()

// React hook for page view tracking
export function usePageTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window !== 'undefined' && analytics.getIsInitialized()) {
      const url = pathname + searchParams.toString()
      analytics.trackPageView({
        page_path: url,
        page_location: window.location.href
      })
    }
  }, [pathname, searchParams])
}

// Hook for tracking user engagement
export function useEngagementTracking() {
  useEffect(() => {
    let startTime = Date.now()
    let isActive = true

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false
      } else {
        isActive = true
        startTime = Date.now()
      }
    }

    const handleBeforeUnload = () => {
      if (isActive) {
        const engagementTime = Math.round((Date.now() - startTime) / 1000)
        if (engagementTime > 10) { // Only track if user was engaged for more than 10 seconds
          analytics.trackUserEngagement(engagementTime)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])
}

// Analytics configuration component
export function AnalyticsProvider({
  children,
  trackingId
}: {
  children: React.ReactNode
  trackingId?: string
}) {
  useEffect(() => {
    if (trackingId && !analytics.getIsInitialized()) {
      analytics.initialize(trackingId)
    }
  }, [trackingId])

  return children
}

// Analytics dashboard data types
export interface AnalyticsData {
  totalVisitors: number
  totalPageViews: number
  averageSessionDuration: number
  bounceRate: number
  topPages: Array<{
    page: string
    views: number
    uniqueViews: number
  }>
  topReferrers: Array<{
    source: string
    sessions: number
  }>
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
  }
  geographicData: Array<{
    country: string
    sessions: number
  }>
  conversionData: {
    newsletterSignups: number
    contactForms: number
    blogPostReads: number
  }
}

export interface AnalyticsFilters {
  dateRange: {
    start: Date
    end: Date
  }
  dimensions?: string[]
  metrics?: string[]
}