import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2'
import * as schema from './schema'
import { eq, desc, asc, and, or, like, sql } from 'drizzle-orm'

// Database connection
const connectionString = process.env.DATABASE_URL || 'mysql://root@localhost:3306/thesundaytraveller'

// Create mysql connection
const connection = mysql.createConnection(connectionString)

// Create drizzle instance
export const db = drizzle(connection, { schema, mode: 'default' })

// Export schema types
export * from './schema'

// Database operations
export async function initializeDatabase() {
  try {
    // Test connection
    const connectionInstance = await connection
    await connectionInstance.execute('SELECT 1')
    console.log('Database connected successfully')
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Posts operations
export async function getPublishedPosts(limit = 10, offset = 0) {
  return await db
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.status, 'published'))
    .orderBy(desc(schema.posts.publishedAt))
    .limit(limit)
    .offset(offset)
}

export async function getPostBySlug(slug: string) {
  const result = await db
    .select({
      // Post fields
      id: schema.posts.id,
      title: schema.posts.title,
      slug: schema.posts.slug,
      excerpt: schema.posts.excerpt,
      content: schema.posts.content,
      featuredImage: schema.posts.featuredImage,
      authorId: schema.posts.authorId,
      status: schema.posts.status,
      isFeatured: schema.posts.isFeatured,
      publishedAt: schema.posts.publishedAt,
      createdAt: schema.posts.createdAt,
      updatedAt: schema.posts.updatedAt,
      seoTitle: schema.posts.seoTitle,
      seoDescription: schema.posts.seoDescription,
      seoKeywords: schema.posts.seoKeywords,
      viewCount: schema.posts.viewCount,
      likeCount: schema.posts.likeCount,
      commentCount: schema.posts.commentCount,
      readingTime: schema.posts.readingTime,
      difficulty: schema.posts.difficulty,
      location: schema.posts.location,
      // Author fields
      author: {
        id: schema.users.id,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        email: schema.users.email,
        avatar: schema.users.avatar,
        username: schema.users.username
      }
    })
    .from(schema.posts)
    .leftJoin(schema.users, schema.eq(schema.posts.authorId, schema.users.id))
    .where(schema.eq(schema.posts.slug, slug))
    .limit(1)

  const post = result[0]
  if (!post) return null

  // Get the first category for this post
  const categoryResult = await db
    .select({
      id: schema.categories.id,
      name: schema.categories.name,
      slug: schema.categories.slug,
      color: schema.categories.color,
      description: schema.categories.description
    })
    .from(schema.postsToCategories)
    .leftJoin(schema.categories, schema.eq(schema.postsToCategories.categoryId, schema.categories.id))
    .where(schema.eq(schema.postsToCategories.postId, post.id))
    .limit(1)

  return {
    ...post,
    category: categoryResult[0] || null
  }
}

export async function getPostsByCategory(categorySlug: string, limit = 10) {
  const result = await db
    .select({
      posts: schema.posts,
      categories: schema.categories,
    })
    .from(schema.posts)
    .innerJoin(schema.postsToCategories, schema.eq(schema.posts.id, schema.postsToCategories.postId))
    .innerJoin(schema.categories, schema.eq(schema.postsToCategories.categoryId, schema.categories.id))
    .where(schema.and(
      schema.eq(schema.categories.slug, categorySlug),
      schema.eq(schema.posts.status, 'published')
    ))
    .orderBy(schema.desc(schema.posts.publishedAt))
    .limit(limit)

  return result.map(row => ({ ...row.posts, category: row.categories }))
}

// News operations
export async function getNews(limit = 10, offset = 0) {
  return await db
    .select()
    .from(schema.news)
    .where(schema.eq(schema.news.status, 'published'))
    .orderBy(schema.desc(schema.news.publishedAt))
    .limit(limit)
    .offset(offset)
}

// Destinations operations
export async function getDestinations(limit = 20) {
  return await db
    .select()
    .from(schema.destinations)
    .where(schema.eq(schema.destinations.status, 'published'))
    .orderBy(schema.desc(schema.destinations.publishedAt))
    .limit(limit)
}

