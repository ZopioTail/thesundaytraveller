'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'outline'
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
  rounded?: boolean
  dot?: boolean
  icon?: ReactNode
  onClick?: () => void
  removable?: boolean
  onRemove?: () => void
}

const variantStyles = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  primary: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  secondary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  info: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  outline: 'border border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
}

const sizeStyles = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm'
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  rounded = true,
  dot = false,
  icon,
  onClick,
  removable = false,
  onRemove
}: BadgeProps) {
  const badgeClasses = cn(
    'inline-flex items-center font-medium transition-all duration-200',
    variantStyles[variant],
    sizeStyles[size],
    rounded ? 'rounded-full' : 'rounded-md',
    onClick && 'cursor-pointer hover:opacity-80',
    className
  )

  const content = (
    <>
      {dot && (
        <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5 flex-shrink-0" />
      )}
      {icon && (
        <span className="mr-1 flex-shrink-0">
          {icon}
        </span>
      )}
      <span className="truncate">
        {children}
      </span>
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove?.()
          }}
          className="ml-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </>
  )

  if (onClick) {
    return (
      <motion.button
        className={badgeClasses}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        {content}
      </motion.button>
    )
  }

  return (
    <span className={badgeClasses}>
      {content}
    </span>
  )
}

// Specialized Badge Components
export function StatusBadge({
  status,
  className = '',
  ...props
}: {
  status: 'draft' | 'published' | 'archived' | 'pending' | 'approved' | 'rejected'
} & Omit<BadgeProps, 'variant' | 'children'>) {
  const statusConfig = {
    draft: { variant: 'warning' as const, label: 'Draft' },
    published: { variant: 'success' as const, label: 'Published' },
    archived: { variant: 'default' as const, label: 'Archived' },
    pending: { variant: 'warning' as const, label: 'Pending' },
    approved: { variant: 'success' as const, label: 'Approved' },
    rejected: { variant: 'error' as const, label: 'Rejected' }
  }

  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

export function PriorityBadge({
  priority,
  className = '',
  ...props
}: {
  priority: 'low' | 'medium' | 'high' | 'urgent'
} & Omit<BadgeProps, 'variant' | 'children'>) {
  const priorityConfig = {
    low: { variant: 'info' as const, label: 'Low' },
    medium: { variant: 'warning' as const, label: 'Medium' },
    high: { variant: 'error' as const, label: 'High' },
    urgent: { variant: 'error' as const, label: 'Urgent' }
  }

  const config = priorityConfig[priority]

  return (
    <Badge
      variant={config.variant}
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

export function RoleBadge({
  role,
  className = '',
  ...props
}: {
  role: 'admin' | 'editor' | 'author' | 'user'
} & Omit<BadgeProps, 'variant' | 'children'>) {
  const roleConfig = {
    admin: { variant: 'error' as const, label: 'Admin' },
    editor: { variant: 'warning' as const, label: 'Editor' },
    author: { variant: 'info' as const, label: 'Author' },
    user: { variant: 'default' as const, label: 'User' }
  }

  const config = roleConfig[role]

  return (
    <Badge
      variant={config.variant}
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

export function CountBadge({
  count,
  max = 99,
  className = '',
  ...props
}: {
  count: number
  max?: number
} & Omit<BadgeProps, 'children'>) {
  const displayCount = count > max ? `${max}+` : count.toString()

  return (
    <Badge
      variant="error"
      size="sm"
      className={cn('min-w-[20px] h-5 flex items-center justify-center', className)}
      {...props}
    >
      {displayCount}
    </Badge>
  )
}