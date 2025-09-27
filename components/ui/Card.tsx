'use client'

import { ReactNode } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  hover?: boolean
  clickable?: boolean
  onClick?: () => void
  header?: ReactNode
  footer?: ReactNode
  title?: string
  subtitle?: string
  icon?: ReactNode
}

const variantStyles = {
  default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
  elevated: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700',
  outlined: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
  glass: 'bg-white/10 dark:bg-gray-800/50 backdrop-blur-md border border-white/20 dark:border-gray-700/50'
}

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8'
}

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full'
}

export default function Card({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  hover = false,
  clickable = false,
  onClick,
  header,
  footer,
  title,
  subtitle,
  icon
}: CardProps) {
  const cardClasses = cn(
    'relative overflow-hidden transition-all duration-300',
    variantStyles[variant],
    paddingStyles[padding],
    roundedStyles[rounded],
    hover && 'hover:shadow-lg hover:-translate-y-1',
    clickable && 'cursor-pointer hover:shadow-md',
    className
  )

  const content = (
    <>
      {(header || title || icon) && (
        <div className="mb-4">
          {header}
          {title && (
            <div className="flex items-center space-x-3">
              {icon && (
                <div className="flex-shrink-0">
                  {icon}
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {title}
                </h3>
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex-1">
        {children}
      </div>

      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </>
  )

  if (clickable || onClick) {
    return (
      <motion.div
        className={cardClasses}
        whileHover={{ scale: hover ? 1.02 : 1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {content}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {content}
    </motion.div>
  )
}

// Specialized Card Components
export function StatsCard({
  title,
  value,
  change,
  changeType = 'increase',
  icon,
  className = '',
  ...props
}: {
  title: string
  value: string | number
  change?: string
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: ReactNode
} & Omit<CardProps, 'title' | 'children'>) {
  const changeColor = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  }

  return (
    <Card
      className={cn('text-center', className)}
      padding="lg"
      hover
      {...props}
    >
      {icon && (
        <div className="flex justify-center mb-4">
          {icon}
        </div>
      )}
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </div>
      {change && (
        <div className={cn('text-sm font-medium', changeColor[changeType])}>
          {change}
        </div>
      )}
    </Card>
  )
}

export function FeatureCard({
  title,
  description,
  icon,
  className = '',
  ...props
}: {
  title: string
  description: string
  icon?: ReactNode
} & Omit<CardProps, 'title' | 'children'>) {
  return (
    <Card
      className={className}
      padding="lg"
      hover
      {...props}
    >
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </Card>
  )
}

export function ProductCard({
  title,
  description,
  price,
  image,
  badge,
  className = '',
  ...props
}: {
  title: string
  description: string
  price?: string
  image?: string
  badge?: string
} & Omit<CardProps, 'title' | 'children'>) {
  return (
    <Card
      className={cn('overflow-hidden', className)}
      hover
      {...props}
    >
      {image && (
        <div className="relative h-48 bg-gray-200 dark:bg-gray-700 mb-4">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
          {badge && (
            <div className="absolute top-2 left-2 z-10">
              <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded">
                {badge}
              </span>
            </div>
          )}
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {description}
        </p>
        {price && (
          <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {price}
          </div>
        )}
      </div>
    </Card>
  )
}