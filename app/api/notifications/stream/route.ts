import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = request.nextUrl.searchParams.get('userId')

  if (!userId) {
    return new Response('User ID required', { status: 400 })
  }

  // Set up Server-Sent Events
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode('data: {"type":"connection","message":"Connected"}\n\n'))

      // Simulate sending notifications (in real app, this would be from database or message queue)
      const interval = setInterval(() => {
        // This is where you'd check for new notifications from database
        // For now, we'll just keep the connection alive
      }, 30000) // Send keepalive every 30 seconds

      // Cleanup on client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  })
}