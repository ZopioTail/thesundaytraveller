'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { CSRFProtection } from '@/lib/security'

interface CSRFContextType {
  csrfToken: string | null
  refreshToken: () => void
}

const CSRFContext = createContext<CSRFContextType | undefined>(undefined)

export function CSRFProvider({ children }: { children: React.ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null)

  const refreshToken = () => {
    const newToken = CSRFProtection.generateToken()
    setCsrfToken(newToken)

    // Store token in sessionStorage for persistence
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('csrf-token', newToken)
    }
  }

  useEffect(() => {
    // Try to get token from sessionStorage first
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('csrf-token')
      if (storedToken) {
        setCsrfToken(storedToken)
      } else {
        refreshToken()
      }
    }
  }, [])

  return (
    <CSRFContext.Provider value={{ csrfToken, refreshToken }}>
      {children}
    </CSRFContext.Provider>
  )
}

export function useCSRF() {
  const context = useContext(CSRFContext)
  if (context === undefined) {
    throw new Error('useCSRF must be used within a CSRFProvider')
  }
  return context
}

// CSRF Input component for forms
interface CSRFInputProps {
  className?: string
}

export function CSRFInput({ className }: CSRFInputProps) {
  const { csrfToken } = useCSRF()

  if (!csrfToken) {
    return null
  }

  return (
    <input
      type="hidden"
      name="csrf-token"
      value={csrfToken}
      className={className}
    />
  )
}

// CSRF Meta tag for API requests
export function CSRFMeta() {
  const { csrfToken } = useCSRF()

  if (!csrfToken) {
    return null
  }

  return (
    <meta
      name="csrf-token"
      content={csrfToken}
    />
  )
}