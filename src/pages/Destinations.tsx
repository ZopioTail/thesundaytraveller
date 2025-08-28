import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPinIcon,
  PhotoIcon,
  CalendarIcon,
  GlobeAltIcon,
  FlagIcon,
} from '@heroicons/react/24/outline';

// Mock destinations data organized by regions
const destinationsByRegion = {
  'North America': [
    {
      id: 1,
      name: 'United States',
      flag: '🇺🇸',
      description: 'From the bustling streets of New York to the natural wonders of Yellowstone, exploring the diverse landscapes and cultures of America.',
      image: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      coordinates: { lat: 39.8283, lng: -98.5795 },
      visited: true,
      visitDate: new Date('2023-06-15'),
      blogPosts: 12
    },
    {
      id: 2,
      name: 'Canada',
      flag: '🇨🇦',
      description: 'Discovering the pristine wilderness, vibrant cities, and warm hospitality of the Great White North.',
      image: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      coordinates: { lat: 56.1304, lng: -106.3468 },
      visited: true,
      visitDate: new Date('2023-08-22'),
      blogPosts: 8
    }
  ],
  'Europe': [
    {
      id: 3,
      name: 'France',
      flag: '🇫🇷',
      description: 'From the romantic streets of Paris to the lavender fields of Provence, experiencing the art de vivre.',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      coordinates: { lat: 46.2276, lng: 2.2137 },
      visited: true,
      visitDate: new Date('2023-04-10'),
      blogPosts: 15
    },
    {
      id: 4,
      name: 'Italy',
      flag: '🇮🇹',
      description: 'Immersing in the rich history, incredible cuisine, and timeless beauty of the Italian peninsula.',
      image: 'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      coordinates: { lat: 41.8719, lng: 12.5674 },
      visited: true,
      visitDate: new Date('2023-05-20'),
      blogPosts: 18
    }
  ],
  'Southeast Asia': [
    {
      id: 5,
      name: 'Thailand',
      flag: '🇹🇭',
      description: 'Exploring ancient temples, pristine beaches, and the incredible warmth of Thai hospitality.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1528181304800-259b08848526?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      coordinates: { lat: 15.8700, lng: 100.9925 },
      visited: true,
      visitDate: new Date('2023-02-14'),
      blogPosts: 22
    },
    {
      id: 6,
      name: 'Japan',
      flag: '🇯🇵',
      description: 'Discovering the perfect blend of ancient traditions and cutting-edge modernity in the Land of the Rising Sun.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1528164344705-47542687000d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      coordinates: { lat: 36.2048, lng: 138.2529 },
      visited: true,
      visitDate: new Date('2023-03-18'),
      blogPosts: 25
    }
  ],
  'Africa': [
    {
      id: 7,
      name: 'Kenya',
      flag: '🇰🇪',
      description: 'Witnessing the Great Migration and experiencing the raw beauty of African wildlife and landscapes.',
      image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      coordinates: { lat: -0.0236, lng: 37.9062 },
      visited: true,
      visitDate: new Date('2023-07-05'),
      blogPosts: 14
    }
  ],
  'South America': [
    {
      id: 8,
      name: 'Brazil',
      flag: '🇧🇷',
      description: 'From the Amazon rainforest to the vibrant beaches of Rio, exploring the heart of South America.',
      image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
      ],
      coordinates: { lat: -14.2350, lng: -51.9253 },
      visited: true,
      visitDate: new Date('2023-09-12'),
      blogPosts: 16
    }
  ]
};

const regions = Object.keys(destinationsByRegion);

