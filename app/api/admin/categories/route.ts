import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getCategories, createCategory } from '@/lib/db'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { generateSlug } from '@/lib/auth-utils'
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

// GET /api/admin/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.POST_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categoriesList = await getCategories()
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

    // For now, skip the slug conflict check as it requires complex querying
    // This would need a more sophisticated implementation with Firestore

    // Get all categories to determine the highest sort order
    const categoriesRef = collection(firestoreDb, 'categories')
    const q = query(categoriesRef, orderBy('sortOrder', 'desc'), where('isActive', '==', true))
    const querySnapshot = await getDocs(q)
    const maxSort = querySnapshot.docs.length > 0
      ? Math.max(...querySnapshot.docs.map(doc => doc.data().sortOrder || 0))
      : 0

    const newCategoryData = {
      name,
      slug,
      description,
      color: color || '#6366f1',
      icon: icon || null,
      parentId: parentId || null,
      isActive,
      sortOrder: maxSort + 1,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(categoriesRef, newCategoryData)

    return NextResponse.json({
      id: docRef.id,
      ...newCategoryData
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}