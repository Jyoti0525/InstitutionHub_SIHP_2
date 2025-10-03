import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  BarChart3,
  Users,
  BookOpen,
  Building2,
  DollarSign,
  GraduationCap,
  Shield,
  Activity
} from 'lucide-react'

// Benchmarking categories with icons
const categories = [
  { id: 'faculty', name: 'Faculty Quality', icon: Users, weight: 15 },
  { id: 'research', name: 'Research Output', icon: BookOpen, weight: 20 },
  { id: 'infrastructure', name: 'Infrastructure', icon: Building2, weight: 10 },
  { id: 'placements', name: 'Placements', icon: GraduationCap, weight: 15 },
  { id: 'industry', name: 'Industry Links', icon: DollarSign, weight: 10 },
  { id: 'governance', name: 'Governance', icon: Shield, weight: 10 },
  { id: 'outcomes', name: 'Student Outcomes', icon: Award, weight: 20 }
]

// Mock benchmarking data
const generateBenchmarkData = (institutionId: string) => {
  return {
    yourScore: 75.3,
    topPerformer: 92.5,
    top10Avg: 88.2,
    stateAvg: 73.8,
    sectorAvg: 76.1,
    nationalAvg: 68.5,
    percentile: 68, // You're better than 68% of institutions
    categoryScores: [
      { category: 'Faculty Quality', yourScore: 72, top10: 88, sectorAvg: 75, percentile: 65 },
      { category: 'Research Output', yourScore: 68, top10: 90, sectorAvg: 70, percentile: 58 },
      { category: 'Infrastructure', yourScore: 85, top10: 92, sectorAvg: 80, percentile: 78 },
      { category: 'Placements', yourScore: 78, top10: 89, sectorAvg: 77, percentile: 72 },
      { category: 'Industry Links', yourScore: 70, top10: 86, sectorAvg: 72, percentile: 62 },
      { category: 'Governance', yourScore: 82, top10: 90, sectorAvg: 78, percentile: 75 },
      { category: 'Student Outcomes', yourScore: 76, top10: 91, sectorAvg: 74, percentile: 70 }
    ],
    strengths: [
      'Infrastructure quality exceeds sector average by 5 points',
      'Governance practices rank in top 25% nationally',
      'Strong placement record above sector benchmark'
    ],
    improvements: [
      'Research output below top performers by 22 points',
      'Faculty quality needs improvement - 16 point gap to top 10',
      'Industry partnerships below sector average'
    ]
  }
}

