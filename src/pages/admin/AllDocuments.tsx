import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  FileText,
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  ChevronRight,
  ArrowLeft
} from 'lucide-react'
import { Document, Institution } from '@/types'
import { formatDate } from '@/lib/utils'

export default function AllDocuments() {
  const { institutions, getDocumentsByInstitutionId } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null)

  // Filter institutions
  const filteredInstitutions = institutions.filter(inst =>
    inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get total document count across all institutions
  const getTotalDocuments = () => {
    let total = 0
    institutions.forEach(inst => {
      const docs = getDocumentsByInstitutionId(inst.id)
      total += docs.length
    })
    return total
  }

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />
      case 'flagged':
        return <AlertTriangle className="w-4 h-4 text-warning" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-error" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'verified':
        return 'bg-success/10 text-success border-success/20'
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'flagged':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'rejected':
        return 'bg-error/10 text-error border-error/20'
      default:
        return 'bg-neutral-bg-secondary text-neutral-text-secondary'
    }
  }

  // If an institution is selected, show its documents
  if (selectedInstitution) {
    const documents = getDocumentsByInstitutionId(selectedInstitution.id)
    const stats = {
      total: documents.length,
      pending: documents.filter(d => d.status === 'pending').length,
      verified: documents.filter(d => d.status === 'verified').length,
      flagged: documents.filter(d => d.status === 'flagged').length,
      rejected: documents.filter(d => d.status === 'rejected').length
    }

    return (
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div>
          <Button
            variant="ghost"
            onClick={() => setSelectedInstitution(null)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Institutions
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
                {selectedInstitution.name}
              </h1>
              <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
                {selectedInstitution.state} • {selectedInstitution.type}
              </p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-text-secondary">Total Documents</p>
                  <p className="text-2xl font-bold text-neutral-text-primary dark:text-neutral-100 mt-1">
                    {stats.total}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-text-secondary">Pending</p>
                  <p className="text-2xl font-bold text-warning mt-1">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-warning opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-text-secondary">Verified</p>
                  <p className="text-2xl font-bold text-success mt-1">{stats.verified}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-text-secondary">Flagged</p>
                  <p className="text-2xl font-bold text-warning mt-1">{stats.flagged}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-text-secondary">Rejected</p>
                  <p className="text-2xl font-bold text-error mt-1">{stats.rejected}</p>
                </div>
                <XCircle className="w-8 h-8 text-error opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>Documents ({documents.length})</CardTitle>
            <CardDescription>All documents submitted by this institution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {documents.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 mx-auto text-neutral-text-muted dark:text-neutral-600 mb-3" />
                  <p className="text-neutral-text-secondary dark:text-neutral-400">
                    No documents found
                  </p>
                </div>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg hover:bg-neutral-bg-tertiary dark:hover:bg-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-neutral-text-primary dark:text-neutral-100 truncate">
                            {doc.name}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-text-secondary">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {doc.uploadDate ? formatDate(new Date(doc.uploadDate)) : 'N/A'}
                          </span>
                          <span>{doc.size}</span>
                          {doc.verificationSource && (
                            <span className="text-xs text-neutral-text-muted">
                              • {doc.verificationSource}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant="default" className={`${getStatusColor(doc.status)} flex items-center gap-1`}>
                        {getStatusIcon(doc.status)}
                        {doc.status}
                      </Badge>

                      <div className="text-right min-w-[60px]">
                        <p className="text-xs text-neutral-text-muted">DSI</p>
                        <p className="text-sm font-bold text-primary">
                          +{doc.dsiContribution?.toFixed(1) || '0'}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {doc.status === 'pending' && (
                          <>
                            <Button size="sm" variant="ghost" className="text-success hover:text-success">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-error hover:text-error">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show list of institutions
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
          Documents by Institution
        </h1>
        <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
          Select an institution to view their submitted documents
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-text-muted" />
            <Input
              type="text"
              placeholder="Search institutions by name or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-text-secondary">Total Institutions</p>
                <p className="text-2xl font-bold text-neutral-text-primary dark:text-neutral-100 mt-1">
                  {institutions.length}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-text-secondary">Total Documents</p>
                <p className="text-2xl font-bold text-primary mt-1">
                  {getTotalDocuments()}
                </p>
              </div>
              <FileText className="w-8 h-8 text-primary opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-neutral-text-secondary">Showing Results</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {filteredInstitutions.length}
                </p>
              </div>
              <Search className="w-8 h-8 text-success opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Institutions List */}
      <Card>
        <CardHeader>
          <CardTitle>Institutions ({filteredInstitutions.length})</CardTitle>
          <CardDescription>Click on an institution to view their documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredInstitutions.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 mx-auto text-neutral-text-muted dark:text-neutral-600 mb-3" />
                <p className="text-neutral-text-secondary dark:text-neutral-400">
                  No institutions found
                </p>
              </div>
            ) : (
              filteredInstitutions.slice(0, 50).map((inst) => {
                const docs = getDocumentsByInstitutionId(inst.id)
                const pendingCount = docs.filter(d => d.status === 'pending').length

                return (
                  <div
                    key={inst.id}
                    onClick={() => setSelectedInstitution(inst)}
                    className="flex items-center justify-between p-4 bg-neutral-bg-secondary dark:bg-neutral-800 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 cursor-pointer transition-colors border-2 border-transparent hover:border-primary/20"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-text-primary dark:text-neutral-100 mb-1">
                          {inst.name}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-neutral-text-secondary">
                          <span>{inst.state}</span>
                          <span>•</span>
                          <Badge variant="outline" className="text-xs">
                            {inst.type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-neutral-text-muted">Documents</p>
                        <p className="text-2xl font-bold text-primary">{docs.length}</p>
                      </div>
                      {pendingCount > 0 && (
                        <Badge className="bg-warning/10 text-warning border-warning/20">
                          {pendingCount} pending
                        </Badge>
                      )}
                      <ChevronRight className="w-5 h-5 text-neutral-text-muted" />
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
