import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq, or } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, firstName, lastName } = body

    // Validation
    if (!email || !username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Email, username, and password are required',
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already exists',
          message: 'A user with this email or username already exists',
        },
        { status: 409 }
      )
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email,
        username,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role: 'user',
        isActive: true,
      })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        createdAt: users.createdAt,
      })

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser[0],
      },
    })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Registration failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}