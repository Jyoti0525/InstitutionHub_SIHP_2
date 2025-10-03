import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Award,
  MapPin,
  Filter,
  Download,
  Eye,
  Target,
  Brain,
  Activity
} from 'lucide-react'

// Mock data for jury analytics
const stateWiseData = [
  { state: 'Tamil Nadu', institutions: 67, avgDSI: 78.5, topPerformer: 'IIT Madras', trend: 'up' },
  { state: 'Karnataka', institutions: 58, avgDSI: 76.2, topPerformer: 'IISc Bangalore', trend: 'up' },
  { state: 'Maharashtra', institutions: 72, avgDSI: 74.8, topPerformer: 'IIT Bombay', trend: 'stable' },
  { state: 'Kerala', institutions: 45, avgDSI: 73.1, topPerformer: 'IIT Palakkad', trend: 'down' },
  { state: 'Andhra Pradesh', institutions: 53, avgDSI: 71.9, topPerformer: 'NIT Warangal', trend: 'up' }
]

const sectorWiseData = [
  { sector: 'Engineering & Technology', count: 185, avgDSI: 75.3, color: '#0284c7' },
  { sector: 'Medical & Health Sciences', count: 42, avgDSI: 78.9, color: '#16a34a' },
  { sector: 'Arts & Science', count: 68, avgDSI: 71.2, color: '#dc2626' },
  { sector: 'Management', count: 40, avgDSI: 73.8, color: '#ca8a04' }
]

const topPerformers = [
  { rank: 1, name: 'IIT Madras', state: 'Tamil Nadu', dsi: 92.5, score: 95.2, sector: 'Engineering' },
  { rank: 2, name: 'IISc Bangalore', state: 'Karnataka', dsi: 91.8, score: 94.7, sector: 'Science & Research' },
  { rank: 3, name: 'IIT Bombay', state: 'Maharashtra', dsi: 90.3, score: 93.1, sector: 'Engineering' },
  { rank: 4, name: 'AIIMS Delhi', state: 'Delhi', dsi: 89.7, score: 92.8, sector: 'Medical' },
  { rank: 5, name: 'IIT Delhi', state: 'Delhi', dsi: 88.9, score: 91.5, sector: 'Engineering' },
  { rank: 6, name: 'IIT Kanpur', state: 'Uttar Pradesh', dsi: 87.5, score: 90.2, sector: 'Engineering' },
  { rank: 7, name: 'IIT Kharagpur', state: 'West Bengal', dsi: 86.8, score: 89.6, sector: 'Engineering' },
  { rank: 8, name: 'Delhi University', state: 'Delhi', dsi: 85.2, score: 88.3, sector: 'Arts & Science' },
  { rank: 9, name: 'IIT Roorkee', state: 'Uttarakhand', dsi: 84.7, score: 87.9, sector: 'Engineering' },
  { rank: 10, name: 'Jawaharlal Nehru University', state: 'Delhi', dsi: 83.5, score: 86.8, sector: 'Arts & Science' }
]

const performanceTrends = [
  { category: 'Faculty Quality', avgScore: 76.3, trend: '+2.1%', status: 'improving' },
  { category: 'Research Output', avgScore: 68.9, trend: '+5.4%', status: 'improving' },
  { category: 'Infrastructure', avgScore: 82.1, trend: '+1.2%', status: 'stable' },
  { category: 'Student Outcomes', avgScore: 74.5, trend: '-0.8%', status: 'declining' },
  { category: 'Industry Partnerships', avgScore: 65.2, trend: '+3.7%', status: 'improving' }
]

