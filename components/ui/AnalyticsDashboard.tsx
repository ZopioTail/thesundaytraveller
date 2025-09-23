'use client'

import React, { useState, useEffect } from 'react'
import Card from './Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'
import Badge from './Badge'
import { Button } from './Button'
import { Input } from './Input'
import { analytics, AnalyticsData, AnalyticsFilters } from '@/lib/analytics'

interface AnalyticsDashboardProps {
  className?: string
}

export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<AnalyticsFilters['dateRange']>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  })
  const [selectedMetric, setSelectedMetric] = useState('overview')

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      // In a real implementation, this would fetch from Google Analytics API
      // For now, we'll use mock data
      const mockData: AnalyticsData = {
        totalVisitors: 15420,
        totalPageViews: 45680,
        averageSessionDuration: 180, // seconds
        bounceRate: 0.32,
        topPages: [
          { page: '/blog', views: 12500, uniqueViews: 8900 },
          { page: '/destinations', views: 8900, uniqueViews: 6700 },
          { page: '/gallery', views: 5600, uniqueViews: 4200 },
          { page: '/about', views: 3400, uniqueViews: 2800 },
          { page: '/contact', views: 2100, uniqueViews: 1800 }
        ],
        topReferrers: [
          { source: 'google', sessions: 8900 },
          { source: 'facebook', sessions: 3400 },
          { source: 'twitter', sessions: 2100 },
          { source: 'instagram', sessions: 1200 },
          { source: 'direct', sessions: 820 }
        ],
        deviceBreakdown: {
          desktop: 0.65,
          mobile: 0.30,
          tablet: 0.05
        },
        geographicData: [
          { country: 'United States', sessions: 4500 },
          { country: 'United Kingdom', sessions: 2100 },
          { country: 'Canada', sessions: 1800 },
          { country: 'Australia', sessions: 1200 },
          { country: 'Germany', sessions: 900 }
        ],
        conversionData: {
          newsletterSignups: 340,
          contactForms: 89,
          blogPostReads: 12500
        }
      }

      setAnalyticsData(mockData)
    } catch (err) {
      setError('Failed to fetch analytics data')
      console.error('Analytics fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const formatPercentage = (num: number) => {
    return `${(num * 100).toFixed(1)}%`
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading analytics...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className={className}>
        <div className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={fetchAnalyticsData} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  if (!analyticsData) return null

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Date Range Selector */}
      <Card title="Analytics Period" subtitle="Select the date range for analytics data">
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Input
              type="date"
              value={dateRange.start.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                start: new Date(e.target.value)
              }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Input
              type="date"
              value={dateRange.end.toISOString().split('T')[0]}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                end: new Date(e.target.value)
              }))}
            />
          </div>
          <Button onClick={fetchAnalyticsData}>
            Refresh Data
          </Button>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Visitors</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.totalVisitors)}</p>
              </div>
              <Badge>+12.5%</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Page Views</p>
                <p className="text-2xl font-bold">{formatNumber(analyticsData.totalPageViews)}</p>
              </div>
              <Badge>+8.2%</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Session</p>
                <p className="text-2xl font-bold">{formatDuration(analyticsData.averageSessionDuration)}</p>
              </div>
              <Badge>+5.1%</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-2xl font-bold">{formatPercentage(analyticsData.bounceRate)}</p>
              </div>
              <Badge variant="error">-2.3%</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={selectedMetric} onValueChange={setSelectedMetric}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Device Breakdown">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Desktop</span>
                  <span className="font-medium">{formatPercentage(analyticsData.deviceBreakdown.desktop)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile</span>
                  <span className="font-medium">{formatPercentage(analyticsData.deviceBreakdown.mobile)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tablet</span>
                  <span className="font-medium">{formatPercentage(analyticsData.deviceBreakdown.tablet)}</span>
                </div>
              </div>
            </Card>

            <Card title="Top Countries">
              <div className="space-y-3">
                {analyticsData.geographicData.slice(0, 5).map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.country}</span>
                    <span className="font-medium">{formatNumber(item.sessions)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card title="Top Traffic Sources">
            <div className="space-y-3">
              {analyticsData.topReferrers.map((referrer, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="capitalize">{referrer.source}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(referrer.sessions / analyticsData.topReferrers[0].sessions) * 100}%`
                        }}
                      />
                    </div>
                    <span className="font-medium w-16 text-right">{formatNumber(referrer.sessions)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card title="Top Performing Pages">
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="font-medium">{page.page}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(page.uniqueViews)} unique views
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatNumber(page.views)}</p>
                    <p className="text-sm text-muted-foreground">total views</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="conversions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="p-6 text-center">
                <p className="text-2xl font-bold text-green-600">
                  {formatNumber(analyticsData.conversionData.newsletterSignups)}
                </p>
                <p className="text-sm text-muted-foreground">Newsletter Signups</p>
              </div>
            </Card>

            <Card>
              <div className="p-6 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {formatNumber(analyticsData.conversionData.contactForms)}
                </p>
                <p className="text-sm text-muted-foreground">Contact Forms</p>
              </div>
            </Card>

            <Card>
              <div className="p-6 text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {formatNumber(analyticsData.conversionData.blogPostReads)}
                </p>
                <p className="text-sm text-muted-foreground">Blog Post Reads</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}