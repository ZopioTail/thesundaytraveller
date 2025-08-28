'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CameraIcon,
  MapPinIcon,
  CalendarIcon,
  HeartIcon,
  ShareIcon,
} from '@heroicons/react/24/outline'

const galleryImages = [
  {
    id: 1,
    src: '/images/optimized/gallery-1.jpg',
    title: 'Himalayan Sunrise',
    location: 'Himalayas, Nepal',
    date: '2025-08-18',
    category: 'Mountains',
    description: 'The first light of dawn breaking over the world\'s highest peaks during my solo trek.',
    likes: 234,
    camera: 'Canon EOS R5',
    settings: 'f/8, 1/125s, ISO 100'
  },
  {
    id: 2,
    src: '/images/optimized/gallery-2.jpg',
    title: 'Rappelling Adventure',
    location: 'Western Ghats, India',
    date: '2025-08-15',
    category: 'Adventure',
    description: 'Conquering fear one rope at a time - 200 feet above the valley floor.',
    likes: 189,
    camera: 'Sony A7 III',
    settings: 'f/5.6, 1/250s, ISO 200'
  },
  {
    id: 3,
    src: '/images/optimized/gallery-3.jpg',
    title: 'Portuguese Coastline',
    location: 'Algarve, Portugal',
    date: '2025-08-22',
    category: 'Travel',
    description: 'Golden hour along Portugal\'s dramatic coastline - a digital nomad\'s paradise.',
    likes: 156,
    camera: 'Fujifilm X-T4',
    settings: 'f/11, 1/60s, ISO 100'
  },
  {
    id: 4,
    src: '/images/optimized/gallery-4.jpg',
    title: 'Morning Coffee Ritual',
    location: 'Home Base, India',
    date: '2025-08-26',
    category: 'Lifestyle',
    description: 'The quiet moments between adventures - finding peace in simple rituals.',
    likes: 98,
    camera: 'iPhone 14 Pro',
    settings: 'f/1.8, 1/30s, ISO 64'
  },
  {
    id: 5,
    src: '/images/optimized/gallery-5.jpg',
    title: 'Drone Photography Session',
    location: 'Various Locations',
    date: '2025-08-24',
    category: 'Technology',
    description: 'Capturing the world from above - where technology meets artistry.',
    likes: 167,
    camera: 'DJI Mavic Air 2',
    settings: 'f/2.8, 1/120s, ISO 100'
  },
  {
    id: 6,
    src: '/images/optimized/gallery-6.jpg',
    title: 'Military Photography',
    location: 'Classified Location',
    date: '2025-08-20',
    category: 'Military',
    description: 'Documenting the human stories behind the uniform - honor, duty, sacrifice.',
    likes: 203,
    camera: 'Nikon D850',
    settings: 'f/4, 1/200s, ISO 400'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'White Water Rapids',
    location: 'Rishikesh, India',
    date: '2025-08-12',
    category: 'Adventure',
    description: 'Reading the rapids - where mindfulness meets adrenaline.',
    likes: 145,
    camera: 'GoPro Hero 11',
    settings: 'f/2.8, 1/500s, ISO 200'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Paragliding Freedom',
    location: 'Bir Billing, India',
    date: '2025-08-08',
    category: 'Adventure',
    description: 'Flying without wings - the ultimate expression of freedom and trust.',
    likes: 178,
    camera: 'Sony A7R IV',
    settings: 'f/8, 1/320s, ISO 100'
  },
  {
    id: 9,
    src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    title: 'Diplomatic Mission',
    location: 'International Waters',
    date: '2025-08-16',
    category: 'Military',
    description: 'Building bridges across cultures - diplomacy in action.',
    likes: 134,
    camera: 'Canon EOS 5D Mark IV',
    settings: 'f/5.6, 1/160s, ISO 320'
  },
  {
    id: 10,
    src: '/images/optimized/gallery-7.jpg',
    title: 'Scenic Overlook',
    location: 'Mountain Vista, India',
    date: '2025-08-10',
    category: 'Travel',
    description: 'Breathtaking views from high altitude - nature\'s grandest theater.',
    likes: 198,
    camera: 'Canon EOS R5',
    settings: 'f/11, 1/125s, ISO 100'
  },
  {
    id: 11,
    src: '/images/optimized/gallery-8.jpg',
    title: 'Yoga Practice',
    location: 'Rishikesh, India',
    date: '2025-08-05',
    category: 'Lifestyle',
    description: 'Finding inner peace through ancient practices - mind, body, spirit alignment.',
    likes: 156,
    camera: 'Sony A7 III',
    settings: 'f/4, 1/60s, ISO 200'
  },
  {
    id: 12,
    src: '/images/optimized/gallery-9.jpg',
    title: 'Meditation Moment',
    location: 'Himalayan Foothills',
    date: '2025-07-30',
    category: 'Lifestyle',
    description: 'Solitude and reflection in nature\'s embrace - the journey within.',
    likes: 187,
    camera: 'Fujifilm X-T4',
    settings: 'f/5.6, 1/80s, ISO 160'
  }
]

