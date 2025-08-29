'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const countries = [
  { name: 'India', code: 'IN', x: 75, y: 45, flag: '🇮🇳' },
  { name: 'Mexico', code: 'MX', x: 20, y: 35, flag: '🇲🇽' },
  { name: 'Guatemala', code: 'GT', x: 25, y: 40, flag: '🇬🇹' },
  { name: 'Belize', code: 'BZ', x: 27, y: 42, flag: '🇧🇿' },
  { name: 'Honduras', code: 'HN', x: 28, y: 43, flag: '🇭🇳' },
  { name: 'El Salvador', code: 'SV', x: 26, y: 44, flag: '🇸🇻' },
  { name: 'Nicaragua', code: 'NI', x: 29, y: 46, flag: '🇳🇮' },
  { name: 'Costa Rica', code: 'CR', x: 30, y: 48, flag: '🇨🇷' },
  { name: 'Panama', code: 'PA', x: 32, y: 50, flag: '🇵🇦' },
  { name: 'Brazil', code: 'BR', x: 45, y: 65, flag: '🇧🇷' },
  { name: 'Argentina', code: 'AR', x: 42, y: 75, flag: '🇦🇷' },
  { name: 'Paraguay', code: 'PY', x: 43, y: 70, flag: '🇵🇾' },
  { name: 'Peru', code: 'PE', x: 38, y: 62, flag: '🇵🇪' },
  { name: 'Bolivia', code: 'BO', x: 40, y: 65, flag: '🇧🇴' },
  { name: 'Cyprus', code: 'CY', x: 65, y: 30, flag: '🇨🇾' },
  { name: 'Croatia', code: 'HR', x: 58, y: 25, flag: '🇭🇷' },
  { name: 'Serbia', code: 'RS', x: 60, y: 27, flag: '🇷🇸' },
  { name: 'Hungary', code: 'HU', x: 59, y: 24, flag: '🇭🇺' },
  { name: 'Denmark', code: 'DK', x: 55, y: 18, flag: '🇩🇰' },
  { name: 'Iceland', code: 'IS', x: 48, y: 12, flag: '🇮🇸' },
  { name: 'Bulgaria', code: 'BG', x: 62, y: 28, flag: '🇧🇬' },
  { name: 'UAE', code: 'AE', x: 72, y: 38, flag: '🇦🇪' },
  { name: 'Qatar', code: 'QA', x: 70, y: 36, flag: '🇶🇦' },
  { name: 'Turkey', code: 'TR', x: 64, y: 32, flag: '🇹🇷' },
  { name: 'Rwanda', code: 'RW', x: 68, y: 52, flag: '🇷🇼' },
  { name: 'Congo DR', code: 'CD', x: 66, y: 55, flag: '🇨🇩' },
  { name: 'Uganda', code: 'UG', x: 69, y: 50, flag: '🇺🇬' },
  { name: 'Ethiopia', code: 'ET', x: 71, y: 48, flag: '🇪🇹' },
  { name: 'Egypt', code: 'EG', x: 67, y: 35, flag: '🇪🇬' },
  { name: 'South Africa', code: 'ZA', x: 65, y: 70, flag: '🇿🇦' },
  { name: 'Mauritius', code: 'MU', x: 78, y: 65, flag: '🇲🇺' },
  { name: 'Kazakhstan', code: 'KZ', x: 80, y: 25, flag: '🇰🇿' },
  { name: 'Mongolia', code: 'MN', x: 85, y: 22, flag: '🇲🇳' },
  { name: 'Nepal', code: 'NP', x: 77, y: 42, flag: '🇳🇵' },
  { name: 'Bhutan', code: 'BT', x: 79, y: 43, flag: '🇧🇹' },
  { name: 'Maldives', code: 'MV', x: 73, y: 50, flag: '🇲🇻' },
  { name: 'Thailand', code: 'TH', x: 82, y: 48, flag: '🇹🇭' },
  { name: 'Cambodia', code: 'KH', x: 84, y: 50, flag: '🇰🇭' },
]

