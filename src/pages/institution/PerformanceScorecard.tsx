import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Download, TrendingUp, Info } from 'lucide-react'
import { getDSIColor } from '@/lib/utils'
import categoriesData from '@/data/categories.json'
import submetricsData from '@/data/submetrics.json'

export default function PerformanceScorecard() {
  const { selectedInstitution } = useStore()

  if (!selectedInstitution) {
    return <div>No institution selected</div>
  }

  const compositeScore = selectedInstitution.compositeScore

  const getSubmetricsForCategory = (categoryId: string) => {
    return submetricsData.filter(s => s.categoryId === categoryId)
  }

  const getConfidenceBadge = (level: string) => {
    const variants: Record<string, any> = {
      high: 'success',
      medium: 'warning',
      low: 'destructive'
    }
    return variants[level] || 'outline'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
            Performance Scorecard
          </h1>
          <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
            Comprehensive performance analysis across all categories
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Composite Score Header */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-text-secondary dark:text-neutral-400 mb-2">
                Overall Composite Score
              </p>
              <div className="flex items-baseline gap-3">
                <div className="text-6xl font-bold text-primary">
                  {compositeScore.toFixed(1)}
                </div>
                <div className="text-2xl text-neutral-text-muted dark:text-neutral-500">
                  / 100
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">
                  +2.3% from last year
                </span>
              </div>
            </div>
            <div className="text-right">
              <Badge variant="success" className="text-lg px-4 py-2">
                Above Average
              </Badge>
              <p className="text-xs text-neutral-text-muted dark:text-neutral-500 mt-2">
                Rank: 87th Nationally
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Category-wise Performance</CardTitle>
          <CardDescription>
            Detailed breakdown of all 11 performance categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {categoriesData.map((category) => {
              const submetrics = getSubmetricsForCategory(category.id)
              const categoryColor = getDSIColor(category.score)

              return (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-left">
                          <div className="font-semibold text-neutral-text-primary dark:text-neutral-100">
                            {category.name}
                          </div>
                          <div className="text-xs text-neutral-text-muted dark:text-neutral-500 mt-1">
                            {submetrics.length} metrics • Weight: {category.weight}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                          <div
                            className="text-2xl font-bold"
                            style={{ color: categoryColor }}
                          >
                            {category.score.toFixed(1)}
                          </div>
                          <Progress value={category.score} className="w-24 h-2 mt-1" />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="bg-neutral-bg dark:bg-neutral-900 rounded-lg p-4 mt-2">
                      {/* Submetrics Table */}
                      <div className="space-y-3">
                        {submetrics.map((submetric) => (
                          <div
                            key={submetric.id}
                            className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-border dark:border-neutral-700"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100">
                                  {submetric.name}
                                </span>
                                <Badge
                                  variant={getConfidenceBadge(submetric.confidenceLevel)}
                                  className="text-xs"
                                >
                                  {submetric.confidenceLevel} confidence
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-xs text-neutral-text-secondary dark:text-neutral-400">
                                <span>Raw Value: {submetric.rawValue}</span>
                                <span>•</span>
                                <span>Weight: {submetric.weight}%</span>
                                <span>•</span>
                                <span>Peer Percentile: {submetric.peerPercentile || 'N/A'}th</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div
                                  className="text-xl font-bold"
                                  style={{ color: getDSIColor(submetric.normalizedScore) }}
                                >
                                  {submetric.normalizedScore.toFixed(1)}
                                </div>
                                <Progress value={submetric.normalizedScore} className="w-20 h-1.5 mt-1" />
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8"
                                onClick={() => {
                                  alert(
                                    `Metric: ${submetric.name}\n\n` +
                                    `Formula: ${submetric.formula}\n` +
                                    `Raw Value: ${submetric.rawValue}\n` +
                                    `Normalized Score: ${submetric.normalizedScore}\n` +
                                    `Evidence Documents: ${submetric.evidenceDocIds.length} attached`
                                  )
                                }}
                              >
                                <Info className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Category Summary */}
                      <div className="mt-4 pt-4 border-t border-neutral-border dark:border-neutral-700">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-xs text-neutral-text-muted dark:text-neutral-500">
                              Category Weight
                            </div>
                            <div className="text-lg font-bold text-neutral-text-primary dark:text-neutral-100 mt-1">
                              {category.weight}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-text-muted dark:text-neutral-500">
                              Total Metrics
                            </div>
                            <div className="text-lg font-bold text-neutral-text-primary dark:text-neutral-100 mt-1">
                              {submetrics.length}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-text-muted dark:text-neutral-500">
                              Contribution to Total
                            </div>
                            <div className="text-lg font-bold text-neutral-text-primary dark:text-neutral-100 mt-1">
                              {((category.score * category.weight) / 100).toFixed(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
          <CardDescription>AI-generated insights and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                type: 'success',
                title: 'Strong Performance in Accreditation',
                message: 'Your institution scores 92.0 in Accreditation & Compliance, placing you in the top 15% nationally.'
              },
              {
                type: 'warning',
                title: 'Improvement Needed in Digital Presence',
                message: 'Digital Presence scores 58.0. Consider investing in online learning platforms and digital infrastructure.'
              },
              {
                type: 'info',
                title: 'Research Output Below Peers',
                message: 'Research & Innovation at 68.5 is below the peer median of 72.3. Focus on increasing publications and patents.'
              }
            ].map((insight, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  insight.type === 'success'
                    ? 'bg-success/10 border-success/20'
                    : insight.type === 'warning'
                    ? 'bg-warning/10 border-warning/20'
                    : 'bg-info/10 border-info/20'
                }`}
              >
                <h4
                  className={`font-semibold text-sm ${
                    insight.type === 'success'
                      ? 'text-success'
                      : insight.type === 'warning'
                      ? 'text-warning'
                      : 'text-info'
                  }`}
                >
                  {insight.title}
                </h4>
                <p className="text-sm text-neutral-text-secondary dark:text-neutral-400 mt-1">
                  {insight.message}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
