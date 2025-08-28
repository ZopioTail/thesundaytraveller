'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  HeartIcon,
  SparklesIcon,
  CameraIcon,
  GiftIcon,
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline'

const lifestylePosts = [
  {
    id: 1,
    title: 'Digital Nomad Setup: My Mobile Office Essentials',
    excerpt: 'Everything I carry to stay productive while traveling the world as a digital nomad.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Digital Nomad',
    readTime: 8,
    publishedAt: new Date('2024-01-22'),
    tags: ['Remote Work', 'Productivity', 'Gear'],
  },
  {
    id: 2,
    title: 'Slow Travel: Why Less is More',
    excerpt: 'How embracing slow travel transformed my perspective and deepened my cultural experiences.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Philosophy',
    readTime: 6,
    publishedAt: new Date('2024-01-18'),
    tags: ['Slow Travel', 'Mindfulness', 'Culture'],
  },
  {
    id: 3,
    title: 'Sustainable Packing: Zero-Waste Travel Tips',
    excerpt: 'Practical strategies for reducing waste and traveling more sustainably without sacrificing comfort.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Sustainability',
    readTime: 10,
    publishedAt: new Date('2024-01-15'),
    tags: ['Sustainability', 'Packing', 'Environment'],
  },
  {
    id: 4,
    title: 'Travel Photography: Capturing Authentic Moments',
    excerpt: 'Tips for taking meaningful photos that tell stories and respect local cultures.',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Photography',
    readTime: 12,
    publishedAt: new Date('2024-01-12'),
    tags: ['Photography', 'Ethics', 'Storytelling'],
  },
  {
    id: 5,
    title: 'Building Connections: Making Friends While Traveling',
    excerpt: 'How to connect with locals and fellow travelers to create meaningful relationships on the road.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Social',
    readTime: 7,
    publishedAt: new Date('2024-01-08'),
    tags: ['Social', 'Community', 'Culture'],
  },
  {
    id: 6,
    title: 'Travel Wellness: Staying Healthy on the Road',
    excerpt: 'Essential tips for maintaining physical and mental health during long-term travel.',
    image: 'https://images.unsplash.com/photo-1506629905607-24b52cc5f69b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Wellness',
    readTime: 9,
    publishedAt: new Date('2024-01-05'),
    tags: ['Health', 'Wellness', 'Self-care'],
  },
]

const categories = [
  { name: 'Digital Nomad', icon: HomeIcon, color: 'from-blue-500 to-cyan-600' },
  { name: 'Photography', icon: CameraIcon, color: 'from-purple-500 to-pink-600' },
  { name: 'Wellness', icon: HeartIcon, color: 'from-green-500 to-emerald-600' },
  { name: 'Social', icon: UserGroupIcon, color: 'from-orange-500 to-red-600' },
]

export default function LifestylePage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Travel lifestyle"
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
            <SparklesIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Travel Lifestyle
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Insights into the travel lifestyle, from digital nomad tips to sustainable practices
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Lifestyle <span className="gradient-text">Topics</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Explore different aspects of the travel lifestyle and find inspiration for your own journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="card card-hover text-center">
                    <div className="card-body">
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${category.color} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="icon-xl text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Explore {category.name.toLowerCase()} content
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lifestyle Posts */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Latest <span className="gradient-text">Lifestyle</span> Posts
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lifestylePosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/lifestyle/${post.id}`}>
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
                          {post.publishedAt.toLocaleDateString()}
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Transform Your Travel Lifestyle
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get personalized advice on building a sustainable, fulfilling travel lifestyle that works for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <HeartIcon className="mr-2 icon-md" />
                Get Lifestyle Coaching
              </Link>
              <Link href="/book" className="btn-outline">
                <GiftIcon className="mr-2 icon-md" />
                Download Guide
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
