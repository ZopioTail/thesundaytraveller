'use client'

import { ReactNode, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

// Calendar Types
export interface CalendarEvent {
  id: string
  title: string
  description?: string
  start: Date
  end: Date
  allDay?: boolean
  color?: string
  category?: string
  location?: string
  attendees?: string[]
  metadata?: Record<string, any>
}

export interface CalendarDay {
  date: Date
  events: CalendarEvent[]
  isCurrentMonth: boolean
  isToday: boolean
  isSelected?: boolean
}

interface CalendarProps {
  events?: CalendarEvent[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  onEventCreate?: (date: Date) => void
  view?: 'month' | 'week' | 'day'
  className?: string
  showHeader?: boolean
  showWeekNumbers?: boolean
  locale?: string
  timeZone?: string
}

// Color Palette for Events
const EVENT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
]

// Utility Functions
function formatDate(date: Date, locale = 'en-US'): string {
  return date.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function formatTime(date: Date, locale = 'en-US'): string {
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  const days: Date[] = []

  // Add days from previous month to fill the first week
  const firstDayOfWeek = firstDay.getDay()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month, -i)
    days.push(prevDate)
  }

  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }

  // Add days from next month to fill the last week
  const remainingDays = 42 - days.length // 6 weeks * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    days.push(new Date(year, month + 1, day))
  }

  return days
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getDate() === date2.getDate() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getFullYear() === date2.getFullYear()
}

function getEventsForDate(events: CalendarEvent[], date: Date): CalendarEvent[] {
  return events.filter(event => {
    const eventStart = new Date(event.start)
    const eventEnd = new Date(event.end)

    return date >= eventStart && date <= eventEnd
  })
}

// Event Component
interface EventProps {
  event: CalendarEvent
  onClick?: (event: CalendarEvent) => void
  className?: string
}

function Event({ event, onClick, className = '' }: EventProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={cn(
        'px-2 py-1 rounded text-xs font-medium cursor-pointer overflow-hidden',
        'border-l-4 transition-all duration-200',
        className
      )}
      style={{
        backgroundColor: event.color ? `${event.color}20` : '#E5E7EB',
        borderLeftColor: event.color || '#6B7280',
        color: event.color || '#374151'
      }}
      onClick={() => onClick?.(event)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="truncate font-medium">{event.title}</div>
      {!event.allDay && (
        <div className="text-xs opacity-75">
          {formatTime(event.start)} - {formatTime(event.end)}
        </div>
      )}
      {event.location && (
        <div className="text-xs opacity-75 flex items-center">
          <MapPinIcon className="w-3 h-3 mr-1" />
          {event.location}
        </div>
      )}
    </motion.div>
  )
}

// Day Component
interface DayProps {
  day: CalendarDay
  events: CalendarEvent[]
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  maxEvents?: number
}

function Day({ day, events, onDateSelect, onEventClick, maxEvents = 3 }: DayProps) {
  const dayEvents = events.slice(0, maxEvents)
  const remainingEvents = events.length - maxEvents

  return (
    <div
      className={cn(
        'min-h-[120px] p-2 border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-200',
        day.isCurrentMonth
          ? 'bg-white dark:bg-gray-900'
          : 'bg-gray-50 dark:bg-gray-800/50',
        day.isToday && 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
        day.isSelected && 'ring-2 ring-orange-500'
      )}
      onClick={() => onDateSelect?.(day.date)}
    >
      <div className={cn(
        'text-sm font-medium mb-2',
        day.isToday ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'
      )}>
        {day.date.getDate()}
      </div>

      <div className="space-y-1">
        {dayEvents.map((event) => (
          <Event
            key={event.id}
            event={event}
            onClick={(event) => onEventClick?.(event)}
          />
        ))}

        {remainingEvents > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
            +{remainingEvents} more
          </div>
        )}
      </div>
    </div>
  )
}

// Month View Component
function MonthView({
  currentDate,
  events,
  selectedDate,
  onDateSelect,
  onEventClick,
  showWeekNumbers = false
}: {
  currentDate: Date
  events: CalendarEvent[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
  showWeekNumbers?: boolean
}) {
  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate)

    return daysInMonth.map(date => ({
      date,
      events: getEventsForDate(events, date),
      isCurrentMonth: date.getMonth() === currentDate.getMonth(),
      isToday: isSameDay(date, new Date()),
      isSelected: selectedDate ? isSameDay(date, selectedDate) : false
    }))
  }, [currentDate, events, selectedDate])

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="grid grid-cols-7 gap-0">
      {/* Week day headers */}
      {weekDays.map((day) => (
        <div
          key={day}
          className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
        >
          {day}
        </div>
      ))}

      {/* Days */}
      {days.map((day, index) => (
        <Day
          key={day.date.toISOString()}
          day={day}
          events={day.events}
          onDateSelect={onDateSelect}
          onEventClick={onEventClick}
        />
      ))}
    </div>
  )
}

