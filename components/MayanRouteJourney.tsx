'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

// Mayan Route journey countries in order
const journeyCountries = [
  { name: 'India', flag: '🇮🇳', code: 'IN' },
  { name: 'Mexico', flag: '🇲🇽', code: 'MX' },
  { name: 'Belize', flag: '🇧🇿', code: 'BZ' },
  { name: 'Guatemala', flag: '🇬🇹', code: 'GT' },
  { name: 'San Salvador', flag: '🇸🇻', code: 'SV' },
  { name: 'Honduras', flag: '🇭🇳', code: 'HN' },
  { name: 'Nicaragua', flag: '🇳🇮', code: 'NI' },
  { name: 'Costa Rica', flag: '🇨🇷', code: 'CR' },
  { name: 'Panama', flag: '🇵🇦', code: 'PA' },
  { name: 'Mexico', flag: '🇲🇽', code: 'MX2' }, // Second visit
  { name: 'India', flag: '🇮🇳', code: 'IN2' }, // Return
]

export default function MayanRouteJourney() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [animatedIndex, setAnimatedIndex] = useState(-1)

  // Progressive animation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedIndex((prev) => {
        if (prev >= journeyCountries.length - 1) {
          return -1 // Reset animation
        }
        return prev + 1
      })
    }, 800)

    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative section-padding bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-orange-900/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.3),transparent_70%)]" />
        <div className="w-full h-full bg-[radial-gradient(circle_at_70%_70%,rgba(239,68,68,0.2),transparent_70%)]" />
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
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
            className="inline-flex items-center space-x-2 bg-amber-100 dark:bg-amber-900/30 rounded-full px-6 py-3 mb-8 border border-amber-200 dark:border-amber-800"
          >
            <span className="text-2xl">📖</span>
            <span className="text-amber-800 dark:text-amber-200 font-semibold">Featured Book</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Mayan Routes, Indian Roots
          </h2>
          <h3 className="text-2xl md:text-3xl font-semibold text-amber-700 dark:text-amber-300 mb-6">
            Journey Highlights
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            From India to the Mayan World and Back – a journey captured in 'Mayan Routes, Indian Roots.'
          </p>
        </motion.div>

        {/* Journey Path - Desktop */}
        <div className="hidden lg:block">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative"
          >
            {/* Journey Line */}
            <div className="flex items-center justify-between mb-8 relative">
              {journeyCountries.map((country, index) => (
                <div key={`${country.code}-${index}`} className="flex items-center">
                  {/* Country */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: animatedIndex >= index ? 1 : 0.3,
                      scale: animatedIndex >= index ? 1 : 0.8
                    }}
                    transition={{ duration: 0.5 }}
                    className={`text-center cursor-pointer transition-all duration-300 ${
                      hoveredCountry === `${country.code}-${index}` ? 'transform scale-110' : ''
                    }`}
                    onMouseEnter={() => setHoveredCountry(`${country.code}-${index}`)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  >
                    <div className="text-3xl mb-2">{country.flag}</div>
                    <div className={`font-bold text-sm px-3 py-2 rounded-lg transition-colors ${
                      animatedIndex >= index 
                        ? 'text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/50' 
                        : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800'
                    }`}>
                      {country.name}
                    </div>
                  </motion.div>

                  {/* Arrow */}
                  {index < journeyCountries.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ 
                        opacity: animatedIndex >= index ? 1 : 0.3,
                        x: 0
                      }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mx-4"
                    >
                      <ArrowRightIcon className={`w-6 h-6 transition-colors ${
                        animatedIndex >= index 
                          ? 'text-amber-600 dark:text-amber-400' 
                          : 'text-gray-400 dark:text-gray-600'
                      }`} />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Journey Path - Mobile */}
        <div className="lg:hidden">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-4"
          >
            {journeyCountries.map((country, index) => (
              <div key={`${country.code}-${index}`}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: animatedIndex >= index ? 1 : 0.3,
                    x: 0
                  }}
                  transition={{ duration: 0.5 }}
                  className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                    animatedIndex >= index 
                      ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800' 
                      : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-2xl">{country.flag}</div>
                  <div className={`font-bold text-lg transition-colors ${
                    animatedIndex >= index 
                      ? 'text-amber-800 dark:text-amber-200' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {country.name}
                  </div>
                </motion.div>

                {/* Arrow Down */}
                {index < journeyCountries.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: animatedIndex >= index ? 1 : 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center py-2"
                  >
                    <div className={`w-0.5 h-8 transition-colors ${
                      animatedIndex >= index 
                        ? 'bg-amber-400 dark:bg-amber-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  </motion.div>
                )}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-16 p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm border border-amber-200 dark:border-amber-800"
        >
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
            <strong>The author has traveled to 47+ countries worldwide,</strong> but this book focuses only on the Mayan journey.
          </p>
          <div className="flex items-center justify-center space-x-2 text-amber-700 dark:text-amber-300">
            <span className="text-xl">🌍</span>
            <span className="font-semibold">A Cultural Bridge Between Two Ancient Civilizations</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
