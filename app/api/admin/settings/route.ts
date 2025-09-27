import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { getDocuments, createDocument, updateDocument } from '@/lib/firestore'
import { Timestamp } from 'firebase/firestore'

// GET /api/admin/settings - Get all settings grouped by category
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.SETTINGS_VIEW)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allSettings = await getDocuments('settings')

    // Group settings by category
    const groupedSettings = {
      general: [
        {
          id: 'site_title',
          key: 'siteTitle',
          value: 'The Sunday Traveller',
          description: 'Website title',
          category: 'general',
          isPublic: true,
        },
        {
          id: 'site_description',
          key: 'siteDescription',
          value: 'A travel blog sharing adventures and experiences from around the world.',
          description: 'Website description',
          category: 'general',
          isPublic: true,
        },
        {
          id: 'site_url',
          key: 'siteUrl',
          value: 'https://thesundaytraveller.com',
          description: 'Website URL',
          category: 'general',
          isPublic: true,
        },
        {
          id: 'admin_email',
          key: 'adminEmail',
          value: 'admin@thesundaytraveller.com',
          description: 'Admin email address',
          category: 'general',
          isPublic: false,
        },
      ],
      seo: [
        {
          id: 'meta_keywords',
          key: 'metaKeywords',
          value: 'travel, adventure, blog, photography, destinations',
          description: 'Default meta keywords',
          category: 'seo',
          isPublic: true,
        },
        {
          id: 'og_image',
          key: 'ogImage',
          value: '/images/optimized/hero-main.jpg',
          description: 'Default Open Graph image',
          category: 'seo',
          isPublic: true,
        },
        {
          id: 'twitter_handle',
          key: 'twitterHandle',
          value: '@thesundaytraveller',
          description: 'Twitter handle',
          category: 'seo',
          isPublic: true,
        },
        {
          id: 'facebook_page',
          key: 'facebookPage',
          value: 'https://facebook.com/thesundaytraveller',
          description: 'Facebook page URL',
          category: 'seo',
          isPublic: true,
        },
      ],
      content: [
        {
          id: 'posts_per_page',
          key: 'postsPerPage',
          value: 10,
          description: 'Number of posts per page',
          category: 'content',
          isPublic: true,
        },
        {
          id: 'excerpt_length',
          key: 'excerptLength',
          value: 150,
          description: 'Excerpt length in words',
          category: 'content',
          isPublic: true,
        },
        {
          id: 'auto_generate_excerpts',
          key: 'autoGenerateExcerpts',
          value: true,
          description: 'Auto-generate excerpts from content',
          category: 'content',
          isPublic: false,
        },
        {
          id: 'enable_comments',
          key: 'enableComments',
          value: true,
          description: 'Enable comments on posts',
          category: 'content',
          isPublic: true,
        },
      ],
      notifications: [
        {
          id: 'email_notifications',
          key: 'emailNotifications',
          value: true,
          description: 'Enable email notifications',
          category: 'notifications',
          isPublic: false,
        },
        {
          id: 'new_comment_notifications',
          key: 'newCommentNotifications',
          value: true,
          description: 'Notify on new comments',
          category: 'notifications',
          isPublic: false,
        },
        {
          id: 'new_user_notifications',
          key: 'newUserNotifications',
          value: true,
          description: 'Notify on new user registrations',
          category: 'notifications',
          isPublic: false,
        },
      ],
    }

    // Override default values with saved values from database
    allSettings.forEach((setting: any) => {
      const category = groupedSettings[setting.category as keyof typeof groupedSettings]
      if (category) {
        const settingItem = category.find(s => s.key === setting.key)
        if (settingItem) {
          settingItem.value = setting.value
        }
      }
    })

    return NextResponse.json(Object.values(groupedSettings))
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/settings - Save settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.SETTINGS_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body

    if (!Array.isArray(settings)) {
      return NextResponse.json({ error: 'Settings must be an array' }, { status: 400 })
    }

    // Save each setting
    const results = await Promise.all(
      settings.map(async (setting: any) => {
        const existingSetting = await getDocuments('settings', {
          where: [{ field: 'key', operator: '==', value: setting.key }],
          limit: 1
        })

        if (existingSetting.length > 0) {
          // Update existing setting
          await updateDocument('settings', existingSetting[0].id, {
            value: setting.value,
            updatedAt: Timestamp.now(),
          })
        } else {
          // Create new setting
          await createDocument('settings', {
            key: setting.key,
            value: setting.value,
            description: setting.description || '',
            category: setting.category,
            isPublic: setting.isPublic,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
          })
        }

        return { key: setting.key, success: true }
      })
    )

    return NextResponse.json({
      message: 'Settings saved successfully',
      results
    })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}