// Media operations
export async function getMediaFiles(limit = 50, offset = 0, folder?: string) {
  if (folder) {
    return await db
      .select()
      .from(schema.media)
      .where(schema.eq(schema.media.folder, folder))
      .orderBy(schema.desc(schema.media.createdAt))
      .limit(limit)
      .offset(offset)
  } else {
    return await db
      .select()
      .from(schema.media)
      .orderBy(schema.desc(schema.media.createdAt))
      .limit(limit)
      .offset(offset)
  }
}

// CRUD Operations
export async function createPost(data: schema.NewPost) {
  return await db.insert(schema.posts).values(data)
}

export async function updatePost(id: number, data: Partial<schema.NewPost>) {
  return await db
    .update(schema.posts)
    .set({ ...data, updatedAt: new Date() })
    .where(schema.eq(schema.posts.id, id))
}

export async function deletePost(id: number) {
  return await db
    .delete(schema.posts)
    .where(schema.eq(schema.posts.id, id))
}

export async function createNews(data: schema.NewNews) {
  return await db.insert(schema.news).values(data)
}

export async function updateNews(id: number, data: Partial<schema.NewNews>) {
  return await db
    .update(schema.news)
    .set(data)
    .where(schema.eq(schema.news.id, id))
}

export async function createDestination(data: schema.NewDestination) {
  return await db.insert(schema.destinations).values(data)
}

export async function updateDestination(id: number, data: Partial<schema.NewDestination>) {
  return await db
    .update(schema.destinations)
    .set(data)
    .where(schema.eq(schema.destinations.id, id))
}

export async function uploadMedia(data: schema.NewMedia) {
  return await db.insert(schema.media).values(data)
}

// Analytics
export async function trackPageView(data: schema.NewAnalytic) {
  return await db.insert(schema.analytics).values(data)
}

export async function getStats() {
  const [postStats] = await db
    .select({
      count: schema.sql<number>`count(*)`,
    })
    .from(schema.posts)

  const [newsStats] = await db
    .select({
      count: schema.sql<number>`count(*)`,
    })
    .from(schema.news)

  const [destinationStats] = await db
    .select({
      count: schema.sql<number>`count(*)`,
    })
    .from(schema.destinations)

  const [mediaStats] = await db
    .select({
      count: schema.sql<number>`count(*)`,
    })
    .from(schema.media)

  const [viewStats] = await db
    .select({
      totalViews: schema.sql<number>`sum(${schema.posts.viewCount})`,
    })
    .from(schema.posts)

  return {
    posts: postStats.count,
    news: newsStats.count,
    destinations: destinationStats.count,
    media: mediaStats.count,
    views: viewStats.totalViews || 0,
    visitors: 10000 // This would come from analytics table
  }
}

// Search functionality
export async function searchContent(query: string, type?: 'posts' | 'news' | 'destinations') {
  const results: any = {}

  if (!type || type === 'posts') {
    const posts = await db
      .select()
      .from(schema.posts)
      .where(
        or(
          like(schema.posts.title, `%${query}%`),
          like(schema.posts.excerpt, `%${query}%`),
          like(schema.posts.content, `%${query}%`)
        )
      )
      .limit(20)
    results.posts = posts
  }

  if (!type || type === 'news') {
    const news = await db
      .select()
      .from(schema.news)
      .where(
        or(
          like(schema.news.title, `%${query}%`),
          like(schema.news.excerpt, `%${query}%`),
          like(schema.news.content, `%${query}%`)
        )
      )
      .limit(20)
    results.news = news
  }

  if (!type || type === 'destinations') {
    const destinations = await db
      .select()
      .from(schema.destinations)
      .where(
        or(
          like(schema.destinations.name, `%${query}%`),
          like(schema.destinations.description, `%${query}%`),
          like(schema.destinations.country, `%${query}%`)
        )
      )
      .limit(20)
    results.destinations = destinations
  }

  return results
}

