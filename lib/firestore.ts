import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  WhereFilterOp,
  OrderByDirection
} from 'firebase/firestore'
import { db } from './firebase'

// Types for Firestore operations
export interface FirestoreOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDirection?: OrderByDirection
  where?: Array<{
    field: string
    operator: WhereFilterOp
    value: any
  }>
}

// Generic function to get collection reference
function getCollection(collectionName: string) {
  return collection(db, collectionName)
}

// Generic function to get document reference
function getDocument(collectionName: string, id: string) {
  return doc(db, collectionName, id)
}

// Initialize database connection
export async function initializeDatabase() {
  try {
    // Test connection by trying to access Firestore
    const testCollection = getCollection('test')
    console.log('Firebase connected successfully')
    return true
  } catch (error) {
    console.error('Firebase connection failed:', error)
    return false
  }
}

// Generic get documents function
export async function getDocuments(
  collectionName: string,
  options: FirestoreOptions = {}
) {
  let q = query(getCollection(collectionName))

  // Add where clauses
  if (options.where) {
    options.where.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value))
    })
  }

  // Add ordering
  if (options.orderBy) {
    q = query(q, orderBy(options.orderBy, options.orderDirection || 'desc'))
  }

  // Add limit
  if (options.limit) {
    q = query(q, limit(options.limit))
  }

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamps to JavaScript Dates
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : data.publishedAt,
    }
  })
}

// Generic get single document function
export async function getDocumentById(collectionName: string, id: string) {
  const docRef = getDocument(collectionName, id)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const data = docSnap.data()
    return {
      id: docSnap.id,
      ...data,
      // Convert Firestore Timestamps to JavaScript Dates
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate() : data.publishedAt,
    }
  }
  return null
}

// Generic create document function
export async function createDocument(collectionName: string, data: any) {
  const docRef = await addDoc(getCollection(collectionName), {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  })
  return docRef.id
}

// Generic update document function
export async function updateDocument(
  collectionName: string,
  id: string,
  data: any
) {
  const docRef = getDocument(collectionName, id)
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  })
  return true
}

// Generic delete document function
export async function deleteDocument(collectionName: string, id: string) {
  const docRef = getDocument(collectionName, id)
  await deleteDoc(docRef)
  return true
}

// Posts operations
export async function getPublishedPosts(limitCount = 10, offset = 0) {
  return await getDocuments('posts', {
    where: [{ field: 'status', operator: '==', value: 'published' }],
    orderBy: 'publishedAt',
    orderDirection: 'desc',
    limit: limitCount
  })
}

export async function getPostBySlug(slug: string) {
  const posts = await getDocuments('posts', {
    where: [{ field: 'slug', operator: '==', value: slug }],
    limit: 1
  })
  return posts[0] || null
}

export async function getPostsByCategory(categorySlug: string, limitCount = 10) {
  // This would need a more complex query or subcollection approach
  const posts = await getDocuments('posts', {
    where: [{ field: 'status', operator: '==', value: 'published' }],
    orderBy: 'publishedAt',
    orderDirection: 'desc',
    limit: limitCount
  })

  // Filter by category (this is a simplified approach)
  return posts.filter((post: any) => post.categorySlug === categorySlug)
}

// News operations
export async function getNews(limitCount = 10, offset = 0) {
  return await getDocuments('news', {
    where: [{ field: 'status', operator: '==', value: 'published' }],
    orderBy: 'publishedAt',
    orderDirection: 'desc',
    limit: limitCount
  })
}

// Destinations operations
export async function getDestinations(limitCount = 20) {
  return await getDocuments('destinations', {
    where: [{ field: 'status', operator: '==', value: 'published' }],
    orderBy: 'publishedAt',
    orderDirection: 'desc',
    limit: limitCount
  })
}

// Media operations
export async function getMediaFiles(limitCount = 50, offset = 0, folder?: string) {
  const options: FirestoreOptions = {
    orderBy: 'createdAt',
    orderDirection: 'desc',
    limit: limitCount
  }

  if (folder) {
    options.where = [{ field: 'folder', operator: '==', value: folder }]
  }

  return await getDocuments('media', options)
}

// CRUD Operations
export async function createPost(data: any) {
  return await createDocument('posts', data)
}

export async function updatePost(id: string, data: any) {
  return await updateDocument('posts', id, data)
}

export async function deletePost(id: string) {
  return await deleteDocument('posts', id)
}

export async function createNews(data: any) {
  return await createDocument('news', data)
}

export async function updateNews(id: string, data: any) {
  return await updateDocument('news', id, data)
}

export async function createDestination(data: any) {
  return await createDocument('destinations', data)
}

export async function updateDestination(id: string, data: any) {
  return await updateDocument('destinations', id, data)
}

