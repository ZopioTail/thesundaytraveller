// Database schema - install dependencies first: npm install drizzle-orm mysql2 @types/mysql
// Complete database schema for advanced blog management system

import { mysqlTable, text, int, timestamp, boolean, varchar, serial, json, index, uniqueIndex } from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'
import { eq, desc, asc, and, or, like, sql } from 'drizzle-orm'

// Export query builders for use in other files
export { eq, desc, asc, and, or, sql }

// Users table with role-based access control
export const users = mysqlTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 100 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  avatar: text('avatar'),
  bio: text('bio'),
  role: varchar('role', { length: 50 }).notNull().default('user'), // admin, editor, author, user
  isActive: boolean('is_active').notNull().default(true),
  lastLogin: timestamp('last_login'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  usernameIdx: index('users_username_idx').on(table.username),
  roleIdx: index('users_role_idx').on(table.role),
}))

// Categories for organizing content
export const categories = mysqlTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#6366f1'), // hex color
  icon: varchar('icon', { length: 50 }),
  parentId: int('parent_id').references((): any => categories.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').notNull().default(true),
  sortOrder: int('sort_order').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('categories_slug_idx').on(table.slug),
  parentIdx: index('categories_parent_idx').on(table.parentId),
}))

// Tags for content tagging
export const tags = mysqlTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 7 }).default('#10b981'),
  usageCount: int('usage_count').default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  slugIdx: uniqueIndex('tags_slug_idx').on(table.slug),
  nameIdx: index('tags_name_idx').on(table.name),
}))

// Posts/Blog articles
export const posts = mysqlTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  featuredImage: text('featured_image'),
  authorId: int('author_id').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, published, archived
  isFeatured: boolean('is_featured').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  seoTitle: varchar('seo_title', { length: 60 }),
  seoDescription: varchar('seo_description', { length: 160 }),
  seoKeywords: text('seo_keywords'),
  viewCount: int('view_count').default(0),
  likeCount: int('like_count').default(0),
  commentCount: int('comment_count').default(0),
  readingTime: int('reading_time'), // in minutes
  difficulty: varchar('difficulty', { length: 20 }), // beginner, intermediate, advanced
  location: varchar('location', { length: 255 }),
}, (table) => ({
  slugIdx: uniqueIndex('posts_slug_idx').on(table.slug),
  authorIdx: index('posts_author_idx').on(table.authorId),
  statusIdx: index('posts_status_idx').on(table.status),
  publishedIdx: index('posts_published_idx').on(table.publishedAt),
  featuredIdx: index('posts_featured_idx').on(table.isFeatured),
}))

// News articles
export const news = mysqlTable('news', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt'),
  content: text('content').notNull(),
  featuredImage: text('featured_image'),
  authorId: int('author_id').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  isBreaking: boolean('is_breaking').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  seoTitle: varchar('seo_title', { length: 60 }),
  seoDescription: varchar('seo_description', { length: 160 }),
  viewCount: int('view_count').default(0),
}, (table) => ({
  slugIdx: uniqueIndex('news_slug_idx').on(table.slug),
  authorIdx: index('news_author_idx').on(table.authorId),
  statusIdx: index('news_status_idx').on(table.status),
  publishedIdx: index('news_published_idx').on(table.publishedAt),
}))

// Destinations
export const destinations = mysqlTable('destinations', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  longDescription: text('long_description'),
  country: varchar('country', { length: 100 }).notNull(),
  region: varchar('region', { length: 100 }),
  coordinates: json('coordinates'), // {lat: number, lng: number}
  featuredImage: text('featured_image'),
  images: json('images'), // array of image URLs
  bestTimeToVisit: varchar('best_time_to_visit', { length: 255 }),
  currency: varchar('currency', { length: 10 }),
  language: varchar('language', { length: 100 }),
  timezone: varchar('timezone', { length: 50 }),
  visaInfo: text('visa_info'),
  authorId: int('author_id').notNull().references(() => users.id),
  status: varchar('status', { length: 20 }).notNull().default('draft'),
  isFeatured: boolean('is_featured').default(false),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  seoTitle: varchar('seo_title', { length: 60 }),
  seoDescription: varchar('seo_description', { length: 160 }),
  seoKeywords: text('seo_keywords'),
  viewCount: int('view_count').default(0),
  rating: int('rating'), // 1-5 stars
}, (table) => ({
  slugIdx: uniqueIndex('destinations_slug_idx').on(table.slug),
  authorIdx: index('destinations_author_idx').on(table.authorId),
  statusIdx: index('destinations_status_idx').on(table.status),
  countryIdx: index('destinations_country_idx').on(table.country),
}))

