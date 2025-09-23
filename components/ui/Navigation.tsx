'use client'

import { ReactNode, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRightIcon, HomeIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// Breadcrumb Component
interface BreadcrumbItem {
  label: string
  href?: string
  icon?: ReactNode
  current?: boolean
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: ReactNode
  maxItems?: number
}

export function Breadcrumbs({
  items,
  className = '',
  separator = <ChevronRightIcon className="w-4 h-4" />,
  maxItems = 5
}: BreadcrumbsProps) {
  const displayItems = items.length > maxItems
    ? [
        items[0],
        { label: '...', href: undefined },
        ...items.slice(-maxItems + 2)
      ]
    : items

  return (
    <nav className={cn('flex items-center space-x-1 text-sm', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400 dark:text-gray-600">
                {separator}
              </span>
            )}

            {item.label === '...' ? (
              <span className="text-gray-500 dark:text-gray-400 cursor-default">
                {item.label}
              </span>
            ) : item.current ? (
              <span className="flex items-center space-x-1 text-gray-900 dark:text-white font-medium">
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            ) : (
              <a
                href={item.href}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Pagination Component
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  showInfo?: boolean
  maxVisiblePages?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
  showInfo = true,
  maxVisiblePages = 5
}: PaginationProps) {
  const getVisiblePages = () => {
    const half = Math.floor(maxVisiblePages / 2)
    let start = Math.max(1, currentPage - half)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }

  const visiblePages = getVisiblePages()

  if (totalPages <= 1) return null

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {showInfo && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
      )}

      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
          aria-label="Previous page"
        >
          <ChevronRightIcon className="w-5 h-5 rotate-180" />
        </button>

        {/* Page Numbers */}
        {visiblePages[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              1
            </button>
            {visiblePages[0] > 2 && (
              <span className="px-2 text-gray-400">...</span>
            )}
          </>
        )}

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
              page === currentPage
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            {page}
          </button>
        ))}

        {visiblePages[visiblePages.length - 1] < totalPages && (
          <>
            {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
              <span className="px-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-md transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
          aria-label="Next page"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// Sidebar Navigation Component
interface NavItem {
  label: string
  href?: string
  icon?: ReactNode
  badge?: string | number
  children?: NavItem[]
  disabled?: boolean
  external?: boolean
}

interface SidebarProps {
  items: NavItem[]
  className?: string
  collapsed?: boolean
  onToggle?: () => void
  currentPath?: string
}

export function Sidebar({
  items,
  className = '',
  collapsed = false,
  onToggle,
  currentPath = ''
}: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  const renderNavItem = (item: NavItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.label)
    const active = isActive(item.href)

    return (
      <div key={item.label}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.label)
            } else if (item.href && !item.disabled) {
              if (item.external) {
                window.open(item.href, '_blank')
              } else {
                window.location.href = item.href
              }
            }
          }}
          disabled={item.disabled}
          className={cn(
            'w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
            level > 0 && 'ml-4',
            active
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800',
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <span className={cn('flex-shrink-0', active ? 'text-orange-500' : '')}>
                {item.icon}
              </span>
            )}
            {!collapsed && (
              <span className="font-medium truncate">{item.label}</span>
            )}
          </div>

          <div className="flex items-center space-x-1">
            {item.badge && !collapsed && (
              <span className={cn(
                'px-2 py-1 text-xs font-medium rounded-full',
                active
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
              )}>
                {item.badge}
              </span>
            )}

            {hasChildren && !collapsed && (
              <motion.svg
                className={cn('w-4 h-4 transition-transform duration-200', active ? 'text-orange-500' : '')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isExpanded ? 90 : 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </motion.svg>
            )}
          </div>
        </button>

        {/* Submenu */}
        {hasChildren && !collapsed && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="py-1">
                  {item.children!.map((child) => renderNavItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    )
  }

  return (
    <div className={cn(
      'flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Navigation
          </h2>
        )}
        {onToggle && (
          <button
            onClick={onToggle}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <Bars3Icon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map((item) => renderNavItem(item))}
      </div>
    </div>
  )
}

// Step Navigation Component
interface Step {
  id: string
  title: string
  description?: string
  completed?: boolean
  active?: boolean
  disabled?: boolean
}

interface StepNavigationProps {
  steps: Step[]
  currentStep: number
  onStepChange: (step: number) => void
  className?: string
  variant?: 'horizontal' | 'vertical'
  showDescriptions?: boolean
}

export function StepNavigation({
  steps,
  currentStep,
  onStepChange,
  className = '',
  variant = 'horizontal',
  showDescriptions = false
}: StepNavigationProps) {
  const handleStepClick = (stepIndex: number) => {
    if (steps[stepIndex]?.disabled) return
    onStepChange(stepIndex)
  }

  if (variant === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(index)}
            disabled={step.disabled}
            className={cn(
              'w-full flex items-start space-x-4 p-4 rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
              step.disabled && 'opacity-50 cursor-not-allowed',
              index === currentStep
                ? 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            )}
          >
            <div className={cn(
              'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              index === currentStep
                ? 'bg-orange-500 text-white'
                : step.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            )}>
              {step.completed ? '✓' : index + 1}
            </div>

            <div className="flex-1 text-left">
              <h3 className={cn(
                'font-medium',
                index === currentStep
                  ? 'text-orange-700 dark:text-orange-300'
                  : 'text-gray-900 dark:text-white'
              )}>
                {step.title}
              </h3>
              {showDescriptions && step.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => handleStepClick(index)}
            disabled={step.disabled}
            className={cn(
              'flex flex-col items-center space-y-2 p-2 rounded-lg transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
              step.disabled && 'opacity-50 cursor-not-allowed',
              index === currentStep && 'text-orange-600 dark:text-orange-400'
            )}
          >
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              index === currentStep
                ? 'bg-orange-500 text-white'
                : step.completed
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            )}>
              {step.completed ? '✓' : index + 1}
            </div>

            <div className="text-center">
              <div className={cn(
                'text-xs font-medium',
                index === currentStep
                  ? 'text-orange-600 dark:text-orange-400'
                  : 'text-gray-600 dark:text-gray-400'
              )}>
                {step.title}
              </div>
              {showDescriptions && step.description && (
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {step.description}
                </div>
              )}
            </div>
          </button>

          {index < steps.length - 1 && (
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700 mx-4" />
          )}
        </div>
      ))}
    </div>
  )
}