'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  GlobeAltIcon,
  MapPinIcon,
  PhotoIcon,
  CalendarIcon,
  FlagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const countries = [
  {
    id: 1,
    name: 'Japan',
    flag: '🇯🇵',
    continent: 'Asia',
    visited: true,
    visitDate: new Date('2023-03-15'),
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Land of the rising sun, where ancient traditions meet cutting-edge technology.',
    highlights: ['Cherry Blossoms in Kyoto', 'Tokyo Street Food', 'Mount Fuji Sunrise', 'Traditional Ryokans'],
    blogPosts: 8,
    gallery: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ]
  },
  {
    id: 2,
    name: 'Iceland',
    flag: '🇮🇸',
    continent: 'Europe',
    visited: true,
    visitDate: new Date('2022-09-20'),
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A Nordic island of fire and ice, featuring dramatic landscapes and natural wonders.',
    highlights: ['Northern Lights', 'Blue Lagoon', 'Golden Circle', 'Glacier Hiking'],
    blogPosts: 6,
    gallery: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1531168556467-80aace4d0144?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ]
  },
  {
    id: 3,
    name: 'New Zealand',
    flag: '🇳🇿',
    continent: 'Oceania',
    visited: true,
    visitDate: new Date('2023-11-10'),
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Adventure capital with stunning landscapes, from fjords to mountains.',
    highlights: ['Milford Sound', 'Queenstown Adventures', 'Hobbiton', 'Franz Josef Glacier'],
    blogPosts: 12,
    gallery: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1464822759844-d150baec0494?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ]
  },
  {
    id: 4,
    name: 'Morocco',
    flag: '🇲🇦',
    continent: 'Africa',
    visited: true,
    visitDate: new Date('2022-05-18'),
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'A gateway to Africa with vibrant markets, ancient cities, and Sahara adventures.',
    highlights: ['Marrakech Souks', 'Sahara Desert', 'Atlas Mountains', 'Chefchaouen Blue City'],
    blogPosts: 10,
    gallery: [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ]
  },
  {
    id: 5,
    name: 'Peru',
    flag: '🇵🇪',
    continent: 'South America',
    visited: true,
    visitDate: new Date('2023-07-22'),
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Home to Machu Picchu and rich Incan heritage in the heart of South America.',
    highlights: ['Machu Picchu', 'Sacred Valley', 'Lima Food Scene', 'Amazon Rainforest'],
    blogPosts: 9,
    gallery: [
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1571168035954-96cb8629d50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ]
  },
  {
    id: 6,
    name: 'Norway',
    flag: '🇳🇴',
    continent: 'Europe',
    visited: true,
    visitDate: new Date('2022-12-05'),
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Spectacular fjords, northern lights, and pristine Arctic wilderness.',
    highlights: ['Geirangerfjord', 'Northern Lights', 'Lofoten Islands', 'Bergen Charm'],
    blogPosts: 7,
    gallery: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    ]
  },
]

const continents = [
  { name: 'Europe', color: 'bg-blue-400', count: 15 },
  { name: 'Asia', color: 'bg-orange-400', count: 12 },
  { name: 'Africa', color: 'bg-yellow-400', count: 8 },
  { name: 'South America', color: 'bg-red-400', count: 6 },
  { name: 'North America', color: 'bg-green-400', count: 4 },
  { name: 'Oceania', color: 'bg-purple-400', count: 2 },
]

export default function DestinationsPage() {
  const [selectedCountry, setSelectedCountry] = useState<typeof countries[0] | null>(null)
  const [filterContinent, setFilterContinent] = useState<string>('All')

  const filteredCountries = filterContinent === 'All' 
    ? countries 
    : countries.filter(country => country.continent === filterContinent)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="World map"
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
            className="text-center text-white"
          >
            <GlobeAltIcon className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Destinations
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-8">
              Explore the interactive world map and discover all the incredible places I've visited
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Continents <span className="gradient-text">Explored</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {continents.map((continent, index) => (
                <motion.div
                  key={continent.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 ${continent.color} rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg`}>
                    {continent.count}
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {continent.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Continent Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['All', ...continents.map(c => c.name)].map((continent) => (
              <button
                key={continent}
                onClick={() => setFilterContinent(continent)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  filterContinent === continent
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-gray-600 border border-gray-300 dark:border-gray-600'
                }`}
              >
                {continent}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedCountry(country)}
              >
                <div className="card card-hover">
                  {/* Country Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={country.image}
                      alt={country.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Country Flag & Name Overlay */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{country.flag}</span>
                        <h3 className="text-xl font-bold">{country.name}</h3>
                      </div>
                      <div className="text-sm opacity-90">{country.continent}</div>
                    </div>

                    {/* Visited Badge */}
                    {country.visited && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Visited
                      </div>
                    )}
                  </div>

                  {/* Country Info */}
                  <div className="card-body">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {country.description}
                    </p>

                    {/* Highlights */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Highlights
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {country.highlights.slice(0, 3).map((highlight) => (
                          <span
                            key={highlight}
                            className="px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        {country.visited && (
                          <div className="flex items-center">
                            <CalendarIcon className="mr-1 icon-sm" />
                            {country.visitDate?.toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center">
                          <PhotoIcon className="mr-1 icon-sm" />
                          {country.gallery.length} photos
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">{country.blogPosts} stories</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4 flex items-center text-orange-600 dark:text-orange-400 font-medium text-sm group-hover:text-orange-700 dark:group-hover:text-orange-300">
                      View Details
                      <svg className="ml-2 icon-sm group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Country Detail Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCountry(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <Image
                  src={selectedCountry.image}
                  alt={selectedCountry.name}
                  width={800}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-4xl">{selectedCountry.flag}</span>
                    <h3 className="text-3xl font-serif font-bold">{selectedCountry.name}</h3>
                  </div>
                  {selectedCountry.visited && (
                    <div className="flex items-center text-sm opacity-90">
                      <CalendarIcon className="mr-2 icon-sm" />
                      Visited on {selectedCountry.visitDate?.toLocaleDateString()}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedCountry(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors duration-200"
                >
                  <XMarkIcon className="icon-lg" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {selectedCountry.description}
                </p>

                {/* Highlights */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Must-See Highlights
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedCountry.highlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center space-x-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Gallery */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Photo Gallery
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedCountry.gallery.map((photo, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="relative aspect-square rounded-lg overflow-hidden"
                      >
                        <Image
                          src={photo}
                          alt={`${selectedCountry.name} ${index + 1}`}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="btn-primary flex-1">
                    <MapPinIcon className="mr-2 icon-md" />
                    View on Map
                  </button>
                  <button className="btn-secondary flex-1">
                    <PhotoIcon className="mr-2 icon-md" />
                    View All Photos
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Plan Your Next Adventure
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get personalized travel recommendations and insider tips for your next destination
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                <GlobeAltIcon className="mr-2 icon-md" />
                Get Travel Tips
              </button>
              <button className="btn-secondary">
                <FlagIcon className="mr-2 icon-md" />
                Request Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
