'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  AcademicCapIcon,
  HeartIcon,
  CameraIcon,
  BookOpenIcon,
  GlobeAltIcon,
  UserGroupIcon,
  PaintBrushIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/outline'

const culturalStories = [
  {
    id: 1,
    title: 'Life Beyond the Uniform: Curtains, Coffee & Calm',
    excerpt: 'They say a uniform defines you. It speaks of duty, discipline, and perhaps a certain seriousness that comes with the responsibility of serving your nation. But what happens when you step out of that uniform? What defines you then?',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Lifestyle',
    readTime: 6,
    publishedAt: new Date('2025-08-26'),
    tags: ['Lifestyle', 'Personal', 'Home', 'Balance', 'Mindfulness'],
    featured: true,
    author: 'Rabindra Sahu',
    slug: 'life-beyond-the-uniform-curtains-coffee-calm',
    likes: 234,
    comments: 45
  },
  {
    id: 2,
    title: 'The Art of Military Photography: Capturing Stories Beyond Combat',
    excerpt: 'Military photography is about more than documenting operations. It\'s about capturing the human stories, the quiet moments, and the profound experiences that shape those who serve.',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Photography',
    readTime: 9,
    publishedAt: new Date('2025-08-20'),
    tags: ['Photography', 'Military', 'Storytelling', 'Art', 'Documentation'],
    featured: true,
    author: 'Rabindra Sahu',
    slug: 'military-photography-capturing-stories-beyond-combat',
    likes: 189,
    comments: 32
  },
  {
    id: 3,
    title: 'Building Bridges: Military Diplomacy in Action',
    excerpt: 'Sometimes the most important battles are won not with weapons, but with words, understanding, and the ability to find common ground even in the most challenging circumstances.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Diplomacy',
    readTime: 8,
    publishedAt: new Date('2025-08-16'),
    tags: ['Diplomacy', 'Military', 'Peace-building', 'International Relations', 'Leadership'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'building-bridges-military-diplomacy-in-action',
    likes: 156,
    comments: 28
  },
  {
    id: 4,
    title: 'Cultural Exchange Through Service: Learning from Local Communities',
    excerpt: 'Military service often takes you to different regions and communities. Each posting becomes an opportunity to learn, understand, and appreciate diverse cultures and traditions.',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Cultural Exchange',
    readTime: 7,
    publishedAt: new Date('2025-08-14'),
    tags: ['Culture', 'Community', 'Service', 'Learning', 'Diversity'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'cultural-exchange-through-service-learning-from-local-communities',
    likes: 143,
    comments: 22
  },
  {
    id: 5,
    title: 'The Philosophy of Simple Living: Lessons from Military Life',
    excerpt: 'Military life teaches you to carry only what you need. This philosophy extends far beyond the battlefield and can transform how you approach life, relationships, and happiness.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Philosophy',
    readTime: 8,
    publishedAt: new Date('2025-08-12'),
    tags: ['Minimalism', 'Philosophy', 'Simple Living', 'Military Life', 'Wisdom'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'philosophy-of-simple-living-lessons-from-military-life',
    likes: 167,
    comments: 31
  },
  {
    id: 6,
    title: 'Traditional Arts and Modern Expression: Finding Balance',
    excerpt: 'Exploring how traditional art forms can inform and enhance modern creative expression, bridging the gap between heritage and contemporary culture.',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Arts',
    readTime: 6,
    publishedAt: new Date('2025-08-10'),
    tags: ['Traditional Arts', 'Modern Art', 'Culture', 'Heritage', 'Expression'],
    featured: false,
    author: 'Rabindra Sahu',
    slug: 'traditional-arts-and-modern-expression-finding-balance',
    likes: 134,
    comments: 19
  }
]

const categories = ['All', 'Lifestyle', 'Photography', 'Diplomacy', 'Cultural Exchange', 'Philosophy', 'Arts']

export default function CulturePage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStories = culturalStories.filter(story => {
    const matchesCategory = selectedCategory === 'All' || story.category === selectedCategory
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const featuredStories = filteredStories.filter(story => story.featured)
  const regularStories = filteredStories.filter(story => !story.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 dark:from-purple-900/30 dark:to-pink-900/30" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <PaintBrushIcon className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              <MusicalNoteIcon className="w-8 h-8 text-pink-600 dark:text-pink-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Culture & Lifestyle
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Exploring the intersection of military service and civilian life, discovering beauty in simplicity, and finding meaning in the quiet moments between duty calls. These stories celebrate the human experience beyond the uniform.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <BookOpenIcon className="w-4 h-4" />
                <span>{culturalStories.length} Cultural Stories</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="w-4 h-4" />
                <span>Personal Experiences</span>
              </div>
              <div className="flex items-center space-x-2">
                <HeartIcon className="w-4 h-4" />
                <span>Life Reflections</span>
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
                placeholder="Search cultural stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
                      ? 'bg-purple-600 text-white'
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
                Featured Stories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Deep reflections on life, culture, and the human experience
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
                      <span className="px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
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
                          <CameraIcon className="w-4 h-4" />
                          <span>{story.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Link
                      href={`/blog/${story.slug}`}
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
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
                More Cultural Stories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover more insights into culture, lifestyle, and personal growth
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
                      <span className="px-2 py-1 bg-purple-600 text-white text-xs font-semibold rounded-full">
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
                          <CameraIcon className="w-3 h-3" />
                          <span>{story.comments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <Link
                      href={`/blog/${story.slug}`}
                      className="inline-flex items-center text-purple-600 dark:text-purple-400 font-medium text-sm hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
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
            <BookOpenIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No Stories Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search terms to find more cultural stories.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
