import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { tags } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'

// PUT /api/admin/tags/[id] - Update tag
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tagId = parseInt(params.id)

    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 })
    }

    const body = await request.json()
    const { name, color } = body

    // Check if tag exists
    const existingTag = await db
      .select()
      .from(tags)
      .where(eq(tags.id, tagId))
      .limit(1)

    if (existingTag.length === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Generate new slug if name changed
    let slug = existingTag[0].slug
    if (name && name !== existingTag[0].name) {
      slug = generateSlug(name)

      // Check if new slug conflicts with other tags
      const slugConflict = await db
        .select()
        .from(tags)
        .where(eq(tags.slug, slug))
        .limit(1)

      if (slugConflict.length > 0) {
        return NextResponse.json({ error: 'Tag with this name already exists' }, { status: 409 })
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    }

    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (color !== undefined) updateData.color = color

    const [updatedTag] = await db
      .update(tags)
      .set(updateData)
      .where(eq(tags.id, tagId))
      .returning()

    return NextResponse.json(updatedTag)
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/tags/[id] - Delete tag
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_DELETE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const tagId = parseInt(params.id)

    if (isNaN(tagId)) {
      return NextResponse.json({ error: 'Invalid tag ID' }, { status: 400 })
    }

    // Check if tag exists
    const existingTag = await db
      .select()
      .from(tags)
      .where(eq(tags.id, tagId))
      .limit(1)

    if (existingTag.length === 0) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
    }

    // Delete the tag
    await db
      .delete(tags)
      .where(eq(tags.id, tagId))

    return NextResponse.json({ message: 'Tag deleted successfully' })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}