// Week View Component
function WeekView({
  currentDate,
  events,
  selectedDate,
  onDateSelect,
  onEventClick
}: {
  currentDate: Date
  events: CalendarEvent[]
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
  onEventClick?: (event: CalendarEvent) => void
}) {
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    return date
  })

  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="flex">
      {/* Time column */}
      <div className="w-16 border-r border-gray-200 dark:border-gray-700">
        <div className="h-12 border-b border-gray-200 dark:border-gray-700" />
        {hours.map((hour) => (
          <div
            key={hour}
            className="h-12 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-right pr-2"
          >
            {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="flex-1 grid grid-cols-7">
        {weekDays.map((date) => (
          <div key={date.toISOString()} className="border-r border-gray-200 dark:border-gray-700">
            {/* Day header */}
            <div className="h-12 border-b border-gray-200 dark:border-gray-700 p-2 text-sm font-medium">
              <div>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
              <div className={cn(
                'text-lg',
                isSameDay(date, new Date()) && 'text-orange-600 dark:text-orange-400'
              )}>
                {date.getDate()}
              </div>
            </div>

            {/* Hours */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-12 border-b border-gray-200 dark:border-gray-700 relative"
              >
                {/* Events for this hour */}
                {events
                  .filter(event => {
                    const eventDate = new Date(event.start)
                    return isSameDay(eventDate, date) && eventDate.getHours() === hour
                  })
                  .map((event) => (
                    <Event
                      key={event.id}
                      event={event}
                      onClick={onEventClick}
                      className="absolute inset-x-1 top-1"
                    />
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Main Calendar Component
export function Calendar({
  events = [],
  selectedDate,
  onDateSelect,
  onEventClick,
  onEventCreate,
  view = 'month',
  className = '',
  showHeader = true,
  showWeekNumbers = false,
  locale = 'en-US'
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate || new Date())

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    }
    setCurrentDate(newDate)
  }

  const navigateToday = () => {
    setCurrentDate(new Date())
  }

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date)
    onDateSelect?.(date)
  }

  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700', className)}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {view === 'month' && currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
              {view === 'week' && 'Week View'}
              {view === 'day' && formatDate(currentDate, locale)}
            </h2>
            <button
              onClick={navigateToday}
              className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200"
            >
              Today
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Calendar Content */}
      <div className="p-4">
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onEventClick={onEventClick}
            showWeekNumbers={showWeekNumbers}
          />
        )}

        {view === 'week' && (
          <WeekView
            currentDate={currentDate}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onEventClick={onEventClick}
          />
        )}

        {view === 'day' && (
          <div className="space-y-4">
            <div className="text-center p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {formatDate(currentDate, locale)}
              </h3>
            </div>

            <div className="space-y-2">
              {events
                .filter(event => isSameDay(new Date(event.start), currentDate))
                .map((event) => (
                  <Event
                    key={event.id}
                    event={event}
                    onClick={onEventClick}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Event Creation Button */}
      {onEventCreate && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onEventCreate(currentDate)}
            className="w-full flex items-center justify-center space-x-2 p-3 text-sm font-medium text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-200"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      )}
    </div>
  )
}

// Event Modal Component
interface EventModalProps {
  event: CalendarEvent | null
  isOpen: boolean
  onClose: () => void
  onSave?: (event: CalendarEvent) => void
  onDelete?: (eventId: string) => void
}

export function EventModal({ event, isOpen, onClose, onSave, onDelete }: EventModalProps) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {event ? 'Edit Event' : 'Create Event'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <ChevronRightIcon className="w-5 h-5 rotate-45" />
              </button>
            </div>

            {event && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <ClockIcon className="w-4 h-4 text-gray-400" />
                    <span>
                      {formatDate(event.start)} {formatTime(event.start)}
                      {event.end && ` - ${formatTime(event.end)}`}
                    </span>
                  </div>

                  {event.location && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPinIcon className="w-4 h-4 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                  )}

                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span>{event.attendees.length} attendees</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 pt-4">
                  {onSave && (
                    <button
                      onClick={() => onSave(event)}
                      className="flex-1 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors duration-200"
                    >
                      Save Changes
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(event.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}