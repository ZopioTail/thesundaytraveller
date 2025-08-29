'use client'

import { useState } from 'react'

// Lightweight version with key destinations only
const countries = [
  { name: 'India', code: 'IN', x: 75, y: 45, flag: '🇮🇳' },
  { name: 'Vietnam', code: 'VN', x: 82, y: 48, flag: '🇻🇳' },
  { name: 'Thailand', code: 'TH', x: 80, y: 50, flag: '🇹🇭' },
  { name: 'Peru', code: 'PE', x: 38, y: 62, flag: '🇵🇪' },
  { name: 'Iceland', code: 'IS', x: 48, y: 12, flag: '🇮🇸' },
  { name: 'UAE', code: 'AE', x: 72, y: 38, flag: '🇦🇪' },
  { name: 'Qatar', code: 'QA', x: 70, y: 36, flag: '🇶🇦' },
  { name: 'Turkey', code: 'TR', x: 64, y: 32, flag: '🇹🇷' },
]

export default function TravelPath() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
      {/* Simple background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_70%)]" />
      </div>
      {/* Simple Country Grid - No heavy SVG animations */}
      <div className="relative w-full h-full flex flex-col justify-center p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Countries Explored
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            A journey across continents and cultures
          </p>
        </div>

        {/* Country Grid */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 max-w-4xl mx-auto">
          {countries.map((country, index) => (
            <div
              key={country.code}
              className="group relative flex flex-col items-center p-3 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
              onMouseEnter={() => setHoveredCountry(country.code)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              {/* Flag */}
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {country.flag}
              </div>

              {/* Country Name */}
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">
                {country.name}
              </div>

              {/* Hover Tooltip */}
              {hoveredCountry === country.code && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap z-10">
                  {country.name}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Simple Stats */}
        <div className="flex justify-center mt-8 space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{countries.length}+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">6</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Continents</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">250K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Miles</div>
          </div>
        </div>
      </div>
    </div>
  )
}
