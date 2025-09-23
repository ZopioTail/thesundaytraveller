'use client'

import React from 'react'
import { AnalyticsDashboard } from '@/components/ui/AnalyticsDashboard'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { analytics } from '@/lib/analytics'

export default function AnalyticsPage() {
  const handleExportReport = () => {
    // In a real implementation, this would generate and download a comprehensive analytics report
    console.log('Exporting analytics report...')
  }

  const handleRefreshData = () => {
    // Force refresh of analytics data
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Comprehensive insights into your website performance and user behavior
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="info">Live Data</Badge>
          <Button variant="outline" onClick={handleRefreshData}>
            Refresh
          </Button>
          <Button onClick={handleExportReport}>
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Real-time Users</p>
                <p className="text-2xl font-bold text-green-600">247</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-blue-600">1,234</p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversion Rate</p>
                <p className="text-2xl font-bold text-purple-600">3.2%</p>
              </div>
              <Badge variant="success">+0.5%</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-orange-600">$12,450</p>
              </div>
              <Badge variant="success">+12%</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Dashboard */}
      <AnalyticsDashboard />

      {/* Additional Analytics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Performance Metrics" subtitle="Key performance indicators">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Page Load Time</span>
              <span className="font-medium">1.2s</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Server Response Time</span>
              <span className="font-medium">245ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Cache Hit Rate</span>
              <span className="font-medium">94.2%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Uptime</span>
              <span className="font-medium text-green-600">99.9%</span>
            </div>
          </div>
        </Card>

        <Card title="User Engagement" subtitle="How users interact with your content">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Average Session Duration</span>
              <span className="font-medium">4m 32s</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Pages per Session</span>
              <span className="font-medium">3.8</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Return Visitor Rate</span>
              <span className="font-medium">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Newsletter Signup Rate</span>
              <span className="font-medium">2.1%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Setup Instructions */}
      <Card title="Analytics Setup" subtitle="Configure your analytics tracking">
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Google Analytics Integration
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
              To enable real-time analytics, add your Google Analytics 4 Measurement ID to your environment variables.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-sm">
                  NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
                </code>
                <Button size="sm" variant="outline">
                  Copy
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">
              Event Tracking
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300">
              Events are automatically tracked for key user interactions including page views, form submissions,
              newsletter signups, and social media shares.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}