// Generate smooth curved path through all countries
const generatePath = () => {
  const sortedCountries = [...countries].sort((a, b) => a.x - b.x)
  let path = `M ${sortedCountries[0].x} ${sortedCountries[0].y}`
  
  for (let i = 1; i < sortedCountries.length; i++) {
    const prev = sortedCountries[i - 1]
    const curr = sortedCountries[i]
    const next = sortedCountries[i + 1]
    
    // Calculate control points for smooth curves
    const cp1x = prev.x + (curr.x - prev.x) * 0.5
    const cp1y = prev.y + Math.sin((curr.x - prev.x) * 0.1) * 5
    const cp2x = curr.x - (next ? (next.x - curr.x) * 0.3 : 10)
    const cp2y = curr.y + Math.cos((curr.x - prev.x) * 0.1) * 3
    
    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`
  }
  
  return path
}

export default function TravelPath() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const pathData = generatePath()

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <svg 
        viewBox="0 0 100 80" 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient for the path */}
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="25%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
          
          {/* Animated dash pattern */}
          <pattern id="dashPattern" patternUnits="userSpaceOnUse" width="4" height="1">
            <rect width="2" height="1" fill="url(#pathGradient)" />
            <rect x="2" width="2" height="1" fill="transparent" />
          </pattern>
        </defs>

        {/* Animated Travel Path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="0.8"
          strokeDasharray="2 1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            strokeDashoffset: [0, -3]
          }}
          transition={{ 
            pathLength: { duration: 3, ease: "easeInOut" },
            opacity: { duration: 1 },
            strokeDashoffset: { 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }
          }}
        />

        {/* Country Flags */}
        {countries.map((country, index) => (
          <g key={country.code}>
            {/* Flag Circle Background */}
            <motion.circle
              cx={country.x}
              cy={country.y}
              r={hoveredCountry === country.code ? 2.5 : 1.8}
              fill="white"
              stroke="url(#pathGradient)"
              strokeWidth="0.3"
              className="drop-shadow-sm cursor-pointer"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.1 + 1,
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.4 }}
              onMouseEnter={() => setHoveredCountry(country.code)}
              onMouseLeave={() => setHoveredCountry(null)}
            />
            
            {/* Flag Emoji */}
            <motion.text
              x={country.x}
              y={country.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="1.2"
              className="cursor-pointer select-none"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.1 + 1.2,
                duration: 0.3
              }}
              whileHover={{ scale: 1.2 }}
              onMouseEnter={() => setHoveredCountry(country.code)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              {country.flag}
            </motion.text>

            {/* Country Name Tooltip */}
            {hoveredCountry === country.code && (
              <motion.g
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
              >
                <rect
                  x={country.x - country.name.length * 0.3}
                  y={country.y - 4}
                  width={country.name.length * 0.6}
                  height={1.5}
                  fill="rgba(0,0,0,0.8)"
                  rx="0.3"
                />
                <text
                  x={country.x}
                  y={country.y - 3.2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="0.8"
                  fill="white"
                  className="font-medium"
                >
                  {country.name}
                </text>
              </motion.g>
            )}

            {/* Pulsing Animation for Recent Countries */}
            {index < 5 && (
              <motion.circle
                cx={country.x}
                cy={country.y}
                r={1.8}
                fill="none"
                stroke="url(#pathGradient)"
                strokeWidth="0.2"
                opacity={0.6}
                animate={{
                  r: [1.8, 3.5, 1.8],
                  opacity: [0.6, 0, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.4
                }}
              />
            )}
          </g>
        ))}

        {/* Animated Travel Plane */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          <motion.path
            d="M-1,-0.5 L1,0 L-1,0.5 L-0.5,0 Z"
            fill="#3B82F6"
            transform-origin="0 0"
            animate={{
              offsetDistance: ["0%", "100%"]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              offsetPath: `path('${pathData}')`,
              offsetRotate: "auto"
            }}
          />
        </motion.g>
      </svg>

      {/* Stats Overlay */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex justify-between items-center text-sm">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <span className="text-gray-600 dark:text-gray-400">Countries Visited:</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 ml-2">{countries.length}</span>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <span className="text-gray-600 dark:text-gray-400">Continents:</span>
            <span className="font-bold text-green-600 dark:text-green-400 ml-2">6</span>
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 py-2">
            <span className="text-gray-600 dark:text-gray-400">Miles Traveled:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 ml-2">250K+</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-0.5 bg-gradient-to-r from-blue-500 to-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Travel Route</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">🇮🇳</span>
            <span className="text-gray-600 dark:text-gray-400">Hover for details</span>
          </div>
        </div>
      </div>
    </div>
  )
}
