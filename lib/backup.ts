import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

export interface BackupOptions {
  includeAnalytics?: boolean
  includeMedia?: boolean
  dateFrom?: Date
  dateTo?: Date
  categories?: number[]
  authors?: number[]
}

export interface ExportOptions {
  format: 'csv' | 'json' | 'xml'
  entity: 'posts' | 'users' | 'comments' | 'categories' | 'tags' | 'media' | 'newsletter' | 'analytics'
  includeMetadata?: boolean
  dateFrom?: Date
  dateTo?: Date
  limit?: number
}

export class BackupManager {
  private static readonly BACKUP_DIR = path.join(process.cwd(), 'backups')

  static async createFullBackup(options: BackupOptions = {}): Promise<{ success: boolean; filename: string; size: number; error?: string }> {
    try {
      await mkdir(this.BACKUP_DIR, { recursive: true })

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `backup-full-${timestamp}.json`
      const filepath = path.join(this.BACKUP_DIR, filename)

      const backupData: any = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        metadata: {
          totalRecords: 0,
          options
        },
        data: {}
      }

      // Backup users
      const usersCollection = collection(firestoreDb, 'users')
      const usersSnapshot = await getDocs(usersCollection)
      const userRecords = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      backupData.data.users = userRecords
      backupData.metadata.totalRecords += userRecords.length

      // Backup categories
      const categoriesCollection = collection(firestoreDb, 'categories')
      const categoriesSnapshot = await getDocs(categoriesCollection)
      const categoryRecords = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      backupData.data.categories = categoryRecords
      backupData.metadata.totalRecords += categoryRecords.length

      // Backup tags
      const tagsCollection = collection(firestoreDb, 'tags')
      const tagsSnapshot = await getDocs(tagsCollection)
      const tagRecords = tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      backupData.data.tags = tagRecords
      backupData.metadata.totalRecords += tagRecords.length

      // Backup posts
      const postsCollection = collection(firestoreDb, 'posts')
      const postsSnapshot = await getDocs(postsCollection)
      const postRecords = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      backupData.data.posts = postRecords
      backupData.metadata.totalRecords += postRecords.length

      // Backup comments
      const commentsCollection = collection(firestoreDb, 'comments')
      const commentsSnapshot = await getDocs(commentsCollection)
      const commentRecords = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      backupData.data.comments = commentRecords
      backupData.metadata.totalRecords += commentRecords.length

      // Backup media (metadata only, not actual files)
      if (options.includeMedia !== false) {
        const mediaCollection = collection(firestoreDb, 'media')
        const mediaSnapshot = await getDocs(mediaCollection)
        const mediaRecords = mediaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        backupData.data.media = mediaRecords
        backupData.metadata.totalRecords += mediaRecords.length
      }

      // Backup newsletter subscriptions
      const newsletterCollection = collection(firestoreDb, 'newsletterSubscriptions')
      const newsletterSnapshot = await getDocs(newsletterCollection)
      const newsletterRecords = newsletterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      backupData.data.newsletterSubscriptions = newsletterRecords
      backupData.metadata.totalRecords += newsletterRecords.length

      // Backup analytics (optional)
      if (options.includeAnalytics) {
        const analyticsCollection = collection(firestoreDb, 'analytics')
        const analyticsSnapshot = await getDocs(analyticsCollection)
        const analyticsRecords = analyticsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        backupData.data.analytics = analyticsRecords
        backupData.metadata.totalRecords += analyticsRecords.length
      }

      // Write backup file
      const backupContent = JSON.stringify(backupData, null, 2)
      await writeFile(filepath, backupContent, 'utf-8')

      const stats = await import('fs').then(fs => fs.promises.stat(filepath))

      return {
        success: true,
        filename,
        size: stats.size
      }

    } catch (error) {
      console.error('Backup creation failed:', error)
      return {
        success: false,
        filename: '',
        size: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  static async createIncrementalBackup(sinceDate: Date): Promise<{ success: boolean; filename: string; size: number; error?: string }> {
    try {
      await mkdir(this.BACKUP_DIR, { recursive: true })

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `backup-incremental-${timestamp}.json`
      const filepath = path.join(this.BACKUP_DIR, filename)

      const backupData: any = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        type: 'incremental',
        sinceDate: sinceDate.toISOString(),
        metadata: {
          totalRecords: 0
        },
        data: {}
      }

      // Get records created/modified since the last backup
      const usersCollection = collection(firestoreDb, 'users')
      const postsCollection = collection(firestoreDb, 'posts')
      const commentsCollection = collection(firestoreDb, 'comments')

      const [usersSnapshot, postsSnapshot, commentsSnapshot] = await Promise.all([
        getDocs(query(usersCollection, where('createdAt', '>=', Timestamp.fromDate(sinceDate)))),
        getDocs(query(postsCollection, where('createdAt', '>=', Timestamp.fromDate(sinceDate)))),
        getDocs(query(commentsCollection, where('createdAt', '>=', Timestamp.fromDate(sinceDate))))
      ])

      const newUserRecords = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const newPostRecords = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      const newCommentRecords = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

      backupData.metadata.totalRecords = newUserRecords.length + newPostRecords.length + newCommentRecords.length

      if (backupData.metadata.totalRecords === 0) {
        return {
          success: true,
          filename,
          size: 0
        }
      }

      // Only backup new records for incremental
      const userRecords = newUserRecords
      const postRecords = newPostRecords
      const commentRecords = newCommentRecords

      backupData.data.users = userRecords
      backupData.data.posts = postRecords
      backupData.data.comments = commentRecords

      const backupContent = JSON.stringify(backupData, null, 2)
      await writeFile(filepath, backupContent, 'utf-8')

      const stats = await import('fs').then(fs => fs.promises.stat(filepath))

      return {
        success: true,
        filename,
        size: stats.size
      }

    } catch (error) {
      console.error('Incremental backup creation failed:', error)
      return {
        success: false,
        filename: '',
        size: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  static async exportData(options: ExportOptions): Promise<{ success: boolean; filename: string; size: number; error?: string }> {
    try {
      await mkdir(this.BACKUP_DIR, { recursive: true })

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `export-${options.entity}-${timestamp}.${options.format}`
      const filepath = path.join(this.BACKUP_DIR, filename)

      let data: any[] = []
      let headers: string[] = []

      // Build query based on entity type
      switch (options.entity) {
        case 'posts':
          const postsCollection = collection(firestoreDb, 'posts')
          const postsSnapshot = await getDocs(postsCollection)
          data = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          headers = ['id', 'title', 'slug', 'excerpt', 'content', 'authorId', 'status', 'createdAt', 'updatedAt']
          break

        case 'users':
          const usersCollection = collection(firestoreDb, 'users')
          const usersSnapshot = await getDocs(usersCollection)
          data = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          headers = ['id', 'email', 'username', 'firstName', 'lastName', 'role', 'createdAt']
          break

        case 'comments':
          const commentsCollection = collection(firestoreDb, 'comments')
          const commentsSnapshot = await getDocs(commentsCollection)
          data = commentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          headers = ['id', 'content', 'authorName', 'authorEmail', 'postId', 'status', 'createdAt']
          break

        case 'categories':
          const categoriesCollection = collection(firestoreDb, 'categories')
          const categoriesSnapshot = await getDocs(categoriesCollection)
          data = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          headers = ['id', 'name', 'slug', 'description', 'parentId', 'createdAt']
          break

        case 'tags':
          const tagsCollection = collection(firestoreDb, 'tags')
          const tagsSnapshot = await getDocs(tagsCollection)
          data = tagsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          headers = ['id', 'name', 'slug', 'usageCount', 'createdAt']
          break

        case 'media':
          const mediaCollection = collection(firestoreDb, 'media')
          const mediaSnapshot = await getDocs(mediaCollection)
          data = mediaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          headers = ['id', 'filename', 'originalName', 'url', 'mimeType', 'size', 'createdAt']
          break

        case 'newsletter':
          const newsletterCollection = collection(firestoreDb, 'newsletterSubscriptions')
          const newsletterSnapshot = await getDocs(newsletterCollection)
          data = newsletterSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
          headers = ['id', 'email', 'firstName', 'lastName', 'isActive', 'createdAt']
          break

        case 'analytics':
          const analyticsCollection = collection(firestoreDb, 'analytics')
          const analyticsSnapshot = await getDocs(query(analyticsCollection, orderBy('timestamp', 'desc')))
          data = analyticsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).slice(0, options.limit || 1000)
          headers = ['id', 'pageUrl', 'pageTitle', 'userId', 'deviceType', 'timestamp']
          break
      }

      if (data.length === 0) {
        return {
          success: true,
          filename,
          size: 0
        }
      }

      // Export based on format
      let exportContent: string

      switch (options.format) {
        case 'csv':
          exportContent = this.convertToCSV(data, headers)
          break

        case 'json':
          const jsonData = options.includeMetadata ? {
            metadata: {
              exportDate: new Date().toISOString(),
              entity: options.entity,
              recordCount: data.length,
              options
            },
            data
          } : data
          exportContent = JSON.stringify(jsonData, null, 2)
          break

        case 'xml':
          exportContent = this.convertToXML(data, options.entity, headers)
          break

        default:
          throw new Error(`Unsupported export format: ${options.format}`)
      }

      await writeFile(filepath, exportContent, 'utf-8')

      const stats = await import('fs').then(fs => fs.promises.stat(filepath))

      return {
        success: true,
        filename,
        size: stats.size
      }

    } catch (error) {
      console.error('Export failed:', error)
      return {
        success: false,
        filename: '',
        size: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private static convertToCSV(data: any[], headers: string[]): string {
    if (data.length === 0) return ''

    const csvRows = [
      headers.join(','),
      ...data.map(row =>
        headers.map(header => {
          const value = row[header]
          // Escape CSV values that contain commas, quotes, or newlines
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value ?? ''
        }).join(',')
      )
    ]

    return csvRows.join('\n')
  }

  private static convertToXML(data: any[], entityName: string, headers: string[]): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
    xml += `<${entityName}>\n`

    data.forEach((item, index) => {
      xml += `  <record id="${index + 1}">\n`
      headers.forEach(header => {
        const value = item[header]
        if (value !== null && value !== undefined) {
          xml += `    <${header}>${this.escapeXML(value.toString())}</${header}>\n`
        }
      })
      xml += `  </record>\n`
    })

    xml += `</${entityName}>`
    return xml
  }

  private static escapeXML(str: string): string {
    return str
      .replace(/&/g, '&')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/"/g, '"')
      .replace(/'/g, '\'')
  }

  static async getBackupList(): Promise<{ filename: string; size: number; createdAt: Date; type: string }[]> {
    try {
      const files = await import('fs').then(fs => fs.promises.readdir(this.BACKUP_DIR))
      const backupFiles = files.filter(file => file.startsWith('backup-') || file.startsWith('export-'))

      const backupList = await Promise.all(
        backupFiles.map(async (filename) => {
          const filepath = path.join(this.BACKUP_DIR, filename)
          const stats = await import('fs').then(fs => fs.promises.stat(filepath))

          const type = filename.includes('export-') ? 'export' :
                      filename.includes('incremental') ? 'incremental' : 'full'

          return {
            filename,
            size: stats.size,
            createdAt: stats.birthtime,
            type
          }
        })
      )

      return backupList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    } catch (error) {
      console.error('Failed to get backup list:', error)
      return []
    }
  }

  static async deleteBackup(filename: string): Promise<{ success: boolean; error?: string }> {
    try {
      const filepath = path.join(this.BACKUP_DIR, filename)
      await import('fs').then(fs => fs.promises.unlink(filepath))

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}