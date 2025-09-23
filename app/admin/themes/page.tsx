'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  SwatchIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  EyeIcon,
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { ThemeManager, ThemeConfig, predefinedThemes } from '@/lib/themes'

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center space-x-3">
      <label className="text-sm font-medium text-gray-700 w-24">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="#000000"
        />
      </div>
    </div>
  )
}

export default function ThemesPage() {
  const [themes, setThemes] = useState(ThemeManager.getAvailableThemes())
  const [selectedTheme, setSelectedTheme] = useState<string>('default')
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(ThemeManager.getCurrentTheme())
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newThemeName, setNewThemeName] = useState('')
  const [baseTheme, setBaseTheme] = useState('default')

  useEffect(() => {
    const handleThemeChange = (theme: ThemeConfig) => {
      setCurrentTheme(theme)
      setThemes(ThemeManager.getAvailableThemes())
    }

    ThemeManager.addChangeListener(handleThemeChange)

    return () => {
      ThemeManager.removeChangeListener(handleThemeChange)
    }
  }, [])

  const handleThemeSelect = (themeName: string) => {
    setSelectedTheme(themeName)
    setIsEditing(false)
  }

  const handleThemeApply = () => {
    ThemeManager.setTheme(selectedTheme)
  }

  const handleEditTheme = () => {
    setIsEditing(true)
  }

  const handleSaveTheme = () => {
    if (isEditing) {
      // Save current theme as custom theme
      const customTheme = ThemeManager.createCustomTheme(
        `${selectedTheme}-custom-${Date.now()}`,
        selectedTheme,
        currentTheme
      )
      setThemes(ThemeManager.getAvailableThemes())
      setIsEditing(false)
    }
  }

  const handleCreateTheme = () => {
    if (newThemeName.trim()) {
      const customTheme = ThemeManager.createCustomTheme(newThemeName, baseTheme, {})
      setThemes(ThemeManager.getAvailableThemes())
      setSelectedTheme(newThemeName)
      setShowCreateModal(false)
      setNewThemeName('')
    }
  }

  const handleDeleteTheme = (themeName: string) => {
    if (ThemeManager.deleteCustomTheme(themeName)) {
      setThemes(ThemeManager.getAvailableThemes())
      if (selectedTheme === themeName) {
        setSelectedTheme('default')
      }
    }
  }

  const handleExportTheme = (themeName: string) => {
    const theme = themes.find(t => t.name === themeName)?.config
    if (theme) {
      const dataStr = JSON.stringify(theme, null, 2)
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

      const exportFileDefaultName = `${themeName}-theme.json`

      const linkElement = document.createElement('a')
      linkElement.setAttribute('href', dataUri)
      linkElement.setAttribute('download', exportFileDefaultName)
      linkElement.click()
    }
  }

  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const themeConfig = JSON.parse(e.target?.result as string)
          const customTheme = ThemeManager.createCustomTheme(
            `${themeConfig.name || 'imported'}-${Date.now()}`,
            'default',
            themeConfig
          )
          setThemes(ThemeManager.getAvailableThemes())
          setSelectedTheme(customTheme.name)
        } catch (error) {
          alert('Invalid theme file')
        }
      }
      reader.readAsText(file)
    }
  }

  const updateThemeColor = (colorKey: string, value: string) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }))
  }

  const updateThemeProperty = (category: string, property: string, value: any) => {
    setCurrentTheme(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof ThemeConfig] as any,
        [property]: value
      }
    }))
  }

  const resetTheme = () => {
    const originalTheme = themes.find(t => t.name === selectedTheme)?.config || predefinedThemes.default
    setCurrentTheme(originalTheme)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Theme Customizer</h1>
          <p className="text-gray-600">Customize the appearance of your blog</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => document.getElementById('theme-import')?.click()}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
            Import Theme
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Theme
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theme List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Available Themes</h2>
            </div>

            <div className="p-4 space-y-2">
              {themes.map((theme) => (
                <div
                  key={theme.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTheme === theme.name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleThemeSelect(theme.name)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{theme.name}</h3>
                      <p className="text-sm text-gray-500">{theme.config.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      {theme.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExportTheme(theme.name)
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Export Theme"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                      )}
                      {theme.isCustom && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteTheme(theme.name)
                          }}
                          className="p-1 text-red-400 hover:text-red-600"
                          title="Delete Theme"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Theme Actions */}
          <div className="mt-4 space-y-2">
            <button
              onClick={handleThemeApply}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <EyeIcon className="h-4 w-4 mr-2" />
              Apply Theme
            </button>

            {selectedTheme !== 'default' && (
              <button
                onClick={handleEditTheme}
                className="w-full flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                <SwatchIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Editing...' : 'Edit Theme'}
              </button>
            )}

            {isEditing && (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveTheme}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Save
                </button>
                <button
                  onClick={resetTheme}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-1" />
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Theme Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Theme' : 'Theme Preview'}
              </h2>
            </div>

            <div className="p-6 space-y-8">
              {/* Color Palette */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Primary"
                    value={currentTheme.colors.primary}
                    onChange={(value) => updateThemeColor('primary', value)}
                  />
                  <ColorPicker
                    label="Secondary"
                    value={currentTheme.colors.secondary}
                    onChange={(value) => updateThemeColor('secondary', value)}
                  />
                  <ColorPicker
                    label="Background"
                    value={currentTheme.colors.background}
                    onChange={(value) => updateThemeColor('background', value)}
                  />
                  <ColorPicker
                    label="Text"
                    value={currentTheme.colors.text}
                    onChange={(value) => updateThemeColor('text', value)}
                  />
                  <ColorPicker
                    label="Success"
                    value={currentTheme.colors.success}
                    onChange={(value) => updateThemeColor('success', value)}
                  />
                  <ColorPicker
                    label="Warning"
                    value={currentTheme.colors.warning}
                    onChange={(value) => updateThemeColor('warning', value)}
                  />
                  <ColorPicker
                    label="Error"
                    value={currentTheme.colors.error}
                    onChange={(value) => updateThemeColor('error', value)}
                  />
                  <ColorPicker
                    label="Info"
                    value={currentTheme.colors.info}
                    onChange={(value) => updateThemeColor('info', value)}
                  />
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Typography</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Family
                    </label>
                    <input
                      type="text"
                      value={currentTheme.typography.fontFamily}
                      onChange={(e) => updateThemeProperty('typography', 'fontFamily', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Font Size
                    </label>
                    <input
                      type="text"
                      value={currentTheme.typography.fontSize.base}
                      onChange={(e) => {
                        const newFontSize = { ...currentTheme.typography.fontSize, base: e.target.value }
                        updateThemeProperty('typography', 'fontSize', newFontSize)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Border Radius</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Small
                    </label>
                    <input
                      type="text"
                      value={currentTheme.borderRadius.sm}
                      onChange={(e) => updateThemeProperty('borderRadius', 'sm', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medium
                    </label>
                    <input
                      type="text"
                      value={currentTheme.borderRadius.md}
                      onChange={(e) => updateThemeProperty('borderRadius', 'md', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Large
                    </label>
                    <input
                      type="text"
                      value={currentTheme.borderRadius.lg}
                      onChange={(e) => updateThemeProperty('borderRadius', 'lg', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Extra Large
                    </label>
                    <input
                      type="text"
                      value={currentTheme.borderRadius.xl}
                      onChange={(e) => updateThemeProperty('borderRadius', 'xl', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Preview</h3>
                <div className="border border-gray-200 rounded-lg p-6 space-y-4">
                  <div className="flex space-x-4">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg">
                      Primary Button
                    </button>
                    <button className="px-4 py-2 bg-secondary text-white rounded-lg">
                      Secondary Button
                    </button>
                    <button className="px-4 py-2 bg-surface border border-border rounded-lg">
                      Outline Button
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-text">Heading 1</h1>
                    <h2 className="text-3xl font-semibold text-text">Heading 2</h2>
                    <h3 className="text-2xl font-medium text-text">Heading 3</h3>
                    <p className="text-base text-text">
                      This is a sample paragraph with <strong className="font-semibold">bold text</strong> and{' '}
                      <em className="italic">italic text</em>. The theme colors and typography are applied here.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <div className="px-3 py-1 bg-success text-white rounded-full text-sm">
                      Success
                    </div>
                    <div className="px-3 py-1 bg-warning text-white rounded-full text-sm">
                      Warning
                    </div>
                    <div className="px-3 py-1 bg-error text-white rounded-full text-sm">
                      Error
                    </div>
                    <div className="px-3 py-1 bg-info text-white rounded-full text-sm">
                      Info
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input for theme import */}
      <input
        id="theme-import"
        type="file"
        accept=".json"
        onChange={handleImportTheme}
        className="hidden"
      />

      {/* Create Theme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold mb-4">Create New Theme</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme Name
                </label>
                <input
                  type="text"
                  value={newThemeName}
                  onChange={(e) => setNewThemeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My Custom Theme"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Theme
                </label>
                <select
                  value={baseTheme}
                  onChange={(e) => setBaseTheme(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(predefinedThemes).map(([name, theme]) => (
                    <option key={name} value={name}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTheme}
                  disabled={!newThemeName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Create Theme
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}