'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HomeIcon,
  DocumentTextIcon,
  NewspaperIcon,
  MapPinIcon,
  PhotoIcon,
  CogIcon,
  UserIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  GlobeAltIcon,
  SwatchIcon,
} from '@heroicons/react/24/outline'
import { getAllowedNavItems, hasPermission, PERMISSIONS } from '@/lib/rbac'

const allNavigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon, permission: PERMISSIONS.POST_READ },
  { name: 'Posts', href: '/admin/posts', icon: DocumentTextIcon, permission: PERMISSIONS.POST_READ },
  { name: 'Search', href: '/admin/search', icon: MagnifyingGlassIcon, permission: PERMISSIONS.POST_READ },
  { name: 'Media', href: '/admin/media', icon: PhotoIcon, permission: PERMISSIONS.MEDIA_UPLOAD },
  { name: 'SEO', href: '/admin/seo', icon: GlobeAltIcon, permission: PERMISSIONS.SETTINGS_VIEW },
  { name: 'Themes', href: '/admin/themes', icon: SwatchIcon, permission: PERMISSIONS.SETTINGS_VIEW },
  { name: 'News', href: '/admin/news', icon: NewspaperIcon, permission: PERMISSIONS.POST_READ },
  { name: 'Destinations', href: '/admin/destinations', icon: MapPinIcon, permission: PERMISSIONS.POST_READ },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, permission: PERMISSIONS.ANALYTICS_VIEW },
  { name: 'Users', href: '/admin/users', icon: UserIcon, permission: PERMISSIONS.USER_READ },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon, permission: PERMISSIONS.SETTINGS_VIEW },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()

  // Filter navigation based on user permissions
  const navigation = allNavigation.filter(item =>
    hasPermission(session?.user as any, item.permission)
  )

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!session) {
    router.push('/admin/login')
    return null
  }

  const user = session?.user

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl lg:hidden"
            >
              <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
                <Link href="/admin" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">TS</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">Admin</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <nav className="mt-5 px-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 transition-colors duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800 shadow-lg">
          <div className="flex h-16 flex-shrink-0 items-center px-4 border-b border-gray-200 dark:border-gray-700">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
            </Link>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md mb-1 transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top navigation */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <button
            type="button"
            className="border-r border-gray-200 dark:border-gray-700 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-4">
            <div className="flex flex-1">
              <form onSubmit={handleSearch} className="flex w-full md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600 dark:focus-within:text-gray-300">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 ml-3" />
                  </div>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block h-full w-full border-transparent py-2 pl-10 pr-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-transparent focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:outline-none focus:ring-0 bg-transparent"
                    placeholder="Search posts, news, destinations..."
                    type="search"
                  />
                </div>
              </form>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <BellIcon className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                >
                  <Image
                    className="h-8 w-8 rounded-full object-cover"
                    src={user?.image || '/images/default-avatar.jpg'}
                    alt={user?.name || 'User'}
                    width={32}
                    height={32}
                  />
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</div>
                  </div>
                </button>

                {/* User menu dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      >
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 capitalize mt-1">{user?.role}</p>
                        </div>
                        <Link
                          href="/admin/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <UserCircleIcon className="mr-3 h-5 w-5" />
                          Profile
                        </Link>
                        <Link
                          href="/admin/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <CogIcon className="mr-3 h-5 w-5" />
                          Settings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                          Sign out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
