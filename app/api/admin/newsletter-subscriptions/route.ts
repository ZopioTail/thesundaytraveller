import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasPermission, PERMISSIONS, User } from '@/lib/rbac'
import { getDocuments } from '@/lib/firestore'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || !hasPermission(session.user as User, PERMISSIONS.ANALYTICS_VIEW)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const subscriptions = await getDocuments('newsletterSubscriptions', {
      where: [{ field: 'isActive', operator: '==', value: true }],
      orderBy: 'createdAt',
      orderDirection: 'desc'
    })

    return NextResponse.json({
      subscriptions,
      total: subscriptions.length
    })
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}