export default function Destinations() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const allDestinations = Object.values(destinationsByRegion).flat();
  const totalCountries = allDestinations.length;
  const totalBlogPosts = allDestinations.reduce((sum, dest) => sum + dest.blogPosts, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="container-custom relative z-10">
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

            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold">{totalCountries}</div>
                <div className="text-sm opacity-80">Countries Visited</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{regions.length}</div>
                <div className="text-sm opacity-80">Regions Explored</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{totalBlogPosts}</div>
                <div className="text-sm opacity-80">Stories Written</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive World Map */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Interactive World Map
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Click on regions to explore the countries I've visited and the stories behind each journey
            </p>
          </motion.div>

          {/* Simplified World Map with Regions */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 mb-12">
            <svg
              className="w-full h-96 md:h-[500px]"
              viewBox="0 0 1000 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background */}
              <rect width="1000" height="500" fill="currentColor" className="text-blue-50 dark:text-gray-800" />

              {/* Simplified continent shapes with click handlers */}
              {/* North America */}
              <motion.path
                d="M100 150 L250 120 L280 180 L200 220 L120 200 Z"
                fill="currentColor"
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedRegion === 'North America'
                    ? 'text-green-500'
                    : hoveredCountry === 'North America'
                    ? 'text-green-400'
                    : 'text-green-300 hover:text-green-400'
                }`}
                onClick={() => setSelectedRegion(selectedRegion === 'North America' ? null : 'North America')}
                onMouseEnter={() => setHoveredCountry('North America')}
                onMouseLeave={() => setHoveredCountry(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />

              {/* Europe */}
              <motion.path
                d="M450 120 L550 110 L580 160 L520 180 L470 160 Z"
                fill="currentColor"
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedRegion === 'Europe'
                    ? 'text-blue-500'
                    : hoveredCountry === 'Europe'
                    ? 'text-blue-400'
                    : 'text-blue-300 hover:text-blue-400'
                }`}
                onClick={() => setSelectedRegion(selectedRegion === 'Europe' ? null : 'Europe')}
                onMouseEnter={() => setHoveredCountry('Europe')}
                onMouseLeave={() => setHoveredCountry(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />

              {/* Southeast Asia */}
              <motion.path
                d="M700 200 L800 190 L820 240 L750 260 L720 230 Z"
                fill="currentColor"
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedRegion === 'Southeast Asia'
                    ? 'text-orange-500'
                    : hoveredCountry === 'Southeast Asia'
                    ? 'text-orange-400'
                    : 'text-orange-300 hover:text-orange-400'
                }`}
                onClick={() => setSelectedRegion(selectedRegion === 'Southeast Asia' ? null : 'Southeast Asia')}
                onMouseEnter={() => setHoveredCountry('Southeast Asia')}
                onMouseLeave={() => setHoveredCountry(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />

              {/* Africa */}
              <motion.path
                d="M480 220 L580 210 L600 320 L520 340 L460 280 Z"
                fill="currentColor"
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedRegion === 'Africa'
                    ? 'text-yellow-500'
                    : hoveredCountry === 'Africa'
                    ? 'text-yellow-400'
                    : 'text-yellow-300 hover:text-yellow-400'
                }`}
                onClick={() => setSelectedRegion(selectedRegion === 'Africa' ? null : 'Africa')}
                onMouseEnter={() => setHoveredCountry('Africa')}
                onMouseLeave={() => setHoveredCountry(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />

              {/* South America */}
              <motion.path
                d="M250 280 L350 270 L380 380 L300 400 L220 350 Z"
                fill="currentColor"
                className={`cursor-pointer transition-colors duration-200 ${
                  selectedRegion === 'South America'
                    ? 'text-red-500'
                    : hoveredCountry === 'South America'
                    ? 'text-red-400'
                    : 'text-red-300 hover:text-red-400'
                }`}
                onClick={() => setSelectedRegion(selectedRegion === 'South America' ? null : 'South America')}
                onMouseEnter={() => setHoveredCountry('South America')}
                onMouseLeave={() => setHoveredCountry(null)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />

              {/* Region Labels */}
              <text x="175" y="170" textAnchor="middle" className="text-sm font-medium fill-gray-700 dark:fill-gray-300">
                North America
              </text>
              <text x="515" y="145" textAnchor="middle" className="text-sm font-medium fill-gray-700 dark:fill-gray-300">
                Europe
              </text>
              <text x="760" y="225" textAnchor="middle" className="text-sm font-medium fill-gray-700 dark:fill-gray-300">
                Southeast Asia
              </text>
              <text x="540" y="275" textAnchor="middle" className="text-sm font-medium fill-gray-700 dark:fill-gray-300">
                Africa
              </text>
              <text x="315" y="335" textAnchor="middle" className="text-sm font-medium fill-gray-700 dark:fill-gray-300">
                South America
              </text>
            </svg>

            {/* Map Legend */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Click on regions to explore destinations • Hover for preview
              </p>
              <div className="flex justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>North America</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>Europe</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span>Asia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>Africa</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>South America</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries by Region */}
      <section className="section-padding">
        <div className="container-custom">
          {/* Region Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setSelectedRegion(null)}
              className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                selectedRegion === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-600'
              }`}
            >
              All Regions
            </button>
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                  selectedRegion === region
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-600'
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Countries Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedRegion || 'all'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {(selectedRegion ? [selectedRegion] : regions).map((region) => (
                <div key={region} className="mb-16">
                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl md:text-3xl font-serif font-bold mb-8 text-gray-900 dark:text-white"
                  >
                    {region}
                  </motion.h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinationsByRegion[region as keyof typeof destinationsByRegion]?.map((country, index) => (
                      <motion.div
                        key={country.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group cursor-pointer"
                        onClick={() => setSelectedCountry(country)}
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                          {/* Country Image */}
                          <div className="relative aspect-w-16 aspect-h-10 overflow-hidden">
                            <img
                              src={country.image}
                              alt={country.name}
                              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Flag Overlay */}
                            <div className="absolute top-4 right-4 text-3xl">
                              {country.flag}
                            </div>

                            {/* Visit Status */}
                            {country.visited && (
                              <div className="absolute top-4 left-4 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                                Visited
                              </div>
                            )}
                          </div>

                          {/* Country Info */}
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-xl font-serif font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                                {country.name}
                              </h4>
                              <span className="text-2xl">{country.flag}</span>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                              {country.description}
                            </p>

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
                            <div className="mt-4 flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300">
                              View Details
                              <svg className="ml-2 icon-sm group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Country Detail Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
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
                <img
                  src={selectedCountry.image}
                  alt={selectedCountry.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
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
                  <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                  {selectedCountry.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {selectedCountry.blogPosts}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Stories Written</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {selectedCountry.gallery.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Photos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {selectedCountry.visited ? 'Yes' : 'Planned'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Visited</div>
                  </div>
                </div>

                {/* Photo Gallery */}
                <div className="mb-8">
                  <h4 className="text-xl font-serif font-bold mb-4">Photo Gallery</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedCountry.gallery.map((photo: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden"
                      >
                        <img
                          src={photo}
                          alt={`${selectedCountry.name} ${index + 1}`}
                          className="w-full h-32 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
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

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Plan Your Next Adventure
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get personalized travel recommendations and insider tips for your next destination
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                <GlobeAltIcon className="mr-2 h-5 w-5" />
                Get Travel Tips
              </button>
              <button className="btn-secondary">
                <FlagIcon className="mr-2 h-5 w-5" />
                Request Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
