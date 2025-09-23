import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BackupManager, ExportOptions } from '@/lib/backup'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { entity, format, options = {} } = body

    if (!entity || !format) {
      return NextResponse.json({ error: 'Entity and format are required' }, { status: 400 })
    }

    if (!['posts', 'users', 'comments', 'categories', 'tags', 'media', 'newsletter', 'analytics'].includes(entity)) {
      return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 })
    }

    if (!['csv', 'json', 'xml'].includes(format)) {
      return NextResponse.json({ error: 'Invalid export format' }, { status: 400 })
    }

    const exportOptions: ExportOptions = {
      entity: entity as any,
      format: format as any,
      includeMetadata: options.includeMetadata || false,
      dateFrom: options.dateFrom ? new Date(options.dateFrom) : undefined,
      dateTo: options.dateTo ? new Date(options.dateTo) : undefined,
      limit: options.limit
    }

    const result = await BackupManager.exportData(exportOptions)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${entity} exported successfully`,
        filename: result.filename,
        size: result.size
      })
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Export API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}