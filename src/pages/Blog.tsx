import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  ClockIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

// Mock blog data with Unsplash images
const blogPosts = [
  {
    id: 1,
    title: "Hidden Gems of Southeast Asia",
    excerpt: "Discover the untold stories and secret locations that most travelers never find in this comprehensive guide to Southeast Asia's best-kept secrets.",
    content: "Full blog content here...",
    category: "Travel",
    tags: ["Southeast Asia", "Hidden Gems", "Adventure"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 8,
    createdAt: new Date('2024-01-15'),
    featured: true
  },
  {
    id: 2,
    title: "Mountain Adventures in the Himalayas",
    excerpt: "A thrilling journey through the world's highest peaks, sharing stories of courage, breathtaking views, and life-changing experiences.",
    content: "Full blog content here...",
    category: "Adventure",
    tags: ["Himalayas", "Mountains", "Trekking"],
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 12,
    createdAt: new Date('2024-01-10'),
    featured: false
  },
  {
    id: 3,
    title: "Digital Nomad Life: Working from Paradise",
    excerpt: "How I balance professional responsibilities with wanderlust, sharing practical tips for location-independent work.",
    content: "Full blog content here...",
    category: "Lifestyle",
    tags: ["Digital Nomad", "Remote Work", "Lifestyle"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 6,
    createdAt: new Date('2024-01-05'),
    featured: true
  },
  {
    id: 4,
    title: "The Business of Travel Writing",
    excerpt: "Behind the scenes of building a career in travel journalism, from pitching stories to building relationships with editors.",
    content: "Full blog content here...",
    category: "Profession",
    tags: ["Travel Writing", "Career", "Journalism"],
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 10,
    createdAt: new Date('2023-12-28'),
    featured: false
  },
  {
    id: 5,
    title: "Cultural Immersion in Rural Japan",
    excerpt: "Living with local families and experiencing authentic Japanese culture away from the tourist crowds.",
    content: "Full blog content here...",
    category: "Travel",
    tags: ["Japan", "Culture", "Rural Travel"],
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 9,
    createdAt: new Date('2023-12-20'),
    featured: false
  },
  {
    id: 6,
    title: "Solo Female Travel: Safety and Empowerment",
    excerpt: "Practical advice and inspiring stories about traveling solo as a woman, breaking barriers and building confidence.",
    content: "Full blog content here...",
    category: "Lifestyle",
    tags: ["Solo Travel", "Female Travel", "Safety"],
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    author: "The Sunday Traveller",
    readTime: 7,
    createdAt: new Date('2023-12-15'),
    featured: true
  }
];

const categories = ["All", "Travel", "Adventure", "Lifestyle", "Profession"];

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category.toLowerCase());
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
              Blog & Stories
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
              Explore my travel stories, tips, and adventures from around the world
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
                placeholder="Search stories..."
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
              <span>Filters</span>
            </button>
          </div>

          {/* Category Filters */}
          <motion.div
            initial={false}
            animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="flex flex-wrap gap-3 py-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'story' : 'stories'}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link to={`/blog/${post.id}`} className="block">
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group-hover:scale-105">
                    {/* Featured Badge */}
                    {post.featured && (
                      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
                        Featured
                      </div>
                    )}

                    {/* Post Image */}
                    <div className="relative aspect-w-16 aspect-h-10 overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Post Content */}
                    <div className="p-6">
                      {/* Category and Meta */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
                          <TagIcon className="mr-1 h-3 w-3" />
                          {post.category}
                        </span>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
                          <div className="flex items-center">
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {post.createdAt.toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="mr-1 h-3 w-3" />
                            {post.readTime} min
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read More */}
                      <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium text-sm group-hover:text-primary-700 dark:group-hover:text-primary-300">
                        Read More
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
          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-gray-400 mb-4">
                <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No stories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSearchParams({});
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Never Miss a Story
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Subscribe to get the latest travel stories and tips delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