// Advanced search with multiple filters and full-text search
export async function searchPostsAdvanced(filters: {
  query?: string
  categoryId?: string
  tagIds?: string[]
  status?: string
  authorId?: string
  dateFrom?: Date
  dateTo?: Date
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'relevance'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}) {
  const conditions = []

  // Simple text search using LIKE for MySQL
  if (filters.query) {
    const searchQuery = filters.query.trim()

    // Create a simple LIKE-based search condition for MySQL
    const searchCondition = or(
      like(schema.posts.title, `%${searchQuery}%`),
      like(schema.posts.excerpt, `%${searchQuery}%`),
      like(schema.posts.content, `%${searchQuery}%`)
    )
    conditions.push(searchCondition)
  }

  if (filters.categoryId) {
    conditions.push(sql`EXISTS (
      SELECT 1 FROM ${schema.postsToCategories}
      WHERE ${schema.postsToCategories.postId} = ${schema.posts.id}
      AND ${schema.postsToCategories.categoryId} = ${filters.categoryId}
    )`)
  }

  if (filters.status) {
    conditions.push(eq(schema.posts.status, filters.status))
  }

  if (filters.authorId) {
    conditions.push(eq(schema.posts.authorId, parseInt(filters.authorId)))
  }

  if (filters.dateFrom) {
    conditions.push(sql`${schema.posts.publishedAt} >= ${filters.dateFrom}`)
  }

  if (filters.dateTo) {
    conditions.push(sql`${schema.posts.publishedAt} <= ${filters.dateTo}`)
  }

  // Tag filtering
  if (filters.tagIds && filters.tagIds.length > 0) {
    const tagConditions = filters.tagIds.map(tagId =>
      sql`EXISTS (
        SELECT 1 FROM ${schema.postsToTags}
        WHERE ${schema.postsToTags.postId} = ${schema.posts.id}
        AND ${schema.postsToTags.tagId} = ${tagId}
      )`
    )
    conditions.push(and(...tagConditions))
  }

  const orderByField = {
    createdAt: schema.posts.createdAt,
    updatedAt: schema.posts.updatedAt,
    publishedAt: schema.posts.publishedAt,
    title: schema.posts.title,
    relevance: filters.query ? schema.posts.createdAt : schema.posts.createdAt
  }[filters.sortBy || 'createdAt']

  const orderByDirection = filters.sortOrder === 'asc' ? asc : desc

  const result = await db
    .select({
      id: schema.posts.id,
      title: schema.posts.title,
      slug: schema.posts.slug,
      excerpt: schema.posts.excerpt,
      status: schema.posts.status,
      publishedAt: schema.posts.publishedAt,
      createdAt: schema.posts.createdAt,
      updatedAt: schema.posts.updatedAt,
      authorId: schema.posts.authorId,
      // categoryId is handled through junction table
      featuredImage: schema.posts.featuredImage,
      seoTitle: schema.posts.seoTitle,
      seoDescription: schema.posts.seoDescription,
      viewCount: schema.posts.viewCount,
      author: {
        id: schema.users.id,
        firstName: schema.users.firstName,
        lastName: schema.users.lastName,
        email: schema.users.email,
        avatar: schema.users.avatar
      },
      category: {
        id: schema.categories.id,
        name: schema.categories.name,
        slug: schema.categories.slug,
        color: schema.categories.color
      },
      tags: sql`
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', ${schema.postsToTags.tagId},
              'name', ${schema.tags.name},
              'slug', ${schema.tags.slug},
              'color', ${schema.tags.color}
            )
          ),
          JSON_ARRAY()
        )
      `,
      // Add search relevance score (simplified for MySQL)
      relevanceScore: filters.query ? sql`1` : sql`0`
    })
    .from(schema.posts)
    .leftJoin(schema.users, eq(schema.posts.authorId, schema.users.id))
    // Category join is handled through junction table
    .leftJoin(schema.postsToTags, eq(schema.posts.id, schema.postsToTags.postId))
    .leftJoin(schema.tags, eq(schema.postsToTags.tagId, schema.tags.id))
    .where(and(...conditions))
    .groupBy(
      schema.posts.id,
      schema.users.id,
      schema.categories.id
    )
    .orderBy(
      filters.query && filters.sortBy === 'relevance'
        ? desc(schema.posts.createdAt)
        : orderByDirection(orderByField)
    )
    .limit(filters.limit || 20)
    .offset(filters.offset || 0)

  return result
}

// Get search suggestions/autocomplete
export async function getSearchSuggestions(query: string, limit: number = 10) {
  if (!query || query.length < 2) return []

  const suggestions = await db
    .select({
      type: sql<string>`'post'`,
      id: schema.posts.id,
      title: schema.posts.title,
      slug: schema.posts.slug,
      excerpt: schema.posts.excerpt,
      category: schema.categories.name,
      publishedAt: schema.posts.publishedAt
    })
    .from(schema.posts)
    // Category join is handled through junction table
    .where(
      or(
        like(schema.posts.title, `%${query}%`),
        like(schema.posts.excerpt, `%${query}%`),
        like(schema.categories.name, `%${query}%`)
      )
    )
    .orderBy(desc(schema.posts.publishedAt))
    .limit(limit)

  return suggestions
}

