import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Download,
  Mail,
  Calendar,
  Clock,
  Eye,
  CheckCircle,
  TrendingUp,
  BarChart3,
  FileSpreadsheet,
  FileBarChart,
  Settings,
  Sparkles,
  Bell
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { generateReport, downloadReport } from '@/services/reportGenerator'

// Mock report data
const reportTypes = [
  {
    id: 'performance',
    name: 'Performance Report',
    description: 'Comprehensive analysis of institutional performance metrics',
    icon: BarChart3,
    frequency: 'Monthly',
    lastGenerated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    size: '2.4 MB',
    pages: 15
  },
  {
    id: 'improvement',
    name: 'AI Improvement Report',
    description: 'AI-generated insights and recommendations for enhancement',
    icon: Sparkles,
    frequency: 'Weekly',
    lastGenerated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    size: '1.8 MB',
    pages: 12
  },
  {
    id: 'benchmark',
    name: 'Benchmarking Report',
    description: 'Comparative analysis with peer institutions',
    icon: TrendingUp,
    frequency: 'Quarterly',
    lastGenerated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    size: '3.1 MB',
    pages: 22
  },
  {
    id: 'compliance',
    name: 'Compliance Report',
    description: 'Regulatory compliance and documentation status',
    icon: CheckCircle,
    frequency: 'Monthly',
    lastGenerated: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    nextScheduled: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    size: '1.2 MB',
    pages: 8
  },
  {
    id: 'data-export',
    name: 'Data Export',
    description: 'Raw data export in CSV/Excel format',
    icon: FileSpreadsheet,
    frequency: 'On-demand',
    lastGenerated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextScheduled: null,
    size: '856 KB',
    pages: null
  }
]

const recentReports = [
  {
    name: 'Monthly Performance Report - November 2024',
    type: 'Performance Report',
    generatedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    status: 'ready',
    size: '2.4 MB'
  },
  {
    name: 'AI Insights & Recommendations - Week 48',
    type: 'AI Improvement Report',
    generatedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'ready',
    size: '1.8 MB'
  },
  {
    name: 'Data Export - Complete Dataset',
    type: 'Data Export',
    generatedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'ready',
    size: '856 KB'
  },
  {
    name: 'Compliance Status Report - October 2024',
    type: 'Compliance Report',
    generatedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: 'ready',
    size: '1.2 MB'
  }
]