const categories = ['All', 'Mountains', 'Adventure', 'Travel', 'Lifestyle', 'Technology', 'Military']

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set())

  const filteredImages = galleryImages.filter(image => 
    selectedCategory === 'All' || image.category === selectedCategory
  )

  const handleLike = (imageId: number) => {
    setLikedImages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(imageId)) {
        newSet.delete(imageId)
      } else {
        newSet.add(imageId)
      }
      return newSet
    })
  }

  const openLightbox = (imageId: number) => {
    setSelectedImage(imageId)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage)
    let newIndex
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0
    }
    
    setSelectedImage(filteredImages[newIndex].id)
  }

  const selectedImageData = selectedImage ? galleryImages.find(img => img.id === selectedImage) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <CameraIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              A visual journey through adventures, cultures, and the extraordinary moments that define our travels. 
              Each photograph tells a story of courage, discovery, and the beauty found in pushing beyond comfort zones.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square cursor-pointer" onClick={() => openLightbox(image.id)}>
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Overlay Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-bold text-lg mb-1">{image.title}</h3>
                    <div className="flex items-center text-sm opacity-90">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>{image.location}</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {image.category}
                    </span>
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{image.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                    {image.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{new Date(image.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleLike(image.id)}
                        className={`flex items-center space-x-1 transition-colors duration-200 ${
                          likedImages.has(image.id) 
                            ? 'text-red-500' 
                            : 'hover:text-red-500'
                        }`}
                      >
                        <HeartIcon className={`w-4 h-4 ${likedImages.has(image.id) ? 'fill-current' : ''}`} />
                        <span>{image.likes + (likedImages.has(image.id) ? 1 : 0)}</span>
                      </button>
                      <button className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200">
                        <ShareIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && selectedImageData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-square lg:aspect-auto">
                  <Image
                    src={selectedImageData.src}
                    alt={selectedImageData.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Image Details */}
                <div className="p-6 lg:p-8">
                  <div className="mb-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full">
                      {selectedImageData.category}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedImageData.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {selectedImageData.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPinIcon className="w-5 h-5 mr-3" />
                      <span>{selectedImageData.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="w-5 h-5 mr-3" />
                      <span>{new Date(selectedImageData.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CameraIcon className="w-5 h-5 mr-3" />
                      <span>{selectedImageData.camera}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Camera Settings</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-mono">
                      {selectedImageData.settings}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleLike(selectedImageData.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                        likedImages.has(selectedImageData.id)
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      <HeartIcon className={`w-5 h-5 ${likedImages.has(selectedImageData.id) ? 'fill-current' : ''}`} />
                      <span>{selectedImageData.likes + (likedImages.has(selectedImageData.id) ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <ShareIcon className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
