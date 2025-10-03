import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DSIGauge from '@/components/dashboard/DSIGauge'
import DocumentViewer from '@/components/documents/DocumentViewer'
import {
  ArrowLeft, Building, MapPin, Calendar, Award, FileText, CheckCircle,
  AlertTriangle, Edit, Save, X
} from 'lucide-react'

export default function InstitutionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getInstitutionById, getDocumentsByInstitutionId, updateInstitution } = useStore()

  const institution = getInstitutionById(id || '')
  const documents = getDocumentsByInstitutionId(id || '')

  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedData, setEditedData] = useState({
    submissionStatus: institution?.submissionStatus || '',
    notes: ''
  })

  if (!institution) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-neutral-text-muted mb-4">Institution not found</p>
        <Button onClick={() => navigate('/admin/institutions')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Institutions
        </Button>
      </div>
    )
  }

  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc)
    setViewerOpen(true)
  }

  const handleSaveChanges = () => {
    if (editedData.submissionStatus) {
      updateInstitution(institution.id, {
        submissionStatus: editedData.submissionStatus as any
      })
    }
    setEditMode(false)
  }

  const verifiedDocs = documents.filter(d => d.status === 'verified').length
  const pendingDocs = documents.filter(d => d.status === 'pending').length
  const flaggedDocs = documents.filter(d => d.status === 'flagged' || d.status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/admin/institutions')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-1">{institution.name}</h1>
            <div className="flex items-center gap-3 text-sm text-neutral-text-muted">
              <span className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                {institution.id}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {institution.state}
              </span>
              <span>•</span>
              <Badge variant="outline">{institution.type}</Badge>
            </div>
          </div>
        </div>

        {!editMode ? (
          <Button onClick={() => setEditMode(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Status
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSaveChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditMode(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <DSIGauge value={institution.currentDSI} size="sm" showLabel={false} />
              <p className="text-sm text-neutral-text-muted mt-2">DSI Score</p>
              <p className="text-2xl font-bold mt-1">{institution.currentDSI.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="w-10 h-10 mx-auto mb-2 text-success" />
              <p className="text-sm text-neutral-text-muted mb-1">Composite Score</p>
              <p className="text-2xl font-bold">{institution.compositeScore.toFixed(1)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <FileText className="w-10 h-10 mx-auto mb-2 text-info" />
              <p className="text-sm text-neutral-text-muted mb-1">Documents</p>
              <p className="text-2xl font-bold">{documents.length}</p>
              <p className="text-xs text-neutral-text-muted mt-1">{verifiedDocs} verified</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              {editMode ? (
                <select
                  value={editedData.submissionStatus}
                  onChange={(e) => setEditedData({ ...editedData, submissionStatus: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-neutral-border text-sm"
                >
                  <option value="approved">Approved</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="revision_required">Needs Revision</option>
                  <option value="in_progress">In Progress</option>
                  <option value="not_started">Not Started</option>
                  <option value="rejected">Rejected</option>
                </select>
              ) : (
                <>
                  <CheckCircle className="w-10 h-10 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-neutral-text-muted mb-1">Status</p>
                  <Badge
                    variant={
                      institution.submissionStatus === 'approved' ? 'verified' :
                      institution.submissionStatus === 'pending_review' ? 'pending' : 'warning'
                    }
                  >
                    {institution.submissionStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Institution Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-neutral-text-muted">Institution ID:</span>
                  <span className="text-sm font-medium">{institution.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-neutral-text-muted">Type:</span>
                  <span className="text-sm font-medium">{institution.type}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-neutral-text-muted">State:</span>
                  <span className="text-sm font-medium">{institution.state}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-sm text-neutral-text-muted">NAAC Grade:</span>
                  <span className="text-sm font-medium">{institution.naacGrade || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-neutral-text-muted">Next Deadline:</span>
                  <span className="text-sm font-medium">
                    {institution.nextDeadline ? new Date(institution.nextDeadline).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">DSI Score</span>
                    <span className="text-sm font-bold">{institution.currentDSI.toFixed(1)}</span>
                  </div>
                  <div className="h-2 bg-neutral-bg dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${institution.currentDSI}%`,
                        backgroundColor: institution.currentDSI >= 90 ? '#16a34a' :
                                       institution.currentDSI >= 70 ? '#eab308' : '#dc2626'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Composite Score</span>
                    <span className="text-sm font-bold">{institution.compositeScore.toFixed(1)}</span>
                  </div>
                  <div className="h-2 bg-neutral-bg dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${institution.compositeScore}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Document Completion</span>
                    <span className="text-sm font-bold">{((verifiedDocs / documents.length) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-neutral-bg dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-success"
                      style={{ width: `${(verifiedDocs / documents.length) * 100}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {editMode && (
            <Card>
              <CardHeader>
                <CardTitle>Review Notes</CardTitle>
                <CardDescription>Add notes about this institution's review</CardDescription>
              </CardHeader>
              <CardContent>
                <textarea
                  value={editedData.notes}
                  onChange={(e) => setEditedData({ ...editedData, notes: e.target.value })}
                  placeholder="Enter review notes..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-md border border-neutral-border resize-none"
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-text-muted">Verified</p>
                    <p className="text-2xl font-bold text-success">{verifiedDocs}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-success opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-text-muted">Pending</p>
                    <p className="text-2xl font-bold text-warning">{pendingDocs}</p>
                  </div>
                  <FileText className="w-8 h-8 text-warning opacity-20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-text-muted">Flagged</p>
                    <p className="text-2xl font-bold text-error">{flaggedDocs}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-error opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>Documents submitted by this institution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-neutral-bg dark:hover:bg-neutral-900 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-neutral-text-muted" />
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-neutral-text-muted">{doc.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          doc.status === 'verified' ? 'verified' :
                          doc.status === 'pending' ? 'pending' :
                          doc.status === 'flagged' ? 'flagged' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {doc.status}
                      </Badge>
                      <Button size="sm" variant="outline" onClick={() => handleViewDocument(doc)}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent activity and status changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {institution.lastReviewDate && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-success" />
                      <div className="w-px h-full bg-neutral-border" />
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">Last Review Completed</p>
                      <p className="text-xs text-neutral-text-muted">
                        {new Date(institution.lastReviewDate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-info" />
                    <div className="w-px h-full bg-neutral-border" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">Institution Registered</p>
                    <p className="text-xs text-neutral-text-muted">Initial registration completed</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-neutral-border" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-text-muted">End of timeline</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DocumentViewer
        document={selectedDocument}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </div>
  )
}
