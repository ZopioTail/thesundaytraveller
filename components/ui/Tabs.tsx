'use client'

import { ReactNode, createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
  variant?: 'default' | 'underline' | 'pills'
  size?: 'sm' | 'md' | 'lg'
}

export function Tabs({
  value,
  onValueChange,
  children,
  className = '',
  variant = 'default',
  size = 'md'
}: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'underline' | 'pills'
  size?: 'sm' | 'md' | 'lg'
}

export function TabsList({
  children,
  className = '',
  variant = 'default',
  size = 'md'
}: TabsListProps) {
  const sizeStyles = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  }

  const variantStyles = {
    default: 'bg-gray-100 dark:bg-gray-800 p-1 rounded-lg',
    underline: 'border-b border-gray-200 dark:border-gray-700 bg-transparent p-0',
    pills: 'bg-transparent p-0 space-x-1'
  }

  return (
    <div
      className={cn(
        'flex items-center',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
  disabled?: boolean
  icon?: ReactNode
}

export function TabsTrigger({
  value,
  children,
  className = '',
  disabled = false,
  icon
}: TabsTriggerProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsTrigger must be used within Tabs')

  const { value: selectedValue, onValueChange } = context
  const isSelected = selectedValue === value

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value)
    }
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'relative flex items-center justify-center space-x-2 px-3 py-1 rounded-md font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isSelected
          ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-700/50',
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      role="tab"
      aria-selected={isSelected}
    >
      {icon && (
        <span className={cn('flex-shrink-0', isSelected ? 'text-orange-500' : '')}>
          {icon}
        </span>
      )}
      <span>{children}</span>

      {isSelected && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-md"
          layoutId="activeTab"
          initial={false}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
  forceMount?: boolean
}

export function TabsContent({
  value,
  children,
  className = '',
  forceMount = false
}: TabsContentProps) {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsContent must be used within Tabs')

  const { value: selectedValue } = context
  const isSelected = selectedValue === value

  if (!forceMount && !isSelected) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      {isSelected && (
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn('mt-4', className)}
          role="tabpanel"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Vertical Tabs Component
interface VerticalTabsProps {
  tabs: Array<{
    value: string
    label: string
    icon?: ReactNode
    badge?: string | number
    disabled?: boolean
  }>
  children: ReactNode
  defaultValue?: string
  className?: string
  onValueChange?: (value: string) => void
}

export function VerticalTabs({
  tabs,
  children,
  defaultValue,
  className = '',
  onValueChange
}: VerticalTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || tabs[0]?.value || '')

  const handleValueChange = (value: string) => {
    setActiveTab(value)
    onValueChange?.(value)
  }

  return (
    <div className={cn('flex space-x-8', className)}>
      {/* Tab List */}
      <div className="w-64 flex-shrink-0">
        <div className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleValueChange(tab.value)}
              disabled={tab.disabled}
              className={cn(
                'w-full flex items-center justify-between px-4 py-3 text-left rounded-lg transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
                activeTab === tab.value
                  ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800',
                tab.disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <div className="flex items-center space-x-3">
                {tab.icon && (
                  <span className={cn(
                    'flex-shrink-0',
                    activeTab === tab.value ? 'text-orange-500' : ''
                  )}>
                    {tab.icon}
                  </span>
                )}
                <span className="font-medium">{tab.label}</span>
              </div>

              {tab.badge && (
                <span className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  activeTab === tab.value
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-200'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Accordion Component (for collapsible content)
interface AccordionProps {
  type?: 'single' | 'multiple'
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  children: ReactNode
  className?: string
}

export function Accordion({
  type = 'single',
  value,
  onValueChange,
  children,
  className = ''
}: AccordionProps) {
  return (
    <div className={cn('space-y-2', className)} data-accordion-type={type}>
      {children}
    </div>
  )
}

interface AccordionItemProps {
  value: string
  children: ReactNode
  className?: string
}

export function AccordionItem({ value, children, className = '' }: AccordionItemProps) {
  return (
    <div className={cn('border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
      {children}
    </div>
  )
}

interface AccordionTriggerProps {
  children: ReactNode
  className?: string
  icon?: ReactNode
}

export function AccordionTrigger({ children, className = '', icon }: AccordionTriggerProps) {
  return (
    <button
      className={cn(
        'flex items-center justify-between w-full px-4 py-3 text-left',
        'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2',
        'hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200',
        className
      )}
    >
      <span className="font-medium text-gray-900 dark:text-white">
        {children}
      </span>
      {icon || (
        <motion.svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      )}
    </button>
  )
}

interface AccordionContentProps {
  children: ReactNode
  className?: string
}

export function AccordionContent({ children, className = '' }: AccordionContentProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'overflow-hidden px-4 pb-3',
        className
      )}
    >
      <div className="pt-2 text-gray-600 dark:text-gray-400">
        {children}
      </div>
    </motion.div>
  )
}