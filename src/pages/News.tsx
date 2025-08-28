import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  GlobeAltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

// Mock news data with Unsplash images
const newsArticles = [
  {
    id: 1,
    title: "New UNESCO World Heritage Sites Announced for 2024",
    excerpt: "Discover the latest additions to UNESCO's prestigious list of World Heritage Sites, including hidden gems from Asia and Europe.",
    content: "Full article content here...",
    region: "Global",
    image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 5,
    createdAt: new Date('2024-01-20'),
    featured: true
  },
  {
    id: 2,
    title: "Sustainable Tourism Initiatives Gain Momentum in Southeast Asia",
    excerpt: "Local communities and governments collaborate to promote eco-friendly travel practices across the region.",
    content: "Full article content here...",
    region: "Asia",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 7,
    createdAt: new Date('2024-01-18'),
    featured: false
  },
  {
    id: 3,
    title: "European Rail Network Expands with New High-Speed Routes",
    excerpt: "Travel across Europe becomes more convenient with the introduction of new high-speed rail connections.",
    content: "Full article content here...",
    region: "Europe",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 6,
    createdAt: new Date('2024-01-15'),
    featured: true
  },
  {
    id: 4,
    title: "African Safari Tourism Shows Strong Recovery Post-Pandemic",
    excerpt: "Wildlife conservation efforts and tourism recovery go hand in hand across East and Southern Africa.",
    content: "Full article content here...",
    region: "Africa",
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 8,
    createdAt: new Date('2024-01-12'),
    featured: false
  },
  {
    id: 5,
    title: "Digital Nomad Visas: Latest Updates from Latin America",
    excerpt: "Several Latin American countries introduce new visa programs to attract remote workers and digital nomads.",
    content: "Full article content here...",
    region: "Americas",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 4,
    createdAt: new Date('2024-01-10'),
    featured: false
  },
  {
    id: 6,
    title: "Climate Change Impact on Arctic Tourism Routes",
    excerpt: "Changing ice conditions affect traditional Arctic expedition routes, creating new opportunities and challenges.",
    content: "Full article content here...",
    region: "Arctic",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 9,
    createdAt: new Date('2024-01-08'),
    featured: true
  }
];

const regions = ["All", "Global", "Asia", "Europe", "Africa", "Americas", "Arctic", "Oceania"];

export default function News() {
  const [filteredNews, setFilteredNews] = useState(newsArticles);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  useEffect(() => {
    let filtered = newsArticles;

    // Filter by region
    if (selectedRegion !== 'All') {
      filtered = filtered.filter(article => article.region === selectedRegion);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredNews(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedRegion, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredNews.slice(startIndex, startIndex + articlesPerPage);

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <GlobeAltIcon className="h-16 w-16 mx-auto mb-6 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Travel News
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Stay updated with the latest travel news, trends, and developments from around the world
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <FunnelIcon className="h-5 w-5" />
              <span>Filter by Region</span>
            </button>
          </div>

          {/* Region Filters */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="flex flex-wrap gap-3 py-4">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => handleRegionChange(region)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedRegion === region
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredNews.length} {filteredNews.length === 1 ? 'article' : 'articles'}
              {selectedRegion !== 'All' && ` from ${selectedRegion}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </section>

      {/* News Articles Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/news/${article.id}`} className="block">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                    {/* Featured Badge */}
                    {article.featured && (
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                        Breaking
                      </div>
                    )}

                    {/* Article Image */}
                    <div className="relative aspect-w-16 aspect-h-10 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Article Content */}
                    <div className="p-6">
                      {/* Region and Meta */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                          <GlobeAltIcon className="mr-1 h-3 w-3" />
                          {article.region}
                        </span>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {article.createdAt.toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="mr-1 h-3 w-3" />
                            {article.readTime} min
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                        {article.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>

                      {/* Read More */}
                      <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300">
                        Read Full Article
                        <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* No Results */}
          {filteredNews.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No news articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('All');
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </motion.div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Stay Informed
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Get the latest travel news and updates delivered straight to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
