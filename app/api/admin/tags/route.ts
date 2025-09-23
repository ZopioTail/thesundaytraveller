import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { tags } from '@/lib/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'

// GET /api/admin/tags - Get all tags
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tagsList = await db
      .select()
      .from(tags)
      .orderBy(desc(tags.createdAt))

    return NextResponse.json(tagsList)
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/tags - Create new tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, color } = body

    if (!name) {
      return NextResponse.json({ error: 'Tag name is required' }, { status: 400 })
    }

    const slug = generateSlug(name)

    // Check if slug already exists
    const existingTag = await db
      .select()
      .from(tags)
      .where(eq(tags.slug, slug))
      .limit(1)

    if (existingTag.length > 0) {
      return NextResponse.json({ error: 'Tag with this name already exists' }, { status: 409 })
    }

    const [newTag] = await db
      .insert(tags)
      .values({
        name,
        slug,
        color: color || '#10b981',
      })
      .returning()

    return NextResponse.json(newTag, { status: 201 })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}