// Media library
export const media = mysqlTable('media', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  originalName: varchar('original_name', { length: 255 }).notNull(),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  size: int('size').notNull(), // in bytes
  width: int('width'),
  height: int('height'),
  alt: text('alt'),
  caption: text('caption'),
  folder: varchar('folder', { length: 100 }).default('general'),
  uploadedBy: int('uploaded_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  filenameIdx: index('media_filename_idx').on(table.filename),
  folderIdx: index('media_folder_idx').on(table.folder),
  uploaderIdx: index('media_uploader_idx').on(table.uploadedBy),
}))

// Comments system
export const comments = mysqlTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  authorEmail: varchar('author_email', { length: 255 }).notNull(),
  authorWebsite: varchar('author_website', { length: 255 }),
  postId: int('post_id').references(() => posts.id),
  newsId: int('news_id').references(() => news.id),
  parentId: int('parent_id').references((): any => comments.id), // for nested comments
  status: varchar('status', { length: 20 }).notNull().default('pending'), // pending, approved, spam
  isAnonymous: boolean('is_anonymous').default(false),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  postIdx: index('comments_post_idx').on(table.postId),
  newsIdx: index('comments_news_idx').on(table.newsId),
  parentIdx: index('comments_parent_idx').on(table.parentId),
  statusIdx: index('comments_status_idx').on(table.status),
}))

// Newsletter subscriptions
export const newsletterSubscriptions = mysqlTable('newsletter_subscriptions', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  isActive: boolean('is_active').notNull().default(true),
  subscriptionSource: varchar('subscription_source', { length: 100 }).default('website'),
  preferences: json('preferences'), // {categories: string[], frequency: string}
  unsubscribedAt: timestamp('unsubscribed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: uniqueIndex('newsletter_email_idx').on(table.email),
  activeIdx: index('newsletter_active_idx').on(table.isActive),
}))

// Social media posts
export const socialPosts = mysqlTable('social_posts', {
  id: serial('id').primaryKey(),
  platform: varchar('platform', { length: 50 }).notNull(), // twitter, facebook, instagram, linkedin
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  postUrl: text('post_url'),
  scheduledAt: timestamp('scheduled_at'),
  publishedAt: timestamp('published_at'),
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, scheduled, published, failed
  engagement: json('engagement'), // {likes: number, shares: number, comments: number}
  createdBy: int('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  platformIdx: index('social_platform_idx').on(table.platform),
  statusIdx: index('social_status_idx').on(table.status),
  scheduledIdx: index('social_scheduled_idx').on(table.scheduledAt),
}))

// Analytics and tracking
export const analytics = mysqlTable('analytics', {
  id: serial('id').primaryKey(),
  pageUrl: text('page_url').notNull(),
  pageTitle: varchar('page_title', { length: 255 }),
  userAgent: text('user_agent'),
  ipAddress: varchar('ip_address', { length: 45 }),
  referrer: text('referrer'),
  sessionId: varchar('session_id', { length: 255 }),
  userId: int('user_id').notNull().references(() => users.id),
  deviceType: varchar('device_type', { length: 20 }), // desktop, mobile, tablet
  browser: varchar('browser', { length: 50 }),
  country: varchar('country', { length: 100 }),
  city: varchar('city', { length: 100 }),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
}, (table) => ({
  urlIdx: index('analytics_url_idx').on(table.pageUrl),
  sessionIdx: index('analytics_session_idx').on(table.sessionId),
  userIdx: index('analytics_user_idx').on(table.userId),
  timestampIdx: index('analytics_timestamp_idx').on(table.timestamp),
}))

