import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenIcon,
  StarIcon,
  ShoppingCartIcon,
  EyeIcon,
  GiftIcon,
  TruckIcon,
  ShieldCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const bookData = {
  title: "Wanderlust Chronicles: A Journey Through 47 Countries",
  subtitle: "Stories of Discovery, Adventure, and Human Connection",
  author: "The Sunday Traveller",
  isbn: "978-0-123456-78-9",
  pages: 384,
  publishDate: "March 2024",
  price: 24.99,
  rating: 4.8,
  reviews: 127,
  description: "Join me on an extraordinary journey across 47 countries and 6 continents. This memoir combines personal stories, cultural insights, and practical travel wisdom gained from years of exploration. From the bustling streets of Tokyo to the serene landscapes of Patagonia, discover how travel can transform not just your perspective, but your entire life.",
  features: [
    "384 pages of captivating stories",
    "Over 100 stunning photographs",
    "Practical travel tips and guides",
    "Cultural insights and local wisdom",
    "Personal reflections and growth",
    "Detailed destination information"
  ],
  coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
};

const previewPages = [
  {
    pageNumber: 1,
    title: "Chapter 1: The First Step",
    content: "The decision to leave everything behind and embark on a journey around the world wasn't made lightly. It was a Tuesday morning in March when I realized that my comfortable life had become a beautiful prison...",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    pageNumber: 15,
    title: "Chapter 3: Lost in Translation",
    content: "Standing in the middle of a bustling Tokyo street at 2 AM, unable to communicate with anyone around me, I learned my first valuable lesson about travel: vulnerability is not weakness, it's the gateway to authentic human connection...",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  },
  {
    pageNumber: 127,
    title: "Chapter 8: The Kindness of Strangers",
    content: "In a small village in rural Kenya, I discovered that hospitality transcends language barriers. When Maria invited me to share dinner with her family, I experienced generosity that would forever change my understanding of wealth...",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
  }
];

const testimonials = [
  {
    text: "A beautifully written memoir that captures the essence of wanderlust. Every page is a new adventure.",
    author: "Travel + Leisure Magazine",
    rating: 5
  },
  {
    text: "The Sunday Traveller has a gift for storytelling that makes you feel like you're right there experiencing every moment.",
    author: "National Geographic Traveler",
    rating: 5
  },
  {
    text: "This book doesn't just tell you where to go; it shows you how to truly see and experience the world.",
    author: "Lonely Planet",
    rating: 4
  }
];

