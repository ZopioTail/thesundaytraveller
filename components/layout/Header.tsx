'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline'
import { useTheme } from '@/components/providers/ThemeProvider'
import Logo from '@/components/Logo'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Destinations', href: '/destinations' },
  { name: 'Book', href: '/book' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Blog', href: '/blog' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  // Determine header style based on page and scroll position
  const getHeaderStyle = () => {
    // Pages with dark hero sections that need white header initially
    const darkHeroPages = ['/', '/about', '/book']
    const isDarkHeroPage = darkHeroPages.includes(pathname)

    if (isDarkHeroPage && !isScrolled) {
      return {
        bg: 'bg-transparent',
        text: 'text-white',
        border: 'border-white/20',
        logo: 'text-white',
        mobile: 'bg-black/95 backdrop-blur-md'
      }
    } else {
      return {
        bg: 'bg-white/95 backdrop-blur-md dark:bg-gray-900/95',
        text: 'text-gray-900 dark:text-white',
        border: 'border-gray-200 dark:border-gray-700',
        logo: 'text-gray-900 dark:text-white',
        mobile: 'bg-white dark:bg-gray-900'
      }
    }
  }

  const headerStyle = getHeaderStyle()

  const isDark = theme === 'dark'

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark')
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        headerStyle.bg,
        isScrolled ? 'shadow-lg' : ''
      )}
    >
      <nav className="container-custom">
        <div className={cn(
          "flex items-center justify-between h-16 lg:h-20 border-b transition-colors duration-300",
          headerStyle.border,
          !isScrolled && pathname === '/' ? 'border-transparent' : ''
        )}>
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo
              variant={headerStyle.text.includes('white') ? 'light' : 'dark'}
              size="md"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-3 py-2 text-sm font-semibold rounded-lg transition-all duration-200 hover:scale-105',
                  isActive(item.href)
                    ? 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20'
                    : headerStyle.text.includes('white')
                    ? 'text-white hover:text-orange-300 hover:bg-white/10'
                    : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-lg transition-colors duration-200',
                headerStyle.text.includes('white')
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <SunIcon className="icon-md text-yellow-500" />
              ) : (
                <MoonIcon className={cn('icon-md', headerStyle.text.includes('white') ? 'text-white' : 'text-gray-700')} />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'lg:hidden p-2 rounded-lg transition-colors duration-200',
                headerStyle.text.includes('white')
                  ? 'bg-white/10 hover:bg-white/20'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
              )}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className={cn('icon-lg', headerStyle.text)} />
              ) : (
                <Bars3Icon className={cn('icon-lg', headerStyle.text)} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 overflow-hidden"
            >
              <div className={cn('p-4 space-y-2 rounded-lg', headerStyle.mobile)}>
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-lg text-base font-semibold transition-colors duration-200',
                      isActive(item.href)
                        ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
