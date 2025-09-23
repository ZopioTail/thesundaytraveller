import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { BackupManager, BackupOptions } from '@/lib/backup'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { type, options = {} } = body

    if (!type || !['full', 'incremental'].includes(type)) {
      return NextResponse.json({ error: 'Invalid backup type' }, { status: 400 })
    }

    let result

    if (type === 'full') {
      result = await BackupManager.createFullBackup(options as BackupOptions)
    } else {
      const sinceDate = new Date(options.sinceDate || Date.now() - 24 * 60 * 60 * 1000) // Default to last 24 hours
      result = await BackupManager.createIncrementalBackup(sinceDate)
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `${type} backup created successfully`,
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
    console.error('Backup API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'editor')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const backups = await BackupManager.getBackupList()

    return NextResponse.json({
      success: true,
      backups
    })

  } catch (error) {
    console.error('Get backups API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}