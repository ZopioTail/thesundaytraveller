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
  SparklesIcon,
  FireIcon,
  HeartIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  TrophyIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  EyeIcon,
} from '@heroicons/react/24/outline'
import {
  MapPinIcon as MapPinIconSolid,
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid,
} from '@heroicons/react/24/solid'
import CountUpAnimation from '@/components/ui/CountUpAnimation'
import StatsChart from '@/components/ui/StatsChart'
import TravelPath from '@/components/TravelPath'

// Enhanced Hero carousel images with more data
const heroImages = [
  {
    url: '/images/optimized/hero-main.jpg',
    alt: 'Vineet Kumar - The Sunday Traveller',
    title: 'The Sunday Traveller',
    subtitle: 'Where military discipline meets wanderlust - discover extraordinary destinations through the eyes of a soldier-explorer who finds profound lessons in every journey',
    badge: 'Featured Story',
    cta: 'Start Your Journey',
    stats: { countries: '47+', stories: '150+', years: '5+' }
  },
  {
    url: '/images/optimized/hero-adventure.jpg',
    alt: 'Adventure sports and extreme activities',
    title: 'Adventure Beyond Limits',
    subtitle: 'From rappelling down 200-foot cliffs to navigating Grade IV rapids - every adrenaline-fueled adventure teaches courage, resilience, and the art of calculated risk',
    badge: 'Extreme Adventures',
    cta: 'Explore Adventures',
    stats: { adventures: '50+', heights: '200ft', rapids: 'Grade IV' }
  },
  {
    url: '/images/optimized/hero-military.jpg',
    alt: 'Military service and professional life',
    title: 'Life Beyond the Uniform',
    subtitle: 'Discovering beauty in simplicity - from military precision to civilian adventures, explore how discipline informs intentional living and meaningful connections',
    badge: 'Military Life',
    cta: 'Read Stories',
    stats: { service: '10+ yrs', missions: '25+', awards: '8' }
  },
  {
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Portugal travel destination',
    title: 'Destinations That Transform',
    subtitle: 'From Portugal\'s cobblestone streets to Nepal\'s towering peaks - each destination offers unique lessons in culture, adventure, and personal growth',
    badge: 'Travel Guides',
    cta: 'Discover Places',
    stats: { continents: '6', cultures: '30+', photos: '2500+' }
  }
]

