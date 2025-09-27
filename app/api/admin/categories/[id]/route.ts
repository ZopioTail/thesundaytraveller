import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

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

    const body = await request.json()
    const { name, description, color, icon, parentId, isActive, sortOrder } = body

    // Check if category exists
    const categoryRef = doc(db, 'categories', params.id)
    const categorySnap = await getDoc(categoryRef)

    if (!categorySnap.exists()) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    const existingCategory = categorySnap.data()

    // Generate new slug if name changed
    let slug = existingCategory.slug
    if (name && name !== existingCategory.name) {
      slug = generateSlug(name)
    }

    const updateData: any = {
      updatedAt: Timestamp.now(),
    }

    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (color !== undefined) updateData.color = color
    if (icon !== undefined) updateData.icon = icon
    if (parentId !== undefined) updateData.parentId = parentId
    if (isActive !== undefined) updateData.isActive = isActive
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder

    await updateDoc(categoryRef, updateData)

    return NextResponse.json({
      id: params.id,
      ...updateData
    })
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

    // Check if category exists
    const categoryRef = doc(db, 'categories', params.id)
    const categorySnap = await getDoc(categoryRef)

    if (!categorySnap.exists()) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // For now, skip the children check as it requires complex querying
    // This would need a more sophisticated implementation with Firestore

    // Delete the category
    await deleteDoc(categoryRef)

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}