import { useMemo } from 'react'
import { getDSIColor } from '@/lib/utils'

interface DSIGaugeProps {
  value: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export default function DSIGauge({
  value,
  size = 'lg',
  showLabel = true,
  animated = true
}: DSIGaugeProps) {
  const sizeMap = {
    sm: { width: 120, stroke: 8, fontSize: 24 },
    md: { width: 180, stroke: 12, fontSize: 32 },
    lg: { width: 240, stroke: 16, fontSize: 48 },
  }

  const { width, stroke, fontSize } = sizeMap[size]
  const radius = (width - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference

  const color = getDSIColor(value)

  const label = useMemo(() => {
    if (value >= 95) return 'Excellent'
    if (value >= 90) return 'Good'
    if (value >= 70) return 'Warning'
    return 'Critical'
  }, [value])

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: width }}>
        {/* Background Circle */}
        <svg
          className="transform -rotate-90"
          width={width}
          height={width}
        >
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            fill="none"
            className="text-neutral-200 dark:text-neutral-700"
          />
          {/* Progress Circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={animated ? 'transition-all duration-1000 ease-out' : ''}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="font-bold animate-count-up"
            style={{ fontSize, color }}
          >
            {value.toFixed(1)}
          </div>
          <div className="text-sm text-neutral-text-secondary dark:text-neutral-400 font-medium">
            DSI Score
          </div>
        </div>
      </div>

      {showLabel && (
        <div className="mt-4 text-center">
          <div
            className="text-sm font-semibold px-3 py-1 rounded-full inline-block"
            style={{
              backgroundColor: `${color}20`,
              color: color,
            }}
          >
            {label}
          </div>
        </div>
      )}
    </div>
  )
}
