import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Document } from '@/types'
import { FileText, Eye, Trash2, AlertTriangle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface DocumentListProps {
  documents: Document[]
  onView?: (document: Document) => void
  onDelete?: (document: Document) => void
}

export default function DocumentList({ documents, onView, onDelete }: DocumentListProps) {
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
    <div className="space-y-2">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="flex items-center gap-4 p-4 border border-neutral-border dark:border-neutral-700 rounded-lg hover:bg-neutral-bg dark:hover:bg-neutral-900 transition-colors"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100 truncate">
              {doc.name}
            </h4>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                {doc.type}
              </span>
              {doc.size && (
                <>
                  <span className="text-xs text-neutral-text-muted">•</span>
                  <span className="text-xs text-neutral-text-muted dark:text-neutral-500">
                    {doc.size}
                  </span>
                </>
              )}
              {doc.uploadDate && (
                <>
                  <span className="text-xs text-neutral-text-muted">•</span>
                  <span className="text-xs text-neutral-text-muted dark:text-neutral-500">
                    {formatDate(doc.uploadDate)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={getStatusBadge(doc.status)} className="text-xs">
              {doc.status}
            </Badge>

            {doc.status === 'verified' && (
              <div className="text-xs text-success font-medium">
                +{doc.dsiContribution.toFixed(1)}%
              </div>
            )}

            {doc.status === 'flagged' && doc.rejectionReason && (
              <AlertTriangle className="w-4 h-4 text-warning" />
            )}
          </div>

          <div className="flex items-center gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(doc)}>
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
        </div>
      ))}
    </div>
  )
}
