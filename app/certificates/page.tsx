'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  AcademicCapIcon,
  TrophyIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline'

const certificates = [
  {
    id: 1,
    title: 'Military Service Excellence Award',
    organization: 'Indian Armed Forces',
    date: '2023-12-15',
    category: 'Military',
    description: 'Recognition for outstanding service and leadership in challenging operational environments.',
    image: '/images/optimized/gallery-6.jpg',
    skills: ['Leadership', 'Strategic Planning', 'Team Management'],
    credentialId: 'IAF-2023-MSE-001'
  },
  {
    id: 2,
    title: 'Advanced Mountaineering Certificate',
    organization: 'Himalayan Mountaineering Institute',
    date: '2023-08-20',
    category: 'Adventure',
    description: 'Certified in advanced mountaineering techniques, high-altitude survival, and rescue operations.',
    image: '/images/optimized/gallery-1.jpg',
    skills: ['Mountaineering', 'Risk Assessment', 'Emergency Response'],
    credentialId: 'HMI-2023-AMC-045'
  },
  {
    id: 3,
    title: 'International Travel Photography',
    organization: 'National Geographic Society',
    date: '2023-06-10',
    category: 'Photography',
    description: 'Professional certification in travel photography, composition, and storytelling through images.',
    image: '/images/optimized/drone-photography.jpg',
    skills: ['Photography', 'Visual Storytelling', 'Digital Editing'],
    credentialId: 'NGS-2023-ITP-789'
  },
  {
    id: 4,
    title: 'Scuba Diving Instructor (PADI)',
    organization: 'Professional Association of Diving Instructors',
    date: '2023-04-15',
    category: 'Adventure',
    description: 'Certified to teach scuba diving up to 40 meters depth with advanced rescue techniques.',
    image: '/images/optimized/scuba-diving.jpg',
    skills: ['Scuba Diving', 'Underwater Safety', 'Instruction'],
    credentialId: 'PADI-2023-IDC-567'
  },
  {
    id: 5,
    title: 'Skydiving License (AFF)',
    organization: 'United States Parachute Association',
    date: '2023-02-28',
    category: 'Adventure',
    description: 'Accelerated Freefall license with certification for solo jumps and formation flying.',
    image: '/images/optimized/skydiving.jpg',
    skills: ['Skydiving', 'Risk Management', 'Precision Landing'],
    credentialId: 'USPA-2023-AFF-234'
  },
  {
    id: 6,
    title: 'Cultural Diplomacy Certificate',
    organization: 'Ministry of External Affairs, India',
    date: '2022-11-30',
    category: 'Diplomacy',
    description: 'Specialized training in cultural diplomacy, international relations, and cross-cultural communication.',
    image: '/images/optimized/gallery-5.jpg',
    skills: ['Diplomacy', 'Cultural Intelligence', 'Communication'],
    credentialId: 'MEA-2022-CDC-123'
  },
  {
    id: 7,
    title: 'Drone Pilot License (DGCA)',
    organization: 'Directorate General of Civil Aviation',
    date: '2022-09-15',
    category: 'Technology',
    description: 'Commercial drone pilot license for aerial photography and surveying operations.',
    image: '/images/optimized/drone-photography.jpg',
    skills: ['Drone Operation', 'Aerial Photography', 'Aviation Safety'],
    credentialId: 'DGCA-2022-UAS-456'
  },
  {
    id: 8,
    title: 'Wilderness First Aid',
    organization: 'National Outdoor Leadership School',
    date: '2022-07-20',
    category: 'Safety',
    description: 'Comprehensive wilderness medical training for remote area emergencies and rescue operations.',
    image: '/images/optimized/gallery-7.jpg',
    skills: ['First Aid', 'Emergency Medicine', 'Wilderness Survival'],
    credentialId: 'NOLS-2022-WFA-789'
  }
]

const categories = ['All', 'Military', 'Adventure', 'Photography', 'Diplomacy', 'Technology', 'Safety']

const categoryIcons = {
  Military: ShieldCheckIcon,
  Adventure: TrophyIcon,
  Photography: DocumentTextIcon,
  Diplomacy: GlobeAltIcon,
  Technology: BuildingOfficeIcon,
  Safety: AcademicCapIcon,
}

export default function CertificatesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null)

  const filteredCertificates = certificates.filter(cert => 
    selectedCategory === 'All' || cert.category === selectedCategory
  )

  const openLightbox = (certId: number) => {
    setSelectedCertificate(certId)
  }

  const closeLightbox = () => {
    setSelectedCertificate(null)
  }

  const navigateCertificate = (direction: 'prev' | 'next') => {
    if (selectedCertificate === null) return
    
    const currentIndex = filteredCertificates.findIndex(cert => cert.id === selectedCertificate)
    let newIndex
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredCertificates.length - 1
    } else {
      newIndex = currentIndex < filteredCertificates.length - 1 ? currentIndex + 1 : 0
    }
    
    setSelectedCertificate(filteredCertificates[newIndex].id)
  }

  const selectedCertData = selectedCertificate ? certificates.find(cert => cert.id === selectedCertificate) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20">
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
              <AcademicCapIcon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
              <TrophyIcon className="w-10 h-10 text-yellow-500" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              Certificates & Achievements
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              A collection of professional certifications, military honors, and specialized training 
              that showcase expertise across military service, adventure sports, photography, and international relations.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {categories.map((category) => {
              const IconComponent = category !== 'All' ? categoryIcons[category as keyof typeof categoryIcons] : null
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 shadow-md'
                  }`}
                >
                  {IconComponent && <IconComponent className="w-4 h-4" />}
                  <span>{category}</span>
                </button>
              )
            })}
          </motion.div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCertificates.map((certificate, index) => {
              const IconComponent = categoryIcons[certificate.category as keyof typeof categoryIcons]
              return (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => openLightbox(certificate.id)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={certificate.image}
                      alt={certificate.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        <IconComponent className="w-3 h-3" />
                        <span>{certificate.category}</span>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-sm font-medium">Click to view details</p>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                      {certificate.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                      {certificate.organization}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                      {certificate.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(certificate.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DocumentTextIcon className="w-4 h-4" />
                        <span>Certificate</span>
                      </div>
                    </div>

                    {/* Skills Tags */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {certificate.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {certificate.skills.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          +{certificate.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Certificate Lightbox */}
      <AnimatePresence>
        {selectedCertificate && selectedCertData && (
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
                onClick={() => navigateCertificate('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                onClick={() => navigateCertificate('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors duration-200"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Certificate Image */}
                <div className="relative aspect-square lg:aspect-auto">
                  <Image
                    src={selectedCertData.image}
                    alt={selectedCertData.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Certificate Details */}
                <div className="p-6 lg:p-8">
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold rounded-full w-fit">
                      {React.createElement(categoryIcons[selectedCertData.category as keyof typeof categoryIcons], { className: "w-4 h-4" })}
                      <span>{selectedCertData.category}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {selectedCertData.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {selectedCertData.description}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <BuildingOfficeIcon className="w-5 h-5 mr-3" />
                      <span>{selectedCertData.organization}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="w-5 h-5 mr-3" />
                      <span>{new Date(selectedCertData.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <DocumentTextIcon className="w-5 h-5 mr-3" />
                      <span>ID: {selectedCertData.credentialId}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Skills & Competencies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCertData.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                      <DocumentTextIcon className="w-5 h-5" />
                      <span>View Certificate</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                      <span>Verify</span>
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
