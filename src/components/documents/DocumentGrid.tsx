import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Document } from '@/types'
import { FileText, Eye, Download, Trash2, AlertTriangle } from 'lucide-react'
import { formatFileSize, formatDate } from '@/lib/utils'

interface DocumentGridProps {
  documents: Document[]
  onView?: (document: Document) => void
  onDelete?: (document: Document) => void
}

export default function DocumentGrid({ documents, onView, onDelete }: DocumentGridProps) {
  const getStatusBadge = (status: Document['status']) => {
    const variants: Record<Document['status'], any> = {
      verified: 'verified',
      pending: 'pending',
      missing: 'missing',
      rejected: 'destructive',
      flagged: 'flagged'
    }
    return variants[status] || 'outline'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100 truncate">
                  {doc.name}
                </h4>
                <p className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
                  {doc.type}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getStatusBadge(doc.status)} className="text-xs">
                    {doc.status}
                  </Badge>
                  {doc.size && (
                    <span className="text-xs text-neutral-text-muted dark:text-neutral-500">
                      {doc.size}
                    </span>
                  )}
                </div>
                {doc.uploadDate && (
                  <p className="text-xs text-neutral-text-muted dark:text-neutral-500 mt-2">
                    Uploaded: {formatDate(doc.uploadDate)}
                  </p>
                )}
                {doc.status === 'verified' && (
                  <div className="mt-2">
                    <div className="flex items-center gap-1 text-xs text-success">
                      <span className="font-medium">DSI Contribution:</span>
                      <span className="font-bold">+{doc.dsiContribution.toFixed(1)}%</span>
                    </div>
                  </div>
                )}
                {doc.status === 'flagged' && doc.rejectionReason && (
                  <div className="mt-2 flex items-start gap-1 text-xs text-warning">
                    <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    <span>{doc.rejectionReason}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              {onView && (
                <Button variant="outline" size="sm" onClick={() => onView(doc)} className="flex-1">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(doc)}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
