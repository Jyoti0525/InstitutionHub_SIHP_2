import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts'
import { TrendingUp, TrendingDown, Building, FileCheck, AlertCircle, CheckCircle } from 'lucide-react'

export default function Analytics() {
  const { institutions, getDocumentsByInstitutionId } = useStore()

  // Get all documents from all institutions
  const allDocuments = institutions.flatMap(inst => getDocumentsByInstitutionId(inst.id))

  // State-wise distribution
  const stateDistribution = institutions.reduce((acc, inst) => {
    acc[inst.state] = (acc[inst.state] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const stateData = Object.entries(stateDistribution).map(([state, count]) => ({
    state,
    count
  })).sort((a, b) => b.count - a.count)

  // Type distribution
  const typeDistribution = institutions.reduce((acc, inst) => {
    acc[inst.type] = (acc[inst.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const typeData = Object.entries(typeDistribution).map(([type, count]) => ({
    name: type,
    value: count
  }))

  const COLORS = ['#1e40af', '#16a34a', '#eab308', '#dc2626', '#0284c7', '#7c3aed']

  // DSI score distribution
  const dsiDistribution = [
    { range: '0-40', count: institutions.filter(i => i.currentDSI < 40).length, color: '#dc2626' },
    { range: '40-60', count: institutions.filter(i => i.currentDSI >= 40 && i.currentDSI < 60).length, color: '#f97316' },
    { range: '60-70', count: institutions.filter(i => i.currentDSI >= 60 && i.currentDSI < 70).length, color: '#eab308' },
    { range: '70-90', count: institutions.filter(i => i.currentDSI >= 70 && i.currentDSI < 90).length, color: '#16a34a' },
    { range: '90-100', count: institutions.filter(i => i.currentDSI >= 90).length, color: '#0284c7' },
  ]

  // Compliance status distribution
  const complianceData = [
    { name: 'Approved', value: institutions.filter(i => i.submissionStatus === 'approved').length },
    { name: 'Pending Review', value: institutions.filter(i => i.submissionStatus === 'pending_review').length },
    { name: 'Needs Revision', value: institutions.filter(i => i.submissionStatus === 'revision_required').length },
  ]

  // Monthly trend (mock data)
  const monthlyTrend = [
    { month: 'Jan', submissions: 42, verifications: 38, avgDSI: 72 },
    { month: 'Feb', submissions: 56, verifications: 51, avgDSI: 74 },
    { month: 'Mar', submissions: 68, verifications: 62, avgDSI: 75 },
    { month: 'Apr', submissions: 54, verifications: 49, avgDSI: 76 },
    { month: 'May', submissions: 72, verifications: 67, avgDSI: 78 },
    { month: 'Jun', submissions: 85, verifications: 78, avgDSI: 79 },
    { month: 'Jul', submissions: 91, verifications: 84, avgDSI: 80 },
    { month: 'Aug', submissions: 88, verifications: 82, avgDSI: 81 },
    { month: 'Sep', submissions: 96, verifications: 89, avgDSI: 82 },
  ]

  // Calculate key metrics
  const totalInstitutions = institutions.length
  const totalDocuments = allDocuments.length
  const verifiedDocuments = allDocuments.filter(d => d.status === 'verified').length
  const pendingReview = institutions.filter(i => i.submissionStatus === 'pending_review').length
  const avgDSI = institutions.length > 0 ? institutions.reduce((sum, i) => sum + i.currentDSI, 0) / institutions.length : 0
  const avgComposite = institutions.length > 0 ? institutions.reduce((sum, i) => sum + i.compositeScore, 0) / institutions.length : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">National Analytics Dashboard</h1>
        <p className="text-neutral-text-secondary">
          Comprehensive insights and trends across all institutions
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-muted mb-1">Total Institutions</p>
                <p className="text-3xl font-bold">{totalInstitutions}</p>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12% from last month
                </p>
              </div>
              <Building className="w-10 h-10 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-muted mb-1">Documents Processed</p>
                <p className="text-3xl font-bold">{totalDocuments}</p>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {verifiedDocuments} verified
                </p>
              </div>
              <FileCheck className="w-10 h-10 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-muted mb-1">Avg DSI Score</p>
                <p className="text-3xl font-bold">{avgDSI.toFixed(1)}</p>
                <p className="text-xs text-success mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +3.2 points YoY
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-info opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-muted mb-1">Pending Review</p>
                <p className="text-3xl font-bold">{pendingReview}</p>
                <p className="text-xs text-warning mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Requires attention
                </p>
              </div>
              <AlertCircle className="w-10 h-10 text-warning opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Submission & Verification Trends</CardTitle>
              <CardDescription>
                Document submission and verification activity over the last 9 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e40af" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1e40af" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVerifications" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="submissions"
                    stroke="#1e40af"
                    fillOpacity={1}
                    fill="url(#colorSubmissions)"
                    name="Submissions"
                  />
                  <Area
                    type="monotone"
                    dataKey="verifications"
                    stroke="#16a34a"
                    fillOpacity={1}
                    fill="url(#colorVerifications)"
                    name="Verifications"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Average DSI Score Trend</CardTitle>
              <CardDescription>
                National average DSI score progression
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                  <YAxis domain={[65, 85]} tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avgDSI"
                    stroke="#0284c7"
                    strokeWidth={3}
                    dot={{ fill: '#0284c7', r: 5 }}
                    name="Avg DSI Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Institution Type Distribution</CardTitle>
                <CardDescription>
                  Breakdown by institution type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.split(' ')[0]} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>
                  Current compliance status distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complianceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#16a34a" />
                      <Cell fill="#eab308" />
                      <Cell fill="#dc2626" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>DSI Score Distribution</CardTitle>
              <CardDescription>
                Number of institutions in each DSI score range
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dsiDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="range" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Bar dataKey="count" name="Institutions">
                    {dsiDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Institutions</CardTitle>
              <CardDescription>
                Institutions ranked by composite score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {institutions
                  .sort((a, b) => b.compositeScore - a.compositeScore)
                  .slice(0, 10)
                  .map((inst, index) => (
                    <div key={inst.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-neutral-bg dark:hover:bg-neutral-900 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{inst.name}</p>
                          <p className="text-xs text-neutral-text-muted">{inst.state} • {inst.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-neutral-text-muted">DSI</p>
                          <p className="font-bold" style={{ color: inst.currentDSI >= 90 ? '#16a34a' : inst.currentDSI >= 70 ? '#eab308' : '#dc2626' }}>
                            {inst.currentDSI.toFixed(1)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-neutral-text-muted">Composite</p>
                          <p className="font-bold">{inst.compositeScore.toFixed(1)}</p>
                        </div>
                        <Badge variant={inst.naacGrade === 'A++' || inst.naacGrade === 'A+' ? 'success' : 'outline'}>
                          {inst.naacGrade || 'N/A'}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Summary</CardTitle>
              <CardDescription>
                National averages and benchmarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-neutral-text-muted mb-2">Average DSI Score</p>
                  <p className="text-3xl font-bold mb-1">{avgDSI.toFixed(1)}</p>
                  <div className="h-2 bg-neutral-bg dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-info" style={{ width: `${avgDSI}%` }} />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-neutral-text-muted mb-2">Average Composite Score</p>
                  <p className="text-3xl font-bold mb-1">{avgComposite.toFixed(1)}</p>
                  <div className="h-2 bg-neutral-bg dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-success" style={{ width: `${avgComposite}%` }} />
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-neutral-text-muted mb-2">Verification Rate</p>
                  <p className="text-3xl font-bold mb-1">{totalDocuments > 0 ? ((verifiedDocuments / totalDocuments) * 100).toFixed(0) : 0}%</p>
                  <div className="h-2 bg-neutral-bg dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${totalDocuments > 0 ? (verifiedDocuments / totalDocuments) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>State-wise Institution Distribution</CardTitle>
              <CardDescription>
                Number of institutions by state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stateData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: '#6b7280' }} />
                  <YAxis dataKey="state" type="category" width={100} tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1e40af" name="Institutions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Insights</CardTitle>
              <CardDescription>
                Key statistics by state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stateData.map((state) => {
                  const stateInsts = institutions.filter(i => i.state === state.state)
                  const avgStateDSI = stateInsts.length > 0 ? stateInsts.reduce((sum, i) => sum + i.currentDSI, 0) / stateInsts.length : 0

                  return (
                    <div key={state.state} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{state.state}</p>
                        <p className="text-xs text-neutral-text-muted">{state.count} institutions</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-neutral-text-muted">Avg DSI</p>
                          <p className="font-bold">{avgStateDSI.toFixed(1)}</p>
                        </div>
                        <div className="w-32 h-2 bg-neutral-bg dark:bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${avgStateDSI}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
