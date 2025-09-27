import * as firestore from './firestore'
import * as firestoreSchema from './firestore-schema'

// Export Firestore functions as the main database interface
export const db = firestore.db

// Export Firestore schema types
export * from './firestore-schema'

// Re-export Firestore functions with the same names as before
export const initializeDatabase = firestore.initializeDatabase
export const getDocumentById = firestore.getDocumentById
export const getPublishedPosts = firestore.getPublishedPosts
export const getPostBySlug = firestore.getPostBySlug
export const getPostsByCategory = firestore.getPostsByCategory
export const getNews = firestore.getNews
export const getDestinations = firestore.getDestinations
export const getMediaFiles = firestore.getMediaFiles
export const createPost = firestore.createPost
export const updatePost = firestore.updatePost
export const deletePost = firestore.deletePost
export const createNews = firestore.createNews
export const updateNews = firestore.updateNews
export const createDestination = firestore.createDestination
export const updateDestination = firestore.updateDestination
export const uploadMedia = firestore.uploadMedia
export const trackPageView = firestore.trackPageView
export const getStats = firestore.getStats
export const searchContent = firestore.searchContent
export const subscribeNewsletter = firestore.subscribeNewsletter
export const unsubscribeNewsletter = firestore.unsubscribeNewsletter
export const createComment = firestore.createComment
export const getComments = firestore.getComments
export const createUser = firestore.createUser
export const getUserByEmail = firestore.getUserByEmail
export const getUserById = firestore.getUserById
export const getCategories = firestore.getCategories
export const getTags = firestore.getTags
export const getSetting = firestore.getSetting
export const setSetting = firestore.setSetting
