'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
  BookOpenIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

const blogPosts = [
  {
    id: 1,
    title: 'What Adventure Sports Taught This Soldier About Life',
    excerpt: 'The crisp salute, the well-creased uniform, the structured life of the armed forces – these have been my constants for years. But beyond the discipline and duty, there\'s another side to my story that involves adrenaline, risk, and the raw beauty of pushing human limits.',
    image: '/images/optimized/gallery-2.jpg',
    category: 'Adventure',
    readTime: 8,
    createdAt: new Date('2025-08-28'),
    tags: ['Military', 'Adventure Sports', 'Life Lessons', 'Leadership', 'Resilience'],
    featured: true,
    author: 'Vineet Kumar',
    slug: 'what-adventure-sports-taught-this-soldier-about-life'
  },
  {
    id: 2,
    title: 'Life Beyond the Uniform: Curtains, Coffee & Calm',
    excerpt: 'They say a uniform defines you. It speaks of duty, discipline, and perhaps a certain seriousness that comes with the responsibility of serving your nation. But what happens when you step out of that uniform? What defines you then?',
    image: '/images/optimized/gallery-8.jpg',
    category: 'Culture',
    readTime: 6,
    createdAt: new Date('2025-08-26'),
    tags: ['Lifestyle', 'Personal', 'Home', 'Balance', 'Mindfulness'],
    featured: true,
    author: 'Rabindra Sahu',
    slug: 'life-beyond-the-uniform-curtains-coffee-calm'
  },
  {
    id: 3,
    title: 'Flying Drones, Teaching Peace & Trading Stocks',
    excerpt: 'Most days, you\'ll find me in uniform, focused on the critical responsibilities that come with serving in the armed forces. But life has taught me that passion projects and diverse interests don\'t just enrich your personal life – they make you a better professional.',
    image: '/images/optimized/drone-photography.jpg',
    category: 'Food & Lifestyle',
    readTime: 10,
    createdAt: new Date('2025-08-24'),
    tags: ['Technology', 'Teaching', 'Finance', 'Drones', 'Peace-building', 'Trading'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'flying-drones-teaching-peace-trading-stocks'
  },
  {
    id: 4,
    title: 'Exploring Portugal: A Digital Nomad\'s Paradise',
    excerpt: 'From the cobblestone streets of Lisbon to the dramatic cliffs of the Algarve, Portugal has become my temporary home base. Here\'s why this country is perfect for digital nomads and remote workers.',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Destinations',
    readTime: 7,
    createdAt: new Date('2025-08-22'),
    tags: ['Portugal', 'Digital Nomad', 'Remote Work', 'Europe', 'Lifestyle'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'exploring-portugal-digital-nomad-paradise'
  },
  {
    id: 5,
    title: 'The Art of Military Photography: Capturing Stories Beyond Combat',
    excerpt: 'Military photography is about more than documenting operations. It\'s about capturing the human stories, the quiet moments, and the profound experiences that shape those who serve.',
    image: '/images/optimized/gallery-6.jpg',
    category: 'Culture',
    readTime: 9,
    createdAt: new Date('2025-08-20'),
    tags: ['Photography', 'Military', 'Storytelling', 'Art', 'Documentation'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'military-photography-capturing-stories-beyond-combat'
  },
  {
    id: 6,
    title: 'Himalayan Trek: Lessons from 18,000 Feet',
    excerpt: 'The thin air at high altitude teaches you things about yourself that sea-level living never could. Here are the profound lessons learned during my solo trek through the Himalayas.',
    image: '/images/optimized/gallery-1.jpg',
    category: 'Adventure',
    readTime: 12,
    createdAt: new Date('2025-08-18'),
    tags: ['Himalayas', 'Trekking', 'Solo Travel', 'Mountain Climbing', 'Self-Discovery'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'himalayan-trek-lessons-from-18000-feet'
  },
  {
    id: 7,
    title: 'Building Bridges: Military Diplomacy in Action',
    excerpt: 'Sometimes the most important battles are won not with weapons, but with words, understanding, and the ability to find common ground even in the most challenging circumstances.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Culture',
    readTime: 8,
    createdAt: new Date('2025-08-16'),
    tags: ['Diplomacy', 'Military', 'Peace-building', 'International Relations', 'Leadership'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'building-bridges-military-diplomacy-in-action'
  },
  {
    id: 8,
    title: 'The Minimalist Soldier: Living with Less, Experiencing More',
    excerpt: 'Military life teaches you to carry only what you need. This philosophy extends far beyond the battlefield and can transform how you approach life, travel, and happiness.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Food & Lifestyle',
    readTime: 7,
    createdAt: new Date('2025-08-14'),
    tags: ['Minimalism', 'Military Life', 'Philosophy', 'Simple Living', 'Travel'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'minimalist-soldier-living-with-less-experiencing-more'
  }
]

const categories = ['All', 'Destinations', 'Adventure', 'Culture', 'Food & Lifestyle']

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const featuredPosts = blogPosts.filter(post => post.featured)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="/images/optimized/hero-main.jpg"
          alt="Travel blog"
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
            <BookOpenIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Travel Stories
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Authentic travel experiences, practical tips, and inspiring stories from around the world
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Search Bar */}
            <div className="relative mb-8">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 icon-md text-gray-400" />
              <input
                type="text"
                placeholder="Search stories, destinations, or topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4 mb-8">
              <FunnelIcon className="icon-md text-gray-600 dark:text-gray-400" />
              <div className="flex flex-wrap gap-3">
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

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'} found
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {selectedCategory === 'All' && searchTerm === '' && (
        <section className="section-padding">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-8">
                Featured <span className="gradient-text">Stories</span>
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="card card-hover">
                        <div className="relative h-64 overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                              Featured
                            </span>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center">
                              <CalendarIcon className="mr-1 icon-xs" />
                              {post.createdAt.toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="mr-1 icon-xs" />
                              {post.readTime} min read
                            </div>
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-2">
                              {post.tags.slice(0, 2).map((tag) => (
                                <span
                                  key={tag}
                                  className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                                >
                                  <TagIcon className="mr-1 icon-xs" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium text-sm">
                              Read More
                              <ArrowRightIcon className="ml-1 icon-sm group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              All <span className="gradient-text">Stories</span>
            </h2>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="card card-hover">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                              {post.category}
                            </span>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                            <div className="flex items-center">
                              <CalendarIcon className="mr-1 icon-xs" />
                              {post.createdAt.toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="mr-1 icon-xs" />
                              {post.readTime} min
                            </div>
                          </div>
                          <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                            {post.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                            {post.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {post.tags.slice(0, 2).map((tag) => (
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
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No stories found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search terms or category filter
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </motion.div>
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
              Never Miss an Adventure
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Subscribe to get the latest travel stories, photography tips, and destination guides delivered to your inbox.
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
