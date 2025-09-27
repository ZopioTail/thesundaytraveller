// Theme system for customizable UI
export interface ThemeColors {
  // Primary colors
  primary: string
  primaryHover: string
  primaryLight: string
  primaryDark: string

  // Secondary colors
  secondary: string
  secondaryHover: string
  secondaryLight: string
  secondaryDark: string

  // Background colors
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  backgroundAccent: string

  // Surface colors
  surface: string
  surfaceSecondary: string
  surfaceTertiary: string

  // Text colors
  text: string
  textSecondary: string
  textTertiary: string
  textInverse: string

  // Border colors
  border: string
  borderLight: string
  borderDark: string

  // Status colors
  success: string
  successLight: string
  successDark: string

  warning: string
  warningLight: string
  warningDark: string

  error: string
  errorLight: string
  errorDark: string

  info: string
  infoLight: string
  infoDark: string

  // Special colors
  accent: string
  accentLight: string
  accentDark: string

  // Gradients
  gradientPrimary: string
  gradientSecondary: string
  gradientAccent: string
}

export interface ThemeTypography {
  fontFamily: string
  fontSize: {
    xs: string
    sm: string
    base: string
    lg: string
    xl: string
    '2xl': string
    '3xl': string
    '4xl': string
    '5xl': string
  }
  fontWeight: {
    light: string
    normal: string
    medium: string
    semibold: string
    bold: string
  }
  lineHeight: {
    tight: string
    normal: string
    relaxed: string
    loose: string
  }
}

export interface ThemeSpacing {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
}

export interface ThemeBorderRadius {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  full: string
}

export interface ThemeShadows {
  none: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  inner: string
}

export interface ThemeAnimations {
  duration: {
    fast: string
    normal: string
    slow: string
  }
  easing: {
    linear: string
    in: string
    out: string
    inOut: string
    bounce: string
  }
}

export interface ThemeBreakpoints {
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
}

export interface ThemeConfig {
  name: string
  description: string
  version: string
  author: string
  colors: ThemeColors
  typography: ThemeTypography
  spacing: ThemeSpacing
  borderRadius: ThemeBorderRadius
  shadows: ThemeShadows
  animations: ThemeAnimations
  breakpoints: ThemeBreakpoints
  customCSS?: string
  metadata?: Record<string, any>
}

// Predefined themes
export const predefinedThemes: Record<string, ThemeConfig> = {
  default: {
    name: 'Default',
    description: 'The default theme with modern design',
    version: '1.0.0',
    author: 'The Sunday Traveller',
    colors: {
      // Primary colors (Orange/Pink gradient theme)
      primary: '#f97316',
      primaryHover: '#ea580c',
      primaryLight: '#fed7aa',
      primaryDark: '#c2410c',

      // Secondary colors (Blue theme)
      secondary: '#3b82f6',
      secondaryHover: '#2563eb',
      secondaryLight: '#dbeafe',
      secondaryDark: '#1d4ed8',

      // Background colors
      background: '#ffffff',
      backgroundSecondary: '#f8fafc',
      backgroundTertiary: '#f1f5f9',
      backgroundAccent: '#fef3c7',

      // Surface colors
      surface: '#ffffff',
      surfaceSecondary: '#f8fafc',
      surfaceTertiary: '#e2e8f0',

      // Text colors
      text: '#1e293b',
      textSecondary: '#64748b',
      textTertiary: '#94a3b8',
      textInverse: '#ffffff',

      // Border colors
      border: '#e2e8f0',
      borderLight: '#f1f5f9',
      borderDark: '#cbd5e1',

      // Status colors
      success: '#10b981',
      successLight: '#d1fae5',
      successDark: '#047857',

      warning: '#f59e0b',
      warningLight: '#fef3c7',
      warningDark: '#d97706',

      error: '#ef4444',
      errorLight: '#fecaca',
      errorDark: '#dc2626',

      info: '#3b82f6',
      infoLight: '#dbeafe',
      infoDark: '#1d4ed8',

      // Special colors
      accent: '#8b5cf6',
      accentLight: '#e9d5ff',
      accentDark: '#7c3aed',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
      gradientSecondary: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      gradientAccent: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)'
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem',
      '5xl': '8rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
    },
    animations: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
      },
      easing: {
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  },

  minimal: {
    name: 'Minimal',
    description: 'Clean and minimal theme',
    version: '1.0.0',
    author: 'The Sunday Traveller',
    colors: {
      // Primary colors (Monochrome theme)
      primary: '#000000',
      primaryHover: '#333333',
      primaryLight: '#f5f5f5',
      primaryDark: '#000000',

      // Secondary colors (Gray theme)
      secondary: '#6b7280',
      secondaryHover: '#4b5563',
      secondaryLight: '#f9fafb',
      secondaryDark: '#374151',

      // Background colors
      background: '#ffffff',
      backgroundSecondary: '#ffffff',
      backgroundTertiary: '#f9fafb',
      backgroundAccent: '#f9fafb',

      // Surface colors
      surface: '#ffffff',
      surfaceSecondary: '#f9fafb',
      surfaceTertiary: '#f3f4f6',

      // Text colors
      text: '#111827',
      textSecondary: '#6b7280',
      textTertiary: '#9ca3af',
      textInverse: '#ffffff',

      // Border colors
      border: '#e5e7eb',
      borderLight: '#f3f4f6',
      borderDark: '#d1d5db',

      // Status colors
      success: '#059669',
      successLight: '#ecfdf5',
      successDark: '#047857',

      warning: '#d97706',
      warningLight: '#fffbeb',
      warningDark: '#b45309',

      error: '#dc2626',
      errorLight: '#fef2f2',
      errorDark: '#991b1b',

      info: '#2563eb',
      infoLight: '#eff6ff',
      infoDark: '#1d4ed8',

      // Special colors
      accent: '#000000',
      accentLight: '#f5f5f5',
      accentDark: '#000000',

      // Gradients
      gradientPrimary: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
      gradientSecondary: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
      gradientAccent: 'linear-gradient(135deg, #000000 0%, #6b7280 100%)'
    },
    typography: {
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem'
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2'
      }
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
      '3xl': '4rem',
      '4xl': '6rem',
      '5xl': '8rem'
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    shadows: {
      none: 'none',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
    },
    animations: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms'
      },
      easing: {
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    }
  }
}

