'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  NewspaperIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  ArrowTrendingUpIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'

const newsArticles = [
  {
    id: 1,
    title: 'New Visa-Free Travel Agreements Open Up Southeast Asia',
    excerpt: 'Recent diplomatic agreements make it easier than ever to explore multiple countries in Southeast Asia without visa hassles.',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Visa Updates',
    type: 'update',
    publishedAt: new Date('2024-01-20'),
    readTime: 5,
    tags: ['Visa', 'Southeast Asia', 'Travel Policy'],
    urgent: false,
  },
  {
    id: 2,
    title: 'Climate Change Impact on Popular Destinations',
    excerpt: 'How rising sea levels and changing weather patterns are affecting some of the world\'s most beloved travel destinations.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Environment',
    type: 'alert',
    publishedAt: new Date('2024-01-18'),
    readTime: 8,
    tags: ['Climate Change', 'Environment', 'Sustainability'],
    urgent: true,
  },
  {
    id: 3,
    title: 'Best Travel Apps of 2024: Complete Guide',
    excerpt: 'Essential mobile apps that will make your travels smoother, safer, and more enjoyable this year.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Technology',
    type: 'guide',
    publishedAt: new Date('2024-01-15'),
    readTime: 12,
    tags: ['Technology', 'Apps', 'Travel Tips'],
    urgent: false,
  },
  {
    id: 4,
    title: 'Safety Alert: Current Situations in Popular Destinations',
    excerpt: 'Important safety updates and travel advisories for major tourist destinations worldwide.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Safety',
    type: 'alert',
    publishedAt: new Date('2024-01-12'),
    readTime: 6,
    tags: ['Safety', 'Travel Advisory', 'Security'],
    urgent: true,
  },
  {
    id: 5,
    title: 'Sustainable Tourism: How to Travel Responsibly',
    excerpt: 'Practical tips for minimizing your environmental impact while maximizing positive contributions to local communities.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Sustainability',
    type: 'guide',
    publishedAt: new Date('2024-01-10'),
    readTime: 10,
    tags: ['Sustainability', 'Responsible Travel', 'Environment'],
    urgent: false,
  },
  {
    id: 6,
    title: 'Currency Exchange Tips: Save Money on Your Travels',
    excerpt: 'Expert strategies for getting the best exchange rates and avoiding hidden fees when traveling internationally.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Finance',
    type: 'tip',
    publishedAt: new Date('2024-01-08'),
    readTime: 7,
    tags: ['Finance', 'Money', 'Travel Tips'],
    urgent: false,
  },
]

const categories = ['All', 'Visa Updates', 'Safety', 'Technology', 'Environment', 'Sustainability', 'Finance']
const types = ['All', 'Alert', 'Update', 'Guide', 'Tip']

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedType, setSelectedType] = useState('All')

  const filteredArticles = useMemo(() => {
    return newsArticles.filter(article => {
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory
      const matchesType = selectedType === 'All' || article.type === selectedType.toLowerCase()
      return matchesCategory && matchesType
    })
  }, [selectedCategory, selectedType])

  const urgentNews = newsArticles.filter(article => article.urgent)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'alert':
        return ExclamationTriangleIcon
      case 'update':
        return ArrowTrendingUpIcon
      case 'guide':
        return InformationCircleIcon
      default:
        return NewspaperIcon
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-500'
      case 'update':
        return 'bg-blue-500'
      case 'guide':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Travel news"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 via-pink-500/80 to-purple-600/80" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <NewspaperIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Travel News
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Stay updated with the latest travel news, safety alerts, and industry insights
            </p>
          </motion.div>
        </div>
      </section>

      {/* Urgent News Banner */}
      {urgentNews.length > 0 && (
        <section className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
          <div className="container-custom py-6">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="icon-lg text-red-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Urgent Travel Updates
                </h3>
                <div className="space-y-2">
                  {urgentNews.map((article) => (
                    <Link
                      key={article.id}
                      href={`/news/${article.id}`}
                      className="block text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 transition-colors duration-200"
                    >
                      • {article.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Category Filter */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedType === type
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
          </div>
        </div>
      </section>

      {/* News Articles */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, index) => {
              const TypeIcon = getTypeIcon(article.type)
              return (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/news/${article.id}`}>
                    <div className="card card-hover">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 flex space-x-2">
                          <span className={`px-3 py-1 ${getTypeColor(article.type)} text-white text-xs font-semibold rounded-full flex items-center`}>
                            <TypeIcon className="icon-xs mr-1" />
                            {article.type.charAt(0).toUpperCase() + article.type.slice(1)}
                          </span>
                          {article.urgent && (
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="card-body">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-1 icon-xs" />
                            {article.publishedAt.toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="mr-1 icon-xs" />
                            {article.readTime} min
                          </div>
                        </div>
                        <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium text-sm">
                            Read
                            <svg className="ml-2 icon-sm group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Stay Informed
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get the latest travel news, safety updates, and industry insights delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
              />
              <button className="btn-secondary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