export default function Benchmarking() {
  const { selectedInstitution } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showTrendsModal, setShowTrendsModal] = useState(false)

  if (!selectedInstitution) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-neutral-text-secondary">No institution selected</p>
      </div>
    )
  }

  const data = generateBenchmarkData(selectedInstitution.id)

  const handleViewTrends = () => {
    setShowTrendsModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Benchmarking' }]} />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
              Benchmarking & Comparison
            </h1>
          </div>
          <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
            See how your institution performs compared to peers and top performers
          </p>
        </div>
        <Button variant="outline" onClick={handleViewTrends}>
          <Activity className="w-4 h-4 mr-2" />
          View Trends
        </Button>
      </div>

      {/* Performance Percentile Card */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-primary/10 rounded-xl">
              <Target className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-neutral-text-primary dark:text-neutral-100 mb-2">
                Your Performance Percentile
              </h3>
              <p className="text-neutral-text-secondary dark:text-neutral-400 mb-4">
                You rank better than <span className="font-bold text-primary">{data.percentile}%</span> of all institutions in your sector
              </p>
              <div className="relative h-8 bg-neutral-bg-tertiary dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-error via-warning to-success rounded-full transition-all"
                  style={{ width: `${data.percentile}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-primary rounded-full shadow-lg"
                  style={{ left: `calc(${data.percentile}% - 8px)` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-neutral-text-muted">Bottom 25%</span>
                <span className="text-neutral-text-muted">Median</span>
                <span className="text-neutral-text-muted">Top 10%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Score Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Overall DSI Score Comparison</CardTitle>
          <CardDescription>How you compare to different peer groups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Your Score', value: data.yourScore, color: 'primary', isYou: true },
            { label: 'Top Performer', value: data.topPerformer, color: 'warning' },
            { label: 'Top 10 Average', value: data.top10Avg, color: 'success' },
            { label: 'Sector Average', value: data.sectorAvg, color: 'info' },
            { label: 'State Average', value: data.stateAvg, color: 'neutral-text-secondary' },
            { label: 'National Average', value: data.nationalAvg, color: 'neutral-text-muted' }
          ].map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${
                    item.isYou ? 'text-primary' : 'text-neutral-text-primary dark:text-neutral-100'
                  }`}>
                    {item.label}
                  </span>
                  {item.isYou && <Badge variant="default">You</Badge>}
                </div>
                <span className={`text-2xl font-bold ${
                  item.isYou ? 'text-primary' : `text-${item.color}`
                }`}>
                  {item.value}
                </span>
              </div>
              <div className="relative h-3 bg-neutral-bg-tertiary dark:bg-neutral-700 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full rounded-full transition-all ${
                    item.isYou ? 'bg-primary' : `bg-${item.color}`
                  }`}
                  style={{ width: `${(item.value / 100) * 100}%` }}
                />
              </div>
              {item.isYou && (
                <div className="flex items-center gap-4 text-sm mt-2">
                  <span className="text-error flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    Gap to Top Performer: {(data.topPerformer - data.yourScore).toFixed(1)} points
                  </span>
                  <span className="text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Above National Avg: +{(data.yourScore - data.nationalAvg).toFixed(1)} points
                  </span>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Category-wise Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Category-wise Performance</CardTitle>
          <CardDescription>Detailed breakdown across performance categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.categoryScores.map((cat) => {
            const Icon = categories.find(c => c.name === cat.category)?.icon || Target
            const gapToTop10 = cat.top10 - cat.yourScore
            const vsAvg = cat.yourScore - cat.sectorAvg

            return (
              <div
                key={cat.category}
                className="p-4 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-text-primary dark:text-neutral-100">
                        {cat.category}
                      </p>
                      <p className="text-sm text-neutral-text-secondary mt-1">
                        Percentile: <span className="font-medium text-primary">{cat.percentile}th</span>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{cat.yourScore}</p>
                    <p className="text-xs text-neutral-text-muted">/ 100</p>
                  </div>
                </div>

                {/* Comparison Bars */}
                <div className="space-y-2">
                  {/* Your Score */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-primary font-medium">Your Score</span>
                      <span className="text-primary font-bold">{cat.yourScore}</span>
                    </div>
                    <div className="h-2 bg-neutral-bg-tertiary dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${cat.yourScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Top 10 Average */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-text-secondary">Top 10% Average</span>
                      <span className="text-warning font-semibold">{cat.top10}</span>
                    </div>
                    <div className="h-2 bg-neutral-bg-tertiary dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-warning/60 rounded-full"
                        style={{ width: `${cat.top10}%` }}
                      />
                    </div>
                  </div>

                  {/* Sector Average */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-text-secondary">Sector Average</span>
                      <span className="text-info font-semibold">{cat.sectorAvg}</span>
                    </div>
                    <div className="h-2 bg-neutral-bg-tertiary dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-info/60 rounded-full"
                        style={{ width: `${cat.sectorAvg}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Performance Indicators */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-border dark:border-neutral-700">
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`flex items-center gap-1 ${vsAvg >= 0 ? 'text-success' : 'text-error'}`}>
                      {vsAvg >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      vs Sector: {vsAvg >= 0 ? '+' : ''}{vsAvg.toFixed(1)}
                    </span>
                    <span className="text-neutral-text-muted">
                      Gap to Top 10%: {gapToTop10.toFixed(1)} pts
                    </span>
                  </div>
                  {gapToTop10 > 10 && (
                    <Badge variant="destructive" className="text-xs">Action Needed</Badge>
                  )}
                  {vsAvg >= 5 && (
                    <Badge variant="default" className="text-xs bg-success/10 text-success border-success/20">
                      Strength
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Strengths */}
        <Card className="border-l-4 border-l-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <TrendingUp className="w-5 h-5" />
              Key Strengths
            </CardTitle>
            <CardDescription>Areas where you excel</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-2 flex-shrink-0" />
                  <span className="text-neutral-text-secondary dark:text-neutral-300">{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Improvements */}
        <Card className="border-l-4 border-l-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Target className="w-5 h-5" />
              Improvement Areas
            </CardTitle>
            <CardDescription>Focus areas to close performance gaps</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {data.improvements.map((improvement, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                  <span className="text-neutral-text-secondary dark:text-neutral-300">{improvement}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Trends Modal */}
      {showTrendsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowTrendsModal(false)}>
          <Card className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Performance Trends Over Time
              </CardTitle>
              <CardDescription>Historical performance comparison with benchmarks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-center text-sm font-medium border-b pb-2">
                  <div>Quarter</div>
                  <div>Your Score</div>
                  <div>Sector Avg</div>
                  <div>Trend</div>
                </div>
                {[
                  { q: 'Q4 2024', your: 75.3, sector: 76.1, trend: 'up' },
                  { q: 'Q3 2024', your: 73.8, sector: 75.5, trend: 'up' },
                  { q: 'Q2 2024', your: 71.2, sector: 74.8, trend: 'stable' },
                  { q: 'Q1 2024', your: 70.5, sector: 74.2, trend: 'down' }
                ].map((item, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 text-center py-3 border-b items-center">
                    <div className="font-medium">{item.q}</div>
                    <div className="text-primary font-semibold">{item.your}</div>
                    <div className="text-neutral-text-secondary">{item.sector}</div>
                    <div>
                      {item.trend === 'up' && <TrendingUp className="w-5 h-5 text-success mx-auto" />}
                      {item.trend === 'down' && <TrendingDown className="w-5 h-5 text-error mx-auto" />}
                      {item.trend === 'stable' && <div className="w-5 h-0.5 bg-warning mx-auto" />}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <p className="text-sm font-medium text-success mb-2">📈 Positive Momentum</p>
                <p className="text-sm text-neutral-text-secondary">
                  Your institution has shown consistent improvement over the past 3 quarters,
                  with a total gain of 4.8 points. Keep up the momentum!
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setShowTrendsModal(false)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