const stats = [
  {
    icon: MapPinIcon,
    value: 47,
    label: 'Countries Visited',
    suffix: '+',
    color: 'from-blue-500 to-cyan-500',
    description: 'Across 6 continents'
  },
  {
    icon: CameraIcon,
    value: 2500,
    label: 'Photos Captured',
    suffix: '+',
    color: 'from-purple-500 to-pink-500',
    description: 'Moments frozen in time'
  },
  {
    icon: BookOpenIcon,
    value: 150,
    label: 'Stories Written',
    suffix: '+',
    color: 'from-orange-500 to-red-500',
    description: 'Adventures documented'
  },
  {
    icon: GlobeAltIcon,
    value: 6,
    label: 'Continents Explored',
    suffix: '',
    color: 'from-green-500 to-teal-500',
    description: 'Every corner of Earth'
  },
  {
    icon: TrophyIcon,
    value: 25,
    label: 'Adventures Completed',
    suffix: '+',
    color: 'from-yellow-500 to-orange-500',
    description: 'Extreme challenges conquered'
  },
  {
    icon: UserGroupIcon,
    value: 10000,
    label: 'Lives Inspired',
    suffix: '+',
    color: 'from-indigo-500 to-purple-500',
    description: 'Fellow travelers motivated'
  },
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
      {/* Enhanced Hero Section with Carousel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
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

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <Image
              src={heroImages[currentSlide].url}
              alt={heroImages[currentSlide].alt}
              fill
              className="object-cover"
              priority
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Hero Content */}
        <div className="relative z-20 text-center text-white px-6 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 1.1 }}
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
                  {heroImages[currentSlide].badge}
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 text-shadow-xl bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent leading-tight"
              >
                {heroImages[currentSlide].title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-xl md:text-2xl lg:text-3xl mb-10 text-shadow-lg max-w-4xl mx-auto leading-relaxed text-gray-100"
              >
                {heroImages[currentSlide].subtitle}
              </motion.p>

              {/* Hero Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-10"
              >
                {Object.entries(heroImages[currentSlide].stats).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">
                      {value}
                    </div>
                    <div className="text-sm md:text-base text-gray-300 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Enhanced CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Link href="/destinations" className="btn-primary group">
                  <MapPinIconSolid className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  {heroImages[currentSlide].cta}
                  <ArrowRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link href="/blog" className="btn-outline group">
                  <BookOpenIcon className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  Read Stories
                  <ArrowRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="flex items-center justify-center space-x-2 text-sm text-gray-300 mt-8"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-pink-400 border-2 border-white" />
                  ))}
                </div>
                <span className="ml-3">Trusted by 10,000+ travelers worldwide</span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Carousel Controls */}
        <motion.button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ChevronLeftIcon className="w-6 h-6 text-white" />
        </motion.button>
        <motion.button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 p-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ChevronRightIcon className="w-6 h-6 text-white" />
        </motion.button>

        {/* Enhanced Carousel Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {heroImages.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              className={`relative transition-all duration-300 ${
                index === currentSlide
                  ? 'w-12 h-3 bg-white rounded-full'
                  : 'w-3 h-3 bg-white/50 rounded-full hover:bg-white/70'
              }`}
            >
              {index === currentSlide && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Scroll Down Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300 cursor-pointer"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-sm mb-2">Scroll to explore</span>
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

      {/* Enhanced Stats Section */}
      <section className="relative section-padding bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
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
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-gray-200/50 dark:border-gray-700/50"
            >
              <TrophyIcon className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Achievement Highlights</span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Journey by the Numbers
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Every adventure tells a story, and every story adds to the incredible journey of exploration and discovery across our beautiful planet.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative"
                >
                  <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                      className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${stat.color} rounded-2xl mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Number */}
                    <div className={`text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      <CountUpAnimation end={stat.value} suffix={stat.suffix} />
                    </div>

                    {/* Label */}
                    <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {stat.label}
                    </div>

                    {/* Description */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.description}
                    </div>

                    {/* Hover Effect */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color} animate-pulse`} />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Additional Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold text-orange-500 mb-1">5+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Years Traveling</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500 mb-1">250K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Miles Covered</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500 mb-1">30+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Languages Heard</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-500 mb-1">100+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Local Friends</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Travel Path Section */}
      <section className="relative section-padding bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.2),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.2),transparent_50%)]" />
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20"
            >
              <GlobeAltIcon className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-white">Global Adventures</span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white">
              My Global <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Journey</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Follow the path of adventure across 47+ countries and 6 continents. Each flag represents a unique story,
              cultural discovery, and unforgettable experience that shaped this incredible journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <TravelPath />
          </motion.div>

          {/* Journey Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              { icon: MapPinIconSolid, title: 'First Journey', desc: 'Started in India, 2019', color: 'from-green-400 to-blue-500' },
              { icon: HeartIconSolid, title: 'Favorite Destination', desc: 'Portugal - Culture & Beauty', color: 'from-pink-400 to-red-500' },
              { icon: StarIconSolid, title: 'Most Challenging', desc: 'Nepal Himalayas Trek', color: 'from-yellow-400 to-orange-500' }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.color} rounded-full mb-4 shadow-lg`}>
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section className="relative section-padding bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-gray-200/50 dark:border-gray-700/50"
            >
              <RocketLaunchIcon className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Discover Adventures</span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              Explore by <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
              Dive into different types of travel experiences, from adrenaline-pumping adventures to peaceful cultural immersions and everything in between.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Link
                  href={category.href}
                  className="block relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <div className="relative h-80 lg:h-96">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Enhanced gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Floating elements */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <ArrowRightIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                    >
                      <div className="mb-4">
                        <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold border border-white/30">
                          {index === 0 ? '25+ Destinations' : index === 1 ? '15+ Adventures' : index === 2 ? '20+ Cultures' : '30+ Experiences'}
                        </span>
                      </div>

                      <h3 className="text-3xl lg:text-4xl font-bold mb-4 text-shadow-lg">
                        {category.name}
                      </h3>

                      <p className="text-lg text-white/90 mb-6 leading-relaxed">
                        {category.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-lg font-semibold">
                          <span className="mr-3">Explore Now</span>
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <ArrowRightIcon className="w-5 h-5" />
                          </motion.div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-1">
                            {[1, 2, 3].map((i) => (
                              <div key={i} className="w-6 h-6 rounded-full bg-white/30 border border-white/50" />
                            ))}
                          </div>
                          <span className="text-sm text-white/80">+{Math.floor(Math.random() * 50) + 10} stories</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-center mt-16"
          >
            <Link href="/destinations" className="btn-primary group">
              <GlobeAltIcon className="mr-3 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              View All Destinations
              <ArrowRightIcon className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="relative section-padding bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.6, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/30"
            >
              <HeartIcon className="w-5 h-5 text-pink-200" />
              <span className="text-sm font-semibold text-white">Traveler Reviews</span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white">
              What Travelers Say
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-5xl mx-auto"
          >
            <div className="glass-card p-8 md:p-16 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-8 left-8 text-6xl text-white/20 font-serif">"</div>
              <div className="absolute bottom-8 right-8 text-6xl text-white/20 font-serif rotate-180">"</div>

              <div className="flex justify-center mb-8">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <StarIconSolid className="w-8 h-8 text-yellow-400 mx-1" />
                  </motion.div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="text-center"
                >
                  <blockquote className="text-2xl md:text-3xl font-light text-white mb-12 italic leading-relaxed">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>

                  <div className="flex items-center justify-center space-x-6">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="relative"
                    >
                      <Image
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].author}
                        width={64}
                        height={64}
                        className="rounded-full border-4 border-white/30 shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white" />
                    </motion.div>

                    <div className="text-left">
                      <div className="text-xl font-bold text-white mb-1">
                        {testimonials[currentTestimonial].author}
                      </div>
                      <div className="text-white/80 text-base flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2" />
                        {testimonials[currentTestimonial].location}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Testimonial Navigation */}
              <div className="flex justify-center mt-12 space-x-3">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial
                        ? 'bg-white scale-125'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white"
          >
            {[
              { number: '10K+', label: 'Happy Travelers' },
              { number: '4.9/5', label: 'Average Rating' },
              { number: '500+', label: 'Reviews' },
              { number: '47+', label: 'Countries Covered' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                <div className="text-3xl font-bold mb-2">{item.number}</div>
                <div className="text-white/80">{item.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative section-padding bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(59,130,246,0.3),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(147,51,234,0.3),transparent_70%)]" />
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="container-custom text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* 3D Book Animation */}
            <motion.div
              className="inline-block mb-12"
              initial={{ rotateY: -30, scale: 0.8 }}
              whileInView={{ rotateY: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              whileHover={{
                scale: 1.05,
                rotateY: 15,
                rotateX: 5,
                transition: { duration: 0.3 }
              }}
              style={{ perspective: 1000 }}
            >
              <div className="relative w-40 h-52 mx-auto">
                {/* Book Cover */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 rounded-lg shadow-2xl transform-gpu">
                  <div className="absolute inset-4 border-2 border-white/30 rounded-md flex flex-col items-center justify-center text-white">
                    <GlobeAltIcon className="w-12 h-12 mb-2" />
                    <div className="text-xs font-bold text-center leading-tight">
                      THE SUNDAY<br />TRAVELLER<br />GUIDE
                    </div>
                  </div>
                </div>

                {/* Book Spine */}
                <div className="absolute -right-2 top-0 w-4 h-52 bg-gradient-to-b from-orange-600 to-purple-700 rounded-r-lg shadow-lg transform-gpu" />

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-purple-600/20 rounded-lg blur-xl scale-110" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-white/20">
                <LightBulbIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-sm font-semibold">Exclusive Travel Guide</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Get My Travel Book
              </h2>

              <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
                Discover insider secrets, hidden gems, and practical tips from years of global exploration.
                Transform your travels with battle-tested strategies from a soldier-explorer.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                {[
                  { icon: MapPinIcon, title: '47+ Destinations', desc: 'Detailed guides' },
                  { icon: CameraIcon, title: 'Photo Locations', desc: 'Instagram-worthy spots' },
                  { icon: FireIcon, title: 'Adventure Tips', desc: 'Safety & preparation' }
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                  >
                    <feature.icon className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/80">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <Link href="/book" className="btn-primary group text-lg px-10 py-5">
                  <BookOpenIcon className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  Get the Book Now
                  <ArrowRightIcon className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                <Link href="/blog" className="btn-outline group text-lg px-10 py-5">
                  <EyeIcon className="mr-3 w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  Preview Stories
                </Link>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-12 flex items-center justify-center space-x-8 text-sm text-white/70"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <StarIconSolid key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                  <span>4.9/5 rating</span>
                </div>
                <div>•</div>
                <div>500+ reviews</div>
                <div>•</div>
                <div>10K+ downloads</div>
              </motion.div>
            </motion.div>
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
