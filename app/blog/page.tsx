'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  SparklesIcon,
  FireIcon,
  HeartIcon,
  EyeIcon,
  UserIcon,
  GlobeAltIcon,
  CameraIcon,
  MapPinIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
  BookmarkIcon as BookmarkIconSolid,
} from '@heroicons/react/24/solid'

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
    slug: 'what-adventure-sports-taught-this-soldier-about-life',
    views: 2847,
    likes: 156,
    comments: 23,
    difficulty: 'Intermediate',
    location: 'Himalayas, India'
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
    author: 'Vineet Kumar',
    slug: 'life-beyond-the-uniform-curtains-coffee-calm',
    views: 1923,
    likes: 89,
    comments: 15,
    difficulty: 'Beginner',
    location: 'Home Base, India'
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
    author: 'Vineet Kumar',
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
    author: 'Vineet Kumar',
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
    author: 'Vineet Kumar',
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
    author: 'Vineet Kumar',
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
    author: 'Vineet Kumar',
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
    author: 'Vineet Kumar',
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
      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
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
          src="/images/optimized/hero-main.jpg"
          alt="Travel blog"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/70 via-pink-500/70 to-purple-600/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="relative z-20 text-center text-white px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/30"
            >
              <SparklesIcon className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold tracking-wide">
                Travel Chronicles
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-shadow-xl bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent leading-tight"
            >
              Travel Stories
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-xl md:text-2xl lg:text-3xl mb-10 text-shadow-lg max-w-4xl mx-auto leading-relaxed text-gray-100"
            >
              Authentic travel experiences, practical tips, and inspiring stories from a soldier's journey around the world
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10"
            >
              {[
                { number: '150+', label: 'Stories' },
                { number: '47+', label: 'Countries' },
                { number: '10K+', label: 'Readers' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">
                    {stat.number}
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
                onClick={() => document.getElementById('featured-stories')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary group"
              >
                <BookOpenIcon className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Read Latest Stories
                <ArrowRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <Link href="/destinations" className="btn-outline group">
                <GlobeAltIcon className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                Explore Destinations
              </Link>
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
            onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-sm mb-2">Discover Stories</span>
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

      {/* Enhanced Search & Filter Section */}
      <section id="search-section" className="relative section-padding bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.3),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(236,72,153,0.3),transparent_50%)]" />
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-gray-200/50 dark:border-gray-700/50"
              >
                <MagnifyingGlassIcon className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Find Your Adventure</span>
              </motion.div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Discover Stories That Inspire
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Search through our collection of travel adventures, cultural insights, and life lessons from around the globe.
              </p>
            </div>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative mb-10"
            >
              <div className="relative group">
                <MagnifyingGlassIcon className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search stories, destinations, adventures, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-16 pr-6 py-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 text-lg shadow-xl hover:shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 to-pink-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>

            {/* Enhanced Category Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-10"
            >
              <div className="flex items-center justify-center mb-6">
                <FunnelIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Filter by Category</span>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category, index) => (
                  <motion.button
                    key={category}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xl'
                        : 'bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {selectedCategory === category && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500"
                        transition={{ duration: 0.3 }}
                      />
                    )}
                    <span className="relative z-10">{category}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-200/50 dark:border-gray-700/50">
                <BookOpenIcon className="w-5 h-5 text-orange-500" />
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'} found
                </span>
              </div>
            </motion.div>
          </motion.div>
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
                    <Link href={`/blog/${post.slug}`}>
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
                    <Link href={`/blog/${post.slug}`}>
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
