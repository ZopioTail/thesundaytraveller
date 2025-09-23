'use client'

import React from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { motion } from 'framer-motion'

export default function ThemeTestPage() {
  const { currentTheme, availableThemes, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Theme System Test</h1>
        <p className="text-gray-600">Testing the customizable theme system</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Theme Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Theme</h2>
          <div className="space-y-2">
            <p><strong>Name:</strong> {currentTheme.name}</p>
            <p><strong>Description:</strong> {currentTheme.description}</p>
            <p><strong>Primary Color:</strong> <span className="inline-block w-4 h-4 rounded border border-gray-300 ml-2" style={{ backgroundColor: currentTheme.colors.primary }}></span></p>
            <p><strong>Background:</strong> <span className="inline-block w-4 h-4 rounded border border-gray-300 ml-2" style={{ backgroundColor: currentTheme.colors.background }}></span></p>
          </div>
        </div>

        {/* Theme Switcher */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Switch Theme</h2>
          <div className="space-y-2">
            {availableThemes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setTheme(theme.name)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  currentTheme.name === theme.config.name
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'hover:bg-gray-100'
                }`}
              >
                {theme.config.name} {theme.isCustom && '(Custom)'}
              </button>
            ))}
          </div>
        </div>

        {/* Color Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Color Preview</h2>
          <div className="grid grid-cols-4 gap-2">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentTheme.colors.primary }}></div>
              <p className="text-xs text-gray-600">Primary</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentTheme.colors.secondary }}></div>
              <p className="text-xs text-gray-600">Secondary</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentTheme.colors.success }}></div>
              <p className="text-xs text-gray-600">Success</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentTheme.colors.warning }}></div>
              <p className="text-xs text-gray-600">Warning</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentTheme.colors.error }}></div>
              <p className="text-xs text-gray-600">Error</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentTheme.colors.info }}></div>
              <p className="text-xs text-gray-600">Info</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentTheme.colors.background }}></div>
              <p className="text-xs text-gray-600">Background</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded border border-gray-300" style={{ backgroundColor: currentTheme.colors.text }}></div>
              <p className="text-xs text-gray-600">Text</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Components */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sample Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-primary text-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            Primary Button
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-secondary text-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            Secondary Button
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-surface border border-border text-text rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            Outline Button
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-success text-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            Success Button
          </motion.button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex space-x-4">
            <div className="px-3 py-1 bg-success text-white rounded-full text-sm">
              Success Badge
            </div>
            <div className="px-3 py-1 bg-warning text-white rounded-full text-sm">
              Warning Badge
            </div>
            <div className="px-3 py-1 bg-error text-white rounded-full text-sm">
              Error Badge
            </div>
            <div className="px-3 py-1 bg-info text-white rounded-full text-sm">
              Info Badge
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-text mb-2">Sample Card</h3>
            <p className="text-textSecondary mb-4">
              This is a sample card component that demonstrates how the theme colors are applied throughout the interface.
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-primary text-white rounded text-sm">
                Action
              </button>
              <button className="px-3 py-1 bg-surface border border-border text-text rounded text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}