// Firestore document types for the blog management system
// These define the structure of documents in each Firestore collection

export interface User {
  id?: string
  email: string
  username: string
  passwordHash: string
  firstName?: string
  lastName?: string
  avatar?: string
  bio?: string
  role: 'super_admin' | 'admin' | 'editor' | 'author' | 'user'
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id?: string
  name: string
  slug: string
  description?: string
  color: string
  icon?: string
  parentId?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface Tag {
  id?: string
  name: string
  slug: string
  color: string
  usageCount: number
  createdAt: Date
}

export interface Post {
  id?: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  authorId: string
  status: 'draft' | 'published' | 'archived'
  isFeatured: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  viewCount: number
  likeCount: number
  commentCount: number
  readingTime?: number
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  location?: string
  categoryIds?: string[]
  tagIds?: string[]
}

export interface News {
  id?: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  authorId: string
  status: 'draft' | 'published' | 'archived'
  isBreaking: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  seoTitle?: string
  seoDescription?: string
  viewCount: number
  categoryIds?: string[]
}

export interface Destination {
  id?: string
  name: string
  slug: string
  description?: string
  longDescription?: string
  country: string
  region?: string
  coordinates?: {
    lat: number
    lng: number
  }
  featuredImage?: string
  images?: string[]
  bestTimeToVisit?: string
  currency?: string
  language?: string
  timezone?: string
  visaInfo?: string
  authorId: string
  status: 'draft' | 'published' | 'archived'
  isFeatured: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  viewCount: number
  rating?: number
}

export interface Media {
  id?: string
  filename: string
  originalName: string
  url: string
  thumbnailUrl?: string
  mimeType: string
  size: number
  width?: number
  height?: number
  alt?: string
  caption?: string
  folder: string
  uploadedBy: string
  createdAt: Date
}

export interface Comment {
  id?: string
  content: string
  authorName: string
  authorEmail: string
  authorWebsite?: string
  postId?: string
  newsId?: string
  parentId?: string
  status: 'pending' | 'approved' | 'spam'
  isAnonymous: boolean
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

export interface NewsletterSubscription {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  isActive: boolean
  subscriptionSource: string
  preferences?: {
    categories?: string[]
    frequency?: string
  }
  unsubscribedAt?: Date
  createdAt: Date
}

export interface SocialPost {
  id?: string
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
  content: string
  imageUrl?: string
  postUrl?: string
  scheduledAt?: Date
  publishedAt?: Date
  status: 'draft' | 'scheduled' | 'published' | 'failed'
  engagement?: {
    likes: number
    shares: number
    comments: number
  }
  createdBy: string
  createdAt: Date
}

export interface Analytic {
  id?: string
  pageUrl: string
  pageTitle?: string
  userAgent?: string
  ipAddress?: string
  referrer?: string
  sessionId?: string
  userId: string
  deviceType?: 'desktop' | 'mobile' | 'tablet'
  browser?: string
  country?: string
  city?: string
  timestamp: Date
}

export interface Setting {
  id?: string
  key: string
  value: any
  description?: string
  category: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id?: string
  type: 'comment' | 'like' | 'newsletter' | 'system' | 'admin' | 'social' | 'backup' | 'security'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  actionUrl?: string
  metadata?: any
  userId: string
  recipientId: string
  createdAt: Date
  expiresAt?: Date
}

export interface Backup {
  id?: string
  filename: string
  size: number
  type: 'full' | 'incremental' | 'media'
  status: 'success' | 'failed' | 'in_progress'
  createdBy: string
  createdAt: Date
}

// Export types for creating new documents
export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type NewCategory = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
export type NewTag = Omit<Tag, 'id' | 'createdAt'>
export type NewPost = Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
export type NewNews = Omit<News, 'id' | 'createdAt' | 'updatedAt'>
export type NewDestination = Omit<Destination, 'id' | 'createdAt' | 'updatedAt'>
export type NewMedia = Omit<Media, 'id' | 'createdAt'>
export type NewComment = Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>
export type NewNewsletterSubscription = Omit<NewsletterSubscription, 'id' | 'createdAt'>
export type NewSocialPost = Omit<SocialPost, 'id' | 'createdAt'>
export type NewAnalytic = Omit<Analytic, 'id' | 'timestamp'>
export type NewSetting = Omit<Setting, 'id' | 'createdAt' | 'updatedAt'>
export type NewNotification = Omit<Notification, 'id' | 'createdAt'>
export type NewBackup = Omit<Backup, 'id' | 'createdAt'>