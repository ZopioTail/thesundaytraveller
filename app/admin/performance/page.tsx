'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { PerformanceMonitor, PerformanceBudget, QueryOptimizer, MemoryManager } from '@/lib/performance'

interface PerformanceMetrics {
  [key: string]: {
    count: number
    avg: number
    min: number
    max: number
    last: number
  }
}

interface BudgetReport {
  [key: string]: {
    budget: number
    status: 'within' | 'over' | 'unknown'
  }
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [budgetReport, setBudgetReport] = useState<BudgetReport>({})
  const [cacheStats, setCacheStats] = useState({ size: 0, maxSize: 0, calculatedSize: 0 })
  const [memoryUsage, setMemoryUsage] = useState<{ used: number; total: number; limit: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadPerformanceData()
    const interval = setInterval(loadPerformanceData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  const loadPerformanceData = () => {
    setMetrics(PerformanceMonitor.getAllMetrics())
    setBudgetReport(PerformanceBudget.getBudgetReport())
    setCacheStats(QueryOptimizer.getCacheStats())
    setMemoryUsage(MemoryManager.getMemoryUsage())
    setLoading(false)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    loadPerformanceData()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleClearCache = () => {
    QueryOptimizer.clearCache()
    loadPerformanceData()
  }

  const handleMemoryCleanup = () => {
    MemoryManager.cleanup()
    loadPerformanceData()
  }

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`
    return `${(ms / 1000).toFixed(2)}s`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'within':
        return <CheckCircleIcon className="h-4 w-4 text-green-600" />
      case 'over':
        return <XCircleIcon className="h-4 w-4 text-red-600" />
      default:
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'within':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'over':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
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
          <h1 className="text-2xl font-bold text-gray-900">Performance Monitor</h1>
          <p className="text-gray-600">Monitor application performance and optimization metrics</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleMemoryCleanup}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Cleanup Memory
          </button>
          <button
            onClick={handleClearCache}
            className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Clear Cache
          </button>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Active Metrics</p>
              <p className="text-xl font-semibold">{Object.keys(metrics).length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CpuChipIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Cache Size</p>
              <p className="text-xl font-semibold">{cacheStats.size}/{cacheStats.maxSize}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ClockIcon className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Budget Status</p>
              <p className="text-xl font-semibold">
                {Object.values(budgetReport).filter(b => b.status === 'within').length}/
                {Object.keys(budgetReport).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white p-4 rounded-lg border border-gray-200"
        >
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <InformationCircleIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-500">Memory Usage</p>
              <p className="text-xl font-semibold">
                {memoryUsage ? formatBytes(memoryUsage.used) : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Performance Metrics</h2>
        </div>

        {Object.keys(metrics).length === 0 ? (
          <div className="p-8 text-center">
            <ChartBarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No metrics available</h3>
            <p className="text-gray-500">Performance metrics will appear here as operations are performed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(metrics).map(([label, data], index) => (
                  <motion.tr
                    key={label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {label}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {data.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(data.avg)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(data.min)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(data.max)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(data.last)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Budget Report */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Performance Budgets</h2>
        </div>

        {Object.keys(budgetReport).length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircleIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets configured</h3>
            <p className="text-gray-500">Performance budgets help monitor if operations stay within expected time limits.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(budgetReport).map(([metric, data], index) => (
                  <motion.tr
                    key={metric}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {metric}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatTime(data.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(data.status)}
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(data.status)}`}>
                          {data.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">System Information</h2>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Cache Statistics</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div>Current Size: {cacheStats.size}</div>
                <div>Max Size: {cacheStats.maxSize}</div>
                <div>Calculated Size: {formatBytes(cacheStats.calculatedSize)}</div>
              </div>
            </div>

            {memoryUsage && (
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Memory Usage</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Used: {formatBytes(memoryUsage.used)}</div>
                  <div>Total: {formatBytes(memoryUsage.total)}</div>
                  <div>Limit: {formatBytes(memoryUsage.limit)}</div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(memoryUsage.used / memoryUsage.limit) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {((memoryUsage.used / memoryUsage.limit) * 100).toFixed(1)}% of limit
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}