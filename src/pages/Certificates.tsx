import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AcademicCapIcon,
  TrophyIcon,
  DocumentTextIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

// Mock certificates data
const certificates = [
  {
    id: 1,
    title: "Certified Travel Professional",
    year: 2023,
    issuer: "International Travel Institute",
    country: "United States",
    flag: "🇺🇸",
    description: "Advanced certification in travel planning, destination knowledge, and customer service excellence.",
    category: "Professional",
    icon: AcademicCapIcon,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    fileUrl: "/certificates/travel-professional.pdf"
  },
  {
    id: 2,
    title: "Adventure Tourism Specialist",
    year: 2022,
    issuer: "Adventure Travel Trade Association",
    country: "Canada",
    flag: "🇨🇦",
    description: "Specialized training in adventure tourism, risk management, and sustainable outdoor practices.",
    category: "Adventure",
    icon: TrophyIcon,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    fileUrl: "/certificates/adventure-specialist.pdf"
  },
  {
    id: 3,
    title: "Cultural Heritage Guide",
    year: 2023,
    issuer: "UNESCO World Heritage Centre",
    country: "France",
    flag: "🇫🇷",
    description: "Certification in cultural heritage interpretation and responsible tourism practices.",
    category: "Cultural",
    icon: BuildingOfficeIcon,
    image: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    fileUrl: "/certificates/heritage-guide.pdf"
  },
  {
    id: 4,
    title: "Wildlife Photography Ethics",
    year: 2022,
    issuer: "National Geographic Society",
    country: "United States",
    flag: "🇺🇸",
    description: "Training in ethical wildlife photography practices and conservation awareness.",
    category: "Photography",
    icon: DocumentTextIcon,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    fileUrl: "/certificates/wildlife-photography.pdf"
  },
  {
    id: 5,
    title: "Sustainable Tourism Advocate",
    year: 2023,
    issuer: "Global Sustainable Tourism Council",
    country: "Netherlands",
    flag: "🇳🇱",
    description: "Advanced certification in sustainable tourism practices and environmental responsibility.",
    category: "Sustainability",
    icon: GlobeAltIcon,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    fileUrl: "/certificates/sustainable-tourism.pdf"
  },
  {
    id: 6,
    title: "Digital Content Creator",
    year: 2021,
    issuer: "Content Creator Institute",
    country: "United Kingdom",
    flag: "🇬🇧",
    description: "Professional certification in digital content creation, social media strategy, and brand building.",
    category: "Digital",
    icon: DocumentTextIcon,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    fileUrl: "/certificates/content-creator.pdf"
  }
];

const categories = ["All", "Professional", "Adventure", "Cultural", "Photography", "Sustainability", "Digital"];

export default function Certificates() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [hoveredCertificate, setHoveredCertificate] = useState<number | null>(null);

  const filteredCertificates = selectedCategory === "All"
    ? certificates
    : certificates.filter(cert => cert.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <AcademicCapIcon className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Certificates & Achievements
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 mb-8">
              Professional certifications and achievements that validate my expertise in travel and tourism
            </p>

            {/* Quick Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold">{certificates.length}</div>
                <div className="text-sm opacity-80">Certifications</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{categories.length - 1}</div>
                <div className="text-sm opacity-80">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold">6</div>
                <div className="text-sm opacity-80">Countries</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCertificates.map((certificate, index) => {
              const Icon = certificate.icon;
              return (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onMouseEnter={() => setHoveredCertificate(certificate.id)}
                  onMouseLeave={() => setHoveredCertificate(null)}
                  onClick={() => setSelectedCertificate(certificate)}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                    {/* Certificate Image */}
                    <div className="relative aspect-w-16 aspect-h-10 overflow-hidden">
                      <img
                        src={certificate.image}
                        alt={certificate.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                      {/* Flag and Year */}
                      <div className="absolute top-4 right-4 flex items-center space-x-2">
                        <span className="text-2xl">{certificate.flag}</span>
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded">
                          {certificate.year}
                        </span>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                        {certificate.category}
                      </div>

                      {/* Hover Overlay */}
                      <AnimatePresence>
                        {hoveredCertificate === certificate.id && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-primary-600/90 flex items-center justify-center"
                          >
                            <div className="text-center text-white p-4">
                              <Icon className="h-12 w-12 mx-auto mb-3" />
                              <div className="text-sm font-medium">Click to view details</div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Certificate Info */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                            <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-serif font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                              {certificate.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {certificate.issuer}
                            </p>
                          </div>
                        </div>
                        <span className="text-xl">{certificate.flag}</span>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {certificate.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {certificate.year}
                        </div>
                        <div className="flex items-center">
                          <GlobeAltIcon className="mr-1 h-3 w-3" />
                          {certificate.country}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 flex items-center justify-center px-3 py-2 text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/40 transition-colors duration-200">
                          <EyeIcon className="mr-1 h-3 w-3" />
                          View
                        </button>
                        <button className="flex-1 flex items-center justify-center px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                          <ArrowDownTrayIcon className="mr-1 h-3 w-3" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredCertificates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <AcademicCapIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No certificates found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No certificates match the selected category
              </p>
              <button
                onClick={() => setSelectedCategory('All')}
                className="btn-primary"
              >
                View All Certificates
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Certificate Detail Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative">
                <img
                  src={selectedCertificate.image}
                  alt={selectedCertificate.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl">{selectedCertificate.flag}</span>
                    <div>
                      <h3 className="text-xl font-serif font-bold">{selectedCertificate.title}</h3>
                      <p className="text-sm opacity-90">{selectedCertificate.issuer}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors duration-200"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Year Obtained</h4>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCertificate.year}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Category</h4>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCertificate.category}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Issuing Country</h4>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                      <span className="mr-2">{selectedCertificate.flag}</span>
                      {selectedCertificate.country}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Issuing Body</h4>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCertificate.issuer}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-lg font-serif font-bold mb-3 text-gray-900 dark:text-white">Description</h4>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedCertificate.description}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="btn-primary flex-1">
                    <EyeIcon className="mr-2 h-5 w-5" />
                    View Certificate
                  </button>
                  <button className="btn-secondary flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">
                    <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                    Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Professional Collaboration
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Interested in working together? Let's discuss opportunities for collaboration,
              speaking engagements, or consulting projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                <DocumentTextIcon className="mr-2 h-5 w-5" />
                Request Collaboration
              </button>
              <button className="btn-secondary">
                <AcademicCapIcon className="mr-2 h-5 w-5" />
                Speaking Inquiries
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
