import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { posts, news, destinations, media, users } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    // Fetch recent posts
    const recentPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.updatedAt))
      .limit(2)

    // Fetch recent news
    const recentNews = await db
      .select()
      .from(news)
      .orderBy(desc(news.updatedAt))
      .limit(2)

    // Fetch recent destinations
    const recentDestinations = await db
      .select()
      .from(destinations)
      .orderBy(desc(destinations.updatedAt))
      .limit(2)

    // Fetch recent media
    const recentMedia = await db
      .select()
      .from(media)
      .orderBy(desc(media.createdAt))
      .limit(2)

    // Combine and sort all activities
    const allActivities = [
      ...recentPosts.map(p => ({
        id: p.id.toString(),
        type: 'post' as const,
        title: p.title,
        action: p.status === 'published' ? 'published' : 'created',
        timestamp: formatTimeAgo(p.updatedAt),
        user: 'System'
      })),
      ...recentNews.map(n => ({
        id: n.id.toString(),
        type: 'news' as const,
        title: n.title,
        action: n.status === 'published' ? 'published' : 'created',
        timestamp: formatTimeAgo(n.updatedAt),
        user: 'System'
      })),
      ...recentDestinations.map(d => ({
        id: d.id.toString(),
        type: 'destination' as const,
        title: d.name,
        action: d.status === 'published' ? 'published' : 'updated',
        timestamp: formatTimeAgo(d.updatedAt),
        user: 'System'
      })),
      ...recentMedia.map(m => ({
        id: m.id.toString(),
        type: 'media' as const,
        title: m.originalName,
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
      [
        {
          id: '1',
          type: 'post',
          title: 'What Adventure Sports Taught This Soldier About Life',
          action: 'published',
          timestamp: '2 hours ago',
          user: 'Rabindra Sahu',
        },
        {
          id: '2',
          type: 'news',
          title: 'New Travel Guidelines for 2025',
          action: 'created',
          timestamp: '4 hours ago',
          user: 'Rabindra Sahu',
        },
        {
          id: '3',
          type: 'destination',
          title: 'Lisbon, Portugal',
          action: 'updated',
          timestamp: '1 day ago',
          user: 'Rabindra Sahu',
        },
        {
          id: '4',
          type: 'media',
          title: 'profession-img-2.jpg',
          action: 'uploaded',
          timestamp: '2 days ago',
          user: 'Rabindra Sahu',
        },
      ],
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