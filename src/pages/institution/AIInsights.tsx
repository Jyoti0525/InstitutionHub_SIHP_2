import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  BookOpen,
  Users,
  Award,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Brain,
  RefreshCw
} from 'lucide-react'

// Mock AI-generated insights data
const generateInsights = (institutionId: string) => {
  const insights = [
    {
      category: 'Faculty Quality',
      icon: Users,
      priority: 'high',
      score: 72,
      benchmark: 85,
      trend: 'up',
      trendValue: '+3.2%',
      recommendations: [
        'Increase faculty with PhD qualifications by 15% to match top performers',
        'Focus on recruiting experienced faculty (10+ years) for core departments',
        'Implement faculty development programs in emerging technologies'
      ],
      impact: 'High impact on overall DSI score (+5.2 points potential)',
      actionable: true
    },
    {
      category: 'Research Output',
      icon: BookOpen,
      priority: 'high',
      score: 65,
      benchmark: 78,
      trend: 'down',
      trendValue: '-1.8%',
      recommendations: [
        'Establish research collaboration with industry partners',
        'Allocate dedicated research hours for faculty members',
        'Create incentive structure for publishing in Q1/Q2 journals'
      ],
      impact: 'Medium-High impact (+4.5 points potential)',
      actionable: true
    },
    {
      category: 'Infrastructure',
      icon: Building2,
      priority: 'medium',
      score: 88,
      benchmark: 82,
      trend: 'up',
      trendValue: '+5.1%',
      recommendations: [
        'Your infrastructure exceeds benchmarks - maintain current standards',
        'Consider digital infrastructure upgrades (cloud labs, virtual reality)',
        'Share best practices with peer institutions'
      ],
      impact: 'Low priority - already performing well',
      actionable: false
    },
    {
      category: 'Student Outcomes',
      icon: Award,
      priority: 'high',
      score: 76,
      benchmark: 82,
      trend: 'stable',
      trendValue: '+0.3%',
      recommendations: [
        'Strengthen industry partnerships for placement opportunities',
        'Enhance skill development programs in high-demand areas',
        'Implement alumni mentorship programs'
      ],
      impact: 'High impact (+6.1 points potential)',
      actionable: true
    }
  ]

  return insights
}

