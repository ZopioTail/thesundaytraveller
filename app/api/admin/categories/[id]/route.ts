import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { categories } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'

// PUT /api/admin/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categoryId = parseInt(params.id)

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, description, color, icon, parentId, isActive, sortOrder } = body

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1)

    if (existingCategory.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Generate new slug if name changed
    let slug = existingCategory[0].slug
    if (name && name !== existingCategory[0].name) {
      slug = generateSlug(name)

      // Check if new slug conflicts with other categories
      const slugConflict = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1)

      if (slugConflict.length > 0) {
        return NextResponse.json({ error: 'Category with this name already exists' }, { status: 409 })
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (color !== undefined) updateData.color = color
    if (icon !== undefined) updateData.icon = icon
    if (parentId !== undefined) updateData.parentId = parentId
    if (isActive !== undefined) updateData.isActive = isActive
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder

    const [updatedCategory] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, categoryId))
      .returning()

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_DELETE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categoryId = parseInt(params.id)

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: 'Invalid category ID' }, { status: 400 })
    }

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1)

    if (existingCategory.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if category has children
    const children = await db
      .select()
      .from(categories)
      .where(eq(categories.parentId, categoryId))

    if (children.length > 0) {
      return NextResponse.json({ error: 'Cannot delete category with subcategories' }, { status: 400 })
    }

    // Delete the category
    await db
      .delete(categories)
      .where(eq(categories.id, categoryId))

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}