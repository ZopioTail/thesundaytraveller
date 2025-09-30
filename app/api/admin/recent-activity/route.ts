import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts, getNews, getDestinations, getMediaFiles } from '@/lib/db'

// Helper function to safely extract properties with defaults
function getProperty(obj: any, property: string, defaultValue: string = ''): string {
  return obj && obj[property] ? obj[property] : defaultValue
}

export async function GET(request: NextRequest) {
  try {
    // Fetch recent posts
    const recentPosts = await getPublishedPosts(2, 0)

    // Fetch recent news
    const recentNews = await getNews(2, 0)

    // Fetch recent destinations
    const recentDestinations = await getDestinations(2)

    // Fetch recent media
    const recentMedia = await getMediaFiles(2, 0)

    // Combine and sort all activities
    const allActivities = [
      ...recentPosts.map(p => ({
        id: p.id || '',
        type: 'post' as const,
        title: getProperty(p, 'title', 'Untitled Post'),
        action: getProperty(p, 'status') === 'published' ? 'published' : 'created',
        timestamp: formatTimeAgo(p.updatedAt),
        user: 'System'
      })),
      ...recentNews.map(n => ({
        id: n.id || '',
        type: 'news' as const,
        title: getProperty(n, 'title', 'Untitled News'),
        action: getProperty(n, 'status') === 'published' ? 'published' : 'created',
        timestamp: formatTimeAgo(n.updatedAt),
        user: 'System'
      })),
      ...recentDestinations.map(d => ({
        id: d.id || '',
        type: 'destination' as const,
        title: getProperty(d, 'name', 'Untitled Destination'),
        action: getProperty(d, 'status') === 'published' ? 'published' : 'updated',
        timestamp: formatTimeAgo(d.updatedAt),
        user: 'System'
      })),
      ...recentMedia.map(m => ({
        id: m.id || '',
        type: 'media' as const,
        title: getProperty(m, 'originalName') || getProperty(m, 'filename', 'Untitled Media'),
        action: 'uploaded',
        timestamp: formatTimeAgo(m.createdAt),
        user: 'System'
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6)

    return NextResponse.json(allActivities)
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return NextResponse.json(
      [],
      { status: 500 }
    )
  }
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date()
  const activityDate = new Date(date)
  const diffInHours = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${diffInHours} hours ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} days ago`

  return activityDate.toLocaleDateString()
}