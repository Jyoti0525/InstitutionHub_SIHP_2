import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  color?: string
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = '#6366f1'
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null
    if (trend.value > 0) return <TrendingUp className="w-4 h-4" />
    if (trend.value < 0) return <TrendingDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (!trend) return ''
    if (trend.value > 0) return 'text-success'
    if (trend.value < 0) return 'text-error'
    return 'text-neutral-text-secondary'
  }

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
              {title}
            </p>
            <h3 className="text-3xl font-bold mt-2 text-neutral-text-primary dark:text-neutral-100">
              {value}
            </h3>
            {subtitle && (
              <p className="text-xs text-neutral-text-muted dark:text-neutral-500 mt-1">
                {subtitle}
              </p>
            )}
            {trend && (
              <div className={`flex items-center gap-1 mt-2 text-sm ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="font-medium">
                  {Math.abs(trend.value)}% {trend.label}
                </span>
              </div>
            )}
          </div>
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
