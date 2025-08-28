'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapIcon,
  FireIcon,
  BoltIcon,
  GlobeAltIcon,
  CameraIcon,
  MapPinIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

const adventures = [
  {
    id: 1,
    title: 'Climbing Mount Kilimanjaro',
    location: 'Tanzania, Africa',
    difficulty: 'Extreme',
    duration: '7 days',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Epic journey to the roof of Africa through diverse ecosystems and challenging terrain.',
    highlights: ['Summit at sunrise', 'Machame route', 'Wildlife encounters', 'Local guides'],
    category: 'Mountain',
    featured: true,
  },
  {
    id: 2,
    title: 'Scuba Diving in the Maldives',
    location: 'Maldives, Indian Ocean',
    difficulty: 'Moderate',
    duration: '5 days',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Underwater paradise with manta rays, whale sharks, and pristine coral reefs.',
    highlights: ['Manta ray encounters', 'Night dives', 'Coral gardens', 'Underwater photography'],
    category: 'Water',
    featured: true,
  },
  {
    id: 3,
    title: 'Patagonia Trekking Expedition',
    location: 'Chile & Argentina',
    difficulty: 'Hard',
    duration: '14 days',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Multi-day trek through Torres del Paine and Los Glaciares National Parks.',
    highlights: ['Glacier hiking', 'Wild camping', 'Condor spotting', 'Ice climbing'],
    category: 'Trekking',
    featured: false,
  },
  {
    id: 4,
    title: 'Sahara Desert Expedition',
    location: 'Morocco, Africa',
    difficulty: 'Moderate',
    duration: '4 days',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Camel trekking through golden dunes with Berber guides and desert camping.',
    highlights: ['Camel trekking', 'Desert camping', 'Star gazing', 'Berber culture'],
    category: 'Desert',
    featured: false,
  },
]

const categories = [
  { name: 'Extreme Sports', icon: BoltIcon, color: 'from-red-500 to-orange-600' },
  { name: 'Water Sports', icon: GlobeAltIcon, color: 'from-blue-500 to-cyan-600' },
  { name: 'Mountain Sports', icon: MapIcon, color: 'from-green-500 to-emerald-600' },
  { name: 'Air Sports', icon: FireIcon, color: 'from-purple-500 to-pink-600' },
]

export default function AdventurePage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Adventure landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/80 via-pink-500/80 to-purple-600/80" />
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <MapIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-shadow-lg">
              Adventure Awaits
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-shadow max-w-3xl mx-auto">
              Push your limits and discover what you're truly capable of through epic adventures around the globe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#adventures" className="btn-primary">
                <MapIcon className="mr-2 icon-md" />
                View Adventures
              </Link>
              <Link href="/contact" className="btn-secondary">
                <CameraIcon className="mr-2 icon-md" />
                Plan Your Trip
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Adventure Categories */}
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
              Adventure <span className="gradient-text">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              From mountain peaks to ocean depths, explore different types of adventures that will challenge and inspire you.
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
                        Explore {category.name.toLowerCase()} adventures
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Adventures Grid */}
      <section id="adventures" className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
              Epic <span className="gradient-text">Adventures</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-center">
              Real adventures from around the world with detailed guides, tips, and stunning photography.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {adventures.map((adventure, index) => (
              <motion.article
                key={adventure.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/adventure/${adventure.id}`}>
                  <div className="card card-hover">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={adventure.image}
                        alt={adventure.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Adventure Badges */}
                      <div className="absolute top-4 left-4 flex flex-col space-y-2">
                        {adventure.featured && (
                          <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                            Featured
                          </span>
                        )}
                        <span className={`px-3 py-1 text-white text-xs font-semibold rounded-full ${
                          adventure.difficulty === 'Extreme' ? 'bg-red-500' :
                          adventure.difficulty === 'Hard' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}>
                          {adventure.difficulty}
                        </span>
                      </div>

                      {/* Adventure Info Overlay */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center space-x-2 mb-2">
                          <MapPinIcon className="icon-sm" />
                          <span className="text-sm">{adventure.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ClockIcon className="icon-sm" />
                          <span className="text-sm">{adventure.duration}</span>
                        </div>
                      </div>
                    </div>

                    <div className="card-body">
                      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-200">
                        {adventure.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {adventure.description}
                      </p>

                      {/* Highlights */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          Highlights
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {adventure.highlights.slice(0, 3).map((highlight) => (
                            <span
                              key={highlight}
                              className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs rounded-full"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <TagIcon className="icon-sm text-gray-500" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {adventure.category}
                          </span>
                        </div>
                        <div className="flex items-center text-orange-600 dark:text-orange-400 font-medium text-sm">
                          Read More
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

      {/* Adventure Stats */}
      <section className="section-padding bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Adventure by the Numbers
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-3xl mx-auto">
              Every adventure pushes boundaries and creates unforgettable memories
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: '47', label: 'Mountains Climbed', icon: MapIcon },
                { value: '23', label: 'Extreme Sports', icon: BoltIcon },
                { value: '156', label: 'Adventure Days', icon: FireIcon },
                { value: '12', label: 'Countries Explored', icon: GlobeAltIcon },
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                      <Icon className="icon-xl text-white" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm opacity-90">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
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
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Get personalized adventure recommendations and expert planning assistance for your next epic journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn-primary">
                <BoltIcon className="mr-2 icon-md" />
                Plan My Adventure
              </Link>
              <Link href="/book" className="btn-outline">
                <CameraIcon className="mr-2 icon-md" />
                Get Adventure Guide
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
