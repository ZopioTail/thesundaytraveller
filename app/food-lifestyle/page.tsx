'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  CakeIcon,
  HeartIcon,
  HomeIcon,
  SparklesIcon,
  CoffeeIcon,
  BookOpenIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const lifestyleStories = [
  {
    id: 1,
    title: 'Flying Drones, Teaching Peace & Trading Stocks',
    excerpt: 'Most days, you\'ll find me in uniform, focused on the critical responsibilities that come with serving in the armed forces. But life has taught me that passion projects and diverse interests don\'t just enrich your personal life – they make you a better professional.',
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Hobbies',
    readTime: 10,
    publishedAt: new Date('2025-08-24'),
    tags: ['Technology', 'Teaching', 'Finance', 'Drones', 'Peace-building', 'Trading'],
    featured: true,
    author: 'Rabindra Sahu',
    slug: 'flying-drones-teaching-peace-trading-stocks',
    likes: 298,
    comments: 67
  },
  {
    id: 2,
    title: 'The Minimalist Soldier: Living with Less, Experiencing More',
    excerpt: 'Military life teaches you to carry only what you need. This philosophy extends far beyond the battlefield and can transform how you approach life, travel, and happiness.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Minimalism',
    readTime: 7,
    publishedAt: new Date('2025-08-14'),
    tags: ['Minimalism', 'Military Life', 'Philosophy', 'Simple Living', 'Travel'],
    featured: true,
    author: 'Rabindra Sahu',
    slug: 'minimalist-soldier-living-with-less-experiencing-more',
    likes: 245,
    comments: 52
  },
  {
    id: 3,
    title: 'Morning Rituals: Coffee, Contemplation & Clarity',
    excerpt: 'How the simple act of brewing coffee became a meditation practice that transforms chaotic mornings into moments of peace and reflection.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Wellness',
    readTime: 5,
    publishedAt: new Date('2025-08-12'),
    tags: ['Morning Routine', 'Coffee', 'Meditation', 'Mindfulness', 'Wellness'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'morning-rituals-coffee-contemplation-clarity',
    likes: 189,
    comments: 34
  },
  {
    id: 4,
    title: 'Home Design for the Nomadic Soul',
    excerpt: 'Creating a sense of home and belonging even when your lifestyle requires frequent moves and adaptability.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Home Design',
    readTime: 8,
    publishedAt: new Date('2025-08-10'),
    tags: ['Interior Design', 'Home', 'Minimalism', 'Nomadic Living', 'Aesthetics'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'home-design-for-the-nomadic-soul',
    likes: 167,
    comments: 28
  },
  {
    id: 5,
    title: 'Cooking as Meditation: Finding Peace in the Kitchen',
    excerpt: 'How preparing meals became a form of mindfulness practice, connecting me to the present moment and creating nourishment for both body and soul.',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Food',
    readTime: 6,
    publishedAt: new Date('2025-08-08'),
    tags: ['Cooking', 'Meditation', 'Mindfulness', 'Food', 'Wellness'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'cooking-as-meditation-finding-peace-in-the-kitchen',
    likes: 156,
    comments: 31
  },
  {
    id: 6,
    title: 'Digital Detox: Reclaiming Attention in a Hyperconnected World',
    excerpt: 'Strategies for maintaining focus and mental clarity while navigating the demands of modern digital life.',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Digital Wellness',
    readTime: 9,
    publishedAt: new Date('2025-08-06'),
    tags: ['Digital Detox', 'Mindfulness', 'Technology', 'Mental Health', 'Focus'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'digital-detox-reclaiming-attention-hyperconnected-world',
    likes: 203,
    comments: 45
  },
  {
    id: 7,
    title: 'The Art of Slow Living: Lessons from Military Precision',
    excerpt: 'How military training in patience and precision can inform a more intentional, slower approach to civilian life.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Slow Living',
    readTime: 7,
    publishedAt: new Date('2025-08-04'),
    tags: ['Slow Living', 'Military', 'Intentional Living', 'Mindfulness', 'Balance'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'art-of-slow-living-lessons-from-military-precision',
    likes: 178,
    comments: 39
  },
  {
    id: 8,
    title: 'Building Meaningful Relationships in a Mobile Lifestyle',
    excerpt: 'Maintaining deep connections and building community when your career requires frequent relocations and deployments.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Relationships',
    readTime: 8,
    publishedAt: new Date('2025-08-02'),
    tags: ['Relationships', 'Community', 'Military Life', 'Connection', 'Friendship'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'building-meaningful-relationships-mobile-lifestyle',
    likes: 134,
    comments: 26
  }
]

const categories = ['All', 'Hobbies', 'Minimalism', 'Wellness', 'Home Design', 'Food', 'Digital Wellness', 'Slow Living', 'Relationships']

export default function FoodLifestylePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStories = lifestyleStories.filter(story => {
    const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const featuredStories = filteredStories.filter(story => story.featured)
  const regularStories = filteredStories.filter(story => !story.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 dark:from-green-900/30 dark:to-blue-900/30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <CoffeeIcon className="w-12 h-12 text-green-600 dark:text-green-400" />
              <SparklesIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Food & Lifestyle
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Exploring the art of intentional living, from morning coffee rituals to minimalist home design. Discover how military discipline can inform a more mindful, balanced approach to everyday life, relationships, and personal growth.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="w-4 h-4" />
                <span>{lifestyleStories.length} Lifestyle Stories</span>
              </div>
              <div className="flex items-center space-x-2">
                <HomeIcon className="w-4 h-4" />
                <span>Home & Living</span>
              </div>
              <div className="flex items-center space-x-2">
                <HeartIcon className="w-4 h-4" />
                <span>Wellness & Balance</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search lifestyle stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                Featured Lifestyle Stories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Insights into intentional living, personal growth, and finding balance
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredStories.map((story, index) => (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-64">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                        {story.category}
                      </span>
                    </div>

                    {/* Story Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{story.title}</h3>
                      <div className="flex items-center justify-between text-sm opacity-90">
                        <span>{story.readTime} min read</span>
                        <span>{story.publishedAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {story.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {story.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>By {story.author}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          <HeartIcon className="w-4 h-4" />
                          <span>{story.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="w-4 h-4" />
                          <span>{story.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Link
                      href={`/blog/${story.slug}`}
                      className="inline-flex items-center text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200"
                    >
                      Read Full Story
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Regular Stories */}
      {regularStories.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                More Lifestyle Stories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover more insights into intentional living and personal growth
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularStories.map((story, index) => (
                <motion.article
                  key={story.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Category */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                        {story.category}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-bold mb-1 line-clamp-2 text-sm">{story.title}</h3>
                      <div className="text-xs opacity-90">{story.readTime} min read</div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                      {story.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {story.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span>{story.publishedAt.toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <HeartIcon className="w-3 h-3" />
                          <span>{story.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="w-3 h-3" />
                          <span>{story.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Link
                      href={`/blog/${story.slug}`}
                      className="inline-flex items-center text-green-600 dark:text-green-400 font-medium text-sm hover:text-green-700 dark:hover:text-green-300 transition-colors duration-200"
                    >
                      Read Story
                      <svg className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* No Results */}
      {filteredStories.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <CoffeeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Stories Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search terms to find more lifestyle stories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
