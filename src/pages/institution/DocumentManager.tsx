import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DocumentUploader from '@/components/documents/DocumentUploader'
import DocumentGrid from '@/components/documents/DocumentGrid'
import DocumentList from '@/components/documents/DocumentList'
import DSICalculator from '@/components/documents/DSICalculator'
import DocumentViewer from '@/components/documents/DocumentViewer'
import { Upload, Grid3x3, List, TrendingUp } from 'lucide-react'
import { Document } from '@/types'
import documentRequirementsData from '@/data/documentRequirements.json'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { Badge } from '@/components/ui/badge'

type SortOption = 'name' | 'date' | 'status' | 'type'

export default function DocumentManager() {
  const { selectedInstitution, getDocumentsByInstitutionId, addDocument, updateDocument, deleteDocument } = useStore()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('date')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [viewerOpen, setViewerOpen] = useState(false)

  if (!selectedInstitution) {
    return <div>No institution selected</div>
  }

  const documents = getDocumentsByInstitutionId(selectedInstitution.id)
  const requirements = documentRequirementsData

  const handleUpload = (files: File[]) => {
    // Simulate document upload with smart categorization
    files.forEach((file, index) => {
      const fileName = file.name.toLowerCase()
      let type = 'Other'
      let category = 'General'
      let dsiContribution = 3

      // Smart categorization based on filename
      if (fileName.includes('faculty') || fileName.includes('staff')) {
        type = 'Faculty'
        category = 'Faculty & Staff'
        dsiContribution = 8
      } else if (fileName.includes('student') || fileName.includes('enrollment')) {
        type = 'Academic'
        category = 'Student Data'
        dsiContribution = 7
      } else if (fileName.includes('research') || fileName.includes('publication')) {
        type = 'Research'
        category = 'Research & Innovation'
        dsiContribution = 9
      } else if (fileName.includes('placement') || fileName.includes('recruit')) {
        type = 'Placement'
        category = 'Placements'
        dsiContribution = 8
      } else if (fileName.includes('infrastructure') || fileName.includes('facility')) {
        type = 'Infrastructure'
        category = 'Infrastructure'
        dsiContribution = 6
      } else if (fileName.includes('financial') || fileName.includes('budget')) {
        type = 'Financial'
        category = 'Finance'
        dsiContribution = 5
      }

      const newDoc: Document = {
        id: `UPLOADED_${Date.now()}_${index}`,
        institutionId: selectedInstitution.id,
        name: file.name,
        type,
        category,
        status: 'pending',
        uploadDate: new Date().toISOString(),
        size: `${(file.size / 1024).toFixed(1)} KB`,
        dsiContribution,
        completeness: 0.75 + Math.random() * 0.25,
        verificationScore: 0,
        verificationSource: 'Uploaded by Institution',
        aiInsights: [
          'Document uploaded successfully',
          'Awaiting verification by admin',
          'Preliminary checks passed'
        ]
      }
      addDocument(newDoc)
    })

    // Show success notification
    alert(`✅ Successfully uploaded ${files.length} document${files.length > 1 ? 's' : ''}!\n\nYour documents are now in the "Pending" tab and awaiting admin verification.`)
  }

  const handleView = (doc: Document) => {
    setSelectedDocument(doc)
    setViewerOpen(true)
  }

  const handleDelete = (doc: Document) => {
    if (confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      deleteDocument(doc.id)
    }
  }

  const sortDocuments = (docs: Document[]) => {
    const sorted = [...docs]
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      case 'date':
        return sorted.sort((a, b) => {
          const dateA = a.uploadDate ? new Date(a.uploadDate).getTime() : 0
          const dateB = b.uploadDate ? new Date(b.uploadDate).getTime() : 0
          return dateB - dateA // Most recent first
        })
      case 'status':
        return sorted.sort((a, b) => a.status.localeCompare(b.status))
      case 'type':
        return sorted.sort((a, b) => a.type.localeCompare(b.type))
      default:
        return sorted
    }
  }

  const filterDocuments = (status?: Document['status']) => {
    const filtered = status ? documents.filter(d => d.status === status) : documents
    return sortDocuments(filtered)
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Documents' }]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
            Document Manager
          </h1>
          <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1 flex items-center gap-2">
            Upload, manage, and track your institutional documents
            <Badge variant="outline" className="ml-2">
              <TrendingUp className="w-3 h-3 mr-1" />
              Each upload improves your DSI
            </Badge>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 rounded-md border border-neutral-border bg-white dark:bg-neutral-900 text-sm flex items-center gap-2"
          >
            <option value="date">Sort: Date (Newest)</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="status">Sort: Status</option>
            <option value="type">Sort: Type</option>
          </select>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side (2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Drag and drop your documents or click to browse
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentUploader onUpload={handleUpload} />
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>
                {documents.length} total document{documents.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="all">
                    All ({documents.length})
                  </TabsTrigger>
                  <TabsTrigger value="verified">
                    Verified ({filterDocuments('verified').length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending ({filterDocuments('pending').length})
                  </TabsTrigger>
                  <TabsTrigger value="flagged">
                    Flagged ({filterDocuments('flagged').length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected ({filterDocuments('rejected').length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  {documents.length > 0 ? (
                    viewMode === 'grid' ? (
                      <DocumentGrid
                        documents={filterDocuments()}
                        onView={handleView}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <DocumentList
                        documents={filterDocuments()}
                        onView={handleView}
                        onDelete={handleDelete}
                      />
                    )
                  ) : (
                    <div className="text-center py-12">
                      <Upload className="w-12 h-12 mx-auto text-neutral-text-muted dark:text-neutral-600 mb-3" />
                      <p className="text-neutral-text-secondary dark:text-neutral-400">
                        No documents uploaded yet
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="verified">
                  {viewMode === 'grid' ? (
                    <DocumentGrid
                      documents={filterDocuments('verified')}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <DocumentList
                      documents={filterDocuments('verified')}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  )}
                </TabsContent>

                <TabsContent value="pending">
                  {viewMode === 'grid' ? (
                    <DocumentGrid
                      documents={filterDocuments('pending')}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <DocumentList
                      documents={filterDocuments('pending')}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  )}
                </TabsContent>

                <TabsContent value="flagged">
                  {viewMode === 'grid' ? (
                    <DocumentGrid
                      documents={filterDocuments('flagged')}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <DocumentList
                      documents={filterDocuments('flagged')}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  )}
                </TabsContent>

                <TabsContent value="rejected">
                  {viewMode === 'grid' ? (
                    <DocumentGrid
                      documents={filterDocuments('rejected')}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  ) : (
                    <DocumentList
                      documents={filterDocuments('rejected')}
                      onView={handleView}
                      onDelete={handleDelete}
                    />
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - DSI Calculator (1 column) */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <DSICalculator
              documents={documents}
              requirements={requirements}
              showBreakdown={true}
            />
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      <DocumentViewer
        document={selectedDocument}
        open={viewerOpen}
        onOpenChange={setViewerOpen}
      />
    </div>
  )
}
