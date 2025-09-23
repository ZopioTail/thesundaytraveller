'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  CloudArrowDownIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  FolderIcon,
  TrashIcon,
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

interface BackupFile {
  filename: string
  size: number
  createdAt: Date
  type: string
}

interface BackupOptions {
  includeAnalytics?: boolean
  includeMedia?: boolean
  dateFrom?: string
  dateTo?: string
  categories?: number[]
  authors?: number[]
}

export default function BackupsPage() {
  const [backups, setBackups] = useState<BackupFile[]>([])
  const [loading, setLoading] = useState(true)
  const [creatingBackup, setCreatingBackup] = useState(false)
  const [exportingData, setExportingData] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)

  // Backup creation options
  const [backupType, setBackupType] = useState<'full' | 'incremental'>('full')
  const [backupOptions, setBackupOptions] = useState<BackupOptions>({
    includeAnalytics: false,
    includeMedia: true,
    dateFrom: '',
    dateTo: ''
  })

  // Export options
  const [exportEntity, setExportEntity] = useState<string>('posts')
  const [exportFormat, setExportFormat] = useState<string>('csv')
  const [exportOptions, setExportOptions] = useState({
    includeMetadata: true,
    dateFrom: '',
    dateTo: '',
    limit: 1000
  })

  useEffect(() => {
    loadBackups()
  }, [])

  const loadBackups = async () => {
    try {
      const response = await fetch('/api/admin/backup')
      const data = await response.json()

      if (data.success) {
        setBackups(data.backups)
      }
    } catch (error) {
      console.error('Failed to load backups:', error)
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async () => {
    setCreatingBackup(true)
    try {
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: backupType,
          options: backupOptions
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Backup created successfully: ${data.filename}`)
        loadBackups()
        setShowCreateModal(false)
      } else {
        alert(`Backup failed: ${data.error}`)
      }
    } catch (error) {
      alert('Backup creation failed')
    } finally {
      setCreatingBackup(false)
    }
  }

  const exportData = async () => {
    setExportingData(true)
    try {
      const response = await fetch('/api/admin/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entity: exportEntity,
          format: exportFormat,
          options: exportOptions
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Export created successfully: ${data.filename}`)
        loadBackups()
        setShowExportModal(false)
      } else {
        alert(`Export failed: ${data.error}`)
      }
    } catch (error) {
      alert('Export failed')
    } finally {
      setExportingData(false)
    }
  }

  const deleteBackup = async (filename: string) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/backup?filename=${encodeURIComponent(filename)}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('Backup deleted successfully')
        loadBackups()
      } else {
        alert(`Delete failed: ${data.error}`)
      }
    } catch (error) {
      alert('Delete failed')
    }
  }

  const downloadBackup = (filename: string) => {
    const link = document.createElement('a')
    link.href = `/backups/${filename}`
    link.download = filename
    link.click()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const filteredBackups = backups.filter(backup => {
    const matchesSearch = backup.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || backup.type === filterType
    return matchesSearch && matchesType
  })

  const getBackupIcon = (type: string) => {
    switch (type) {
      case 'full':
        return <CloudArrowDownIcon className="h-5 w-5 text-blue-600" />
      case 'incremental':
        return <DocumentArrowDownIcon className="h-5 w-5 text-green-600" />
      case 'export':
        return <ArrowDownTrayIcon className="h-5 w-5 text-purple-600" />
      default:
        return <FolderIcon className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Backup & Export</h1>
          <p className="text-gray-600">Manage database backups and data exports</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Export Data
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <CloudArrowDownIcon className="h-4 w-4 mr-2" />
            Create Backup
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CloudArrowDownIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Backups</p>
              <p className="text-xl font-semibold">{backups.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Full Backups</p>
              <p className="text-xl font-semibold">{backups.filter(b => b.type === 'full').length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ArrowDownTrayIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Exports</p>
              <p className="text-xl font-semibold">{backups.filter(b => b.type === 'export').length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FolderIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Size</p>
              <p className="text-xl font-semibold">{formatFileSize(backups.reduce((sum, b) => sum + b.size, 0))}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search backups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="full">Full Backups</option>
              <option value="incremental">Incremental</option>
              <option value="export">Exports</option>
            </select>
          </div>
        </div>
      </div>

      {/* Backups List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredBackups.length === 0 ? (
          <div className="p-8 text-center">
            <FolderIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No backups found</h3>
            <p className="text-gray-500">Create your first backup to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBackups.map((backup, index) => (
              <motion.div
                key={backup.filename}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getBackupIcon(backup.type)}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {backup.filename}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>{formatFileSize(backup.size)}</span>
                        <span>{backup.createdAt.toLocaleString()}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                          {backup.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadBackup(backup.filename)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                      title="Download"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteBackup(backup.filename)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Backup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Create Backup</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Backup Type
                </label>
                <select
                  value={backupType}
                  onChange={(e) => setBackupType(e.target.value as 'full' | 'incremental')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="full">Full Backup</option>
                  <option value="incremental">Incremental Backup</option>
                </select>
              </div>

              {backupType === 'full' && (
                <>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeAnalytics"
                      checked={backupOptions.includeAnalytics}
                      onChange={(e) => setBackupOptions(prev => ({ ...prev, includeAnalytics: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="includeAnalytics" className="text-sm text-gray-700">
                      Include Analytics Data
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeMedia"
                      checked={backupOptions.includeMedia}
                      onChange={(e) => setBackupOptions(prev => ({ ...prev, includeMedia: e.target.checked }))}
                      className="mr-2"
                    />
                    <label htmlFor="includeMedia" className="text-sm text-gray-700">
                      Include Media Files
                    </label>
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={createBackup}
                  disabled={creatingBackup}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {creatingBackup ? 'Creating...' : 'Create Backup'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Export Data Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Export Data</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entity
                </label>
                <select
                  value={exportEntity}
                  onChange={(e) => setExportEntity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="posts">Posts</option>
                  <option value="users">Users</option>
                  <option value="comments">Comments</option>
                  <option value="categories">Categories</option>
                  <option value="tags">Tags</option>
                  <option value="media">Media</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="analytics">Analytics</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Format
                </label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limit
                </label>
                <input
                  type="number"
                  value={exportOptions.limit}
                  onChange={(e) => setExportOptions(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1000"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={exportData}
                  disabled={exportingData}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
                >
                  {exportingData ? 'Exporting...' : 'Export Data'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}