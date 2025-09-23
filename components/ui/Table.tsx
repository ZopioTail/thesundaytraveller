'use client'

import { ReactNode, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// Table Types
export interface Column<T = any> {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (value: any, row: T, index: number) => ReactNode
  className?: string
}

export interface TableAction<T = any> {
  label: string
  icon?: ReactNode
  onClick: (row: T, index: number) => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: (row: T) => boolean
  show?: (row: T) => boolean
}

export interface BulkTableAction<T = any> {
  label: string
  icon?: ReactNode
  onClick: (items: T[]) => void
  variant?: 'primary' | 'secondary' | 'danger'
}

interface TableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  actions?: TableAction<T>[]
  searchable?: boolean
  filterable?: boolean
  sortable?: boolean
  pagination?: boolean
  pageSize?: number
  loading?: boolean
  emptyMessage?: string
  className?: string
  onRowClick?: (row: T, index: number) => void
  selectedRows?: Set<number>
  onSelectionChange?: (selectedRows: Set<number>) => void
  bulkActions?: BulkTableAction<T>[]
}

// Sort Types
type SortDirection = 'asc' | 'desc' | null

interface SortConfig {
  key: string
  direction: SortDirection
}

// Filter Types
interface FilterConfig {
  [key: string]: string
}

// Table Component
export function Table<T>({
  data,
  columns,
  actions = [],
  searchable = true,
  filterable = true,
  sortable = true,
  pagination = true,
  pageSize = 10,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  onRowClick,
  selectedRows,
  onSelectionChange,
  bulkActions = []
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: '', direction: null })
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...data]

    // Apply search filter
    if (searchTerm) {
      result = result.filter((row) =>
        columns.some((column) => {
          const value = column.render
            ? column.render('', row, 0)
            : (row as any)[column.key]
          return String(value).toLowerCase().includes(searchTerm.toLowerCase())
        })
      )
    }

    // Apply column filters
    Object.entries(filterConfig).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) => {
          const cellValue = (row as any)[key]
          return String(cellValue).toLowerCase().includes(value.toLowerCase())
        })
      }
    })

    // Apply sorting
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key]
        const bValue = (b as any)[sortConfig.key]

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return result
  }, [data, searchTerm, filterConfig, sortConfig, columns])

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = pagination
    ? processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processedData

  const handleSort = (key: string) => {
    if (!sortable) return

    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === 'asc'
          ? 'desc'
          : current.key === key && current.direction === 'desc'
          ? null
          : 'asc'
    }))
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilterConfig((current) => ({
      ...current,
      [key]: value
    }))
  }

  const handleRowSelect = (index: number) => {
    if (!onSelectionChange) return

    const newSelected = new Set(selectedRows || [])
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    onSelectionChange(newSelected)
  }

  const handleSelectAll = () => {
    if (!onSelectionChange) return

    if (selectedRows?.size === paginatedData.length) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(paginatedData.map((_, index) => index)))
    }
  }

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) return null
    if (sortConfig.direction === 'asc') return <ChevronUpIcon className="w-4 h-4" />
    if (sortConfig.direction === 'desc') return <ChevronDownIcon className="w-4 h-4" />
    return null
  }

  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Filters */}
      {(searchable || filterable) && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {searchable && (
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {filterable && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
          )}
        </div>
      )}

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {columns
                  .filter((col) => col.filterable)
                  .map((column) => (
                    <div key={column.key}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {column.label}
                      </label>
                      <input
                        type="text"
                        placeholder={`Filter ${column.label.toLowerCase()}...`}
                        value={filterConfig[column.key] || ''}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Actions */}
      {bulkActions.length > 0 && selectedRows && selectedRows.size > 0 && (
        <div className="flex items-center space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <span className="text-sm text-orange-700 dark:text-orange-300">
            {selectedRows.size} item{selectedRows.size > 1 ? 's' : ''} selected
          </span>
          <div className="flex space-x-2">
            {bulkActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  const selectedItems = Array.from(selectedRows).map(i => paginatedData[i])
                  action.onClick(selectedItems)
                }}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200"
              >
                {action.icon}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {onSelectionChange && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows?.size === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200',
                    column.className
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={cn(
                    'flex items-center space-x-1',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}>
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="ml-1">
                        {getSortIcon(column.key)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0) + (onSelectionChange ? 1 : 0)}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const globalIndex = (currentPage - 1) * pageSize + index
                return (
                  <motion.tr
                    key={globalIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200',
                      onRowClick && 'cursor-pointer'
                    )}
                    onClick={() => onRowClick?.(row, globalIndex)}
                  >
                    {onSelectionChange && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedRows?.has(globalIndex) || false}
                          onChange={() => handleRowSelect(globalIndex)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'px-6 py-4 whitespace-nowrap text-sm',
                          column.align === 'center' && 'text-center',
                          column.align === 'right' && 'text-right',
                          column.className
                        )}
                      >
                        {column.render
                          ? column.render((row as any)[column.key], row, globalIndex)
                          : (row as any)[column.key]
                        }
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {actions.map((action, actionIndex) => {
                            const shouldShow = !action.show || action.show(row)
                            const isDisabled = action.disabled?.(row) || false

                            if (!shouldShow) return null

                            return (
                              <button
                                key={actionIndex}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  action.onClick(row, globalIndex)
                                }}
                                disabled={isDisabled}
                                className={cn(
                                  'p-1 rounded-md transition-colors duration-200',
                                  'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                                  action.variant === 'primary' && 'text-orange-600 hover:text-orange-900 hover:bg-orange-100',
                                  action.variant === 'secondary' && 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
                                  action.variant === 'danger' && 'text-red-600 hover:text-red-900 hover:bg-red-100',
                                  isDisabled && 'opacity-50 cursor-not-allowed'
                                )}
                                title={action.label}
                              >
                                {action.icon || <span className="text-xs">{action.label}</span>}
                              </button>
                            )
                          })}
                        </div>
                      </td>
                    )}
                  </motion.tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {Math.min((currentPage - 1) * pageSize + 1, processedData.length)} to{' '}
            {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Table Cell Components
export function TableCell({
  children,
  className = '',
  align = 'left'
}: {
  children: ReactNode
  className?: string
  align?: 'left' | 'center' | 'right'
}) {
  return (
    <td className={cn(
      'px-6 py-4 whitespace-nowrap text-sm',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      className
    )}>
      {children}
    </td>
  )
}

export function TableHeader({
  children,
  className = '',
  sortable = false,
  sortDirection,
  onSort
}: {
  children: ReactNode
  className?: string
  sortable?: boolean
  sortDirection?: SortDirection
  onSort?: () => void
}) {
  return (
    <th
      className={cn(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider',
        sortable && 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-200',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortable && (
          <span>
            {sortDirection === 'asc' && <ChevronUpIcon className="w-4 h-4" />}
            {sortDirection === 'desc' && <ChevronDownIcon className="w-4 h-4" />}
          </span>
        )}
      </div>
    </th>
  )
}