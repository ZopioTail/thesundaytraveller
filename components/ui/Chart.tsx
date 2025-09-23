'use client'

import { ReactNode, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Chart Types
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
  metadata?: Record<string, any>
}

export interface ChartOptions {
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  colors?: string[]
  showLegend?: boolean
  showTooltip?: boolean
  showGrid?: boolean
  animate?: boolean
  responsive?: boolean
}

interface BaseChartProps {
  data: ChartDataPoint[]
  options?: ChartOptions
  className?: string
}

// Color Palette
const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
]

// Tooltip Component
interface TooltipProps {
  content: ReactNode
  x: number
  y: number
  visible: boolean
}

function Tooltip({ content, x, y, visible }: TooltipProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute z-50 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-2 rounded-lg shadow-lg pointer-events-none text-sm"
          style={{ left: x, top: y, transform: 'translate(-50%, -100%)' }}
        >
          {content}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Bar Chart Component
export function BarChart({ data, options = {}, className = '' }: BaseChartProps) {
  const [tooltip, setTooltip] = useState<{ content: ReactNode; x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const {
    width = 600,
    height = 400,
    margin = { top: 20, right: 20, bottom: 60, left: 60 },
    colors = DEFAULT_COLORS,
    showLegend = true,
    showTooltip = true,
    showGrid = true,
    animate = true
  } = options

  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  const maxValue = Math.max(...data.map(d => d.value))
  const barWidth = (chartWidth / data.length) * 0.8
  const barSpacing = chartWidth / data.length * 0.2

  const handleMouseEnter = (event: React.MouseEvent, point: ChartDataPoint, index: number) => {
    if (!showTooltip) return

    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setTooltip({
        content: (
          <div>
            <div className="font-medium">{point.label}</div>
            <div className="text-orange-400">{point.value.toLocaleString()}</div>
            {point.metadata && Object.entries(point.metadata).map(([key, value]) => (
              <div key={key} className="text-xs opacity-80">
                {key}: {value}
              </div>
            ))}
          </div>
        ),
        x,
        y
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid */}
          {showGrid && (
            <g className="grid opacity-20">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <g key={ratio}>
                  <line
                    x1={0}
                    y1={chartHeight * (1 - ratio)}
                    x2={chartWidth}
                    y2={chartHeight * (1 - ratio)}
                    stroke="currentColor"
                    strokeWidth={0.5}
                  />
                  <text
                    x={-10}
                    y={chartHeight * (1 - ratio)}
                    textAnchor="end"
                    dominantBaseline="middle"
                    className="text-xs fill-current"
                  >
                    {Math.round(maxValue * ratio)}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* Bars */}
          {data.map((point, index) => {
            const barHeight = (point.value / maxValue) * chartHeight
            const x = index * (barWidth + barSpacing) + barSpacing / 2
            const y = chartHeight - barHeight

            return (
              <motion.rect
                key={point.label}
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={point.color || colors[index % colors.length]}
                initial={animate ? { height: 0, y: chartHeight } : {}}
                animate={animate ? { height: barHeight, y } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={(e) => handleMouseEnter(e, point, index)}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            )
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = index * (barWidth + barSpacing) + barWidth / 2 + barSpacing / 2
            return (
              <text
                key={point.label}
                x={x}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-current"
              >
                {point.label}
              </text>
            )
          })}
        </g>
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {data.map((point, index) => (
            <div key={point.label} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: point.color || colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">{point.label}</span>
            </div>
          ))}
        </div>
      )}

      <Tooltip
        content={tooltip?.content || null}
        x={tooltip?.x || 0}
        y={tooltip?.y || 0}
        visible={!!tooltip}
      />
    </div>
  )
}

// Line Chart Component
export function LineChart({ data, options = {}, className = '' }: BaseChartProps) {
  const [tooltip, setTooltip] = useState<{ content: ReactNode; x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const {
    width = 600,
    height = 400,
    margin = { top: 20, right: 20, bottom: 60, left: 60 },
    colors = DEFAULT_COLORS,
    showLegend = true,
    showTooltip = true,
    showGrid = true,
    animate = true
  } = options

  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))

  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth
  const yScale = (value: number) => chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight

  const linePath = data.map((point, index) => {
    const x = xScale(index)
    const y = yScale(point.value)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const handleMouseEnter = (event: React.MouseEvent, point: ChartDataPoint, index: number) => {
    if (!showTooltip) return

    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setTooltip({
        content: (
          <div>
            <div className="font-medium">{point.label}</div>
            <div className="text-orange-400">{point.value.toLocaleString()}</div>
          </div>
        ),
        x,
        y
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid */}
          {showGrid && (
            <g className="grid opacity-20">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = chartHeight * (1 - ratio)
                return (
                  <g key={ratio}>
                    <line
                      x1={0}
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="currentColor"
                      strokeWidth={0.5}
                    />
                    <text
                      x={-10}
                      y={y}
                      textAnchor="end"
                      dominantBaseline="middle"
                      className="text-xs fill-current"
                    >
                      {Math.round(minValue + (maxValue - minValue) * ratio)}
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={colors[0]}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animate ? { pathLength: 0, opacity: 0 } : {}}
            animate={animate ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = xScale(index)
            const y = yScale(point.value)

            return (
              <motion.circle
                key={point.label}
                cx={x}
                cy={y}
                r={6}
                fill={colors[0]}
                stroke="white"
                strokeWidth={2}
                initial={animate ? { scale: 0, opacity: 0 } : {}}
                animate={animate ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onMouseEnter={(e) => handleMouseEnter(e, point, index)}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer hover:scale-125 transition-transform"
              />
            )
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = xScale(index)
            return (
              <text
                key={point.label}
                x={x}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-current"
              >
                {point.label}
              </text>
            )
          })}
        </g>
      </svg>

      <Tooltip
        content={tooltip?.content || null}
        x={tooltip?.x || 0}
        y={tooltip?.y || 0}
        visible={!!tooltip}
      />
    </div>
  )
}

// Pie Chart Component
export function PieChart({ data, options = {}, className = '' }: BaseChartProps) {
  const [tooltip, setTooltip] = useState<{ content: ReactNode; x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const {
    width = 400,
    height = 400,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
    colors = DEFAULT_COLORS,
    showLegend = true,
    showTooltip = true,
    animate = true
  } = options

  const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right, margin.bottom, margin.left)
  const centerX = width / 2
  const centerY = height / 2

  const total = data.reduce((sum, d) => sum + d.value, 0)
  let currentAngle = -Math.PI / 2 // Start from top

  const handleMouseEnter = (event: React.MouseEvent, point: ChartDataPoint, path: string) => {
    if (!showTooltip) return

    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setTooltip({
        content: (
          <div>
            <div className="font-medium">{point.label}</div>
            <div className="text-orange-400">{point.value.toLocaleString()} ({((point.value / total) * 100).toFixed(1)}%)</div>
          </div>
        ),
        x,
        y
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      >
        <g transform={`translate(${centerX}, ${centerY})`}>
          {data.map((point, index) => {
            const angle = (point.value / total) * 2 * Math.PI
            const endAngle = currentAngle + angle

            const largeArcFlag = angle > Math.PI ? 1 : 0

            const startX = Math.cos(currentAngle) * radius
            const startY = Math.sin(currentAngle) * radius
            const endX = Math.cos(endAngle) * radius
            const endY = Math.sin(endAngle) * radius

            const pathData = [
              `M 0 0`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ')

            const color = point.color || colors[index % colors.length]

            currentAngle = endAngle

            return (
              <motion.path
                key={point.label}
                d={pathData}
                fill={color}
                initial={animate ? { scale: 0 } : {}}
                animate={animate ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={(e) => handleMouseEnter(e, point, pathData)}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            )
          })}
        </g>
      </svg>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 mt-4 justify-center">
          {data.map((point, index) => (
            <div key={point.label} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded"
                style={{ backgroundColor: point.color || colors[index % colors.length] }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {point.label} ({((point.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      )}

      <Tooltip
        content={tooltip?.content || null}
        x={tooltip?.x || 0}
        y={tooltip?.y || 0}
        visible={!!tooltip}
      />
    </div>
  )
}

// Area Chart Component
export function AreaChart({ data, options = {}, className = '' }: BaseChartProps) {
  const [tooltip, setTooltip] = useState<{ content: ReactNode; x: number; y: number } | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const {
    width = 600,
    height = 400,
    margin = { top: 20, right: 20, bottom: 60, left: 60 },
    colors = DEFAULT_COLORS,
    showLegend = true,
    showTooltip = true,
    showGrid = true,
    animate = true
  } = options

  const chartWidth = width - margin.left - margin.right
  const chartHeight = height - margin.top - margin.bottom

  const maxValue = Math.max(...data.map(d => d.value))

  const xScale = (index: number) => (index / (data.length - 1)) * chartWidth
  const yScale = (value: number) => chartHeight - (value / maxValue) * chartHeight

  const linePath = data.map((point, index) => {
    const x = xScale(index)
    const y = yScale(point.value)
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`

  const handleMouseEnter = (event: React.MouseEvent, point: ChartDataPoint, index: number) => {
    if (!showTooltip) return

    const rect = svgRef.current?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setTooltip({
        content: (
          <div>
            <div className="font-medium">{point.label}</div>
            <div className="text-orange-400">{point.value.toLocaleString()}</div>
          </div>
        ),
        x,
        y
      })
    }
  }

  const handleMouseLeave = () => {
    setTooltip(null)
  }

  return (
    <div className={cn('relative', className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="overflow-visible"
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          {/* Grid */}
          {showGrid && (
            <g className="grid opacity-20">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                const y = chartHeight * (1 - ratio)
                return (
                  <g key={ratio}>
                    <line
                      x1={0}
                      y1={y}
                      x2={chartWidth}
                      y2={y}
                      stroke="currentColor"
                      strokeWidth={0.5}
                    />
                    <text
                      x={-10}
                      y={y}
                      textAnchor="end"
                      dominantBaseline="middle"
                      className="text-xs fill-current"
                    >
                      {Math.round(maxValue * ratio)}
                    </text>
                  </g>
                )
              })}
            </g>
          )}

          {/* Area */}
          <motion.path
            d={areaPath}
            fill={colors[0]}
            fillOpacity={0.3}
            stroke={colors[0]}
            strokeWidth={2}
            initial={animate ? { d: `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z` } : {}}
            animate={animate ? { d: areaPath } : {}}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {/* Line */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={colors[0]}
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={animate ? { pathLength: 0, opacity: 0 } : {}}
            animate={animate ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = xScale(index)
            const y = yScale(point.value)

            return (
              <motion.circle
                key={point.label}
                cx={x}
                cy={y}
                r={4}
                fill={colors[0]}
                stroke="white"
                strokeWidth={2}
                initial={animate ? { scale: 0, opacity: 0 } : {}}
                animate={animate ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onMouseEnter={(e) => handleMouseEnter(e, point, index)}
                onMouseLeave={handleMouseLeave}
                className="cursor-pointer hover:scale-125 transition-transform"
              />
            )
          })}

          {/* X-axis labels */}
          {data.map((point, index) => {
            const x = xScale(index)
            return (
              <text
                key={point.label}
                x={x}
                y={chartHeight + 20}
                textAnchor="middle"
                className="text-xs fill-current"
              >
                {point.label}
              </text>
            )
          })}
        </g>
      </svg>

      <Tooltip
        content={tooltip?.content || null}
        x={tooltip?.x || 0}
        y={tooltip?.y || 0}
        visible={!!tooltip}
      />
    </div>
  )
}