export default function Book() {
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Hero Section with 3D Book */}
      <section className="relative py-24 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Book Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-shadow-lg">
                  {bookData.title}
                </h1>
                <h2 className="text-xl md:text-2xl mb-6 opacity-90 text-shadow">
                  {bookData.subtitle}
                </h2>
                <p className="text-lg mb-8 opacity-80 text-shadow">
                  {bookData.description}
                </p>
              </motion.div>

              {/* Book Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center space-x-6 mb-8"
              >
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(bookData.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-yellow-400/30'
                      }`}
                    />
                  ))}
                  <span className="ml-2 font-semibold">{bookData.rating}</span>
                </div>
                <div className="text-sm opacity-80">
                  {bookData.reviews} reviews
                </div>
                <div className="text-sm opacity-80">
                  {bookData.pages} pages
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="btn-primary bg-white text-orange-600 hover:bg-gray-100"
                >
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  Order Now - ${bookData.price}
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className="btn-secondary"
                >
                  <EyeIcon className="mr-2 h-5 w-5" />
                  Preview Pages
                </button>
              </motion.div>
            </motion.div>

            {/* 3D Book Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center"
            >
              <motion.div
                className="relative"
                whileHover={{
                  rotateY: 15,
                  rotateX: 5,
                  scale: 1.05
                }}
                transition={{ duration: 0.3 }}
                style={{ perspective: 1000 }}
              >
                {/* Book Cover */}
                <div className="relative w-64 h-80 bg-white rounded-lg shadow-2xl overflow-hidden transform-gpu">
                  <img
                    src={bookData.coverImage}
                    alt={bookData.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h3 className="font-serif font-bold text-lg mb-2 text-shadow">
                      {bookData.title}
                    </h3>
                    <p className="text-sm opacity-90 text-shadow">
                      {bookData.author}
                    </p>
                  </div>
                </div>

                {/* Book Spine */}
                <div className="absolute top-0 right-0 w-4 h-80 bg-gradient-to-b from-amber-700 to-amber-900 transform origin-left -skew-y-12 shadow-lg" />

                {/* Book Pages */}
                <div className="absolute top-1 right-1 w-1 h-78 bg-gray-100 rounded-sm" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Book Features */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              What's Inside
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive collection of travel experiences, insights, and practical wisdom
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookData.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
                  <BookOpenIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              What Readers Are Saying
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass-card p-6"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  "{testimonial.text}"
                </blockquote>
                <cite className="text-sm font-semibold text-gray-900 dark:text-white">
                  — {testimonial.author}
                </cite>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Options */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8">
              Get Your Copy Today
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {/* Digital */}
              <div className="glass-card p-6 text-center">
                <BookOpenIcon className="h-12 w-12 mx-auto mb-4 text-white" />
                <h3 className="text-xl font-bold mb-2">Digital Edition</h3>
                <div className="text-3xl font-bold mb-4">${(bookData.price * 0.7).toFixed(2)}</div>
                <ul className="text-sm space-y-2 mb-6 opacity-90">
                  <li>Instant download</li>
                  <li>PDF, EPUB, MOBI formats</li>
                  <li>Interactive links</li>
                </ul>
                <button className="btn-secondary w-full">
                  Buy Digital
                </button>
              </div>

              {/* Paperback */}
              <div className="glass-card p-6 text-center border-2 border-white/30">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-500 text-black text-xs font-bold rounded-full">
                  POPULAR
                </div>
                <GiftIcon className="h-12 w-12 mx-auto mb-4 text-white" />
                <h3 className="text-xl font-bold mb-2">Paperback</h3>
                <div className="text-3xl font-bold mb-4">${bookData.price}</div>
                <ul className="text-sm space-y-2 mb-6 opacity-90">
                  <li>Premium paper quality</li>
                  <li>Free worldwide shipping</li>
                  <li>Signed copy available</li>
                </ul>
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="btn-secondary w-full bg-white text-primary-600 hover:bg-gray-100"
                >
                  Order Paperback
                </button>
              </div>

              {/* Hardcover */}
              <div className="glass-card p-6 text-center">
                <TruckIcon className="h-12 w-12 mx-auto mb-4 text-white" />
                <h3 className="text-xl font-bold mb-2">Hardcover</h3>
                <div className="text-3xl font-bold mb-4">${(bookData.price * 1.5).toFixed(2)}</div>
                <ul className="text-sm space-y-2 mb-6 opacity-90">
                  <li>Collector's edition</li>
                  <li>Dust jacket included</li>
                  <li>Premium binding</li>
                </ul>
                <button className="btn-secondary w-full">
                  Pre-order Hardcover
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center items-center space-x-8 text-sm opacity-80">
              <div className="flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2" />
                Secure Payment
              </div>
              <div className="flex items-center">
                <TruckIcon className="h-5 w-5 mr-2" />
                Free Shipping
              </div>
              <div className="flex items-center">
                <GiftIcon className="h-5 w-5 mr-2" />
                Gift Wrapping
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Page Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-serif font-bold">Book Preview</h3>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {previewPages[currentPreviewPage].pageNumber}
                  </span>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-8 overflow-y-auto max-h-[70vh]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPreviewPage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      <div>
                        <h4 className="text-2xl font-serif font-bold mb-4 text-gray-900 dark:text-white">
                          {previewPages[currentPreviewPage].title}
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {previewPages[currentPreviewPage].content}
                        </p>
                      </div>
                      <div>
                        <img
                          src={previewPages[currentPreviewPage].image}
                          alt={previewPages[currentPreviewPage].title}
                          className="w-full h-64 object-cover rounded-lg shadow-lg"
                        />
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Preview Navigation */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setCurrentPreviewPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPreviewPage === 0}
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <ChevronLeftIcon className="h-5 w-5 mr-2" />
                  Previous
                </button>

                <div className="flex space-x-2">
                  {previewPages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPreviewPage(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === currentPreviewPage ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPreviewPage(prev => Math.min(previewPages.length - 1, prev + 1))}
                  disabled={currentPreviewPage === previewPages.length - 1}
                  className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Next
                  <ChevronRightIcon className="h-5 w-5 ml-2" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowOrderForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif font-bold mb-2">Order Book</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete your order details below
                </p>
              </div>

              {/* Order Form (Jotform will be integrated here) */}
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Edition
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                    <option value="paperback">Paperback - ${bookData.price}</option>
                    <option value="hardcover">Hardcover - ${(bookData.price * 1.5).toFixed(2)}</option>
                    <option value="signed">Signed Paperback - ${(bookData.price + 10).toFixed(2)}</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                  >
                    <ShoppingCartIcon className="mr-2 h-5 w-5" />
                    Order Now
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
