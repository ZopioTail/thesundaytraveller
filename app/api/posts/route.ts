import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPosts } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const category = searchParams.get('category')

    let posts

    if (category && category !== 'all') {
      // Filter by category if specified
      posts = await getPublishedPosts(limit, offset)
      posts = posts.filter((post: any) => post.category?.name === category)
    } else {
      posts = await getPublishedPosts(limit, offset)
    }

    // Transform posts to match the expected format
    const transformedPosts = posts.map((post: any) => ({
      id: post.id || '',
      title: post.title || '',
      excerpt: post.excerpt || '',
      image: post.featuredImage || '/images/placeholder.jpg',
      category: 'Uncategorized', // Will be updated when categories are implemented
      readTime: post.readingTime || 5,
      createdAt: post.publishedAt || post.createdAt,
      tags: [], // Will be updated when tags are implemented
      featured: post.isFeatured || false,
      author: 'Vineet Kumar', // Default author for now
      slug: post.slug || '',
      views: post.viewCount || 0,
      likes: post.likeCount || 0,
      comments: post.commentCount || 0,
      difficulty: post.difficulty || 'Beginner',
      location: post.location || 'Unknown'
    }))

    return NextResponse.json(transformedPosts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      [
        {
          id: 1,
          title: 'What Adventure Sports Taught This Soldier About Life',
          excerpt: 'The crisp salute, the well-creased uniform, the structured life of the armed forces – these have been my constants for years. But beyond the discipline and duty, there\'s another side to my story that involves adrenaline, risk, and the raw beauty of pushing human limits.',
          image: '/images/20230811_131626_HDR.jpg',
          category: 'Adventure',
          readTime: 8,
          createdAt: new Date('2025-08-28').toISOString(),
          tags: ['Military', 'Adventure Sports', 'Life Lessons', 'Leadership', 'Resilience'],
          featured: true,
          author: 'Vineet Kumar',
          slug: 'what-adventure-sports-taught-this-soldier-about-life',
          views: 2847,
          likes: 156,
          comments: 23,
          difficulty: 'Intermediate',
          location: 'Himalayas, India'
        },
        {
          id: 2,
          title: 'Life Beyond the Uniform: Curtains, Coffee & Calm',
          excerpt: 'They say a uniform defines you. It speaks of duty, discipline, and perhaps a certain seriousness that comes with the responsibility of serving your nation. But what happens when you step out of that uniform? What defines you then?',
          image: '/images/20230816_105822_HDR.jpg',
          category: 'Culture',
          readTime: 6,
          createdAt: new Date('2025-08-26').toISOString(),
          tags: ['Lifestyle', 'Personal', 'Home', 'Balance', 'Mindfulness'],
          featured: true,
          author: 'Vineet Kumar',
          slug: 'life-beyond-the-uniform-curtains-coffee-calm',
          views: 1923,
          likes: 89,
          comments: 15,
          difficulty: 'Beginner',
          location: 'Home Base, India'
        }
      ],
      { status: 500 }
    )
  }
}