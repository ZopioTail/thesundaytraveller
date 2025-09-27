import { NextRequest, NextResponse } from 'next/server'
import { getStats } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const stats = await getStats()

    return NextResponse.json({
      posts: stats.posts,
      news: stats.news,
      destinations: stats.destinations,
      media: stats.media,
      views: stats.views,
      visitors: stats.visitors,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      {
        posts: 0,
        news: 0,
        destinations: 0,
        media: 0,
        views: 0,
        visitors: 0,
      },
      { status: 500 }
    )
  }
}