export default function AIInsights() {
  const { selectedInstitution } = useStore()
  const [refreshing, setRefreshing] = useState(false)
  const [actionPlans, setActionPlans] = useState<Set<string>>(new Set())
  const [showActionPlanModal, setShowActionPlanModal] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<any>(null)

  if (!selectedInstitution) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-neutral-text-secondary">No institution selected</p>
      </div>
    )
  }

  const insights = generateInsights(selectedInstitution.id)
  const highPriorityCount = insights.filter(i => i.priority === 'high').length

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      alert('✨ Insights refreshed successfully!\n\nUpdated with latest performance data.')
    }, 1500)
  }

  const handleCreateActionPlan = (insight: any) => {
    setSelectedInsight(insight)
    setShowActionPlanModal(true)
  }

  const confirmActionPlan = () => {
    if (selectedInsight) {
      const newPlans = new Set(actionPlans)
      newPlans.add(selectedInsight.category)
      setActionPlans(newPlans)
      setShowActionPlanModal(false)
      setTimeout(() => {
        alert(`✅ Action Plan created for "${selectedInsight.category}"!\n\nThis plan has been added to your dashboard and will be tracked for progress monitoring.`)
      }, 300)
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'AI Insights' }]} />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
              AI-Powered Insights
            </h1>
          </div>
          <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
            Personalized recommendations based on your performance data and peer benchmarks
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Refresh Insights
            </>
          )}
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-neutral-text-primary dark:text-neutral-100 mb-2">
                AI Analysis Summary
              </h3>
              <p className="text-neutral-text-secondary dark:text-neutral-400 mb-4">
                Based on analysis of your institution's data, we've identified{' '}
                <span className="font-semibold text-primary">{highPriorityCount} high-priority areas</span>{' '}
                for improvement. Implementing these recommendations could increase your DSI score by{' '}
                <span className="font-semibold text-success">up to 15.8 points</span>.
              </p>
              <div className="flex gap-3">
                <Badge variant="default" className="bg-error/10 text-error border-error/20">
                  {insights.filter(i => i.priority === 'high').length} High Priority
                </Badge>
                <Badge variant="default" className="bg-warning/10 text-warning border-warning/20">
                  {insights.filter(i => i.priority === 'medium').length} Medium Priority
                </Badge>
                <Badge variant="default" className="bg-success/10 text-success border-success/20">
                  {insights.filter(i => i.priority === 'low').length} Low Priority
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Action Plans Tracker */}
      {actionPlans.size > 0 && (
        <Card className="border-l-4 border-l-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              Active Action Plans ({actionPlans.size})
            </CardTitle>
            <CardDescription>Track progress on your implemented recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(actionPlans).map((planCategory, i) => {
                const progress = 25 + Math.floor(Math.random() * 50) // Simulated progress
                return (
                  <div key={i} className="p-4 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-neutral-text-primary dark:text-neutral-100">
                        {planCategory}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {progress}% Complete
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2 mb-2" />
                    <div className="flex items-center justify-between text-xs text-neutral-text-secondary dark:text-neutral-400">
                      <span>Started {Math.floor(Math.random() * 15 + 1)} days ago</span>
                      <span>Est. completion: {Math.floor(Math.random() * 30 + 30)} days</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-text-primary dark:text-neutral-100">
          Detailed Insights & Recommendations
        </h2>

        {insights.map((insight, index) => {
          const Icon = insight.icon
          const performanceGap = insight.benchmark - insight.score
          const performancePercent = (insight.score / insight.benchmark) * 100

          return (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.priority === 'high'
                        ? 'bg-error/10'
                        : insight.priority === 'medium'
                        ? 'bg-warning/10'
                        : 'bg-success/10'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        insight.priority === 'high'
                          ? 'text-error'
                          : insight.priority === 'medium'
                          ? 'text-warning'
                          : 'text-success'
                      }`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{insight.category}</CardTitle>
                      <CardDescription className="mt-1">
                        {insight.impact}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={insight.priority === 'high' ? 'destructive' : 'default'}>
                      {insight.priority.toUpperCase()}
                    </Badge>
                    {insight.trend === 'up' && (
                      <div className="flex items-center gap-1 text-success">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{insight.trendValue}</span>
                      </div>
                    )}
                    {insight.trend === 'down' && (
                      <div className="flex items-center gap-1 text-error">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-sm font-medium">{insight.trendValue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Performance Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-text-secondary">Your Score</span>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-neutral-text-primary dark:text-neutral-100">
                        {insight.score}/100
                      </span>
                      <span className="text-neutral-text-muted">
                        Benchmark: {insight.benchmark}
                      </span>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress value={performancePercent} className="h-3" />
                    <div
                      className="absolute top-0 left-0 h-3 bg-success/20 rounded-full"
                      style={{ width: `${(insight.benchmark / 100) * 100}%` }}
                    />
                  </div>
                  {performanceGap > 0 && (
                    <p className="text-sm text-neutral-text-muted">
                      Gap to benchmark: <span className="font-medium text-warning">{performanceGap} points</span>
                    </p>
                  )}
                </div>

                {/* Recommendations */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-semibold text-neutral-text-primary dark:text-neutral-100 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    AI Recommendations
                  </h4>
                  <div className="space-y-2">
                    {insight.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg">
                        {insight.actionable ? (
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                        )}
                        <p className="text-sm text-neutral-text-secondary dark:text-neutral-300 flex-1">
                          {rec}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {insight.actionable && (
                  <div className="pt-2">
                    <Button
                      variant={actionPlans.has(insight.category) ? "default" : "outline"}
                      className="w-full group"
                      onClick={() => handleCreateActionPlan(insight)}
                      disabled={actionPlans.has(insight.category)}
                    >
                      {actionPlans.has(insight.category) ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          <span>Action Plan Created</span>
                        </>
                      ) : (
                        <>
                          <span>Create Action Plan</span>
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Action Plan Modal */}
      {showActionPlanModal && selectedInsight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowActionPlanModal(false)}>
          <Card className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Create Action Plan: {selectedInsight.category}
              </CardTitle>
              <CardDescription>Review and confirm your action plan for improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium text-primary mb-2">Expected Impact</p>
                <p className="text-neutral-text-secondary">{selectedInsight.impact}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Action Items
                </h4>
                <div className="space-y-2">
                  {selectedInsight.recommendations.map((rec: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                      <input type="checkbox" defaultChecked className="mt-1" />
                      <p className="text-sm flex-1">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-neutral-text-secondary mb-1">Target Completion</p>
                  <input type="date" className="w-full p-2 border rounded mt-1" defaultValue={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
                </div>
                <div className="p-3 border rounded-lg">
                  <p className="text-sm text-neutral-text-secondary mb-1">Assign To</p>
                  <select className="w-full p-2 border rounded mt-1">
                    <option>Head of Department</option>
                    <option>Faculty Committee</option>
                    <option>Administration</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowActionPlanModal(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmActionPlan}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Create Action Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
