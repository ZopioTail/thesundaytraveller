'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import Logo from '@/components/Logo'
import { cn } from '@/lib/utils'
import { NotificationDropdown } from '@/components/ui/Notification'

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Destinations', href: '/destinations', icon: '🌍' },
  { name: 'Book', href: '/book', icon: '📖' },
  { name: 'About', href: '/about', icon: 'ℹ️' },
  { name: 'Contact', href: '/contact', icon: '📧' },
  { name: 'Blog', href: '/blog', icon: '📝' },
  { name: 'News', href: '/news', icon: '📰' },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { data: session } = useSession()
  const pathname = usePathname()

  // Determine header style based on page and scroll position
  const getHeaderStyle = () => {
    // Pages with dark hero sections that need white header initially
    const darkHeroPages = ['/', '/about', '/book']
    const isDarkHeroPage = darkHeroPages.includes(pathname)

    if (isDarkHeroPage && !isScrolled) {
      return {
        bg: 'bg-gray-900/95 backdrop-blur-md',
        text: 'text-white',
        border: 'border-white/30',
        logo: 'text-white',
        mobile: 'bg-gray-900/95 backdrop-blur-md'
      }
    } else {
      return {
        bg: 'bg-white/95 backdrop-blur-md',
        text: 'text-gray-900',
        border: 'border-gray-200/50',
        logo: 'text-gray-900',
        mobile: 'bg-white/95 backdrop-blur-md'
      }
    }
  }

  const headerStyle = getHeaderStyle()

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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
        headerStyle.bg,
        isScrolled
          ? 'shadow-2xl backdrop-blur-2xl border-b border-white/10'
          : 'backdrop-blur-md'
      )}
    >
      {/* Enhanced animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/8 via-emerald-600/8 to-blue-600/8 opacity-0 hover:opacity-100 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />

      <nav className="container-custom relative">
        <div className={cn(
          "flex items-center justify-between h-18 lg:h-24 border-b transition-all duration-500",
          headerStyle.border,
          !isScrolled && pathname === '/' ? 'border-transparent' : '',
          isScrolled ? 'border-opacity-30' : ''
        )}>
          {/* Enhanced Logo */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-emerald-600/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 blur-xl" />
            <Link href="/" className="block relative z-10 p-2 rounded-2xl hover:bg-white/10 transition-colors duration-300">
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
                    'relative px-5 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 group overflow-hidden flex items-center space-x-2',
                    isActive(item.href)
                      ? 'text-white bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 shadow-lg scale-105'
                      : headerStyle.text.includes('white')
                      ? 'text-white hover:text-orange-200 hover:bg-white/20 hover:border-white/30 border border-transparent hover:scale-105'
                      : 'text-gray-700 hover:text-teal-600 hover:bg-gray-100/80 hover:border-gray-200/50 border border-transparent hover:scale-105'
                  )}
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 via-emerald-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                  {/* Icon */}
                  <span className="relative z-10 text-base group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>

                  {/* Text */}
                  <span className="relative z-10 group-hover:scale-105 transition-transform duration-200 inline-block font-medium">
                    {item.name}
                  </span>

                  {/* Enhanced hover effects */}
                  <div className="absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-12 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-400 rounded-full" />
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-teal-600/0 group-hover:ring-teal-600/20 transition-all duration-300" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Notifications - Only show when authenticated */}
            {session && (
              <NotificationDropdown />
            )}


            {/* Enhanced Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'lg:hidden p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden shadow-lg',
                headerStyle.text.includes('white')
                  ? 'bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/30 hover:border-white/50'
                  : 'bg-gray-100/90 hover:bg-gray-200/90 backdrop-blur-sm border-2 border-gray-300/50 hover:border-gray-400/70 hover:shadow-xl'
              )}
              aria-label="Toggle menu"
            >
              {/* Enhanced animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/30 to-emerald-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <div className="absolute inset-0 rounded-2xl ring-2 ring-teal-600/0 group-hover:ring-teal-600/30 transition-all duration-300" />

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative z-10"
              >
                {isOpen ? (
                  <XMarkIcon className={cn('w-7 h-7', headerStyle.text)} />
                ) : (
                  <Bars3Icon className={cn('w-7 h-7', headerStyle.text)} />
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
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:hidden mt-8 overflow-hidden"
            >
              <div className={cn(
                'p-8 space-y-4 rounded-3xl backdrop-blur-2xl border shadow-2xl relative',
                headerStyle.mobile,
                headerStyle.text.includes('white')
                  ? 'bg-gray-900/95 border-gray-200/60 shadow-black/20'
                  : 'bg-white/95 border-gray-200/60 shadow-black/10'
              )}>
                {/* Enhanced background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600/5 via-transparent to-emerald-600/5 rounded-3xl" />
                <div className="absolute inset-0 rounded-3xl ring-2 ring-teal-600/10" />
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
                        'group flex items-center px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300 relative overflow-hidden',
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 text-white shadow-lg scale-105'
                          : headerStyle.text.includes('white')
                          ? 'text-white hover:bg-white/10 hover:text-orange-200 hover:scale-105'
                          : 'text-gray-700 hover:bg-gray-100/80 hover:text-teal-600 hover:scale-105'
                      )}
                    >
                      {/* Enhanced animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-teal-600/15 via-emerald-600/15 to-blue-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                      {/* Icon */}
                      <span className="relative z-10 text-lg mr-4 group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </span>

                      {/* Text */}
                      <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 flex-1 font-medium">
                        {item.name}
                      </span>

                      {/* Enhanced arrow */}
                      <motion.div
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ x: 5, scale: 1.1 }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </motion.div>

                      {/* Ring effect */}
                      <div className="absolute inset-0 rounded-2xl ring-2 ring-teal-600/0 group-hover:ring-teal-600/30 transition-all duration-300" />
                    </Link>
                  </motion.div>
                ))}

                {/* Enhanced mobile menu footer */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="pt-6 mt-6 border-t border-gradient-to-r from-teal-300/50 to-emerald-300/50 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-600/5 to-emerald-600/5 rounded-xl" />
                  <p className="text-sm text-gray-600 text-center font-medium relative z-10">
                    ✨ The Sunday Traveller
                  </p>
                  <p className="text-xs text-gray-500 text-center mt-1 relative z-10">
                    Discover • Explore • Travel
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
