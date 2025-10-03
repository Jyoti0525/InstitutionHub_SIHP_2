import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { formatDate, daysUntilDeadline, getDSIColor } from '@/lib/utils'
import { Institution } from '@/types'

export default function ReviewQueue() {
  const navigate = useNavigate()
  const { institutions } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inst.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || inst.submissionStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: institutions.length,
    pending: institutions.filter(i => i.submissionStatus === 'pending_review').length,
    approved: institutions.filter(i => i.submissionStatus === 'approved').length,
    revision: institutions.filter(i => i.submissionStatus === 'revision_required').length,
  }

  const getStatusBadge = (status: Institution['submissionStatus']) => {
    const variants: Record<string, any> = {
      pending_review: 'warning',
      approved: 'success',
      rejected: 'destructive',
      revision_required: 'flagged',
      in_progress: 'info',
      not_started: 'outline'
    }
    return variants[status] || 'outline'
  }

  const getStatusIcon = (status: Institution['submissionStatus']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-success" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-error" />
      case 'pending_review':
        return <Clock className="w-4 h-4 text-warning" />
      case 'revision_required':
        return <AlertTriangle className="w-4 h-4 text-warning" />
      default:
        return <Clock className="w-4 h-4 text-neutral-text-muted" />
    }
  }

  const getPriorityColor = (daysLeft: number, dsi: number) => {
    if (daysLeft < 7 || dsi < 70) return 'error'
    if (daysLeft < 14 || dsi < 85) return 'warning'
    return 'success'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
            Review Queue
          </h1>
          <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
            Review and approve institutional submissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-neutral-text-primary dark:text-neutral-100">
              {stats.total}
            </div>
            <div className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
              Total Institutions
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">
              {stats.pending}
            </div>
            <div className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
              Pending Review
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">
              {stats.approved}
            </div>
            <div className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
              Approved
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-error">
              {stats.revision}
            </div>
            <div className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
              Needs Revision
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Institutions</CardTitle>
              <CardDescription>
                {filteredInstitutions.length} institution{filteredInstitutions.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-text-muted" />
                <Input
                  placeholder="Search institutions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'pending_review' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('pending_review')}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('approved')}
                >
                  Approved
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-border dark:border-neutral-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
                    Institution
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
                    DSI Score
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
                    Composite Score
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
                    Deadline
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
                    Priority
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInstitutions.map((inst) => {
                  const daysLeft = daysUntilDeadline(inst.deadline)
                  const priority = getPriorityColor(daysLeft, inst.currentDSI)

                  return (
                    <tr
                      key={inst.id}
                      className={`border-b border-neutral-border dark:border-neutral-700 hover:bg-neutral-bg dark:hover:bg-neutral-800 transition-colors ${
                        priority === 'error' ? 'border-l-4 border-l-error' : priority === 'warning' ? 'border-l-4 border-l-warning' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {priority === 'error' && (
                            <div className="w-2 h-2 bg-error rounded-full animate-pulse" title="High Priority" />
                          )}
                          {priority === 'warning' && (
                            <div className="w-2 h-2 bg-warning rounded-full" title="Medium Priority" />
                          )}
                          <div>
                            <div className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100">
                              {inst.name}
                            </div>
                            <div className="text-xs text-neutral-text-muted dark:text-neutral-500">
                              {inst.id} • {inst.state}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-xs">
                          {inst.type}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="font-bold text-sm"
                            style={{ color: getDSIColor(inst.currentDSI) }}
                          >
                            {inst.currentDSI.toFixed(1)}%
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100">
                          {inst.compositeScore.toFixed(1)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(inst.submissionStatus)}
                          <Badge variant={getStatusBadge(inst.submissionStatus)} className="text-xs">
                            {inst.submissionStatus.replace('_', ' ')}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-neutral-text-secondary dark:text-neutral-400">
                          {formatDate(inst.deadline)}
                        </div>
                        <div className="text-xs text-neutral-text-muted dark:text-neutral-500">
                          {daysLeft} days left
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            priority === 'error' ? 'destructive' :
                            priority === 'warning' ? 'warning' : 'outline'
                          }
                          className="text-xs"
                        >
                          {priority === 'error' ? 'High' : priority === 'warning' ? 'Medium' : 'Low'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/institution/${inst.id}`)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