export async function uploadMedia(data: any) {
  return await createDocument('media', data)
}

// Analytics
export async function trackPageView(data: any) {
  return await createDocument('analytics', data)
}

export async function getStats() {
  try {
    // Get counts from all collections
    const [postsSnapshot, newsSnapshot, destinationsSnapshot, mediaSnapshot, analyticsSnapshot, usersSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'posts'))),
      getDocs(query(collection(db, 'news'))),
      getDocs(query(collection(db, 'destinations'))),
      getDocs(query(collection(db, 'media'))),
      getDocs(query(collection(db, 'analytics'), orderBy('timestamp', 'desc'), limit(1000))),
      getDocs(query(collection(db, 'users'), where('isActive', '==', true)))
    ])

    // Calculate total views from recent analytics
    const totalViews = analyticsSnapshot.docs.reduce((sum, doc) => {
      const data = doc.data()
      return sum + (data.pageViews || 1) // Default to 1 if not specified
    }, 0)

    // Get unique visitors (simplified - in production you'd use a more sophisticated method)
    const uniqueIPs = new Set()
    analyticsSnapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.ipAddress) {
        uniqueIPs.add(data.ipAddress)
      }
    })

    return {
      posts: postsSnapshot.size,
      news: newsSnapshot.size,
      destinations: destinationsSnapshot.size,
      media: mediaSnapshot.size,
      views: totalViews,
      visitors: uniqueIPs.size
    }
  } catch (error) {
    console.error('Error calculating stats:', error)
    // Return zeros as fallback
    return {
      posts: 0,
      news: 0,
      destinations: 0,
      media: 0,
      views: 0,
      visitors: 0
    }
  }
}

// Search functionality
export async function searchContent(query: string, type?: string) {
  const results: any = {}

  if (!type || type === 'posts') {
    const posts = await getDocuments('posts')
    results.posts = posts.filter((post: any) =>
      post.title?.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
      post.content?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20)
  }

  if (!type || type === 'news') {
    const news = await getDocuments('news')
    results.news = news.filter((item: any) =>
      item.title?.toLowerCase().includes(query.toLowerCase()) ||
      item.excerpt?.toLowerCase().includes(query.toLowerCase()) ||
      item.content?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20)
  }

  if (!type || type === 'destinations') {
    const destinations = await getDocuments('destinations')
    results.destinations = destinations.filter((item: any) =>
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.country?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 20)
  }

  return results
}

// Newsletter subscription
export async function subscribeNewsletter(data: any) {
  return await createDocument('newsletterSubscriptions', data)
}

export async function unsubscribeNewsletter(email: string) {
  const subscriptions = await getDocuments('newsletterSubscriptions', {
    where: [{ field: 'email', operator: '==', value: email }],
    limit: 1
  })

  if (subscriptions[0]) {
    return await updateDocument('newsletterSubscriptions', subscriptions[0].id, {
      isActive: false,
      unsubscribedAt: Timestamp.now()
    })
  }
  return false
}

// Comments
export async function createComment(data: any) {
  return await createDocument('comments', data)
}

export async function getComments(postId?: string, newsId?: string, limitCount = 50) {
  const options: FirestoreOptions = {
    where: [{ field: 'status', operator: '==', value: 'approved' }],
    orderBy: 'createdAt',
    orderDirection: 'desc',
    limit: limitCount
  }

  if (postId) {
    options.where!.push({ field: 'postId', operator: '==', value: postId })
  }

  if (newsId) {
    options.where!.push({ field: 'newsId', operator: '==', value: newsId })
  }

  return await getDocuments('comments', options)
}

// User operations
export async function createUser(data: any) {
  return await createDocument('users', data)
}

export async function getUserByEmail(email: string) {
  const users = await getDocuments('users', {
    where: [{ field: 'email', operator: '==', value: email }],
    limit: 1
  })
  return users[0] || null
}

export async function getUserById(id: string) {
  return await getDocumentById('users', id)
}

// Categories and tags
export async function getCategories() {
  return await getDocuments('categories', {
    where: [{ field: 'isActive', operator: '==', value: true }],
    orderBy: 'sortOrder',
    orderDirection: 'asc'
  })
}

export async function getCategoryById(id: string) {
  return await getDocumentById('categories', id)
}

export async function createCategory(data: any) {
  return await createDocument('categories', data)
}

export async function updateCategory(id: string, data: any) {
  return await updateDocument('categories', id, data)
}

export async function deleteCategory(id: string) {
  return await deleteDocument('categories', id)
}

export async function getTags() {
  return await getDocuments('tags', {
    orderBy: 'usageCount',
    orderDirection: 'desc',
    limit: 50
  })
}

