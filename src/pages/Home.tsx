import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MapPinIcon,
  BookOpenIcon,
  CameraIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import CountUpAnimation from '../components/ui/CountUpAnimation';

// Hero carousel images from Unsplash
const heroImages = [
  {
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Mountain landscape with lake',
    title: 'Explore the Mountains',
    subtitle: 'Discover breathtaking peaks and serene lakes'
  },
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Tropical beach paradise',
    title: 'Tropical Paradise',
    subtitle: 'Unwind on pristine beaches and crystal waters'
  },
  {
    url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Ancient architecture',
    title: 'Cultural Heritage',
    subtitle: 'Journey through history and ancient civilizations'
  },
  {
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
    alt: 'Desert landscape',
    title: 'Desert Adventures',
    subtitle: 'Experience the magic of endless horizons'
  }
];

const categories = [
  {
    name: 'News',
    description: 'Latest travel updates and stories',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/news',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Blog',
    description: 'Personal travel experiences',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/blog',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Travel',
    description: 'Destination guides and tips',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/blog?category=travel',
    color: 'from-green-500 to-teal-500',
  },
  {
    name: 'Adventure',
    description: 'Thrilling outdoor experiences',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/adventure',
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'Lifestyle',
    description: 'Travel lifestyle and culture',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/lifestyle',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'Profession',
    description: 'Professional travel insights',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    href: '/profession',
    color: 'from-gray-500 to-slate-500',
  },
];

const stats = [
  { label: 'Countries Visited', value: 47, icon: MapPinIcon },
  { label: 'Miles Traveled', value: 125000, icon: GlobeAltIcon },
  { label: 'Stories Written', value: 234, icon: BookOpenIcon },
  { label: 'Photos Captured', value: 15000, icon: CameraIcon },
];

const testimonials = [
  {
    quote: "An incredible journey through the eyes of a true explorer. Every story captivates and inspires.",
    author: "Sarah Johnson",
    role: "Travel Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "The Sunday Traveller brings destinations to life with vivid storytelling and stunning photography.",
    author: "Michael Chen",
    role: "Photography Enthusiast",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "A masterful blend of adventure, culture, and personal insight. Truly inspiring content.",
    author: "Emma Rodriguez",
    role: "Adventure Seeker",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Carousel */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="hero-gradient absolute inset-0 opacity-70 z-10" />
              <img
                src={heroImages[currentSlide].url}
                alt={heroImages[currentSlide].alt}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
        >
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors duration-200"
        >
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-serif font-bold mb-6 text-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              The Sunday Traveller
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-light mb-4 text-shadow">
                {heroImages[currentSlide].title}
              </h2>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-shadow opacity-90">
                {heroImages[currentSlide].subtitle}
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link to="/about" className="btn-primary">
                Discover My Journey
              </Link>
              <Link to="/blog" className="btn-secondary">
                Read Stories
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Journey Map Section */}
      <section className="section-padding bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              My Journey Around the World
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Follow the path of my adventures across continents, cultures, and countless memories.
            </p>
          </motion.div>

          {/* Animated Journey Path */}
          <div className="relative max-w-6xl mx-auto mb-16">
            <svg
              className="w-full h-64 md:h-96"
              viewBox="0 0 800 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Curved path */}
              <motion.path
                d="M50 250 Q200 50 400 150 T750 100"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                strokeDasharray="10,5"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3, ease: "easeInOut" }}
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>

              {/* Journey points with flags */}
              {[
                { x: 100, y: 220, country: '🇺🇸', name: 'USA' },
                { x: 250, y: 80, country: '🇬🇧', name: 'UK' },
                { x: 400, y: 150, country: '🇯🇵', name: 'Japan' },
                { x: 550, y: 120, country: '🇦🇺', name: 'Australia' },
                { x: 700, y: 130, country: '🇧🇷', name: 'Brazil' },
              ].map((point, index) => (
                <motion.g
                  key={point.name}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.3 + 1 }}
                >
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="20"
                    fill="white"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    className="drop-shadow-lg"
                  />
                  <text
                    x={point.x}
                    y={point.y + 5}
                    textAnchor="middle"
                    className="text-lg"
                  >
                    {point.country}
                  </text>
                  <text
                    x={point.x}
                    y={point.y + 45}
                    textAnchor="middle"
                    className="text-sm font-medium fill-gray-700 dark:fill-gray-300"
                  >
                    {point.name}
                  </text>
                </motion.g>
              ))}
            </svg>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <motion.div
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  >
                    <CountUpAnimation value={stat.value} />
                  </motion.div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
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
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Explore Categories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Dive into different aspects of travel and discover stories that inspire, 
              inform, and ignite your wanderlust.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={category.href}
                  className="group block relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 group-hover:opacity-90 transition-opacity duration-300`} />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <h3 className="text-2xl font-serif font-bold mb-2">
                      {category.name}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center text-sm font-medium">
                      <span>Explore</span>
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              What Readers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of fellow travelers who have been inspired by these stories.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="glass-card p-8 md:p-12">
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl font-light text-gray-700 dark:text-gray-300 mb-8 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={testimonials[currentTestimonial].avatar}
                      alt={testimonials[currentTestimonial].author}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonials[currentTestimonial].author}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial
                      ? 'bg-primary-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Book CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              className="inline-block mb-8"
              whileHover={{ scale: 1.05, rotateY: 10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-32 h-40 bg-white rounded-lg shadow-2xl mx-auto flex items-center justify-center">
                <BookOpenIcon className="h-16 w-16 text-primary-600" />
              </div>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              My Travel Book
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Discover the complete collection of my travel adventures, insights,
              and stories from around the world in my latest book.
            </p>
            <Link
              to="/book"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <BookOpenIcon className="mr-2 h-5 w-5" />
              Get the Book
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUpIcon className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
