'use client'

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// Base Input Component
interface BaseInputProps {
  label?: string
  helperText?: string
  error?: string
  required?: boolean
  className?: string
  containerClassName?: string
  labelClassName?: string
}

type InputProps = BaseInputProps & InputHTMLAttributes<HTMLInputElement>
type TextareaProps = BaseInputProps & TextareaHTMLAttributes<HTMLTextAreaElement>
type SelectProps = BaseInputProps & SelectHTMLAttributes<HTMLSelectElement> & {
  options?: Array<{ value: string; label: string; disabled?: boolean }>
  placeholder?: string
}

// Input Component
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, required, className, containerClassName, labelClassName, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label className={cn(
            'block text-sm font-medium text-gray-700 dark:text-gray-300',
            labelClassName
          )}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
            'dark:bg-gray-700 dark:text-white',
            'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn(
            'text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea Component
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, error, required, className, containerClassName, labelClassName, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label className={cn(
            'block text-sm font-medium text-gray-700 dark:text-gray-300',
            labelClassName
          )}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
            'dark:bg-gray-700 dark:text-white',
            'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
            'resize-vertical min-h-[80px]',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn(
            'text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// Select Component
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, required, options = [], className, containerClassName, labelClassName, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        {label && (
          <label className={cn(
            'block text-sm font-medium text-gray-700 dark:text-gray-300',
            labelClassName
          )}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500',
            'dark:bg-gray-700 dark:text-white',
            'disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        >
          {props.placeholder && (
            <option value="" disabled>
              {props.placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        {(error || helperText) && (
          <p className={cn(
            'text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

// Checkbox Component
interface CheckboxProps extends BaseInputProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  indeterminate?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, error, required, className, containerClassName, checked, onChange, indeterminate, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', containerClassName)}>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            className={cn(
              'h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500',
              'dark:border-gray-600 dark:bg-gray-700',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {label && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </span>
          )}
        </label>
        {(error || helperText) && (
          <p className={cn(
            'text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

// Radio Group Component
interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}

interface RadioGroupProps extends BaseInputProps {
  value?: string
  onChange?: (value: string) => void
  options: RadioOption[]
  orientation?: 'horizontal' | 'vertical'
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ label, helperText, error, required, options, value, onChange, orientation = 'vertical', className, containerClassName, labelClassName }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', containerClassName)}>
        {label && (
          <label className={cn(
            'block text-sm font-medium text-gray-700 dark:text-gray-300',
            labelClassName
          )}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className={cn(
          'space-y-2',
          orientation === 'horizontal' && 'flex flex-row space-y-0 space-x-6'
        )}>
          {options.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange?.(e.target.value)}
                disabled={option.disabled}
                className={cn(
                  'h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500',
                  'dark:border-gray-600 dark:bg-gray-700',
                  error && 'border-red-500 focus:ring-red-500'
                )}
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {option.label}
              </span>
            </label>
          ))}
        </div>
        {(error || helperText) && (
          <p className={cn(
            'text-sm',
            error ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'