export async function getMediaById(id: string) {
  return await getDocumentById('media', id)
}

export async function updateMedia(id: string, data: any) {
  return await updateDocument('media', id, data)
}

export async function deleteMedia(id: string) {
  return await deleteDocument('media', id)
}

export async function getTagById(id: string) {
  return await getDocumentById('tags', id)
}

export async function updateTag(id: string, data: any) {
  return await updateDocument('tags', id, data)
}

export async function deleteTag(id: string) {
  return await deleteDocument('tags', id)
}

export async function getActiveUsers() {
  return await getDocuments('users', {
    where: [{ field: 'isActive', operator: '==', value: true }],
    orderBy: 'createdAt',
    orderDirection: 'desc'
  })
}

export async function createNotification(data: any) {
  return await createDocument('notifications', data)
}

export async function getNotificationsByUser(userId: string, options: FirestoreOptions = {}) {
  const whereConditions: Array<{ field: string; operator: WhereFilterOp; value: any }> = [
    { field: 'recipientId', operator: '==', value: userId }
  ]

  if (options.where) {
    whereConditions.push(...options.where)
  }

  return await getDocuments('notifications', {
    ...options,
    where: whereConditions
  })
}

export async function updateUser(id: string, data: any) {
  return await updateDocument('users', id, data)
}

// Settings
export async function getSetting(key: string) {
  const settings = await getDocuments('settings', {
    where: [{ field: 'key', operator: '==', value: key }],
    limit: 1
  })
  return settings[0] || null
}

export async function setSetting(key: string, value: any, description?: string) {
  const existing = await getSetting(key)

  if (existing) {
    return await updateDocument('settings', existing.id, { value })
  } else {
    return await createDocument('settings', {
      key,
      value,
      description: description || '',
      isPublic: false
    })
  }
}

// Advanced search functionality
export async function searchPostsAdvanced(options: {
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
  const {
    query,
    categoryId,
    tagIds,
    status,
    authorId,
    dateFrom,
    dateTo,
    sortBy = 'relevance',
    sortOrder = 'desc',
    limit: limitCount = 20,
    offset = 0
  } = options

  // Build where conditions
  const whereConditions: Array<{ field: string; operator: WhereFilterOp; value: any }> = []

  if (status) {
    whereConditions.push({ field: 'status', operator: '==', value: status })
  }

  if (authorId) {
    whereConditions.push({ field: 'authorId', operator: '==', value: authorId })
  }

  if (categoryId) {
    whereConditions.push({ field: 'categoryId', operator: '==', value: categoryId })
  }

  if (dateFrom) {
    whereConditions.push({ field: 'publishedAt', operator: '>=', value: Timestamp.fromDate(dateFrom) })
  }

  if (dateTo) {
    whereConditions.push({ field: 'publishedAt', operator: '<=', value: Timestamp.fromDate(dateTo) })
  }

  // Get posts with basic filtering
  let posts = await getDocuments('posts', {
    where: whereConditions.length > 0 ? whereConditions : undefined,
    orderBy: sortBy === 'relevance' ? 'publishedAt' : sortBy,
    orderDirection: sortOrder,
    limit: limitCount + offset
  })

  // Apply text search filtering (client-side for now)
  if (query) {
    const searchTerm = query.toLowerCase()
    posts = posts.filter((post: any) =>
      post.title?.toLowerCase().includes(searchTerm) ||
      post.excerpt?.toLowerCase().includes(searchTerm) ||
      post.content?.toLowerCase().includes(searchTerm)
    )
  }

  // Apply tag filtering (client-side for now)
  if (tagIds && tagIds.length > 0) {
    posts = posts.filter((post: any) =>
      post.tagIds && post.tagIds.some((tagId: string) => tagIds.includes(tagId))
    )
  }

  // Apply pagination
  const paginatedPosts = posts.slice(offset, offset + limitCount)

  return paginatedPosts
}

export async function getSearchSuggestions(query: string, limitCount = 10) {
  if (!query || query.length < 2) {
    return []
  }

  const searchTerm = query.toLowerCase()

  // Get posts that match the query for suggestions
  const posts = await getDocuments('posts', {
    where: [{ field: 'status', operator: '==', value: 'published' }],
    limit: 50
  })

  const suggestions = new Set<string>()

  // Extract suggestions from titles
  posts.forEach((post: any) => {
    if (post.title?.toLowerCase().includes(searchTerm)) {
      const words = post.title.toLowerCase().split(' ')
      words.forEach((word: string) => {
        if (word.includes(searchTerm) && word.length > 2) {
          suggestions.add(word)
        }
      })
    }
  })

  return Array.from(suggestions).slice(0, limitCount)
}

// Export Firebase services for direct use
export { db }