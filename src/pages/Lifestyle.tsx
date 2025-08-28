
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  SparklesIcon,
  CameraIcon,
  BookOpenIcon,
  MapPinIcon,
  ClockIcon,
  EyeIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

// Demo data for inspiration posts
const inspirationPosts = [
  {
    id: 1,
    title: "Finding Peace in Bali's Hidden Temples",
    excerpt: "Discover the spiritual side of Bali beyond the tourist crowds. These hidden temples offer tranquility and ancient wisdom.",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
    category: "Spirituality",
    readTime: "5 min read",
    likes: 234,
    views: 1200,
    date: "2024-01-15"
  },
  {
    id: 2,
    title: "The Art of Slow Travel: Lessons from Tuscany",
    excerpt: "Why rushing through destinations robs us of authentic experiences. Learn to embrace the Italian art of 'dolce far niente'.",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&h=600&fit=crop",
    category: "Philosophy",
    readTime: "7 min read",
    likes: 189,
    views: 890,
    date: "2024-01-10"
  },
  {
    id: 3,
    title: "Street Food Stories: Connecting Through Cuisine",
    excerpt: "How sharing meals with strangers in Bangkok taught me about human connection and cultural understanding.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    category: "Culture",
    readTime: "6 min read",
    likes: 156,
    views: 750,
    date: "2024-01-05"
  },
  {
    id: 4,
    title: "Digital Detox in the Norwegian Fjords",
    excerpt: "Disconnecting from technology to reconnect with nature. A week without WiFi changed my perspective on modern life.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    category: "Wellness",
    readTime: "8 min read",
    likes: 298,
    views: 1450,
    date: "2023-12-28"
  },
  {
    id: 5,
    title: "Learning Languages Through Travel",
    excerpt: "How immersing yourself in local communities accelerates language learning and creates deeper connections.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
    category: "Learning",
    readTime: "4 min read",
    likes: 167,
    views: 680,
    date: "2023-12-20"
  },
  {
    id: 6,
    title: "Solo Female Travel: Overcoming Fear",
    excerpt: "Practical tips and mindset shifts that transformed my solo travel experience from fearful to fearless.",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    category: "Empowerment",
    readTime: "9 min read",
    likes: 445,
    views: 2100,
    date: "2023-12-15"
  }
];

const categories = ["All", "Spirituality", "Philosophy", "Culture", "Wellness", "Learning", "Empowerment"];

export default function GetInspired() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  const filteredPosts = selectedCategory === "All"
    ? inspirationPosts
    : inspirationPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 text-white section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <SparklesIcon className="h-12 w-12 text-yellow-300 mr-4" />
              <h1 className="text-4xl md:text-6xl font-serif font-bold">
                Get Inspired
              </h1>
              <SparklesIcon className="h-12 w-12 text-yellow-300 ml-4" />
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Stories, insights, and wisdom from the road. Let these experiences ignite your wanderlust and transform your perspective.
            </p>
            <div className="flex items-center justify-center space-x-8 text-white/80">
              <div className="flex items-center">
                <HeartIcon className="h-5 w-5 mr-2" />
                <span>Inspiring Stories</span>
              </div>
              <div className="flex items-center">
                <BookOpenIcon className="h-5 w-5 mr-2" />
                <span>Life Lessons</span>
              </div>
              <div className="flex items-center">
                <CameraIcon className="h-5 w-5 mr-2" />
                <span>Visual Journeys</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredPost(post.id)}
                onMouseLeave={() => setHoveredPost(null)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover transition-transform duration-300"
                    style={{
                      transform: hoveredPost === post.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-sm font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <div className="flex items-center bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                      <EyeIcon className="h-3 w-3 mr-1" />
                      {post.views}
                    </div>
                    <div className="flex items-center bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                      <HeartIcon className="h-3 w-3 mr-1" />
                      {post.likes}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.readTime}</span>
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <button className="text-primary-600 hover:text-primary-700 font-semibold flex items-center">
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200">
                      <ShareIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white section-padding">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Ready to Start Your Own Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let these stories inspire your next adventure. The world is waiting for you to explore it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Explore Destinations
              </button>
              <button className="btn-secondary">
                <BookOpenIcon className="h-5 w-5 mr-2" />
                Read My Book
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
