'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  GlobeAltIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showAutoPopup, setShowAutoPopup] = useState(false)

  // Auto-open popup after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAutoPopup(true)
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Contact"
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
            <EnvelopeIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Have questions about travel? Want to collaborate? I'd love to hear from you!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="card">
                <div className="card-body">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Send a Message
                  </h2>
                  
                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-green-600 mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Thank you for reaching out. I'll get back to you soon!
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject *
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                        >
                          <option value="">Select a topic</option>
                          <option value="travel-advice">Travel Advice</option>
                          <option value="collaboration">Collaboration</option>
                          <option value="speaking">Speaking Engagement</option>
                          <option value="media">Media Inquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200 resize-none"
                          placeholder="Tell me about your travel plans or questions..."
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="btn-primary w-full"
                      >
                        <PaperAirplaneIcon className="mr-2 icon-md" />
                        Send Message
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  Let's Connect
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Whether you're planning your next adventure, looking for travel advice, or interested in collaboration opportunities, I'm here to help!
                </p>
              </div>

              {/* Contact Methods */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="icon-lg text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">hello@thesundaytraveller.com</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">I typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <MapPinIcon className="icon-lg text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Currently in</h3>
                    <p className="text-gray-600 dark:text-gray-400">Lisbon, Portugal</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Always on the move!</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                    <GlobeAltIcon className="icon-lg text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Social Media</h3>
                    <div className="space-y-1">
                      <p className="text-gray-600 dark:text-gray-400">@thesundaytraveller</p>
                      <div className="flex space-x-4 text-sm">
                        <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors duration-200">Instagram</a>
                        <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors duration-200">YouTube</a>
                        <a href="#" className="text-orange-600 hover:text-orange-700 transition-colors duration-200">Twitter</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Times */}
              <div className="card">
                <div className="card-body">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Response Times</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">General Inquiries</span>
                      <span className="font-medium text-gray-900 dark:text-white">24-48 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Travel Advice</span>
                      <span className="font-medium text-gray-900 dark:text-white">1-2 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Collaboration</span>
                      <span className="font-medium text-gray-900 dark:text-white">3-5 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Media Requests</span>
                      <span className="font-medium text-gray-900 dark:text-white">Same day</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "Do you offer personalized travel planning?",
                answer: "Yes! I offer custom travel planning services including itinerary creation, destination recommendations, and budget planning."
              },
              {
                question: "Can you help with travel photography?",
                answer: "Absolutely! I offer photography workshops, one-on-one coaching, and can recommend the best spots for photos in various destinations."
              },
              {
                question: "Do you accept sponsored content?",
                answer: "I'm selective about partnerships and only work with brands that align with my values and would genuinely benefit my audience."
              },
              {
                question: "Are you available for speaking events?",
                answer: "Yes, I speak at travel conferences, universities, and corporate events about travel, photography, and digital nomad lifestyle."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="card-body">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-opening Contact Popup */}
      {showAutoPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <EnvelopeIcon className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Stay Connected!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Have questions about travel, adventure, or military life? I'd love to help!
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAutoPopup(false)
                  document.getElementById('name')?.focus()
                }}
                className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition-colors duration-200 font-semibold"
              >
                Send a Message
              </button>
              <button
                onClick={() => setShowAutoPopup(false)}
                className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Maybe Later
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              This popup won't show again during this session
            </p>
          </motion.div>
        </div>
      )}
    </div>
  )
}
