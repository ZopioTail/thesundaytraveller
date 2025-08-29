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
  { name: 'News', href: '/news' },
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
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        headerStyle.bg,
        isScrolled ? 'shadow-2xl backdrop-blur-xl' : 'backdrop-blur-sm'
      )}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-pink-500/5 to-purple-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />

      <nav className="container-custom relative">
        <div className={cn(
          "flex items-center justify-between h-18 lg:h-24 border-b transition-all duration-500",
          headerStyle.border,
          !isScrolled && pathname === '/' ? 'border-transparent' : '',
          isScrolled ? 'border-opacity-30' : ''
        )}>
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="block">
              <Logo
                variant={headerStyle.text.includes('white') ? 'light' : 'dark'}
                size="lg"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group overflow-hidden',
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg'
                      : headerStyle.text.includes('white')
                      ? 'text-white hover:text-orange-300 hover:bg-white/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-900/20 dark:hover:to-pink-900/20'
                  )}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                  {/* Text */}
                  <span className="relative z-10 group-hover:scale-105 transition-transform duration-200 inline-block">
                    {item.name}
                  </span>

                  {/* Hover underline */}
                  <div className="absolute bottom-1 left-1/2 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-pink-500 group-hover:w-8 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-300 rounded-full" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'p-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                headerStyle.text.includes('white')
                  ? 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-orange-100 hover:to-pink-100 dark:hover:from-orange-900/30 dark:hover:to-pink-900/30 shadow-lg hover:shadow-xl'
              )}
              aria-label="Toggle theme"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

              <motion.div
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="relative z-10"
              >
                {isDark ? (
                  <SunIcon className="icon-md text-yellow-500 drop-shadow-sm" />
                ) : (
                  <MoonIcon className={cn('icon-md drop-shadow-sm', headerStyle.text.includes('white') ? 'text-white' : 'text-gray-700')} />
                )}
              </motion.div>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'lg:hidden p-3 rounded-xl transition-all duration-300 group relative overflow-hidden',
                headerStyle.text.includes('white')
                  ? 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                  : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-orange-100 hover:to-pink-100 dark:hover:from-orange-900/30 dark:hover:to-pink-900/30 shadow-lg hover:shadow-xl'
              )}
              aria-label="Toggle menu"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                {isOpen ? (
                  <XMarkIcon className={cn('icon-lg', headerStyle.text)} />
                ) : (
                  <Bars3Icon className={cn('icon-lg', headerStyle.text)} />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="lg:hidden mt-6 overflow-hidden"
            >
              <div className={cn(
                'p-6 space-y-3 rounded-2xl backdrop-blur-xl border shadow-2xl',
                headerStyle.mobile,
                'bg-white/95 dark:bg-gray-900/95 border-gray-200/50 dark:border-gray-700/50'
              )}>
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'group flex items-center px-5 py-4 rounded-xl text-base font-semibold transition-all duration-300 relative overflow-hidden',
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-900/20 dark:hover:to-pink-900/20 hover:text-orange-600 dark:hover:text-orange-400'
                      )}
                    >
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

                      {/* Icon placeholder for future enhancement */}
                      <div className="w-2 h-2 rounded-full bg-current opacity-50 mr-3 group-hover:opacity-100 transition-opacity duration-300" />

                      {/* Text */}
                      <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                        {item.name}
                      </span>

                      {/* Arrow */}
                      <motion.div
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 3 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile menu footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    The Sunday Traveller
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
