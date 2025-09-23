import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { eq, desc, asc, and, or, ilike, sql } from 'drizzle-orm'

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/thesundaytraveller'

// Create postgres client
const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 60,
})

// Create drizzle instance
export const db = drizzle(client, { schema })

// Export schema types
export * from './schema'

// Database operations
export async function initializeDatabase() {
  try {
    // Test connection
    await client`SELECT 1`
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
    .select()
    .from(schema.posts)
    .where(schema.eq(schema.posts.slug, slug))
    .limit(1)

  return result[0] || null
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
  let query = db
    .select()
    .from(schema.media)
    .orderBy(schema.desc(schema.media.createdAt))
    .limit(limit)
    .offset(offset)

  if (folder) {
    query = query.where(schema.eq(schema.media.folder, folder))
  }

  return await query
}

// CRUD Operations
export async function createPost(data: schema.NewPost) {
  return await db.insert(schema.posts).values(data).returning()
}

export async function updatePost(id: number, data: Partial<schema.NewPost>) {
  return await db
    .update(schema.posts)
    .set({ ...data, updatedAt: new Date() })
    .where(schema.eq(schema.posts.id, id))
    .returning()
}

export async function deletePost(id: number) {
  return await db
    .delete(schema.posts)
    .where(schema.eq(schema.posts.id, id))
    .returning()
}

export async function createNews(data: schema.NewNews) {
  return await db.insert(schema.news).values(data).returning()
}

export async function updateNews(id: number, data: Partial<schema.NewNews>) {
  return await db
    .update(schema.news)
    .set(data)
    .where(schema.eq(schema.news.id, id))
    .returning()
}

export async function createDestination(data: schema.NewDestination) {
  return await db.insert(schema.destinations).values(data).returning()
}

export async function updateDestination(id: number, data: Partial<schema.NewDestination>) {
  return await db
    .update(schema.destinations)
    .set(data)
    .where(schema.eq(schema.destinations.id, id))
    .returning()
}

export async function uploadMedia(data: schema.NewMedia) {
  return await db.insert(schema.media).values(data).returning()
}

// Analytics
export async function trackPageView(data: schema.NewAnalytic) {
  return await db.insert(schema.analytics).values(data).returning()
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
        schema.or(
          schema.ilike(schema.posts.title, `%${query}%`),
          schema.ilike(schema.posts.excerpt, `%${query}%`),
          schema.ilike(schema.posts.content, `%${query}%`)
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
        schema.or(
          schema.ilike(schema.news.title, `%${query}%`),
          schema.ilike(schema.news.excerpt, `%${query}%`),
          schema.ilike(schema.news.content, `%${query}%`)
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
        schema.or(
          schema.ilike(schema.destinations.name, `%${query}%`),
          schema.ilike(schema.destinations.description, `%${query}%`),
          schema.ilike(schema.destinations.country, `%${query}%`)
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

  // Full-text search using PostgreSQL's built-in text search
  if (filters.query) {
    const searchQuery = filters.query.trim()

    // Create a tsvector for full-text search
    const searchCondition = sql`
      to_tsvector('english', COALESCE(${schema.posts.title}, '') || ' ' ||
                 COALESCE(${schema.posts.excerpt}, '') || ' ' ||
                 COALESCE(${schema.posts.content}, '')) @@
      plainto_tsquery('english', ${searchQuery})
    `
    conditions.push(searchCondition)
  }

  if (filters.categoryId) {
    conditions.push(eq(schema.posts.categoryId, filters.categoryId))
  }

  if (filters.status) {
    conditions.push(eq(schema.posts.status, filters.status))
  }

  if (filters.authorId) {
    conditions.push(eq(schema.posts.authorId, filters.authorId))
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
    relevance: filters.query ? sql`ts_rank(
      to_tsvector('english', COALESCE(${schema.posts.title}, '') || ' ' ||
                 COALESCE(${schema.posts.excerpt}, '') || ' ' ||
                 COALESCE(${schema.posts.content}, '')),
      plainto_tsquery('english', ${filters.query})
    )` : schema.posts.createdAt
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
      categoryId: schema.posts.categoryId,
      featuredImage: schema.posts.featuredImage,
      seoTitle: schema.posts.seoTitle,
      seoDescription: schema.posts.seoDescription,
      viewCount: schema.posts.viewCount,
      author: {
        id: schema.users.id,
        name: schema.users.name,
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
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${schema.postsToTags.tagId},
              'name', ${schema.tags.name},
              'slug', ${schema.tags.slug},
              'color', ${schema.tags.color}
            )
          ) FILTER (WHERE ${schema.postsToTags.tagId} IS NOT NULL),
          '[]'::json
        )
      `,
      // Add search relevance score
      relevanceScore: filters.query ? sql`
        ts_rank(
          to_tsvector('english', COALESCE(${schema.posts.title}, '') || ' ' ||
                     COALESCE(${schema.posts.excerpt}, '') || ' ' ||
                     COALESCE(${schema.posts.content}, '')),
          plainto_tsquery('english', ${filters.query})
        )
      ` : sql`0`
    })
    .from(schema.posts)
    .leftJoin(schema.users, eq(schema.posts.authorId, schema.users.id))
    .leftJoin(schema.categories, eq(schema.posts.categoryId, schema.categories.id))
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
        ? desc(sql`ts_rank(
            to_tsvector('english', COALESCE(${schema.posts.title}, '') || ' ' ||
                       COALESCE(${schema.posts.excerpt}, '') || ' ' ||
                       COALESCE(${schema.posts.content}, '')),
            plainto_tsquery('english', ${filters.query})
          )`)
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
    .leftJoin(schema.categories, eq(schema.posts.categoryId, schema.categories.id))
    .where(
      or(
        ilike(schema.posts.title, `%${query}%`),
        ilike(schema.posts.excerpt, `%${query}%`),
        ilike(schema.categories.name, `%${query}%`)
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
    day: sql`DATE(${schema.analytics.createdAt})`,
    week: sql`DATE_TRUNC('week', ${schema.analytics.createdAt})`,
    month: sql`DATE_TRUNC('month', ${schema.analytics.createdAt})`
  }[filters.groupBy || 'day']

  const result = await db
    .select({
      period: groupByClause,
      totalSearches: sql<number>`COUNT(*)`,
      uniqueUsers: sql<number>`COUNT(DISTINCT ${schema.analytics.userId})`,
      topQueries: sql`
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'query', ${schema.analytics.metadata}->>'query',
            'count', ${schema.analytics.metadata}->>'count'
          )
        ) FILTER (WHERE ${schema.analytics.metadata}->>'query' IS NOT NULL)
      `
    })
    .from(schema.analytics)
    .where(
      and(
        eq(schema.analytics.type, 'search'),
        filters.dateFrom ? sql`${schema.analytics.createdAt} >= ${filters.dateFrom}` : undefined,
        filters.dateTo ? sql`${schema.analytics.createdAt} <= ${filters.dateTo}` : undefined
      )
    )
    .groupBy(groupByClause)
    .orderBy(groupByClause)

  return result
}

// Newsletter subscription
export async function subscribeNewsletter(data: schema.NewNewsletterSubscription) {
  return await db.insert(schema.newsletterSubscriptions).values(data).returning()
}

export async function unsubscribeNewsletter(email: string) {
  return await db
    .update(schema.newsletterSubscriptions)
    .set({
      isActive: false,
      unsubscribedAt: new Date()
    })
    .where(schema.eq(schema.newsletterSubscriptions.email, email))
    .returning()
}

// Comments
export async function createComment(data: schema.NewComment) {
  return await db.insert(schema.comments).values(data).returning()
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
  return await db.insert(schema.users).values(data).returning()
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
  return await db
    .insert(schema.settings)
    .values({
      key,
      value,
      description: description || '',
      isPublic: false,
    })
    .onConflictDoUpdate({
      target: schema.settings.key,
      set: {
        value,
        updatedAt: new Date(),
      },
    })
    .returning()
}