export default function JuryDashboard() {
  const [selectedState, setSelectedState] = useState<string | null>(null)

  const totalInstitutions = stateWiseData.reduce((sum, s) => sum + s.institutions, 0)
  const overallAvgDSI = (stateWiseData.reduce((sum, s) => sum + s.avgDSI * s.institutions, 0) / totalInstitutions).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
              Jury Analytics Dashboard
            </h1>
          </div>
          <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
            Cross-institutional insights and performance patterns across all monitored institutions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-secondary">Total Institutions</p>
                <p className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100 mt-2">
                  {totalInstitutions}
                </p>
                <p className="text-xs text-success mt-1">Across 5 states</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-secondary">Average DSI Score</p>
                <p className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100 mt-2">
                  {overallAvgDSI}
                </p>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2.3% this quarter
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Target className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-secondary">Top Performer</p>
                <p className="text-xl font-bold text-neutral-text-primary dark:text-neutral-100 mt-2">
                  IIT Madras
                </p>
                <p className="text-xs text-neutral-text-muted mt-1">DSI: 92.5</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Award className="w-6 h-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-secondary">Active Reviews</p>
                <p className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100 mt-2">
                  127
                </p>
                <p className="text-xs text-warning mt-1">23 pending approval</p>
              </div>
              <div className="p-3 bg-info/10 rounded-lg">
                <Activity className="w-6 h-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="states">State-wise Analysis</TabsTrigger>
          <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
          <TabsTrigger value="trends">Performance Trends</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 10 Performing Institutions</CardTitle>
              <CardDescription>Based on DSI scores and composite performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPerformers.map((inst) => (
                  <div
                    key={inst.rank}
                    className="flex items-center justify-between p-4 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg hover:bg-neutral-bg-tertiary dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        inst.rank === 1 ? 'bg-warning' : inst.rank === 2 ? 'bg-neutral-400' : inst.rank === 3 ? 'bg-warning-dark' : 'bg-neutral-500'
                      }`}>
                        {inst.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-text-primary dark:text-neutral-100">
                          {inst.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-neutral-text-secondary flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {inst.state}
                          </span>
                          <Badge variant="outline" className="text-xs">{inst.sector}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-neutral-text-secondary">DSI Score</p>
                        <p className="text-xl font-bold text-primary">{inst.dsi}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-text-secondary">Composite</p>
                        <p className="text-xl font-bold text-success">{inst.score}</p>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* State-wise Analysis Tab */}
        <TabsContent value="states" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {stateWiseData.map((state) => (
              <Card key={state.state} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        {state.state}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {state.institutions} institutions monitored
                      </CardDescription>
                    </div>
                    {state.trend === 'up' && (
                      <Badge className="bg-success/10 text-success border-success/20">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Improving
                      </Badge>
                    )}
                    {state.trend === 'down' && (
                      <Badge className="bg-error/10 text-error border-error/20">
                        <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                        Declining
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-text-secondary">Average DSI Score</span>
                      <span className="text-2xl font-bold text-primary">{state.avgDSI}</span>
                    </div>
                    <div className="h-2 bg-neutral-bg-tertiary dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${state.avgDSI}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-border dark:border-neutral-700">
                    <div>
                      <p className="text-sm text-neutral-text-secondary">Top Performer</p>
                      <p className="font-semibold text-neutral-text-primary dark:text-neutral-100 mt-1">
                        {state.topPerformer}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sector Analysis Tab */}
        <TabsContent value="sectors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectorWiseData.map((sector) => (
              <Card key={sector.sector}>
                <CardHeader>
                  <CardTitle>{sector.sector}</CardTitle>
                  <CardDescription>{sector.count} institutions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-text-secondary">Average DSI</span>
                      <span className="text-2xl font-bold" style={{ color: sector.color }}>
                        {sector.avgDSI}
                      </span>
                    </div>
                    <div className="h-3 bg-neutral-bg-tertiary dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${sector.avgDSI}%`, backgroundColor: sector.color }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-text-secondary">Compared to overall avg</span>
                    <span className={sector.avgDSI > parseFloat(overallAvgDSI) ? 'text-success' : 'text-error'}>
                      {sector.avgDSI > parseFloat(overallAvgDSI) ? '+' : ''}
                      {(sector.avgDSI - parseFloat(overallAvgDSI)).toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Performance Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends Across Categories</CardTitle>
              <CardDescription>Aggregated performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceTrends.map((trend) => (
                  <div key={trend.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-neutral-text-primary dark:text-neutral-100">
                          {trend.category}
                        </span>
                        <Badge variant={trend.status === 'improving' ? 'default' : trend.status === 'declining' ? 'destructive' : 'secondary'}>
                          {trend.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${
                          trend.status === 'improving' ? 'text-success' :
                          trend.status === 'declining' ? 'text-error' : 'text-neutral-text-secondary'
                        }`}>
                          {trend.trend}
                        </span>
                        <span className="text-xl font-bold text-primary">{trend.avgScore}</span>
                      </div>
                    </div>
                    <div className="h-2 bg-neutral-bg-tertiary dark:bg-neutral-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          trend.status === 'improving' ? 'bg-success' :
                          trend.status === 'declining' ? 'bg-error' : 'bg-warning'
                        }`}
                        style={{ width: `${trend.avgScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