export class ThemeManager {
  private static currentTheme: ThemeConfig = predefinedThemes.default
  private static customThemes: Map<string, ThemeConfig> = new Map()
  private static themeChangeListeners: ((theme: ThemeConfig) => void)[] = []

  static getCurrentTheme(): ThemeConfig {
    return this.currentTheme
  }

  static setTheme(themeName: string): boolean {
    const theme = predefinedThemes[themeName] || this.customThemes.get(themeName)

    if (theme) {
      this.currentTheme = theme
      this.applyTheme(theme)
      this.notifyListeners(theme)
      this.saveTheme(themeName)
      return true
    }

    return false
  }

  static createCustomTheme(name: string, baseTheme: string = 'default', overrides: Partial<ThemeConfig>): ThemeConfig {
    const base = predefinedThemes[baseTheme] || predefinedThemes.default
    const customTheme: ThemeConfig = {
      ...base,
      name,
      description: `Custom theme based on ${base.name}`,
      version: '1.0.0',
      author: 'Custom',
      ...overrides
    }

    this.customThemes.set(name, customTheme)
    this.saveCustomThemes()
    return customTheme
  }

  static deleteCustomTheme(name: string): boolean {
    if (this.customThemes.has(name)) {
      this.customThemes.delete(name)
      this.saveCustomThemes()
      return true
    }
    return false
  }

  static getAvailableThemes(): { name: string; config: ThemeConfig; isCustom: boolean }[] {
    const themes = Object.entries(predefinedThemes).map(([name, config]) => ({
      name,
      config,
      isCustom: false
    }))

    const customThemes = Array.from(this.customThemes.entries()).map(([name, config]) => ({
      name,
      config,
      isCustom: true
    }))

    return [...themes, ...customThemes]
  }

  static applyTheme(theme: ThemeConfig): void {
    const root = document.documentElement

    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    // Apply typography
    root.style.setProperty('--font-family', theme.typography.fontFamily)
    Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value)
    })
    Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
      root.style.setProperty(`--font-weight-${key}`, value)
    })
    Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
      root.style.setProperty(`--line-height-${key}`, value)
    })

    // Apply spacing
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })

    // Apply border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value)
    })

    // Apply shadows
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })

    // Apply animations
    Object.entries(theme.animations.duration).forEach(([key, value]) => {
      root.style.setProperty(`--duration-${key}`, value)
    })
    Object.entries(theme.animations.easing).forEach(([key, value]) => {
      root.style.setProperty(`--easing-${key}`, value)
    })

    // Apply breakpoints
    Object.entries(theme.breakpoints).forEach(([key, value]) => {
      root.style.setProperty(`--breakpoint-${key}`, value)
    })

    // Apply custom CSS
    if (theme.customCSS) {
      const existingStyle = document.getElementById('custom-theme-styles')
      if (existingStyle) {
        existingStyle.remove()
      }

      const style = document.createElement('style')
      style.id = 'custom-theme-styles'
      style.textContent = theme.customCSS
      document.head.appendChild(style)
    }
  }

  static addChangeListener(listener: (theme: ThemeConfig) => void): void {
    this.themeChangeListeners.push(listener)
  }

  static removeChangeListener(listener: (theme: ThemeConfig) => void): void {
    const index = this.themeChangeListeners.indexOf(listener)
    if (index > -1) {
      this.themeChangeListeners.splice(index, 1)
    }
  }

  private static notifyListeners(theme: ThemeConfig): void {
    this.themeChangeListeners.forEach(listener => {
      try {
        listener(theme)
      } catch (error) {
        console.error('Theme change listener error:', error)
      }
    })
  }

  private static saveTheme(themeName: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selected-theme', themeName)
    }
  }

  private static loadSavedTheme(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selected-theme') || 'default'
    }
    return 'default'
  }

  private static saveCustomThemes(): void {
    if (typeof window !== 'undefined') {
      const themes = Object.fromEntries(this.customThemes)
      localStorage.setItem('custom-themes', JSON.stringify(themes))
    }
  }

  private static loadCustomThemes(): void {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('custom-themes')
        if (saved) {
          const themes = JSON.parse(saved)
          this.customThemes = new Map(Object.entries(themes))
        }
      } catch (error) {
        console.error('Failed to load custom themes:', error)
      }
    }
  }

  static initialize(): void {
    // Load custom themes
    this.loadCustomThemes()

    // Load saved theme
    const savedTheme = this.loadSavedTheme()
    const theme = predefinedThemes[savedTheme] || this.customThemes.get(savedTheme) || predefinedThemes.default

    this.currentTheme = theme
    this.applyTheme(theme)
  }
}

// Initialize theme system
if (typeof window !== 'undefined') {
  ThemeManager.initialize()
}