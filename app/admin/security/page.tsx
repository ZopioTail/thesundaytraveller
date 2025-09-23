'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  UserIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

interface SecurityEvent {
  id: string
  timestamp: string
  type: 'failed_login' | 'csrf_violation' | 'rate_limit_exceeded' | 'validation_error' | 'suspicious_activity'
  severity: 'low' | 'medium' | 'high' | 'critical'
  details: Record<string, any>
  ip: string
  userAgent: string
  userId?: string
  resolved: boolean
  resolvedAt?: string
  resolvedBy?: string
}

export default function SecurityPage() {
  const [events, setEvents] = useState<SecurityEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterResolved, setFilterResolved] = useState<string>('all')

  // Mock data for demonstration
  useEffect(() => {
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        type: 'failed_login',
        severity: 'medium',
        details: { email: 'suspicious@example.com', attempts: 5 },
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        resolved: false
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        type: 'rate_limit_exceeded',
        severity: 'low',
        details: { endpoint: '/api/posts', requests: 150 },
        ip: '10.0.0.50',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; SM-G975F)',
        resolved: true,
        resolvedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        resolvedBy: 'admin'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        type: 'csrf_violation',
        severity: 'high',
        details: { endpoint: '/api/admin/posts', method: 'POST' },
        ip: '203.0.113.1',
        userAgent: 'curl/7.68.0',
        resolved: false
      }
    ]

    setEvents(mockEvents)
    setFilteredEvents(mockEvents)
    setLoading(false)
  }, [])

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events.filter(event => {
      const matchesSearch =
        event.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        JSON.stringify(event.details).toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = filterType === 'all' || event.type === filterType
      const matchesSeverity = filterSeverity === 'all' || event.severity === filterSeverity
      const matchesResolved = filterResolved === 'all' ||
        (filterResolved === 'resolved' && event.resolved) ||
        (filterResolved === 'unresolved' && !event.resolved)

      return matchesSearch && matchesType && matchesSeverity && matchesResolved
    })

    setFilteredEvents(filtered)
  }, [events, searchTerm, filterType, filterSeverity, filterResolved])

  const getSeverityColor = (severity: SecurityEvent['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: SecurityEvent['type']) => {
    switch (type) {
      case 'failed_login':
        return <UserIcon className="h-4 w-4" />
      case 'csrf_violation':
        return <ShieldCheckIcon className="h-4 w-4" />
      case 'rate_limit_exceeded':
        return <ClockIcon className="h-4 w-4" />
      case 'validation_error':
        return <ExclamationTriangleIcon className="h-4 w-4" />
      default:
        return <GlobeAltIcon className="h-4 w-4" />
    }
  }

  const getStats = () => {
    const total = events.length
    const unresolved = events.filter(e => !e.resolved).length
    const critical = events.filter(e => e.severity === 'critical').length
    const today = events.filter(e => {
      const eventDate = new Date(e.timestamp)
      const today = new Date()
      return eventDate.toDateString() === today.toDateString()
    }).length

    return { total, unresolved, critical, today }
  }

  const stats = getStats()

  const handleResolveEvent = (eventId: string) => {
    setEvents(prev => prev.map(event =>
      event.id === eventId
        ? { ...event, resolved: true, resolvedAt: new Date().toISOString(), resolvedBy: 'admin' }
        : event
    ))
  }

  const handleExportEvents = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Severity', 'IP', 'Details', 'Resolved'].join(','),
      ...filteredEvents.map(event => [
        event.timestamp,
        event.type,
        event.severity,
        event.ip,
        JSON.stringify(event.details),
        event.resolved ? 'Yes' : 'No'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `security-events-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
          <h1 className="text-2xl font-bold text-gray-900">Security Center</h1>
          <p className="text-gray-600">Monitor and manage security events</p>
        </div>
        <button
          onClick={handleExportEvents}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
          Export Events
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <GlobeAltIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-xl font-semibold">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Unresolved</p>
              <p className="text-xl font-semibold">{stats.unresolved}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShieldCheckIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Critical</p>
              <p className="text-xl font-semibold">{stats.critical}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ClockIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-xl font-semibold">{stats.today}</p>
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
                placeholder="Search events..."
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
              <option value="failed_login">Failed Login</option>
              <option value="csrf_violation">CSRF Violation</option>
              <option value="rate_limit_exceeded">Rate Limit</option>
              <option value="validation_error">Validation Error</option>
              <option value="suspicious_activity">Suspicious Activity</option>
            </select>

            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <select
              value={filterResolved}
              onChange={(e) => setFilterResolved(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="resolved">Resolved</option>
              <option value="unresolved">Unresolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredEvents.length === 0 ? (
          <div className="p-8 text-center">
            <ShieldCheckIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No security events found</h3>
            <p className="text-gray-500">No events match your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getTypeIcon(event.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {event.type.replace('_', ' ').toUpperCase()}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityColor(event.severity)}`}>
                          {event.severity.toUpperCase()}
                        </span>
                        {event.resolved && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200">
                            RESOLVED
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600">
                        {JSON.stringify(event.details, null, 2)}
                      </p>

                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>IP: {event.ip}</span>
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                        {event.resolved && event.resolvedAt && (
                          <span>Resolved: {new Date(event.resolvedAt).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!event.resolved && (
                      <button
                        onClick={() => handleResolveEvent(event.id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}