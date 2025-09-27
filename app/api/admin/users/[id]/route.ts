import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { getDocumentById, updateDocument, deleteDocument } from '@/lib/firestore'
import bcrypt from 'bcryptjs'
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

// GET /api/admin/users/[id] - Get single user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.USER_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRef = doc(firestoreDb, 'users', params.id)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userSnap.data()

    // Transform user to match expected format
    const transformedUser = {
      id: userSnap.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin?.toDate ? user.lastLogin.toDate() : user.lastLogin,
      createdAt: user.createdAt?.toDate ? user.createdAt.toDate() : user.createdAt,
      avatar: user.avatar,
    }

    return NextResponse.json(transformedUser)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.USER_UPDATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      email,
      username,
      firstName,
      lastName,
      password,
      role,
      isActive
    } = body

    // Check if user exists
    const userRef = doc(firestoreDb, 'users', params.id)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const updateData: any = {
      updatedAt: Timestamp.now(),
    }

    if (email !== undefined) updateData.email = email
    if (username !== undefined) {
      // Check if new username already exists
      const usersRef = collection(firestoreDb, 'users')
      const existingUsernameQuery = query(
        usersRef,
        where('username', '==', username),
        where('__name__', '!=', params.id)
      )
      const existingUsernameSnap = await getDocs(existingUsernameQuery)

      if (!existingUsernameSnap.empty) {
        return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
      }
      updateData.username = username
    }
    if (firstName !== undefined) updateData.firstName = firstName
    if (lastName !== undefined) updateData.lastName = lastName
    if (role !== undefined) updateData.role = role
    if (isActive !== undefined) updateData.isActive = isActive

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 12)
    }

    await updateDoc(userRef, updateData)

    const updatedUser = {
      id: params.id,
      ...updateData,
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.USER_DELETE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user exists
    const userRef = doc(firestoreDb, 'users', params.id)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Delete the user
    await deleteDoc(userRef)

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}