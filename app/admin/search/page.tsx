'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  DocumentTextIcon,
  CalendarIcon,
  TagIcon,
  UserIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SearchFilters {
  query: string
  categoryId: string
  tagIds: string[]
  status: string
  authorId: string
  dateFrom: string
  dateTo: string
  sortBy: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'relevance'
  sortOrder: 'asc' | 'desc'
}

interface SearchResult {
  id: number
  title: string
  slug: string
  excerpt: string
  status: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  authorId: number
  categoryId: number
  featuredImage: string
  seoTitle: string
  seoDescription: string
  viewCount: number
  author: {
    id: number
    name: string
    email: string
    avatar: string
  }
  category: {
    id: number
    name: string
    slug: string
    color: string
  }
  tags: Array<{
    id: number
    name: string
    slug: string
    color: string
  }>
  relevanceScore: number
}

interface SearchSuggestion {
  type: string
  id: number
  title: string
  slug: string
  excerpt: string
  category: string
  publishedAt: string
}

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    categoryId: searchParams.get('categoryId') || '',
    tagIds: searchParams.get('tagIds')?.split(',').filter(Boolean) || [],
    status: searchParams.get('status') || '',
    authorId: searchParams.get('authorId') || '',
    dateFrom: searchParams.get('dateFrom') || '',
    dateTo: searchParams.get('dateTo') || '',
    sortBy: (searchParams.get('sortBy') as SearchFilters['sortBy']) || 'relevance',
    sortOrder: (searchParams.get('sortOrder') as SearchFilters['sortOrder']) || 'desc'
  })

  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchFilters: SearchFilters) => {
      if (!searchFilters.query.trim() && !searchFilters.categoryId && !searchFilters.status) {
        setResults([])
        setTotal(0)
        return
      }

      setIsLoading(true)

      try {
        const params = new URLSearchParams()
        Object.entries(searchFilters).forEach(([key, value]) => {
          if (value && (Array.isArray(value) ? value.length > 0 : true)) {
            params.set(key, Array.isArray(value) ? value.join(',') : value)
          }
        })

        const response = await fetch(`/api/admin/search?${params}`)
        const data = await response.json()

        if (response.ok) {
          setResults(data.posts || [])
          setTotal(data.total || 0)
          setHasMore(data.pagination?.hasMore || false)
        } else {
          console.error('Search failed:', data.error)
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsLoading(false)
      }
    }, 300),
    []
  )

  // Get search suggestions
  const getSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch(`/api/admin/search?suggestions=true&q=${encodeURIComponent(query)}`)
        const data = await response.json()

        if (response.ok) {
          setSuggestions(data.suggestions || [])
          setShowSuggestions(true)
        }
      } catch (error) {
        console.error('Suggestions error:', error)
      }
    }, 200),
    []
  )

  useEffect(() => {
    debouncedSearch(filters)
  }, [filters, debouncedSearch])

  useEffect(() => {
    if (filters.query) {
      getSuggestions(filters.query)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [filters.query, getSuggestions])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(0)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setFilters(prev => ({ ...prev, query: suggestion.title }))
    setShowSuggestions(false)
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      categoryId: '',
      tagIds: [],
      status: '',
      authorId: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'relevance',
      sortOrder: 'desc'
    })
    setCurrentPage(0)
  }

  const toggleSort = (field: SearchFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }))
  }

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setCurrentPage(prev => prev + 1)
      // Implement pagination logic here
    }
  }

  const SortButton = ({ field, label }: { field: SearchFilters['sortBy'], label: string }) => (
    <button
      onClick={() => toggleSort(field)}
      className={cn(
        'flex items-center space-x-1 px-2 py-1 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700',
        filters.sortBy === field ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'text-gray-600 dark:text-gray-400'
      )}
    >
      <span>{label}</span>
      {filters.sortBy === field && (
        filters.sortOrder === 'asc' ?
          <ArrowUpIcon className="h-3 w-3" /> :
          <ArrowDownIcon className="h-3 w-3" />
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Advanced Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Search through posts with advanced filters and full-text search capabilities
          </p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6"
        >
          <div className="relative">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  placeholder="Search posts, categories, or content..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {suggestion.title}
                        </div>
                        {suggestion.excerpt && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {suggestion.excerpt}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          in {suggestion.category}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
              </Button>

              {(filters.query || filters.categoryId || filters.status) && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="flex items-center space-x-2"
                >
                  <XMarkIcon className="h-4 w-4" />
                  <span>Clear</span>
                </Button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    <option value="1">Travel</option>
                    <option value="2">Adventure</option>
                    <option value="3">Culture</option>
                    <option value="4">Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date From
                  </label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date To
                  </label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Search Results
            </h2>
            {total > 0 && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {total} result{total !== 1 ? 's' : ''} found
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <SortButton field="relevance" label="Relevance" />
            <SortButton field="publishedAt" label="Date" />
            <SortButton field="title" label="Title" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        )}

        {/* Results */}
        {!isLoading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                        {post.title}
                      </h3>
                      <span className={cn(
                        'px-2 py-1 text-xs rounded-full',
                        post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                        post.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      )}>
                        {post.status}
                      </span>
                      {filters.sortBy === 'relevance' && post.relevanceScore > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {Math.round(post.relevanceScore * 100)}% match
                        </span>
                      )}
                    </div>

                    {post.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {post.excerpt}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <UserIcon className="h-4 w-4" />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      </div>
                      {post.category && (
                        <div className="flex items-center space-x-1">
                          <TagIcon className="h-4 w-4" />
                          <span>{post.category.name}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{post.viewCount} views</span>
                      </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {post.tags.map(tag => (
                          <span
                            key={tag.id}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/posts/${post.id}/edit`)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/blog/${post.slug}`)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6">
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? 'Loading...' : 'Load More Results'}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!isLoading && results.length === 0 && (filters.query || filters.categoryId || filters.status) && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && results.length === 0 && !filters.query && !filters.categoryId && !filters.status && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Start searching
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a search term or use filters to find posts
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}