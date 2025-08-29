'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  MapPinIcon,
  BookOpenIcon,
  CameraIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon,
  PlayIcon,
} from '@heroicons/react/24/outline'
import CountUpAnimation from '@/components/ui/CountUpAnimation'
import StatsChart from '@/components/ui/StatsChart'
import TravelPath from '@/components/TravelPath'

// Hero carousel images
const heroImages = [
  {
    url: '/images/optimized/hero-main.jpg',
    alt: 'Rabindra Sahu - The Sunday Traveller',
    title: 'The Sunday Traveller',
    subtitle: 'Where military discipline meets wanderlust - discover extraordinary destinations through the eyes of a soldier-explorer who finds profound lessons in every journey'
  },
  {
    url: '/images/optimized/hero-adventure.jpg',
    alt: 'Adventure sports and extreme activities',
    title: 'Adventure Beyond Limits',
    subtitle: 'From rappelling down 200-foot cliffs to navigating Grade IV rapids - every adrenaline-fueled adventure teaches courage, resilience, and the art of calculated risk'
  },
  {
    url: '/images/optimized/hero-military.jpg',
    alt: 'Military service and professional life',
    title: 'Life Beyond the Uniform',
    subtitle: 'Discovering beauty in simplicity - from military precision to civilian adventures, explore how discipline informs intentional living and meaningful connections'
  },
  {
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Portugal travel destination',
    title: 'Destinations That Transform',
    subtitle: 'From Portugal\'s cobblestone streets to Nepal\'s towering peaks - each destination offers unique lessons in culture, adventure, and personal growth'
  }
]

const stats = [
  { icon: MapPinIcon, value: 47, label: 'Countries Visited', suffix: '+' },
  { icon: CameraIcon, value: 2500, label: 'Photos Captured', suffix: '+' },
  { icon: BookOpenIcon, value: 150, label: 'Stories Written', suffix: '+' },
  { icon: GlobeAltIcon, value: 6, label: 'Continents Explored', suffix: '' },
]

const categories = [
  {
    name: 'Destinations',
    description: 'Explore breathtaking locations and hidden gems around the world',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/destinations',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Adventure',
    description: 'Thrilling outdoor experiences and extreme sports that push boundaries',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/adventure',
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Culture',
    description: 'Deep dives into local traditions, art, and meaningful life experiences',
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/culture',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Food & Lifestyle',
    description: 'Culinary adventures, minimalist living, and intentional lifestyle choices',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/food-lifestyle',
    color: 'from-green-500 to-teal-500'
  }
]

const testimonials = [
  {
    quote: "The Sunday Traveller's guides helped me discover hidden gems I never would have found on my own. Absolutely incredible insights!",
    author: "Sarah Johnson",
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "Thanks to these detailed travel stories, I felt prepared and excited for every destination. The cultural insights were invaluable.",
    author: "Marco Rodriguez",
    location: "Barcelona, Spain", 
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "The photography and storytelling transport you to each destination. I've planned my entire year of travel based on these guides!",
    author: "Emma Chen",
    location: "Singapore",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  // Show scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={heroImages[currentSlide].url}
              alt={heroImages[currentSlide].alt}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </motion.div>
        </AnimatePresence>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow-lg">
              {heroImages[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-shadow">
              {heroImages[currentSlide].subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/destinations" className="btn-primary">
                <MapPinIcon className="mr-2 icon-md" />
                Explore Destinations
              </Link>
              <Link href="/blog" className="btn-secondary">
                <BookOpenIcon className="mr-2 icon-md" />
                Read Stories
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
        >
          <ChevronLeftIcon className="icon-lg text-white" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
        >
          <ChevronRightIcon className="icon-lg text-white" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
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
              Journey by the <span className="gradient-text">Numbers</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Every adventure tells a story, and every story adds to the incredible journey of exploration and discovery.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full mb-4">
                    <Icon className="icon-xl text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    <CountUpAnimation end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Travel Path Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              My Global <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Follow the path of adventure across 38+ countries and 6 continents. Each flag represents a unique story,
              cultural discovery, and unforgettable experience that shaped this incredible journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <TravelPath />
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Explore by <span className="gradient-text">Category</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Dive into different types of travel experiences, from adrenaline-pumping adventures to peaceful cultural immersions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={category.href}
                  className="group block relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="relative h-64">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80`} />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/90 mb-4">{category.description}</p>
                    <div className="flex items-center text-sm font-medium">
                      <span>Explore</span>
                      <ArrowRightIcon className="ml-2 icon-sm group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="glass-card p-8 md:p-12 max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="icon-lg text-yellow-400 fill-current" />
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <blockquote className="text-xl md:text-2xl font-light text-white mb-8 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <Image
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].author}
                      width={48}
                      height={48}
                      className="img-avatar-md"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-white">
                        {testimonials[currentTestimonial].author}
                      </div>
                      <div className="text-white/80 text-sm">
                        {testimonials[currentTestimonial].location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
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
            <motion.div
              className="inline-block mb-8"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-32 h-40 bg-white rounded-lg shadow-2xl mx-auto flex items-center justify-center">
                <BookOpenIcon className="w-16 h-16 text-orange-600" />
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Get My Travel Book
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Discover insider secrets, hidden gems, and practical tips from years of global exploration in my comprehensive travel guide.
            </p>
            <Link href="/book" className="btn-primary">
              <BookOpenIcon className="mr-2 icon-md" />
              Get the Book
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