// Settings and configuration
export const settings = mysqlTable('settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  value: json('value'),
  description: text('description'),
  category: varchar('category', { length: 50 }).default('general'),
  isPublic: boolean('is_public').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  keyIdx: uniqueIndex('settings_key_idx').on(table.key),
  categoryIdx: index('settings_category_idx').on(table.category),
}))

// Notifications system
export const notifications = mysqlTable('notifications', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 50 }).notNull(), // comment, like, newsletter, system, admin, social, backup, security
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  priority: varchar('priority', { length: 20 }).notNull().default('medium'), // low, medium, high, urgent
  read: boolean('read').notNull().default(false),
  actionUrl: text('action_url'),
  metadata: json('metadata'),
  userId: int('user_id').notNull().references(() => users.id), // sender
  recipientId: int('recipient_id').notNull().references(() => users.id), // receiver
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
}, (table) => ({
  typeIdx: index('notifications_type_idx').on(table.type),
  priorityIdx: index('notifications_priority_idx').on(table.priority),
  readIdx: index('notifications_read_idx').on(table.read),
  recipientIdx: index('notifications_recipient_idx').on(table.recipientId),
  createdIdx: index('notifications_created_idx').on(table.createdAt),
}))

// Backup logs
export const backups = mysqlTable('backups', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  size: int('size').notNull(), // in bytes
  type: varchar('type', { length: 50 }).notNull(), // full, incremental, media
  status: varchar('status', { length: 20 }).notNull(), // success, failed, in_progress
  createdBy: int('created_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  statusIdx: index('backups_status_idx').on(table.status),
  typeIdx: index('backups_type_idx').on(table.type),
}))

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  news: many(news),
  destinations: many(destinations),
  media: many(media),
  comments: many(comments),
  socialPosts: many(socialPosts),
  backups: many(backups),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  posts: many(posts),
  news: many(news),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  categories: many(postsToCategories),
  tags: many(postsToTags),
  comments: many(comments),
}))

export const newsRelations = relations(news, ({ one, many }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
  categories: many(newsToCategories),
  comments: many(comments),
}))

// Junction tables for many-to-many relationships
export const postsToCategories = mysqlTable('posts_to_categories', {
  postId: int('post_id').notNull().references(() => posts.id),
  categoryId: int('category_id').notNull().references(() => categories.id),
}, (table) => ({
  pk: uniqueIndex('posts_to_categories_pk').on(table.postId, table.categoryId),
}))

export const postsToTags = mysqlTable('posts_to_tags', {
  postId: int('post_id').notNull().references(() => posts.id),
  tagId: int('tag_id').notNull().references(() => tags.id),
}, (table) => ({
  pk: uniqueIndex('posts_to_tags_pk').on(table.postId, table.tagId),
}))

export const newsToCategories = mysqlTable('news_to_categories', {
  newsId: int('news_id').notNull().references(() => news.id),
  categoryId: int('category_id').notNull().references(() => categories.id),
}, (table) => ({
  pk: uniqueIndex('news_to_categories_pk').on(table.newsId, table.categoryId),
}))

// Type definitions
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type News = typeof news.$inferSelect
export type NewNews = typeof news.$inferInsert
export type Destination = typeof destinations.$inferSelect
export type NewDestination = typeof destinations.$inferInsert
export type Media = typeof media.$inferSelect
export type NewMedia = typeof media.$inferInsert
export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert
export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect
export type NewNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert
export type SocialPost = typeof socialPosts.$inferSelect
export type NewSocialPost = typeof socialPosts.$inferInsert
export type Analytic = typeof analytics.$inferSelect
export type NewAnalytic = typeof analytics.$inferInsert
export type Setting = typeof settings.$inferSelect
export type NewSetting = typeof settings.$inferInsert
export type Backup = typeof backups.$inferSelect
export type NewBackup = typeof backups.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert