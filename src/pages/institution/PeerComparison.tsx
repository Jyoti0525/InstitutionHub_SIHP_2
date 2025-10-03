import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { TrendingUp, TrendingDown, Award, Building, Users } from 'lucide-react'
import categories from '@/data/categories.json'

export default function PeerComparison() {
  const { selectedInstitution, institutions } = useStore()

  if (!selectedInstitution) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-neutral-text-muted">No institution selected</p>
      </div>
    )
  }

  // Get peer institutions (same type and state)
  const peerInstitutions = institutions.filter(
    inst => inst.id !== selectedInstitution.id &&
    inst.type === selectedInstitution.type &&
    inst.state === selectedInstitution.state
  ).slice(0, 3)

  // Prepare radar chart data
  const radarData = categories.map(cat => ({
    category: cat.name.split(' ')[0], // First word for compact display
    yourScore: cat.score,
    peerAvg: Math.max(50, cat.score + (Math.random() * 20 - 10)), // Mock peer average
    national: Math.max(50, cat.score + (Math.random() * 15 - 7.5)), // Mock national average
  }))

  // Prepare category comparison data
  const categoryComparisonData = categories.map(cat => {
    const peerAvg = Math.max(50, cat.score + (Math.random() * 20 - 10))
    return {
      name: cat.name,
      yourScore: cat.score,
      peerAverage: peerAvg,
      difference: cat.score - peerAvg
    }
  }).sort((a, b) => b.difference - a.difference)

  // Key metrics comparison
  const metricsComparison = [
    {
      name: 'DSI Score',
      yours: selectedInstitution.currentDSI,
      peer1: peerInstitutions[0]?.currentDSI || 0,
      peer2: peerInstitutions[1]?.currentDSI || 0,
      peer3: peerInstitutions[2]?.currentDSI || 0,
    },
    {
      name: 'Composite Score',
      yours: selectedInstitution.compositeScore,
      peer1: peerInstitutions[0]?.compositeScore || 0,
      peer2: peerInstitutions[1]?.compositeScore || 0,
      peer3: peerInstitutions[2]?.compositeScore || 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Peer Comparison</h1>
        <p className="text-neutral-text-secondary">
          Compare your institution's performance with peer institutions
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Building className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm text-neutral-text-muted mb-1">Your Rank</p>
              <p className="text-2xl font-bold">#{Math.floor(Math.random() * 50) + 1}</p>
              <p className="text-xs text-neutral-text-muted mt-1">in {selectedInstitution.state}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-info" />
              <p className="text-sm text-neutral-text-muted mb-1">Peer Institutions</p>
              <p className="text-2xl font-bold">{peerInstitutions.length}</p>
              <p className="text-xs text-neutral-text-muted mt-1">same type & state</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-success" />
              <p className="text-sm text-neutral-text-muted mb-1">Above Peer Avg</p>
              <p className="text-2xl font-bold">7/11</p>
              <p className="text-xs text-neutral-text-muted mt-1">categories</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-warning" />
              <p className="text-sm text-neutral-text-muted mb-1">Percentile Rank</p>
              <p className="text-2xl font-bold">78th</p>
              <p className="text-xs text-neutral-text-muted mt-1">nationally</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="radar" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="radar">Performance Radar</TabsTrigger>
          <TabsTrigger value="category">Category Analysis</TabsTrigger>
          <TabsTrigger value="peers">Peer Details</TabsTrigger>
        </TabsList>

        <TabsContent value="radar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-dimensional Performance Comparison</CardTitle>
              <CardDescription>
                Compare your performance across all categories with peer institutions and national average
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={500}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: '#6b7280', fontSize: 10 }}
                  />
                  <Radar
                    name="Your Institution"
                    dataKey="yourScore"
                    stroke="#1e40af"
                    fill="#1e40af"
                    fillOpacity={0.6}
                    strokeWidth={2}
                  />
                  <Radar
                    name="Peer Average"
                    dataKey="peerAvg"
                    stroke="#16a34a"
                    fill="#16a34a"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                  <Radar
                    name="National Average"
                    dataKey="national"
                    stroke="#eab308"
                    fill="#eab308"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics Comparison</CardTitle>
              <CardDescription>
                Overall scores compared with peer institutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metricsComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="yours" fill="#1e40af" name="Your Institution" />
                  <Bar dataKey="peer1" fill="#3b82f6" name={peerInstitutions[0]?.name || 'Peer 1'} />
                  <Bar dataKey="peer2" fill="#60a5fa" name={peerInstitutions[1]?.name || 'Peer 2'} />
                  <Bar dataKey="peer3" fill="#93c5fd" name={peerInstitutions[2]?.name || 'Peer 3'} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="category" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category-wise Performance Gap Analysis</CardTitle>
              <CardDescription>
                Detailed comparison showing where you excel and where improvement is needed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryComparisonData.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-neutral-bg dark:hover:bg-neutral-900 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <div className="flex items-center gap-2">
                        {item.difference > 0 ? (
                          <Badge variant="success" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            +{item.difference.toFixed(1)}
                          </Badge>
                        ) : (
                          <Badge variant="warning" className="text-xs">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {item.difference.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-neutral-text-muted mb-1">Your Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-neutral-bg dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${item.yourScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold">{item.yourScore.toFixed(1)}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-text-muted mb-1">Peer Average</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-neutral-bg dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-success rounded-full"
                              style={{ width: `${item.peerAverage}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold">{item.peerAverage.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="peers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Peer Institution Details</CardTitle>
              <CardDescription>
                Institutions similar to yours in type and location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {peerInstitutions.length > 0 ? (
                  peerInstitutions.map((peer, index) => (
                    <div key={peer.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg">{peer.name}</h4>
                          <p className="text-sm text-neutral-text-muted">{peer.state}</p>
                        </div>
                        <Badge variant="outline">{peer.type}</Badge>
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-neutral-text-muted mb-1">DSI Score</p>
                          <p className="text-lg font-bold" style={{ color: peer.currentDSI >= 90 ? '#16a34a' : peer.currentDSI >= 70 ? '#eab308' : '#dc2626' }}>
                            {peer.currentDSI.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-text-muted mb-1">Composite Score</p>
                          <p className="text-lg font-bold">{peer.compositeScore.toFixed(1)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-text-muted mb-1">NAAC Grade</p>
                          <p className="text-lg font-bold">{peer.naacGrade || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-text-muted mb-1">Status</p>
                          <Badge variant={
                            peer.submissionStatus === 'approved' ? 'verified' :
                            peer.submissionStatus === 'pending_review' ? 'pending' : 'warning'
                          } className="text-xs">
                            {peer.submissionStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <h5 className="text-xs font-semibold text-neutral-text-muted mb-2">Performance Comparison</h5>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span>DSI Score:</span>
                            <span className={peer.currentDSI > selectedInstitution.currentDSI ? 'text-warning' : 'text-success'}>
                              {peer.currentDSI > selectedInstitution.currentDSI ?
                                `+${(peer.currentDSI - selectedInstitution.currentDSI).toFixed(1)} higher` :
                                `${(selectedInstitution.currentDSI - peer.currentDSI).toFixed(1)} lower`
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Composite:</span>
                            <span className={peer.compositeScore > selectedInstitution.compositeScore ? 'text-warning' : 'text-success'}>
                              {peer.compositeScore > selectedInstitution.compositeScore ?
                                `+${(peer.compositeScore - selectedInstitution.compositeScore).toFixed(1)} higher` :
                                `${(selectedInstitution.compositeScore - peer.compositeScore).toFixed(1)} lower`
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-text-muted">
                    <p>No peer institutions found with matching type and state.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
