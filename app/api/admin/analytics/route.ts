import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { getDocuments } from '@/lib/firestore'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.ANALYTICS_VIEW)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch recent analytics data
    const analytics = await getDocuments('analytics', {
      orderBy: 'timestamp',
      orderDirection: 'desc',
      limit: 1000
    })

    // Process analytics data to get insights
    const topPages = new Map()
    const topReferrers = new Map()
    const deviceBreakdown = { desktop: 0, mobile: 0, tablet: 0 }
    const geographicData = new Map()

    analytics.forEach((entry: any) => {
      // Count page views
      const page = entry.pageUrl || 'Unknown'
      const current = topPages.get(page) || { page, views: 0, uniqueViews: 0 }
      current.views++
      if (!current.uniqueViewsSet) current.uniqueViewsSet = new Set()
      current.uniqueViewsSet.add(entry.ipAddress || entry.sessionId)
      current.uniqueViews = current.uniqueViewsSet.size
      topPages.set(page, current)

      // Count referrers
      const referrer = entry.referrer || 'direct'
      const cleanReferrer = referrer.includes('google') ? 'google' :
                          referrer.includes('facebook') ? 'facebook' :
                          referrer.includes('twitter') ? 'twitter' :
                          referrer.includes('instagram') ? 'instagram' : 'direct'
      const currentRef = topReferrers.get(cleanReferrer) || { source: cleanReferrer, sessions: 0 }
      currentRef.sessions++
      topReferrers.set(cleanReferrer, currentRef)

      // Device breakdown
      const device = entry.deviceType || 'desktop'
      if (deviceBreakdown.hasOwnProperty(device)) {
        deviceBreakdown[device as keyof typeof deviceBreakdown]++
      }

      // Geographic data
      const country = entry.country || 'Unknown'
      const currentGeo = geographicData.get(country) || { country, sessions: 0 }
      currentGeo.sessions++
      geographicData.set(country, currentGeo)
    })

    // Convert maps to arrays and calculate percentages
    const totalSessions = analytics.length
    const topPagesArray = Array.from(topPages.values())
      .sort((a, b) => b.views - a.views)
      .slice(0, 10)

    const topReferrersArray = Array.from(topReferrers.values())
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10)

    // Calculate device percentages
    Object.keys(deviceBreakdown).forEach(device => {
      const key = device as keyof typeof deviceBreakdown
      deviceBreakdown[key] = totalSessions > 0 ? deviceBreakdown[key] / totalSessions : 0
    })

    const geographicArray = Array.from(geographicData.values())
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10)

    return NextResponse.json({
      topPages: topPagesArray,
      topReferrers: topReferrersArray,
      deviceBreakdown,
      geographicData: geographicArray
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}