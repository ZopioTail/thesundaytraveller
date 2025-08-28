'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassmorphismCardProps {
  children: ReactNode
  className?: string
  blur?: 'sm' | 'md' | 'lg' | 'xl'
  opacity?: number
  gradient?: boolean
  hover?: boolean
  border?: boolean
}

export default function GlassmorphismCard({
  children,
  className = '',
  blur = 'md',
  opacity = 0.1,
  gradient = true,
  hover = true,
  border = true,
}: GlassmorphismCardProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
    xl: 'backdrop-blur-xl',
  }

  const baseClasses = `
    relative overflow-hidden rounded-2xl
    ${blurClasses[blur]}
    ${border ? 'border border-white/20 dark:border-white/10' : ''}
    ${gradient ? 'bg-gradient-to-br from-white/20 to-white/5 dark:from-white/10 dark:to-white/5' : `bg-white/${opacity * 100} dark:bg-white/${opacity * 50}`}
    ${hover ? 'transition-all duration-300 hover:bg-white/30 dark:hover:bg-white/15 hover:border-white/30 dark:hover:border-white/20 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/20' : ''}
    shadow-lg shadow-black/5 dark:shadow-black/20
  `

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -2, scale: 1.02 } : undefined}
    >
      {/* Gradient overlay for extra depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}
