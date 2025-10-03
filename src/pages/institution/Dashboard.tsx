import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import DSIGauge from '@/components/dashboard/DSIGauge'
import StatCard from '@/components/dashboard/StatCard'
import CategoryCard from '@/components/dashboard/CategoryCard'
import {
  FileCheck,
  Target,
  Clock,
  AlertCircle,
  Upload,
  BarChart3,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react'
import { daysUntilDeadline, formatDate, formatRelativeTime } from '@/lib/utils'
import categoriesData from '@/data/categories.json'
import { Breadcrumb } from '@/components/ui/breadcrumb'

export default function Dashboard() {
  const navigate = useNavigate()
  const { selectedInstitution, getDocumentsByInstitutionId } = useStore()

  if (!selectedInstitution) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-neutral-text-secondary">No institution selected</p>
      </div>
    )
  }

  const documents = getDocumentsByInstitutionId(selectedInstitution.id)
  const verifiedDocs = documents.filter(d => d.status === 'verified').length
  const pendingDocs = documents.filter(d => d.status === 'pending' || d.status === 'flagged').length
  const daysLeft = daysUntilDeadline(selectedInstitution.deadline)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Dashboard' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
            Dashboard
          </h1>
          <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
            Welcome back! Here's your institution's performance overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/institution/documents')}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Documents
          </Button>
          <Button onClick={() => navigate('/institution/scorecard')}>
            <BarChart3 className="w-4 h-4 mr-2" />
            View Scorecard
          </Button>
        </div>
      </div>

      {/* Alert Banner */}
      {selectedInstitution.submissionStatus === 'pending_review' && (
        <Card className="border-l-4 border-l-warning bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-warning-dark dark:text-warning-light">
                  Submission Under Review
                </h4>
                <p className="text-sm text-neutral-text-secondary dark:text-neutral-400 mt-1">
                  Your documents are currently being reviewed by UGC/AICTE. You'll be notified once the review is complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/institution/documents')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-text-primary dark:text-neutral-100">Upload Documents</p>
                <p className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-0.5">Add missing evidence</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-text-muted" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-success hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/institution/ai-insights')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-text-primary dark:text-neutral-100">View AI Insights</p>
                <p className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-0.5">3 new recommendations</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-text-muted" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-warning hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/institution/benchmarking')}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-neutral-text-primary dark:text-neutral-100">Compare Performance</p>
                <p className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-0.5">See peer benchmarks</p>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-text-muted" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DSI Gauge & Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DSI Gauge */}
        <Card className="lg:col-span-1 flex items-center justify-center p-8">
          <DSIGauge value={selectedInstitution.currentDSI} />
        </Card>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Composite Score"
            value={selectedInstitution.compositeScore.toFixed(1)}
            subtitle="Overall performance rating"
            icon={Target}
            color="#3b82f6"
            trend={{
              value: 2.3,
              label: 'from last year'
            }}
          />
          <StatCard
            title="Documents Submitted"
            value={`${verifiedDocs}/${documents.length}`}
            subtitle={`${pendingDocs} pending verification`}
            icon={FileCheck}
            color="#10b981"
          />
          <StatCard
            title="Days to Deadline"
            value={daysLeft}
            subtitle={`Due: ${formatDate(selectedInstitution.deadline)}`}
            icon={Clock}
            color={daysLeft < 7 ? '#ef4444' : daysLeft < 30 ? '#f59e0b' : '#10b981'}
          />
          <StatCard
            title="Status"
            value={selectedInstitution.submissionStatus.replace('_', ' ').toUpperCase()}
            subtitle={`Updated ${formatRelativeTime(selectedInstitution.lastUpdated)}`}
            icon={Calendar}
            color="#6366f1"
          />
        </div>
      </div>

      {/* Category Performance Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-neutral-text-primary dark:text-neutral-100">
              Performance by Category
            </h2>
            <p className="text-sm text-neutral-text-secondary dark:text-neutral-400 mt-1">
              11 key performance areas weighted by importance
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/institution/scorecard')}
          >
            View Details
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categoriesData.map((category, index) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              score={category.score}
              weight={category.weight}
              trend={index % 3 === 0 ? 2.5 : index % 3 === 1 ? -1.2 : undefined}
              onClick={() => navigate('/institution/scorecard')}
            />
          ))}
        </div>
      </div>

      {/* Missing Documents Widget */}
      <Card className="border-l-4 border-l-warning">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Action Required: Missing Documents
              </CardTitle>
              <CardDescription>Upload these to improve your DSI score</CardDescription>
            </div>
            <Button size="sm" onClick={() => navigate('/institution/documents')}>
              Upload Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Research Publications 2024', impact: '+8', priority: 'high', category: 'Research & Innovation' },
              { name: 'Placement Records (Latest)', impact: '+6', priority: 'high', category: 'Student Outcomes' },
              { name: 'Faculty Development Programs', impact: '+5', priority: 'medium', category: 'Teaching Resources' },
              { name: 'Industry Partnership MOUs', impact: '+4', priority: 'medium', category: 'Industry Links' }
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg hover:bg-neutral-bg-tertiary dark:hover:bg-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full ${doc.priority === 'high' ? 'bg-error' : 'bg-warning'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-text-primary dark:text-neutral-100">
                      {doc.name}
                    </p>
                    <p className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-0.5">
                      {doc.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-success">
                      {doc.impact} DSI
                    </p>
                    <p className="text-xs text-neutral-text-muted">
                      {doc.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-neutral-text-muted opacity-30" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest updates and actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                action: 'Document Verified',
                document: 'Research Publications 2023',
                time: '2 hours ago',
                status: 'success'
              },
              {
                action: 'Document Uploaded',
                document: 'Student Feedback Analysis',
                time: '5 hours ago',
                status: 'info'
              },
              {
                action: 'Document Flagged',
                document: 'Placement Records 2024',
                time: '1 day ago',
                status: 'warning'
              },
              {
                action: 'Score Updated',
                document: 'Composite Score increased to 78.3',
                time: '2 days ago',
                status: 'success'
              }
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-start gap-4 pb-4 border-b border-neutral-border dark:border-neutral-700 last:border-0 last:pb-0"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success'
                      ? 'bg-success'
                      : activity.status === 'warning'
                      ? 'bg-warning'
                      : 'bg-info'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-neutral-text-primary dark:text-neutral-100">
                        {activity.action}
                      </p>
                      <p className="text-sm text-neutral-text-secondary dark:text-neutral-400 mt-1">
                        {activity.document}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-text-muted dark:text-neutral-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
