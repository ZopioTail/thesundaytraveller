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
    <div className="relative w-full h-[600px] lg:h-[700px] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,184,0,0.2),transparent_50%)]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      {/* Main SVG Container */}
      <svg
        viewBox="0 0 100 80"
        className="relative w-full h-full z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Enhanced gradient for the path */}
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="20%" stopColor="#A78BFA" />
            <stop offset="40%" stopColor="#F472B6" />
            <stop offset="60%" stopColor="#FBBF24" />
            <stop offset="80%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>

          {/* Glowing effect gradient */}
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#F472B6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#34D399" stopOpacity="0.8" />
          </linearGradient>

          {/* Filter for glow effect */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Animated dash pattern */}
          <pattern id="dashPattern" patternUnits="userSpaceOnUse" width="6" height="2">
            <rect width="3" height="2" fill="url(#pathGradient)" />
            <rect x="3" width="3" height="2" fill="transparent" />
          </pattern>
        </defs>

        {/* Glowing background path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#glowGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 0.6
          }}
          transition={{
            pathLength: { duration: 4, ease: "easeInOut" },
            opacity: { duration: 2 }
          }}
        />

        {/* Main animated travel path */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="1.2"
          strokeDasharray="3 2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            strokeDashoffset: [0, -5]
          }}
          transition={{
            pathLength: { duration: 4, ease: "easeInOut" },
            opacity: { duration: 2 },
            strokeDashoffset: {
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />

        {/* Country Flags with Enhanced Animations */}
        {countries.map((country, index) => (
          <g key={country.code}>
            {/* Outer glow ring */}
            <motion.circle
              cx={country.x}
              cy={country.y}
              r={3}
              fill="none"
              stroke="url(#pathGradient)"
              strokeWidth="0.2"
              opacity={0.4}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{
                delay: index * 0.15 + 2,
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Flag Circle Background with gradient */}
            <motion.circle
              cx={country.x}
              cy={country.y}
              r={hoveredCountry === country.code ? 3 : 2.2}
              fill="rgba(255,255,255,0.95)"
              stroke="url(#pathGradient)"
              strokeWidth="0.4"
              className="drop-shadow-lg cursor-pointer"
              filter="url(#glow)"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: index * 0.15 + 1.5,
                duration: 0.8,
                type: "spring",
                stiffness: 150
              }}
              whileHover={{
                scale: 1.3,
                boxShadow: "0 0 20px rgba(255,255,255,0.8)"
              }}
              onMouseEnter={() => setHoveredCountry(country.code)}
              onMouseLeave={() => setHoveredCountry(null)}
            />

            {/* Flag Emoji with enhanced styling */}
            <motion.text
              x={country.x}
              y={country.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={hoveredCountry === country.code ? "1.8" : "1.5"}
              className="cursor-pointer select-none"
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
              initial={{ scale: 0, opacity: 0, rotate: -180 }}
              animate={{
                scale: 1,
                opacity: 1,
                rotate: 0,
                y: [0, -1, 0]
              }}
              transition={{
                scale: { delay: index * 0.15 + 1.8, duration: 0.5 },
                opacity: { delay: index * 0.15 + 1.8, duration: 0.5 },
                rotate: { delay: index * 0.15 + 1.8, duration: 0.8 },
                y: {
                  delay: index * 0.15 + 3,
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              whileHover={{
                scale: 1.4,
                rotate: [0, -10, 10, 0],
                transition: { rotate: { duration: 0.5 } }
              }}
              onMouseEnter={() => setHoveredCountry(country.code)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              {country.flag}
            </motion.text>

            {/* Enhanced Country Name Tooltip */}
            {hoveredCountry === country.code && (
              <motion.g
                initial={{ opacity: 0, y: 3, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 3, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Tooltip background with gradient */}
                <rect
                  x={country.x - country.name.length * 0.4}
                  y={country.y - 5.5}
                  width={country.name.length * 0.8}
                  height={2.5}
                  fill="url(#pathGradient)"
                  rx="0.5"
                  filter="url(#glow)"
                />
                <rect
                  x={country.x - country.name.length * 0.4 + 0.1}
                  y={country.y - 5.4}
                  width={country.name.length * 0.8 - 0.2}
                  height={2.3}
                  fill="rgba(0,0,0,0.9)"
                  rx="0.4"
                />
                {/* Tooltip text */}
                <text
                  x={country.x}
                  y={country.y - 4.2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="1"
                  fill="white"
                  className="font-bold"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }}
                >
                  {country.name}
                </text>
                {/* Tooltip arrow */}
                <path
                  d={`M ${country.x - 0.5} ${country.y - 3} L ${country.x} ${country.y - 2} L ${country.x + 0.5} ${country.y - 3} Z`}
                  fill="rgba(0,0,0,0.9)"
                />
              </motion.g>
            )}

            {/* Enhanced Pulsing Animation for Recent Countries */}
            {index < 8 && (
              <>
                <motion.circle
                  cx={country.x}
                  cy={country.y}
                  r={2.2}
                  fill="none"
                  stroke="url(#pathGradient)"
                  strokeWidth="0.3"
                  opacity={0.8}
                  animate={{
                    r: [2.2, 4.5, 2.2],
                    opacity: [0.8, 0, 0.8],
                    strokeWidth: [0.3, 0.1, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                    ease: "easeInOut"
                  }}
                />
                <motion.circle
                  cx={country.x}
                  cy={country.y}
                  r={2.2}
                  fill="none"
                  stroke="rgba(255,255,255,0.6)"
                  strokeWidth="0.2"
                  animate={{
                    r: [2.2, 3.8, 2.2],
                    opacity: [0.6, 0, 0.6]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: index * 0.5 + 0.5,
                    ease: "easeInOut"
                  }}
                />
              </>
            )}
          </g>
        ))}

        {/* Enhanced Animated Travel Plane */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
        >
          {/* Plane trail */}
          <motion.path
            d="M-2,0 L-0.5,0"
            stroke="url(#pathGradient)"
            strokeWidth="0.3"
            strokeLinecap="round"
            opacity={0.6}
            animate={{
              offsetDistance: ["0%", "100%"]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              offsetPath: `path('${pathData}')`,
              offsetRotate: "auto"
            }}
          />

          {/* Main plane */}
          <motion.path
            d="M-1.5,-0.3 L1.5,0 L-1.5,0.3 L-0.8,0 Z"
            fill="url(#pathGradient)"
            stroke="white"
            strokeWidth="0.1"
            transform-origin="0 0"
            filter="url(#glow)"
            animate={{
              offsetDistance: ["0%", "100%"]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              offsetPath: `path('${pathData}')`,
              offsetRotate: "auto"
            }}
          />

          {/* Plane glow effect */}
          <motion.circle
            r="0.8"
            fill="rgba(96, 165, 250, 0.3)"
            animate={{
              offsetDistance: ["0%", "100%"],
              r: [0.8, 1.2, 0.8]
            }}
            transition={{
              offsetDistance: {
                duration: 12,
                repeat: Infinity,
                ease: "linear"
              },
              r: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{
              offsetPath: `path('${pathData}')`,
            }}
          />
        </motion.g>
      </svg>

      {/* Enhanced Stats Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 5 }}
        className="absolute bottom-6 left-6 right-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Countries Visited',
              value: countries.length,
              color: 'from-blue-500 to-cyan-500',
              icon: '🌍'
            },
            {
              label: 'Continents Explored',
              value: '6',
              color: 'from-green-500 to-emerald-500',
              icon: '🗺️'
            },
            {
              label: 'Miles Traveled',
              value: '250K+',
              color: 'from-purple-500 to-pink-500',
              icon: '✈️'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 5.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${stat.color} animate-pulse`} />
              </div>
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                {stat.value}
              </div>
              <div className="text-white/80 text-sm font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Legend */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 4.5 }}
        className="absolute top-6 right-6"
      >
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-2xl">
          <h4 className="text-white font-bold mb-3 text-sm">Journey Legend</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-1 bg-gradient-to-r from-blue-400 via-pink-400 to-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-xs font-medium">Travel Route</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex space-x-1">
                <span className="text-sm animate-bounce" style={{ animationDelay: '0s' }}>🇮🇳</span>
                <span className="text-sm animate-bounce" style={{ animationDelay: '0.2s' }}>🇲🇽</span>
                <span className="text-sm animate-bounce" style={{ animationDelay: '0.4s' }}>🇧🇷</span>
              </div>
              <span className="text-white/90 text-xs font-medium">Hover flags for details</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-pink-400 animate-ping" />
              <span className="text-white/90 text-xs font-medium">Recent destinations</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Running Flag Animation at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex items-center space-x-4 h-full"
        >
          {countries.concat(countries).map((country, index) => (
            <motion.div
              key={`${country.code}-${index}`}
              className="flex-shrink-0 text-3xl"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.1,
                ease: "easeInOut"
              }}
            >
              {country.flag}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
