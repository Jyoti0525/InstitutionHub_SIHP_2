import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Database,
  Brain,
  Target,
  BarChart3
} from 'lucide-react'

interface Factor {
  name: string
  contribution: number // -100 to +100
  description: string
  value: string | number
}

interface ExplainableInsightProps {
  title: string
  recommendation: string
  impact: string
  priority: 'high' | 'medium' | 'low'
  factors: Factor[]
  comparisonData?: {
    yourValue: number
    benchmark: number
    metric: string
  }
}

export default function ExplainableInsight({
  title,
  recommendation,
  impact,
  priority,
  factors,
  comparisonData
}: ExplainableInsightProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const positiveFactors = factors.filter(f => f.contribution > 0)
  const negativeFactors = factors.filter(f => f.contribution < 0)

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Main Recommendation */}
        <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                priority === 'high' ? 'bg-error/10' : priority === 'medium' ? 'bg-warning/10' : 'bg-success/10'
              }`}>
                <Sparkles className={`w-4 h-4 ${
                  priority === 'high' ? 'text-error' : priority === 'medium' ? 'text-warning' : 'text-success'
                }`} />
              </div>
              <h4 className="font-semibold text-neutral-text-primary dark:text-neutral-100">
                {title}
              </h4>
            </div>
            <Badge variant={priority === 'high' ? 'destructive' : 'default'} className="text-xs">
              {priority.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-neutral-text-secondary dark:text-neutral-300 mb-3">
            {recommendation}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-text-muted">{impact}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-7 text-xs"
            >
              <Info className="w-3 h-3 mr-1" />
              {isExpanded ? 'Hide' : 'Why this suggestion?'}
              {isExpanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
            </Button>
          </div>
        </div>

        {/* Explainable AI Section */}
        {isExpanded && (
          <div className="p-4 border-t border-neutral-border dark:border-neutral-700 bg-neutral-bg-secondary dark:bg-neutral-800 space-y-4">
            {/* AI Analysis Header */}
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Brain className="w-4 h-4 text-primary" />
              </div>
              <h5 className="font-semibold text-sm text-neutral-text-primary dark:text-neutral-100">
                AI Analysis Explanation
              </h5>
            </div>

            {/* Comparison Data if available */}
            {comparisonData && (
              <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-border dark:border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-neutral-text-secondary flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" />
                    {comparisonData.metric}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs text-neutral-text-muted">Your Value</div>
                      <div className="text-lg font-bold text-primary">{comparisonData.yourValue}</div>
                    </div>
                    <div className="w-px h-8 bg-neutral-border dark:bg-neutral-700" />
                    <div className="text-right">
                      <div className="text-xs text-neutral-text-muted">Benchmark</div>
                      <div className="text-lg font-bold text-success">{comparisonData.benchmark}</div>
                    </div>
                  </div>
                </div>
                <div className="h-2 bg-neutral-bg-tertiary dark:bg-neutral-700 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(comparisonData.yourValue / comparisonData.benchmark) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Contributing Factors */}
            <div className="space-y-3">
              <p className="text-xs text-neutral-text-muted flex items-center gap-1">
                <Database className="w-3 h-3" />
                Key factors influencing this recommendation:
              </p>

              {/* Positive Factors */}
              {positiveFactors.length > 0 && (
                <div className="space-y-2">
                  <h6 className="text-xs font-semibold text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Positive Indicators ({positiveFactors.length})
                  </h6>
                  {positiveFactors.map((factor, i) => (
                    <div
                      key={i}
                      className="p-2 bg-success/5 border border-success/20 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-neutral-text-primary dark:text-neutral-100">
                          {factor.name}
                        </span>
                        <Badge variant="default" className="bg-success/10 text-success border-success/20 text-xs h-5">
                          +{factor.contribution}%
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-text-secondary dark:text-neutral-400 mb-1">
                        {factor.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-text-muted">Current value:</span>
                        <span className="text-xs font-semibold text-success">{factor.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Negative Factors */}
              {negativeFactors.length > 0 && (
                <div className="space-y-2">
                  <h6 className="text-xs font-semibold text-error flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Areas for Improvement ({negativeFactors.length})
                  </h6>
                  {negativeFactors.map((factor, i) => (
                    <div
                      key={i}
                      className="p-2 bg-error/5 border border-error/20 rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-neutral-text-primary dark:text-neutral-100">
                          {factor.name}
                        </span>
                        <Badge variant="destructive" className="text-xs h-5">
                          {factor.contribution}%
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-text-secondary dark:text-neutral-400 mb-1">
                        {factor.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-text-muted">Current value:</span>
                        <span className="text-xs font-semibold text-error">{factor.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Impact */}
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h6 className="text-xs font-semibold text-primary mb-1">Expected Impact</h6>
                  <p className="text-xs text-neutral-text-secondary dark:text-neutral-300">
                    Addressing these factors could improve your score in this category. The AI model predicts this based on historical data from similar institutions that implemented these changes.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Sources */}
            <div className="pt-2 border-t border-neutral-border dark:border-neutral-700">
              <p className="text-xs text-neutral-text-muted">
                <span className="font-semibold">Data sources:</span> Institution performance data, peer benchmarks, historical trends, and ML pattern analysis
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
