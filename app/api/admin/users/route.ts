import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { getDocuments, createDocument } from '@/lib/firestore'
import bcrypt from 'bcryptjs'
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db as firestoreDb } from '@/lib/firebase'

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.USER_READ)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const users = await getDocuments('users', {
      orderBy: 'createdAt',
      orderDirection: 'desc'
    })

    // Transform users to match expected format
    const transformedUsers = users.map((user: any) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin?.toDate ? user.lastLogin.toDate() : user.lastLogin,
      createdAt: user.createdAt?.toDate ? user.createdAt.toDate() : user.createdAt,
      avatar: user.avatar,
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.USER_CREATE)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      email,
      username,
      firstName,
      lastName,
      password,
      role = 'user',
      isActive = true
    } = body

    if (!email || !username || !password) {
      return NextResponse.json({ error: 'Email, username, and password are required' }, { status: 400 })
    }

    // Check if user already exists
    const usersRef = collection(firestoreDb, 'users')
    const existingUserQuery = query(usersRef, where('email', '==', email))
    const existingUserSnap = await getDocs(existingUserQuery)

    if (!existingUserSnap.empty) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 })
    }

    // Check if username already exists
    const existingUsernameQuery = query(usersRef, where('username', '==', username))
    const existingUsernameSnap = await getDocs(existingUsernameQuery)

    if (!existingUsernameSnap.empty) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    const newUserData = {
      email,
      username,
      firstName,
      lastName,
      passwordHash,
      role,
      isActive,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await createDocument('users', newUserData)

    return NextResponse.json({
      id: docRef,
      ...newUserData
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}