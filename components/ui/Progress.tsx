'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressProps {
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success' | 'warning' | 'error'
  showLabel?: boolean
  label?: string
  className?: string
  animated?: boolean
  striped?: boolean
  rounded?: boolean
}

const sizeStyles = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3'
}

const variantStyles = {
  default: 'bg-orange-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500'
}

export default function Progress({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  className = '',
  animated = true,
  striped = false,
  rounded = true
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const progressClasses = cn(
    'relative overflow-hidden transition-all duration-300',
    sizeStyles[size],
    rounded ? 'rounded-full' : 'rounded-none',
    'bg-gray-200 dark:bg-gray-700',
    className
  )

  const barClasses = cn(
    'h-full transition-all duration-500 ease-out',
    variantStyles[variant],
    animated && 'animate-pulse',
    striped && 'bg-gradient-to-r from-current to-transparent bg-[length:20px_20px] animate-[stripe_1s_linear_infinite]'
  )

  return (
    <div className="space-y-2">
      {(showLabel || label) && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      <div className={progressClasses}>
        <motion.div
          className={barClasses}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}

// Specialized Progress Components
export function LoadingBar({
  className = '',
  size = 'sm',
  ...props
}: Omit<ProgressProps, 'value' | 'max'>) {
  return (
    <Progress
      value={65}
      max={100}
      size={size}
      animated
      striped
      className={className}
      {...props}
    />
  )
}

export function StepProgress({
  steps,
  currentStep,
  className = '',
  size = 'md',
  ...props
}: {
  steps: Array<{ label: string; description?: string }>
  currentStep: number
} & Omit<ProgressProps, 'value' | 'max' | 'showLabel'>) {
  const progressValue = ((currentStep + 1) / steps.length) * 100

  return (
    <div className={cn('space-y-4', className)}>
      <Progress
        value={progressValue}
        max={100}
        showLabel
        label={`Step ${currentStep + 1} of ${steps.length}`}
        size={size}
        {...props}
      />

      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'flex items-center space-x-3 p-3 rounded-lg transition-all duration-200',
                isCompleted && 'bg-green-50 dark:bg-green-900/20',
                isCurrent && 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800',
                isUpcoming && 'bg-gray-50 dark:bg-gray-800/50'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium',
                isCompleted && 'bg-green-500 text-white',
                isCurrent && 'bg-orange-500 text-white',
                isUpcoming && 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              )}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              <div className="flex-1">
                <h3 className={cn(
                  'font-medium',
                  isCompleted && 'text-green-800 dark:text-green-200',
                  isCurrent && 'text-orange-800 dark:text-orange-200',
                  isUpcoming && 'text-gray-600 dark:text-gray-400'
                )}>
                  {step.label}
                </h3>
                {step.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {step.description}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export function CircularProgress({
  value = 0,
  max = 100,
  size = 'md',
  strokeWidth = 4,
  className = '',
  showValue = true,
  children
}: {
  value?: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  strokeWidth?: number
  className?: string
  showValue?: boolean
  children?: ReactNode
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = size === 'sm' ? 20 : size === 'md' ? 30 : 40
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  }

  return (
    <div className={cn('relative inline-flex items-center justify-center', sizeClasses[size], className)}>
      <svg className="transform -rotate-90" width="100%" height="100%">
        {/* Background circle */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-orange-500"
        />
      </svg>

      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {Math.round(percentage)}%
          </span>
        </div>
      )}

      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  )
}

// Skeleton Loading Component
interface SkeletonProps {
  className?: string
  variant?: 'default' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
  lines?: number
}

export function Skeleton({
  className = '',
  variant = 'default',
  width = 'w-full',
  height = 'h-4',
  lines = 1
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded'

  if (variant === 'circular') {
    return (
      <div
        className={cn(baseClasses, 'rounded-full', className)}
        style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
      />
    )
  }

  if (variant === 'rectangular') {
    return (
      <div
        className={cn(baseClasses, className)}
        style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
      />
    )
  }

  // Text skeleton
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(baseClasses, 'h-4', index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full')}
          style={{ width: typeof width === 'number' ? `${width}px` : width, height: typeof height === 'number' ? `${height}px` : height }}
        />
      ))}
    </div>
  )
}