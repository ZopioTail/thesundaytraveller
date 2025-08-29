'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpenIcon,
  StarIcon,
  ShoppingCartIcon,
  GiftIcon,
  CheckIcon,
  PlayIcon,
  UserIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'

const bookFeatures = [
  'Over 300 pages of travel wisdom',
  '150+ stunning photographs',
  'Detailed destination guides',
  'Budget planning templates',
  'Safety tips and checklists',
  'Cultural etiquette guides',
  'Photography techniques',
  'Packing lists and gear reviews'
]

const testimonials = [
  {
    quote: "This book transformed how I approach travel. The insights are invaluable and the photography is breathtaking.",
    author: "Sarah Mitchell",
    location: "Travel Blogger",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "A must-have for any serious traveler. The practical tips saved me hundreds of dollars on my last trip.",
    author: "David Chen",
    location: "Digital Nomad",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "Beautiful storytelling combined with practical advice. This book inspired my year-long sabbatical journey.",
    author: "Emma Rodriguez",
    location: "Adventure Seeker",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
  }
]

const chapters = [
  { title: "The Art of Slow Travel", description: "Why taking your time leads to deeper experiences" },
  { title: "Budget Mastery", description: "How to travel the world without breaking the bank" },
  { title: "Cultural Immersion", description: "Connecting authentically with local communities" },
  { title: "Photography on the Road", description: "Capturing memories that last a lifetime" },
  { title: "Solo Travel Confidence", description: "Embracing independence and personal growth" },
  { title: "Adventure Planning", description: "From dream to reality: making it happen" },
]

export default function BookPage() {
  const [selectedFormat, setSelectedFormat] = useState('paperback')
  const [showBuyPopup, setShowBuyPopup] = useState(false)

  const formats = {
    kindle: {
      price: 149,
      originalPrice: null,
      currency: '₹',
      format: 'Kindle Edition',
      availability: 'Available instantly',
      description: 'Digital edition with instant download'
    },
    paperback: {
      price: 399,
      originalPrice: 499,
      currency: '₹',
      format: 'Paperback',
      availability: 'Ships within 2-3 business days',
      description: 'Physical book with high-quality printing'
    }
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Book Cover */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                className="relative inline-block"
                whileHover={{ 
                  rotateY: 15,
                  rotateX: 5,
                  scale: 1.05 
                }}
                transition={{ duration: 0.3 }}
                style={{ perspective: 1000 }}
              >
                <div className="relative w-320 h-384 mx-auto lg:mx-0 shadow-2xl rounded-lg overflow-hidden">
                  <Image
                    src="/images/optimized/book-cover.jpg"
                    alt="The Sunday Traveller Book by Vineet Kumar"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-serif font-bold mb-2">
                      The Sunday Traveller
                    </h3>
                    <p className="text-sm opacity-90">
                      A Soldier's Journey Through Life and Adventure
                    </p>
                  </div>
                </div>
                
                {/* 3D Effect Shadow */}
                <div className="absolute -bottom-4 -right-4 w-80 h-96 bg-black/20 rounded-lg -z-10 blur-xl" />
              </motion.div>
            </motion.div>

            {/* Book Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="icon-md text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-lg font-semibold">4.9/5</span>
                <span className="text-white/80">(156 reviews)</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                The Sunday Traveller
              </h1>

              <p className="text-xl mb-8 opacity-90">
                A compelling memoir that weaves together military service, extreme adventures, and profound life lessons. From serving in challenging terrains to exploring 47+ countries, discover how military discipline meets wanderlust.
              </p>

              {/* Format Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Choose Your Format</h3>
                <div className="space-y-3">
                  {Object.entries(formats).map(([format, pricing]) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedFormat === format
                          ? 'border-white bg-white/10'
                          : 'border-white/30 hover:border-white/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-semibold">{pricing.format}</div>
                          <div className="text-sm opacity-80">{pricing.availability}</div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            {pricing.originalPrice && (
                              <span className="text-sm line-through opacity-60">
                                {pricing.currency}{pricing.originalPrice}
                              </span>
                            )}
                            <span className="text-lg font-bold">
                              {pricing.currency}{pricing.price}
                            </span>
                          </div>
                          {pricing.originalPrice && (
                            <div className="text-sm text-green-300">
                              Save {pricing.currency}{pricing.originalPrice - pricing.price} (20%)
                            </div>
                          )}
                          <div className="text-xs opacity-70">incl. GST</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Purchase Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowBuyPopup(true)}
                  className="btn-secondary flex-1"
                >
                  <ShoppingCartIcon className="mr-2 icon-md" />
                  Buy Now - {formats[selectedFormat as keyof typeof formats].currency}{formats[selectedFormat as keyof typeof formats].price}
                </button>
                <button className="btn-outline">
                  <GiftIcon className="mr-2 icon-md" />
                  Gift This Book
                </button>
              </div>

              <div className="mt-6 text-sm opacity-80">
                ✨ {selectedFormat === 'paperback' ? 'Save ₹100 (20% off)' : 'Available instantly'} - Free shipping on orders above ₹500
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Book Features */}
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
              What's <span className="gradient-text">Inside</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to become a confident, savvy traveler who creates meaningful experiences around the world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookFeatures.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <CheckIcon className="icon-md text-green-500 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter Preview */}
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
              Chapter <span className="gradient-text">Preview</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get a glimpse of the comprehensive topics covered in this essential travel guide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card card-hover"
              >
                <div className="card-body">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {chapter.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {chapter.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
              Reader <span className="gradient-text">Reviews</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See what fellow travelers are saying about this comprehensive travel guide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="card-body">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="icon-md text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-400 mb-6 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={40}
                      height={40}
                      className="img-avatar-md"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gray-900 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Start Your Journey Today
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of travelers who have transformed their adventures with this comprehensive guide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowBuyPopup(true)}
                className="btn-primary"
              >
                <ShoppingCartIcon className="mr-2 icon-md" />
                Get Your Copy Now
              </button>
              <button className="btn-outline">
                <PlayIcon className="mr-2 icon-md" />
                Watch Preview
              </button>
            </div>
            <div className="mt-6 text-sm opacity-80">
              30-day money-back guarantee • Free shipping on orders above ₹500
            </div>
          </motion.div>
        </div>
      </section>

      {/* Buy Popup */}
      {showBuyPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Choose Your Edition
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select your preferred format to continue
              </p>
            </div>

            <div className="space-y-4">
              {Object.entries(formats).map(([format, pricing]) => (
                <div
                  key={format}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors duration-200 ${
                    selectedFormat === format
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-600'
                  }`}
                  onClick={() => setSelectedFormat(format)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {pricing.format}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {pricing.availability}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        {pricing.originalPrice && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            {pricing.currency}{pricing.originalPrice}
                          </span>
                        )}
                        <span className="text-xl font-bold text-gray-900 dark:text-white">
                          {pricing.currency}{pricing.price}
                        </span>
                      </div>
                      {pricing.originalPrice && (
                        <div className="text-sm text-green-600 dark:text-green-400">
                          Save {pricing.currency}{pricing.originalPrice - pricing.price} (20%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowBuyPopup(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-semibold">
                <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
                Buy Now
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sticky Buy Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowBuyPopup(true)}
          className="bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-orange-700 transition-all duration-200 hover:scale-105"
        >
          <ShoppingCartIcon className="w-5 h-5 inline mr-2" />
          Buy Book
        </button>
      </div>
    </div>
  )
}
