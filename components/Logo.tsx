'use client'

import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Logo({ variant = 'dark', size = 'md', className = '' }: LogoProps) {
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const textColor = variant === 'light' ? 'text-white' : 'text-gray-900 dark:text-white'

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {/* Logo Icon */}
      <div className={cn(iconSizeClasses[size], 'flex-shrink-0')}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Compass Design */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="currentColor"
            strokeWidth="2"
            className={variant === 'light' ? 'text-white' : 'text-orange-500'}
          />
          <circle
            cx="20"
            cy="20"
            r="12"
            fill="currentColor"
            className={variant === 'light' ? 'text-white/20' : 'text-orange-100 dark:text-orange-900/20'}
          />
          {/* Compass Points */}
          <path
            d="M20 4 L24 16 L20 20 L16 16 Z"
            fill="currentColor"
            className={variant === 'light' ? 'text-white' : 'text-orange-500'}
          />
          <path
            d="M36 20 L24 24 L20 20 L24 16 Z"
            fill="currentColor"
            className={variant === 'light' ? 'text-white/60' : 'text-orange-400'}
          />
          <path
            d="M20 36 L16 24 L20 20 L24 24 Z"
            fill="currentColor"
            className={variant === 'light' ? 'text-white/60' : 'text-orange-400'}
          />
          <path
            d="M4 20 L16 16 L20 20 L16 24 Z"
            fill="currentColor"
            className={variant === 'light' ? 'text-white/60' : 'text-orange-400'}
          />
          {/* Center dot */}
          <circle
            cx="20"
            cy="20"
            r="2"
            fill="currentColor"
            className={variant === 'light' ? 'text-white' : 'text-orange-600'}
          />
        </svg>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={cn('font-serif font-bold leading-tight', textSizeClasses[size], textColor)}>
          The Sunday
        </span>
        <span className={cn('font-serif font-bold leading-tight', textSizeClasses[size], textColor)}>
          Traveller
        </span>
      </div>
    </div>
  )
}

// Icon only version
export function LogoIcon({ variant = 'dark', size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }

  return (
    <div className={cn(sizeClasses[size], 'flex-shrink-0', className)}>
      <svg
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Same compass design as above */}
        <circle
          cx="20"
          cy="20"
          r="18"
          stroke="currentColor"
          strokeWidth="2"
          className={variant === 'light' ? 'text-white' : 'text-orange-500'}
        />
        <circle
          cx="20"
          cy="20"
          r="12"
          fill="currentColor"
          className={variant === 'light' ? 'text-white/20' : 'text-orange-100 dark:text-orange-900/20'}
        />
        <path
          d="M20 4 L24 16 L20 20 L16 16 Z"
          fill="currentColor"
          className={variant === 'light' ? 'text-white' : 'text-orange-500'}
        />
        <path
          d="M36 20 L24 24 L20 20 L24 16 Z"
          fill="currentColor"
          className={variant === 'light' ? 'text-white/60' : 'text-orange-400'}
        />
        <path
          d="M20 36 L16 24 L20 20 L24 24 Z"
          fill="currentColor"
          className={variant === 'light' ? 'text-white/60' : 'text-orange-400'}
        />
        <path
          d="M4 20 L16 16 L20 20 L16 24 Z"
          fill="currentColor"
          className={variant === 'light' ? 'text-white/60' : 'text-orange-400'}
        />
        <circle
          cx="20"
          cy="20"
          r="2"
          fill="currentColor"
          className={variant === 'light' ? 'text-white' : 'text-orange-600'}
        />
      </svg>
    </div>
  )
}
