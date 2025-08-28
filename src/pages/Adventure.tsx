
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapIcon,
  CameraIcon,
  ClockIcon,
  StarIcon,
  UserGroupIcon,
  TagIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

// Demo data for travel guides
const travelGuides = [
  {
    id: 1,
    title: "Ultimate Bali Island Hopping Guide",
    description: "Complete 14-day itinerary covering Bali, Gili Islands, and Lombok with insider tips, hidden gems, and budget breakdowns.",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=600&fit=crop",
    category: "Island Hopping",
    duration: "14 days",
    difficulty: "Easy",
    budget: "$800-1200",
    rating: 4.9,
    reviews: 156,
    highlights: ["Sunrise at Mount Batur", "Snorkeling at Gili T", "Rice Terraces of Jatiluwih"],
    tags: ["Beaches", "Culture", "Adventure"]
  },
  {
    id: 2,
    title: "European Backpacking Route: 30 Days",
    description: "Budget-friendly backpacking route through 8 European countries with train routes, hostel recommendations, and must-see attractions.",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=600&fit=crop",
    category: "Backpacking",
    duration: "30 days",
    difficulty: "Moderate",
    budget: "$1500-2500",
    rating: 4.8,
    reviews: 203,
    highlights: ["Prague Castle", "Swiss Alps", "Amsterdam Canals"],
    tags: ["Budget", "Culture", "History"]
  },
  {
    id: 3,
    title: "Japan Cherry Blossom Season Guide",
    description: "Perfect timing and locations for experiencing Japan's cherry blossom season, from Tokyo to Kyoto with cultural experiences.",
    image: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=600&fit=crop",
    category: "Seasonal",
    duration: "10 days",
    difficulty: "Easy",
    budget: "$2000-3000",
    rating: 4.9,
    reviews: 189,
    highlights: ["Yoshino Mountain", "Philosopher's Path", "Hanami Parties"],
    tags: ["Culture", "Nature", "Photography"]
  },
  {
    id: 4,
    title: "Patagonia Trekking Adventure",
    description: "Complete guide to trekking in Patagonia including Torres del Paine, El Calafate, and essential gear recommendations.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop",
    category: "Trekking",
    duration: "21 days",
    difficulty: "Hard",
    budget: "$2500-4000",
    rating: 4.7,
    reviews: 98,
    highlights: ["Torres del Paine", "Perito Moreno Glacier", "Fitz Roy Circuit"],
    tags: ["Adventure", "Nature", "Hiking"]
  },
  {
    id: 5,
    title: "Southeast Asia Food Trail",
    description: "Culinary journey through Thailand, Vietnam, and Malaysia with street food guides, cooking classes, and local markets.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
    category: "Food & Culture",
    duration: "18 days",
    difficulty: "Easy",
    budget: "$600-1000",
    rating: 4.8,
    reviews: 167,
    highlights: ["Bangkok Street Food", "Pho in Hanoi", "Penang Hawker Centers"],
    tags: ["Food", "Culture", "Budget"]
  },
  {
    id: 6,
    title: "Iceland Ring Road Complete Guide",
    description: "Self-drive adventure around Iceland's Ring Road with waterfall stops, glacier hikes, and Northern Lights viewing spots.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    category: "Road Trip",
    duration: "12 days",
    difficulty: "Moderate",
    budget: "$1800-2800",
    rating: 4.9,
    reviews: 134,
    highlights: ["Blue Lagoon", "Jokulsarlon Glacier", "Northern Lights"],
    tags: ["Nature", "Photography", "Adventure"]
  }
];

const categories = ["All", "Island Hopping", "Backpacking", "Seasonal", "Trekking", "Food & Culture", "Road Trip"];
const difficulties = ["All", "Easy", "Moderate", "Hard"];

export default function TravelGuides() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuides = travelGuides.filter(guide => {
    const matchesCategory = selectedCategory === "All" || guide.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || guide.difficulty === selectedDifficulty;
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 text-white section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <GlobeAltIcon className="h-12 w-12 text-yellow-300 mr-4" />
              <h1 className="text-4xl md:text-6xl font-serif font-bold">
                Travel Guides
              </h1>
              <MapIcon className="h-12 w-12 text-yellow-300 ml-4" />
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Comprehensive travel guides crafted from real experiences. Everything you need to plan your perfect adventure.
            </p>
            <div className="flex items-center justify-center space-x-8 text-white/80">
              <div className="flex items-center">
                <MapIcon className="h-5 w-5 mr-2" />
                <span>Detailed Itineraries</span>
              </div>
              <div className="flex items-center">
                <TagIcon className="h-5 w-5 mr-2" />
                <span>Budget Breakdowns</span>
              </div>
              <div className="flex items-center">
                <CameraIcon className="h-5 w-5 mr-2" />
                <span>Insider Tips</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto mb-8">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search guides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex justify-center items-center gap-4">
              <FunnelIcon className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedDifficulty === difficulty
                      ? 'bg-secondary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-secondary-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Guides Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredGuides.map((guide, index) => (
              <motion.article
                key={guide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>

                  <div className="md:w-1/2 p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 text-sm font-semibold rounded-full">
                        {guide.category}
                      </span>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                          {guide.rating} ({guide.reviews})
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-3">
                      {guide.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {guide.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{guide.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        <span>{guide.difficulty}</span>
                      </div>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 col-span-2">
                        <TagIcon className="h-4 w-4 mr-1" />
                        <span>{guide.budget}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Highlights:</h4>
                      <ul className="text-sm text-gray-600 dark:text-gray-300">
                        {guide.highlights.slice(0, 3).map((highlight, idx) => (
                          <li key={idx} className="flex items-center mb-1">
                            <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></div>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {guide.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button className="flex items-center text-primary-600 hover:text-primary-700 font-semibold">
                        View Guide
                        <ArrowRightIcon className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
