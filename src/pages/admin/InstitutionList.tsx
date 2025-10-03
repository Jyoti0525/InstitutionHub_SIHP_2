import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Eye, Download, Filter } from 'lucide-react'

export default function InstitutionList() {
  const { institutions } = useStore()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterState, setFilterState] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  // Get unique types and states
  const types = Array.from(new Set(institutions.map(i => i.type)))
  const states = Array.from(new Set(institutions.map(i => i.state)))

  // Filter institutions
  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inst.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || inst.type === filterType
    const matchesState = filterState === 'all' || inst.state === filterState
    const matchesStatus = filterStatus === 'all' || inst.submissionStatus === filterStatus

    return matchesSearch && matchesType && matchesState && matchesStatus
  })

  const handleViewDetails = (id: string) => {
    navigate(`/admin/institution/${id}`)
  }

  const handleExportData = () => {
    // Mock export functionality
    if (filteredInstitutions.length === 0) return

    const data = filteredInstitutions.map(inst => ({
      ID: inst.id,
      Name: inst.name,
      Type: inst.type,
      State: inst.state,
      DSI: inst.currentDSI,
      Composite: inst.compositeScore,
      Status: inst.submissionStatus,
      NAAC: inst.naacGrade
    }))

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'institutions.csv'
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">All Institutions</h1>
          <p className="text-neutral-text-secondary">
            Manage and view all registered institutions
          </p>
        </div>
        <Button onClick={handleExportData}>
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-text-muted" />
                <Input
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-neutral-border bg-white dark:bg-neutral-900 text-sm"
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">State</label>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-neutral-border bg-white dark:bg-neutral-900 text-sm"
              >
                <option value="all">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-neutral-border bg-white dark:bg-neutral-900 text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending_review">Pending Review</option>
                <option value="revision_required">Needs Revision</option>
                <option value="in_progress">In Progress</option>
                <option value="not_started">Not Started</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-neutral-text-secondary">
          Showing <span className="font-semibold">{filteredInstitutions.length}</span> of{' '}
          <span className="font-semibold">{institutions.length}</span> institutions
        </p>
        {(searchTerm || filterType !== 'all' || filterState !== 'all' || filterStatus !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('')
              setFilterType('all')
              setFilterState('all')
              setFilterStatus('all')
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInstitutions.map(inst => (
          <Card key={inst.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{inst.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <span>{inst.id}</span>
                    <span>•</span>
                    <span>{inst.state}</span>
                  </CardDescription>
                </div>
                <Badge variant="outline">{inst.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Scores */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-neutral-text-muted mb-1">DSI Score</p>
                    <p
                      className="text-xl font-bold"
                      style={{
                        color: inst.currentDSI >= 90 ? '#16a34a' :
                               inst.currentDSI >= 70 ? '#eab308' : '#dc2626'
                      }}
                    >
                      {inst.currentDSI.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-text-muted mb-1">Composite</p>
                    <p className="text-xl font-bold">{inst.compositeScore.toFixed(1)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-text-muted mb-1">NAAC Grade</p>
                    <p className="text-xl font-bold">{inst.naacGrade || 'N/A'}</p>
                  </div>
                </div>

                {/* Status and Deadline */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-text-muted">Status:</span>
                    <Badge
                      variant={
                        inst.submissionStatus === 'approved' ? 'verified' :
                        inst.submissionStatus === 'pending_review' ? 'pending' : 'warning'
                      }
                      className="text-xs"
                    >
                      {inst.submissionStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  <Button size="sm" onClick={() => handleViewDetails(inst.id)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>

                {inst.deadline && (
                  <div className="text-xs text-neutral-text-muted">
                    Next deadline: {new Date(inst.deadline).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInstitutions.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-neutral-text-muted">
              <p className="text-lg font-medium mb-2">No institutions found</p>
              <p className="text-sm">Try adjusting your filters or search term</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
