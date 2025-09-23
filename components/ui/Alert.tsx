'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

type AlertVariant = 'success' | 'error' | 'warning' | 'info'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: ReactNode
  className?: string
  dismissible?: boolean
  onDismiss?: () => void
  icon?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  success: {
    container: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    title: 'text-green-800 dark:text-green-200',
    content: 'text-green-700 dark:text-green-300',
    icon: 'text-green-500'
  },
  error: {
    container: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    title: 'text-red-800 dark:text-red-200',
    content: 'text-red-700 dark:text-red-300',
    icon: 'text-red-500'
  },
  warning: {
    container: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    title: 'text-yellow-800 dark:text-yellow-200',
    content: 'text-yellow-700 dark:text-yellow-300',
    icon: 'text-yellow-500'
  },
  info: {
    container: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    title: 'text-blue-800 dark:text-blue-200',
    content: 'text-blue-700 dark:text-blue-300',
    icon: 'text-blue-500'
  }
}

const sizeStyles = {
  sm: 'p-3 text-sm',
  md: 'p-4',
  lg: 'p-6 text-lg'
}

const defaultIcons = {
  success: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  )
}

export default function Alert({
  variant = 'info',
  title,
  children,
  className = '',
  dismissible = false,
  onDismiss,
  icon,
  size = 'md'
}: AlertProps) {
  const style = variantStyles[variant]
  const defaultIcon = defaultIcons[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={cn(
        'relative border rounded-lg',
        style.container,
        sizeStyles[size],
        className
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className={cn('flex items-center justify-center', style.icon)}>
            {icon || defaultIcon}
          </div>
        </div>

        <div className="ml-3 flex-1">
          {title && (
            <h3 className={cn('font-medium', style.title)}>
              {title}
            </h3>
          )}
          <div className={cn('mt-1', title ? '' : 'ml-0', style.content)}>
            {children}
          </div>
        </div>

        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={cn(
                  'inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  style.container,
                  'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200',
                  'focus:ring-offset-gray-50 dark:focus:ring-offset-gray-900'
                )}
              >
                <span className="sr-only">Dismiss</span>
                <XMarkIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Alert Container for managing multiple alerts
interface AlertContainerProps {
  alerts: Array<{
    id: string
    variant: AlertVariant
    title?: string
    message: ReactNode
    dismissible?: boolean
    icon?: ReactNode
  }>
  onDismiss: (id: string) => void
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center'
  maxAlerts?: number
}

export function AlertContainer({
  alerts,
  onDismiss,
  position = 'top-right',
  maxAlerts = 5
}: AlertContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2'
  }

  const displayAlerts = alerts.slice(0, maxAlerts)

  return (
    <div className={cn(
      'fixed z-50 space-y-2 w-full max-w-sm',
      positionClasses[position]
    )}>
      <AnimatePresence mode="popLayout">
        {displayAlerts.map((alert) => (
          <Alert
            key={alert.id}
            variant={alert.variant}
            title={alert.title}
            dismissible={alert.dismissible}
            icon={alert.icon}
            onDismiss={() => onDismiss(alert.id)}
          >
            {alert.message}
          </Alert>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Convenience functions for common alerts
export const alertUtils = {
  success: (title: string, message: ReactNode) => ({
    variant: 'success' as const,
    title,
    message
  }),
  error: (title: string, message: ReactNode) => ({
    variant: 'error' as const,
    title,
    message
  }),
  warning: (title: string, message: ReactNode) => ({
    variant: 'warning' as const,
    title,
    message
  }),
  info: (title: string, message: ReactNode) => ({
    variant: 'info' as const,
    title,
    message
  })
}