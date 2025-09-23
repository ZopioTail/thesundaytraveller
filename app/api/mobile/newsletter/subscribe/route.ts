import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { newsletterSubscriptions } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { analytics } from '@/lib/analytics'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, firstName, lastName, preferences } = body

    // Validation
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existingSubscription = await db
      .select()
      .from(newsletterSubscriptions)
      .where(eq(newsletterSubscriptions.email, email))
      .limit(1)

    if (existingSubscription.length > 0) {
      const subscription = existingSubscription[0]

      if (subscription.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: 'Already subscribed',
            message: 'This email is already subscribed to our newsletter',
          },
          { status: 409 }
        )
      } else {
        // Reactivate subscription
        await db
          .update(newsletterSubscriptions)
          .set({
            isActive: true,
            firstName,
            lastName,
            preferences,
            unsubscribedAt: null,
          })
          .where(eq(newsletterSubscriptions.email, email))

        // Track newsletter signup
        analytics.trackNewsletterSignup('mobile_app')

        return NextResponse.json({
          success: true,
          message: 'Subscription reactivated successfully',
          data: {
            email,
            firstName,
            lastName,
            preferences,
          },
        })
      }
    }

    // Create new subscription
    const newSubscription = await db
      .insert(newsletterSubscriptions)
      .values({
        email,
        firstName,
        lastName,
        isActive: true,
        subscriptionSource: 'mobile_app',
        preferences,
      })
      .returning()

    // Track newsletter signup
    analytics.trackNewsletterSignup('mobile_app')

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email,
        firstName,
        lastName,
        preferences,
      },
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Subscription failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is required',
        },
        { status: 400 }
      )
    }

    // Update subscription to inactive
    const result = await db
      .update(newsletterSubscriptions)
      .set({
        isActive: false,
        unsubscribedAt: new Date(),
      })
      .where(eq(newsletterSubscriptions.email, email))
      .returning()

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Subscription not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    })
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Unsubscribe failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}