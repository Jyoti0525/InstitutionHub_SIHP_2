import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { getDSIColor } from '@/lib/utils'

interface CategoryCardProps {
  name: string
  score: number
  weight: number
  trend?: number
  onClick?: () => void
}

export default function CategoryCard({
  name,
  score,
  weight,
  trend,
  onClick
}: CategoryCardProps) {
  const color = getDSIColor(score)

  return (
    <Card
      className="card-hover cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium text-neutral-text-secondary dark:text-neutral-400 flex-1">
            {name}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {weight}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold" style={{ color }}>
                {score.toFixed(1)}
              </div>
              <div className="text-xs text-neutral-text-muted dark:text-neutral-500">
                out of 100
              </div>
            </div>
            {trend !== undefined && (
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-neutral-text-secondary'
                }`}
              >
                {trend > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : trend < 0 ? (
                  <ArrowDownRight className="w-4 h-4" />
                ) : null}
                <span>{Math.abs(trend).toFixed(1)}%</span>
              </div>
            )}
          </div>
          <Progress
            value={score}
            className="h-2"
            style={
              {
                '--progress-background': color,
              } as React.CSSProperties
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
