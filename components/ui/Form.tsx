'use client'

import { ReactNode, useState, createContext, useContext, FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExclamationCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// Form Context
interface FormContextType {
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  setValue: (name: string, value: any) => void
  setError: (name: string, error: string) => void
  setTouched: (name: string, touched: boolean) => void
  validateField: (name: string, value: any) => string | null
}

const FormContext = createContext<FormContextType | undefined>(undefined)

// Form Types
export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any) => string | null
  email?: boolean
  url?: boolean
  number?: boolean
  min?: number
  max?: number
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file'
  placeholder?: string
  validation?: FieldValidation
  options?: Array<{ label: string; value: any }>
  multiple?: boolean
  accept?: string
  required?: boolean
  disabled?: boolean
  className?: string
  description?: string
  prefix?: string
  suffix?: string
}

interface FormProps {
  fields: FormField[]
  onSubmit: (values: Record<string, any>) => void | Promise<void>
  initialValues?: Record<string, any>
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit'
  className?: string
  children?: ReactNode
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  loading?: boolean
  layout?: 'vertical' | 'horizontal' | 'grid'
  columns?: 1 | 2 | 3 | 4
}

// Form Component
export function Form({
  fields,
  onSubmit,
  initialValues = {},
  validationMode = 'onBlur',
  className = '',
  children,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  onCancel,
  loading = false,
  layout = 'vertical',
  columns = 1
}: FormProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = (name: string, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))

    if (validationMode === 'onChange') {
      const field = fields.find(f => f.name === name)
      if (field) {
        const error = validateField(name, value)
        setErrors(prev => ({ ...prev, [name]: error || '' }))
      }
    }
  }

  const setError = (name: string, error: string) => {
    setErrors(prev => ({ ...prev, [name]: error }))
  }

  const setTouched = (name: string, touched: boolean) => {
    setTouchedFields(prev => ({ ...prev, [name]: touched }))

    if (validationMode === 'onBlur' && touched) {
      const field = fields.find(f => f.name === name)
      if (field) {
        const error = validateField(name, values[name])
        setErrors(prev => ({ ...prev, [name]: error || '' }))
      }
    }
  }

  const validateField = (name: string, value: any): string | null => {
    const field = fields.find(f => f.name === name)
    if (!field?.validation) return null

    const validation = field.validation

    // Required validation
    if (validation.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && !value.trim())) {
      return null
    }

    // Email validation
    if (validation.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address'
    }

    // URL validation
    if (validation.url && !/^https?:\/\/.+/.test(value)) {
      return 'Please enter a valid URL starting with http:// or https://'
    }

    // Number validation
    if (validation.number && isNaN(Number(value))) {
      return 'Please enter a valid number'
    }

    // Min/Max validation
    if (validation.min !== undefined && Number(value) < validation.min) {
      return `${field.label} must be at least ${validation.min}`
    }

    if (validation.max !== undefined && Number(value) > validation.max) {
      return `${field.label} must be at most ${validation.max}`
    }

    // Min/Max length validation
    if (validation.minLength && value.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      return `${field.label} must be at most ${validation.maxLength} characters`
    }

    // Pattern validation
    if (validation.pattern && !validation.pattern.test(value)) {
      return `${field.label} format is invalid`
    }

    // Custom validation
    if (validation.custom) {
      return validation.custom(value)
    }

    return null
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    fields.forEach(field => {
      const error = validateField(field.name, values[field.name])
      if (error) {
        newErrors[field.name] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (validationMode === 'onSubmit') {
      if (!validateForm()) return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const contextValue: FormContextType = {
    values,
    errors,
    touched: touchedFields,
    setValue,
    setError,
    setTouched,
    validateField
  }

  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'space-y-6'
      case 'grid':
        return `grid gap-6 ${columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-1 md:grid-cols-2' : columns === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`
      default:
        return 'space-y-6'
    }
  }

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
        <div className={getLayoutClasses()}>
          {fields.map((field) => (
            <FormFieldComponent key={field.name} field={field} />
          ))}
        </div>

        {children}

        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {cancelLabel}
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
          >
            {isSubmitting && (
              <motion.div
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
            <span>{isSubmitting ? 'Submitting...' : submitLabel}</span>
          </button>
        </div>
      </form>
    </FormContext.Provider>
  )
}

// Form Field Component
interface FormFieldComponentProps {
  field: FormField
}

function FormFieldComponent({ field }: FormFieldComponentProps) {
  const context = useContext(FormContext)
  if (!context) throw new Error('FormField must be used within Form')

  const { values, errors, touched, setValue, setTouched } = context
  const value = values[field.name] || ''
  const error = errors[field.name] || ''
  const isTouched = touched[field.name] || false
  const showError = isTouched && error

  const handleChange = (newValue: any) => {
    setValue(field.name, newValue)
  }

  const handleBlur = () => {
    setTouched(field.name, true)
  }

  const renderInput = () => {
    const baseProps = {
      id: field.name,
      name: field.name,
      value: value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => handleChange(e.target.value),
      onBlur: handleBlur,
      disabled: field.disabled,
      className: cn(
        'block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm',
        'focus:border-orange-500 focus:ring-orange-500',
        'disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
        showError && 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500',
        field.className
      ),
      'aria-describedby': showError ? `${field.name}-error` : undefined,
      'aria-invalid': showError ? true : undefined
    }

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...baseProps}
            placeholder={field.placeholder}
            rows={4}
            className={cn(baseProps.className, 'resize-y')}
          />
        )

      case 'select':
        return (
          <select {...baseProps} className={cn(baseProps.className, 'cursor-pointer')}>
            <option value="">{field.placeholder || `Select ${field.label.toLowerCase()}...`}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              id={field.name}
              checked={Boolean(value)}
              onChange={(e) => handleChange(e.target.checked)}
              onBlur={handleBlur}
              disabled={field.disabled}
              className={cn(
                'h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                showError && 'border-red-300 focus:border-red-500 focus:ring-red-500'
              )}
            />
            <label htmlFor={field.name} className="ml-2 block text-sm text-gray-900 dark:text-white">
              {field.label}
            </label>
          </div>
        )

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  disabled={field.disabled}
                  className={cn(
                    'h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    showError && 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  )}
                />
                <label htmlFor={`${field.name}-${option.value}`} className="ml-2 block text-sm text-gray-900 dark:text-white">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )

      case 'file':
        return (
          <div className="space-y-2">
            <input
              type="file"
              id={field.name}
              name={field.name}
              onChange={(e) => handleChange(e.target.files)}
              onBlur={handleBlur}
              disabled={field.disabled}
              accept={field.accept}
              multiple={field.multiple}
              className={cn(
                'block w-full text-sm text-gray-500 dark:text-gray-400',
                'file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0',
                'file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700',
                'hover:file:bg-orange-100',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                showError && 'file:border-red-300 file:text-red-700'
              )}
            />
            {field.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{field.description}</p>
            )}
          </div>
        )

      case 'password':
        return (
          <div className="relative">
            <input
              type="password"
              {...baseProps}
              placeholder={field.placeholder}
              className={cn(baseProps.className, 'pr-10')}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => {
                const input = document.getElementById(field.name) as HTMLInputElement
                if (input) {
                  input.type = input.type === 'password' ? 'text' : 'password'
                }
              }}
            >
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )

      default:
        return (
          <div className="relative">
            {field.prefix && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{field.prefix}</span>
              </div>
            )}
            <input
              type={field.type}
              {...baseProps}
              placeholder={field.placeholder}
              className={cn(
                baseProps.className,
                field.prefix && 'pl-8',
                field.suffix && 'pr-8'
              )}
            />
            {field.suffix && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{field.suffix}</span>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className={cn(
      'space-y-2',
      field.type === 'checkbox' || field.type === 'radio' ? 'flex flex-col' : ''
    )}>
      <label
        htmlFor={field.name}
        className={cn(
          'block text-sm font-medium',
          field.type === 'checkbox' ? 'sr-only' : 'text-gray-700 dark:text-gray-300'
        )}
      >
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderInput()}

      {field.description && !showError && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{field.description}</p>
      )}

      <AnimatePresence>
        {showError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400"
            id={`${field.name}-error`}
          >
            <ExclamationCircleIcon className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Form Section Component
interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function FormSection({ title, description, children, className = '' }: FormSectionProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Form Actions Component
interface FormActionsProps {
  children: ReactNode
  className?: string
}

export function FormActions({ children, className = '' }: FormActionsProps) {
  return (
    <div className={cn('flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700', className)}>
      {children}
    </div>
  )
}