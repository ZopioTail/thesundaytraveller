'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface AnimatedBackgroundProps {
  variant?: 'gradient' | 'mesh' | 'particles' | 'waves'
  intensity?: 'low' | 'medium' | 'high'
  colors?: string[]
  className?: string
}

export default function AnimatedBackground({
  variant = 'gradient',
  intensity = 'medium',
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
  className = '',
}: AnimatedBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const intensitySettings = {
    low: { scale: 0.8, opacity: 0.3, speed: 0.5 },
    medium: { scale: 1, opacity: 0.5, speed: 1 },
    high: { scale: 1.2, opacity: 0.7, speed: 1.5 },
  }

  const settings = intensitySettings[intensity]

  if (variant === 'gradient') {
    return (
      <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, ${colors[0]} 0%, ${colors[1]} 25%, ${colors[2]} 50%, ${colors[3]} 75%, ${colors[4]} 100%)`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Floating orbs */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-70"
            style={{
              background: `linear-gradient(45deg, ${colors[i % colors.length]}, ${colors[(i + 1) % colors.length]})`,
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 2,
              ease: 'easeInOut',
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'mesh') {
    return (
      <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="mesh-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              {colors.map((color, i) => (
                <stop
                  key={i}
                  offset={`${(i / (colors.length - 1)) * 100}%`}
                  stopColor={color}
                  stopOpacity={settings.opacity}
                />
              ))}
            </linearGradient>
          </defs>
          
          <motion.path
            d="M0,0 Q25,50 50,25 T100,50 L100,100 L0,100 Z"
            fill="url(#mesh-gradient)"
            animate={{
              d: [
                "M0,0 Q25,50 50,25 T100,50 L100,100 L0,100 Z",
                "M0,25 Q25,0 50,50 T100,25 L100,100 L0,100 Z",
                "M0,50 Q25,25 50,0 T100,75 L100,100 L0,100 Z",
                "M0,0 Q25,50 50,25 T100,50 L100,100 L0,100 Z",
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </svg>
      </div>
    )
  }

  if (variant === 'particles') {
    return (
      <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: colors[i % colors.length],
              opacity: settings.opacity,
            }}
            animate={{
              x: [0, Math.random() * 200 - 100],
              y: [0, Math.random() * 200 - 100],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'waves') {
    return (
      <div className={`fixed inset-0 -z-10 overflow-hidden ${className}`}>
        {colors.map((color, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(${45 + i * 30}deg, transparent, ${color}20, transparent)`,
            }}
            animate={{
              x: [-100, 100],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear',
            }}
          />
        ))}
      </div>
    )
  }

  return null
}