// Advanced analytics for search
export async function getSearchAnalytics(filters: {
  dateFrom?: Date
  dateTo?: Date
  groupBy?: 'day' | 'week' | 'month'
}) {
  const groupByClause = {
    day: sql`DATE(${schema.analytics.timestamp})`,
    week: sql`DATE_SUB(DATE(${schema.analytics.timestamp}), INTERVAL WEEKDAY(${schema.analytics.timestamp}) DAY)`,
    month: sql`DATE_FORMAT(${schema.analytics.timestamp}, '%Y-%m-01')`
  }[filters.groupBy || 'day']

  const result = await db
    .select({
      period: groupByClause,
      totalSearches: sql<number>`COUNT(*)`,
      uniqueUsers: sql<number>`COUNT(DISTINCT ${schema.analytics.userId})`,
      topQueries: sql`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'query', ${schema.analytics.pageUrl},
            'count', 1
          )
        ) FILTER (WHERE ${schema.analytics.pageUrl} IS NOT NULL)
      `
    })
    .from(schema.analytics)
    .where(
      and(
        eq(schema.analytics.pageUrl, '/search'),
        filters.dateFrom ? sql`${schema.analytics.timestamp} >= ${filters.dateFrom}` : undefined,
        filters.dateTo ? sql`${schema.analytics.timestamp} <= ${filters.dateTo}` : undefined
      )
    )
    .groupBy(groupByClause)
    .orderBy(groupByClause)

  return result
}

// Newsletter subscription
export async function subscribeNewsletter(data: schema.NewNewsletterSubscription) {
  return await db.insert(schema.newsletterSubscriptions).values(data)
}

export async function unsubscribeNewsletter(email: string) {
  return await db
    .update(schema.newsletterSubscriptions)
    .set({
      isActive: false,
      unsubscribedAt: new Date()
    })
    .where(schema.eq(schema.newsletterSubscriptions.email, email))
}

// Comments
export async function createComment(data: schema.NewComment) {
  return await db.insert(schema.comments).values(data)
}

export async function getComments(postId?: number, newsId?: number, limit = 50) {
  let whereConditions = [schema.eq(schema.comments.status, 'approved')]

  if (postId) {
    whereConditions.push(schema.eq(schema.comments.postId, postId))
  }

  if (newsId) {
    whereConditions.push(schema.eq(schema.comments.newsId, newsId))
  }

  return await db
    .select()
    .from(schema.comments)
    .where(schema.and(...whereConditions))
    .orderBy(schema.desc(schema.comments.createdAt))
    .limit(limit)
}

// User operations
export async function createUser(data: schema.NewUser) {
  return await db.insert(schema.users).values(data)
}

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(schema.users)
    .where(schema.eq(schema.users.email, email))
    .limit(1)

  return result[0] || null
}

export async function getUserById(id: number) {
  const result = await db
    .select()
    .from(schema.users)
    .where(schema.eq(schema.users.id, id))
    .limit(1)

  return result[0] || null
}

// Categories and tags
export async function getCategories() {
  return await db
    .select()
    .from(schema.categories)
    .where(schema.eq(schema.categories.isActive, true))
    .orderBy(schema.asc(schema.categories.sortOrder))
}

export async function getTags() {
  return await db
    .select()
    .from(schema.tags)
    .orderBy(schema.desc(schema.tags.usageCount))
    .limit(50)
}

// Settings
export async function getSetting(key: string) {
  const result = await db
    .select()
    .from(schema.settings)
    .where(schema.eq(schema.settings.key, key))
    .limit(1)

  return result[0] || null
}

export async function setSetting(key: string, value: any, description?: string) {
  // Try to update first
  const existing = await db
    .select()
    .from(schema.settings)
    .where(schema.eq(schema.settings.key, key))
    .limit(1)

  if (existing.length > 0) {
    return await db
      .update(schema.settings)
      .set({
        value,
        updatedAt: new Date(),
      })
      .where(schema.eq(schema.settings.key, key))
  } else {
    return await db
      .insert(schema.settings)
      .values({
        key,
        value,
        description: description || '',
        isPublic: false,
      })
  }
}