export default function Reports() {
  const { selectedInstitution } = useStore()
  const [previewReport, setPreviewReport] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState<string>('')
  const [generating, setGenerating] = useState<string | null>(null)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [configSaving, setConfigSaving] = useState(false)

  if (!selectedInstitution) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-neutral-text-secondary">No institution selected</p>
      </div>
    )
  }

  const handleDownload = (reportId: string) => {
    setGenerating(reportId)
    setTimeout(() => {
      const reportTypeMap: Record<string, 'performance' | 'improvement' | 'benchmark' | 'compliance' | 'data-export'> = {
        'performance': 'performance',
        'improvement': 'improvement',
        'benchmark': 'benchmark',
        'compliance': 'compliance',
        'data-export': 'data-export'
      }
      const reportType = reportTypeMap[reportId] || 'performance'
      const htmlContent = generateReport({ type: reportType, institution: selectedInstitution })
      const safeInstName = selectedInstitution.name.replace(/[^a-zA-Z0-9]/g, '-')
      const filename = reportId + '-report-' + safeInstName + '-' + new Date().toISOString().split('T')[0] + '.html'
      downloadReport(htmlContent, filename)
      setGenerating(null)
      alert('✅ Report downloaded successfully!')
    }, 800)
  }

  const handlePreview = (reportId: string) => {
    const reportTypeMap: Record<string, 'performance' | 'improvement' | 'benchmark' | 'compliance' | 'data-export'> = {
      'performance': 'performance',
      'improvement': 'improvement',
      'benchmark': 'benchmark',
      'compliance': 'compliance',
      'data-export': 'data-export'
    }
    const reportType = reportTypeMap[reportId] || 'performance'
    const htmlContent = generateReport({ type: reportType, institution: selectedInstitution })
    setPreviewContent(htmlContent)
    setPreviewReport(reportId)
  }

  const handleEmailReport = (reportName: string) => {
    setEmailSending(true)
    setTimeout(() => {
      setEmailSending(false)
      const email = selectedInstitution.email || 'admin@institution.edu'
      alert('✅ Email sent successfully!\n\n"' + reportName + '" has been sent to ' + email)
    }, 1500)
  }

  const handleTestEmail = (reportType: string) => {
    setEmailSending(true)
    setTimeout(() => {
      setEmailSending(false)
      const email = selectedInstitution.email || 'admin@institution.edu'
      alert('✅ Test email sent!\n\nA sample "' + reportType + '" has been sent to ' + email)
    }, 1200)
  }

  const handleConfigureSchedule = (reportType: string) => {
    setShowConfigModal(true)
  }

  const handleNotifications = () => {
    setShowNotificationModal(true)
  }

  const handleCreateCustomReport = () => {
    setShowEmailModal(true)
  }

  const saveConfiguration = () => {
    setConfigSaving(true)
    setTimeout(() => {
      setConfigSaving(false)
      setShowConfigModal(false)
      alert('✅ Configuration saved successfully!')
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
              Automated Reports
            </h1>
          </div>
          <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
            Generate, schedule, and download AI-powered institutional reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleConfigureSchedule('All Reports')}>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" onClick={handleNotifications}>
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-text-primary dark:text-neutral-100">
                  Generate Custom Report
                </h3>
                <p className="text-sm text-neutral-text-secondary dark:text-neutral-400 mt-1">
                  Create a custom report with selected metrics and date range
                </p>
              </div>
            </div>
            <Button onClick={handleCreateCustomReport}>
              <FileBarChart className="w-4 h-4 mr-2" />
              Create Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-text-primary dark:text-neutral-100">
          Scheduled Reports
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon
            const daysUntilNext = report.nextScheduled
              ? Math.ceil((report.nextScheduled.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null

            return (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {report.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {report.frequency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-neutral-text-secondary">
                      <Clock className="w-4 h-4" />
                      <div>
                        <p className="text-xs text-neutral-text-muted">Last Generated</p>
                        <p className="font-medium text-neutral-text-primary dark:text-neutral-100">
                          {formatDate(report.lastGenerated)}
                        </p>
                      </div>
                    </div>
                    {report.nextScheduled && (
                      <div className="flex items-center gap-2 text-neutral-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <div>
                          <p className="text-xs text-neutral-text-muted">Next Scheduled</p>
                          <p className="font-medium text-neutral-text-primary dark:text-neutral-100">
                            In {daysUntilNext} days
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-border dark:border-neutral-700">
                    <div className="flex items-center gap-3 text-sm text-neutral-text-muted">
                      <span>{report.size}</span>
                      {report.pages && <span>• {report.pages} pages</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handlePreview(report.id)}>
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(report.id)}
                        disabled={generating === report.id}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        {generating === report.id ? 'Generating...' : 'Download'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your recently generated reports</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentReports.map((report, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg hover:bg-neutral-bg-tertiary dark:hover:bg-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-text-primary dark:text-neutral-100">
                      {report.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant="outline" className="text-xs">{report.type}</Badge>
                      <span className="text-sm text-neutral-text-secondary">
                        {formatDate(report.generatedDate)}
                      </span>
                      <span className="text-sm text-neutral-text-muted">• {report.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success/10 text-success border-success/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Ready
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => handlePreview('performance')}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDownload('performance')}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleEmailReport(report.name)}>
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Delivery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Automatic Email Delivery
          </CardTitle>
          <CardDescription>Configure automatic report delivery to your email</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start justify-between p-4 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-neutral-text-primary dark:text-neutral-100">
                    Monthly Performance Report
                  </h4>
                  <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
                </div>
                <p className="text-sm text-neutral-text-secondary dark:text-neutral-400 mb-3">
                  Delivered on the 1st of every month to: {selectedInstitution.email || 'admin@institution.edu'}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleConfigureSchedule('Monthly Performance Report')}>
                    Edit Schedule
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTestEmail('Monthly Performance Report')}>
                    Test Email
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between p-4 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-neutral-text-primary dark:text-neutral-100">
                    Weekly AI Insights
                  </h4>
                  <Badge variant="outline">Configured</Badge>
                </div>
                <p className="text-sm text-neutral-text-secondary dark:text-neutral-400 mb-3">
                  Delivered every Monday at 9:00 AM to: {selectedInstitution.email || 'admin@institution.edu'}
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleConfigureSchedule('Weekly AI Insights')}>
                    Edit Schedule
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleTestEmail('Weekly AI Insights')}>
                    Test Email
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => alert('📧 Add New Email Schedule\\n\\nConfigure automatic email delivery for:\\n• Report type\\n• Frequency (daily, weekly, monthly)\\n• Recipients\\n• Custom subject & message\\n\\n(Opening email scheduler...)')}>
              <Mail className="w-4 h-4 mr-2" />
              Add New Email Schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setPreviewReport(null)}>
          <Card className="w-full max-w-6xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="border-b border-neutral-border dark:border-neutral-700">
              <div className="flex items-center justify-between">
                <CardTitle>Report Preview</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleDownload(previewReport)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setPreviewReport(null)}>
                    ✕
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <iframe
                srcDoc={previewContent}
                className="w-full h-full min-h-[600px] border-0"
                title="Report Preview"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowConfigModal(false)}>
          <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Report Schedule Configuration</CardTitle>
              <CardDescription>Configure automatic report generation schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Frequency</label>
                <select className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800">
                  <option>Daily</option>
                  <option selected>Weekly</option>
                  <option>Monthly</option>
                  <option>Quarterly</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Day of Week</label>
                <select className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800">
                  <option selected>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <input type="time" defaultValue="09:00" className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Recipients</label>
                <input type="email" defaultValue={selectedInstitution.email || 'admin@institution.edu'} className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800" />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowConfigModal(false)}>Cancel</Button>
                <Button onClick={saveConfiguration} disabled={configSaving}>
                  {configSaving ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Settings Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNotificationModal(false)}>
          <Card className="w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you receive report notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-neutral-text-secondary">Receive reports via email</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">In-App Alerts</p>
                  <p className="text-sm text-neutral-text-secondary">Show notifications in dashboard</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Report Ready Alerts</p>
                  <p className="text-sm text-neutral-text-secondary">Notify when reports are generated</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowNotificationModal(false)}>Cancel</Button>
                <Button onClick={() => { setShowNotificationModal(false); alert('✅ Notification settings saved!'); }}>
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Custom Report Builder Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowEmailModal(false)}>
          <Card className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <CardTitle>Create Custom Report</CardTitle>
              <CardDescription>Select metrics and configure your custom report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Report Name</label>
                <input type="text" placeholder="My Custom Report" className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800" />
                  <input type="date" className="w-full p-2 border rounded-lg bg-white dark:bg-neutral-800" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Include Metrics</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 border rounded">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">DSI Score</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border rounded">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Faculty Quality</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border rounded">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Research Output</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border rounded">
                    <input type="checkbox" />
                    <span className="text-sm">Student Outcomes</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setShowEmailModal(false)}>Cancel</Button>
                <Button onClick={() => { setShowEmailModal(false); handleDownload('performance'); }}>
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
