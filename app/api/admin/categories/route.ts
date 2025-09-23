import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { categories } from '@/lib/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'

// GET /api/admin/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categoriesList = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.sortOrder), categories.name)

    return NextResponse.json(categoriesList)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, color, icon, parentId, isActive = true } = body

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const slug = generateSlug(name)

    // Check if slug already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1)

    if (existingCategory.length > 0) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 })
    }

    // Get the highest sort order
    const [{ maxSort }] = await db
      .select({ maxSort: sql<number>`MAX(${categories.sortOrder})` })
      .from(categories)

    const [newCategory] = await db
      .insert(categories)
      .values({
        name,
        slug,
        description,
        color: color || '#6366f1',
        icon: icon || null,
        parentId: parentId || null,
        isActive,
        sortOrder: (maxSort || 0) + 1,
      })
      .returning()

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}