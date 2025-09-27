import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, preferences } = body

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Store the newsletter subscription in Firestore
    const { createDocument } = await import('@/lib/firestore')

    const subscriptionData = {
      email,
      name: name || '',
      preferences: preferences || {
        categories: [],
        frequency: 'weekly',
        format: 'html'
      },
      status: 'active',
      subscriptionSource: 'website',
      createdAt: new Date(),
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    const docId = await createDocument('newsletter_subscriptions', subscriptionData)

    // Send confirmation email notification
    const emailData = {
      to: process.env.EMAIL_TO || 'vinny27880@gmail.com',
      subject: `New Newsletter Subscription: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">New Newsletter Subscription</h2>
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Name:</strong> ${name || 'Not provided'}</p>
            <p><strong>Subscription Source:</strong> Website</p>
            <p><strong>Preferred Format:</strong> ${preferences?.format || 'HTML'}</p>
            <p><strong>Frequency:</strong> ${preferences?.frequency || 'Weekly'}</p>
            ${preferences?.categories?.length > 0 ? `<p><strong>Categories:</strong> ${preferences.categories.join(', ')}</p>` : ''}
          </div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This person subscribed to your newsletter from the website.
          </p>
        </div>
      `,
      text: `
New Newsletter Subscription: ${email}

Email: ${email}
Name: ${name || 'Not provided'}
Subscription Source: Website
Preferred Format: ${preferences?.format || 'HTML'}
Frequency: ${preferences?.frequency || 'Weekly'}
${preferences?.categories?.length > 0 ? `Categories: ${preferences.categories.join(', ')}` : ''}

---
This person subscribed to your newsletter from the website.
      `
    }

    // Log the email data (in production, integrate with email service)
    console.log('Newsletter subscription email would be sent:', emailData)

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your email for a confirmation message.',
      id: docId
    })

  } catch (error) {
    console.error('Error processing newsletter subscription:', error)
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    )
  }
}