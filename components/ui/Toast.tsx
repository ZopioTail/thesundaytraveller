'use client'

import { Fragment, ReactNode, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
  action?: {
    label: string
    onClick: () => void
  }
}

const typeStyles = {
  success: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    title: 'text-green-800 dark:text-green-200',
    message: 'text-green-700 dark:text-green-300',
    iconColor: 'text-green-500'
  },
  error: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    title: 'text-red-800 dark:text-red-200',
    message: 'text-red-700 dark:text-red-300',
    iconColor: 'text-red-500'
  },
  warning: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    title: 'text-yellow-800 dark:text-yellow-200',
    message: 'text-yellow-700 dark:text-yellow-300',
    iconColor: 'text-yellow-500'
  },
  info: {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    title: 'text-blue-800 dark:text-blue-200',
    message: 'text-blue-700 dark:text-blue-300',
    iconColor: 'text-blue-500'
  }
}

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action
}: ToastProps) {
  const style = typeStyles[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, id, onClose])

  return (
    <motion.div
      initial={{ opacity: 0, x: 300, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg ring-1 ring-black ring-opacity-5',
        style.bg,
        style.border
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', style.iconColor)}>
              {style.icon}
            </div>
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={cn('text-sm font-medium', style.title)}>
              {title}
            </p>
            {message && (
              <p className={cn('mt-1 text-sm', style.message)}>
                {message}
              </p>
            )}
            {action && (
              <div className="mt-3 flex space-x-7">
                <button
                  type="button"
                  className="rounded-md bg-white dark:bg-gray-800 px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              type="button"
              className={cn(
                'inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                style.bg
              )}
              onClick={() => onClose(id)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Array<{
    id: string
    type: ToastType
    title: string
    message?: string
    duration?: number
    action?: {
      label: string
      onClick: () => void
    }
  }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          action={toast.action}
          onClose={onRemove}
        />
      ))}
    </div>
  )
}