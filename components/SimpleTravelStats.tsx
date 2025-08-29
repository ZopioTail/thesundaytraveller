'use client'

// Ultra-lightweight travel stats component
const countries = [
  { name: 'India', flag: '🇮🇳' },
  { name: 'Vietnam', flag: '🇻🇳' },
  { name: 'Thailand', flag: '🇹🇭' },
  { name: 'Peru', flag: '🇵🇪' },
  { name: 'Iceland', flag: '🇮🇸' },
  { name: 'UAE', flag: '🇦🇪' },
  { name: 'Qatar', flag: '🇶🇦' },
  { name: 'Turkey', flag: '🇹🇷' },
  { name: 'Rwanda', flag: '🇷🇼' },
  { name: 'Serbia', flag: '🇷🇸' },
  { name: 'South Korea', flag: '🇰🇷' },
  { name: 'Nepal', flag: '🇳🇵' },
]

export default function SimpleTravelStats() {
  return (
    <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
      {/* Title */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Global Journey
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Exploring diverse cultures, breathtaking landscapes, and unforgettable experiences across continents
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm">
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {countries.length}+
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">
            Countries Explored
          </div>
        </div>
        
        <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm">
          <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
            6
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">
            Continents Visited
          </div>
        </div>
        
        <div className="text-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl backdrop-blur-sm">
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            250K+
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">
            Miles Traveled
          </div>
        </div>
      </div>

      {/* Country Flags - Simple Grid */}
      <div className="grid grid-cols-6 md:grid-cols-12 gap-4 max-w-4xl mx-auto">
        {countries.map((country) => (
          <div
            key={country.name}
            className="group text-center p-3 rounded-lg bg-white/60 dark:bg-gray-700/60 hover:bg-white dark:hover:bg-gray-700 transition-colors duration-200"
            title={country.name}
          >
            <div className="text-2xl mb-1 group-hover:scale-110 transition-transform duration-200">
              {country.flag}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {country.name}
            </div>
          </div>
        ))}
      </div>

      {/* Simple Journey Description */}
      <div className="text-center mt-8 p-6 bg-white/60 dark:bg-gray-800/60 rounded-xl backdrop-blur-sm">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          From the bustling streets of Delhi to the serene landscapes of Iceland, 
          each destination has contributed to a rich tapestry of experiences, 
          cultural insights, and personal growth through travel.
        </p>
      </div>
    </div>
  )
}
