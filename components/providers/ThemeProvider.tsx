'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeManager, ThemeConfig } from '@/lib/themes'

interface ThemeContextType {
  currentTheme: ThemeConfig
  availableThemes: { name: string; config: ThemeConfig; isCustom: boolean }[]
  setTheme: (themeName: string) => boolean
  createCustomTheme: (name: string, baseTheme?: string, overrides?: Partial<ThemeConfig>) => ThemeConfig
  deleteCustomTheme: (name: string) => boolean
  updateTheme: (updates: Partial<ThemeConfig>) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(ThemeManager.getCurrentTheme())
  const [availableThemes, setAvailableThemes] = useState(ThemeManager.getAvailableThemes())

  useEffect(() => {
    const handleThemeChange = (theme: ThemeConfig) => {
      setCurrentTheme(theme)
      setAvailableThemes(ThemeManager.getAvailableThemes())
    }

    ThemeManager.addChangeListener(handleThemeChange)

    return () => {
      ThemeManager.removeChangeListener(handleThemeChange)
    }
  }, [])

  const setTheme = (themeName: string): boolean => {
    const success = ThemeManager.setTheme(themeName)
    if (success) {
      setCurrentTheme(ThemeManager.getCurrentTheme())
      setAvailableThemes(ThemeManager.getAvailableThemes())
    }
    return success
  }

  const createCustomTheme = (name: string, baseTheme: string = 'default', overrides: Partial<ThemeConfig> = {}): ThemeConfig => {
    const customTheme = ThemeManager.createCustomTheme(name, baseTheme, overrides)
    setAvailableThemes(ThemeManager.getAvailableThemes())
    return customTheme
  }

  const deleteCustomTheme = (name: string): boolean => {
    const success = ThemeManager.deleteCustomTheme(name)
    if (success) {
      setAvailableThemes(ThemeManager.getAvailableThemes())
    }
    return success
  }

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    const updatedTheme = { ...currentTheme, ...updates }
    setCurrentTheme(updatedTheme)
    ThemeManager.applyTheme(updatedTheme)
  }

  const value: ThemeContextType = {
    currentTheme,
    availableThemes,
    setTheme,
    createCustomTheme,
    deleteCustomTheme,
    updateTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
