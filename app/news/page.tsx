'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  SparklesIcon,
  FireIcon,
  BellIcon,
  EyeIcon,
  ArrowRightIcon,
  MegaphoneIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'
import {
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  BellIcon as BellIconSolid,
  FireIcon as FireIconSolid,
} from '@heroicons/react/24/solid'

const newsArticles = [
  {
    id: 1,
    title: 'Military Tourism: Exploring Historical Battlefields Responsibly',
    excerpt: 'A growing trend in military tourism allows visitors to explore historical battlefields while honoring the sacrifices made. Learn about responsible battlefield tourism and its impact on local communities.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Military Tourism',
    type: 'guide',
    publishedAt: new Date('2025-08-28'),
    readTime: 6,
    tags: ['Military History', 'Battlefield Tourism', 'Responsible Travel', 'Heritage'],
    urgent: false,
    author: 'Vineet Kumar',
    views: 3247,
    trending: true,
    featured: true
  },
  {
    id: 2,
    title: 'Adventure Sports Safety: New International Guidelines Released',
    excerpt: 'International Adventure Sports Association releases updated safety guidelines for extreme sports tourism, focusing on risk management and emergency protocols.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Safety',
    type: 'alert',
    publishedAt: new Date('2025-08-26'),
    readTime: 5,
    tags: ['Adventure Sports', 'Safety Guidelines', 'Risk Management', 'Tourism'],
    urgent: true,
    author: 'Vineet Kumar'
  },
  {
    id: 3,
    title: 'Portugal Launches New Digital Nomad Hub in Porto',
    excerpt: 'Portugal announces a new state-of-the-art digital nomad hub in Porto, featuring co-working spaces, networking events, and integration programs for remote workers.',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Technology',
    type: 'update',
    publishedAt: new Date('2025-08-24'),
    readTime: 4,
    tags: ['Portugal', 'Digital Nomads', 'Porto', 'Remote Work', 'Co-working'],
    urgent: false,
    author: 'Vineet Kumar'
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

const categories = ['All', 'Military Tourism', 'Safety', 'Technology', 'Environment', 'Sustainability', 'Finance']
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
      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -25, 0],
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <Image
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Travel news"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/60 via-orange-500/60 to-pink-500/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="relative z-20 text-center text-white px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Breaking News Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-red-500/90 backdrop-blur-md rounded-full px-6 py-3 border border-red-400/50"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <BellIconSolid className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-sm font-bold tracking-wide">
                BREAKING NEWS & UPDATES
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-shadow-xl bg-gradient-to-r from-white via-red-100 to-orange-100 bg-clip-text text-transparent leading-tight"
            >
              Travel News
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl lg:text-3xl mb-10 text-shadow-lg max-w-4xl mx-auto leading-relaxed text-gray-100"
            >
              Stay informed with breaking travel news, safety alerts, and expert insights from around the globe
            </motion.p>

            {/* Live Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10"
            >
              {[
                { number: 'LIVE', label: 'Updates', icon: FireIconSolid },
                { number: '24/7', label: 'Coverage', icon: GlobeAltIcon },
                { number: '100+', label: 'Sources', icon: NewspaperIcon }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-red-400 mr-2" />
                    <div className="text-2xl md:text-3xl font-bold text-red-400">
                      {stat.number}
                    </div>
                  </div>
                  <div className="text-sm md:text-base text-gray-300">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <button
                onClick={() => document.getElementById('urgent-news')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary group bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
              >
                <ExclamationTriangleIconSolid className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                View Urgent Updates
                <ArrowRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => document.getElementById('all-news')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline group"
              >
                <NewspaperIcon className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Browse All News
              </button>
            </motion.div>

            {/* Live Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="flex items-center justify-center space-x-2 text-sm text-gray-300 mt-8"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-red-500 rounded-full"
              />
              <span>Live updates • Last updated 2 minutes ago</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
            onClick={() => document.getElementById('urgent-news')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-sm mb-2">Latest Updates</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-white/50 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
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
