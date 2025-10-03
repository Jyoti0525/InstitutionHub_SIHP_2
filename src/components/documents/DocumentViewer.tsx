import { Document } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, FileText, Calendar, User, CheckCircle, AlertTriangle } from 'lucide-react'
import { formatDate, formatFileSize } from '@/lib/utils'

interface DocumentViewerProps {
  document: Document | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DocumentViewer({ document, open, onOpenChange }: DocumentViewerProps) {
  if (!document) return null

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

  const handleDownload = async () => {
    try {
      const htmlFileName = document.name.replace('.pdf', '.html')
      const response = await fetch(`/documents/${htmlFileName}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = url
      link.download = htmlFileName
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary" />
            {document.name}
          </DialogTitle>
          <DialogDescription>
            Document details and verification information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-bg dark:bg-neutral-900 rounded-lg">
            <div>
              <p className="text-xs text-neutral-text-muted dark:text-neutral-500 mb-1">Document Type</p>
              <p className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100">
                {document.type}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-text-muted dark:text-neutral-500 mb-1">Category</p>
              <p className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100">
                {document.category}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-text-muted dark:text-neutral-500 mb-1">Upload Date</p>
              <p className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {document.uploadDate ? formatDate(document.uploadDate) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-text-muted dark:text-neutral-500 mb-1">File Size</p>
              <p className="font-medium text-sm text-neutral-text-primary dark:text-neutral-100">
                {document.size || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-neutral-text-muted dark:text-neutral-500 mb-1">Status</p>
              <Badge variant={getStatusBadge(document.status)} className="text-xs">
                {document.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs text-neutral-text-muted dark:text-neutral-500 mb-1">DSI Contribution</p>
              <p className="font-medium text-sm text-success">
                +{document.dsiContribution.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Verification Details */}
          {document.status === 'verified' && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-success mb-2">Verification Completed</h4>
                  <div className="space-y-2">
                    {document.verificationDate && (
                      <p className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                        <strong>Verified on:</strong> {formatDate(document.verificationDate)}
                      </p>
                    )}
                    {document.verificationSource && (
                      <p className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                        <strong>Source:</strong> {document.verificationSource}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <p className="text-xs text-neutral-text-muted dark:text-neutral-500">Completeness</p>
                        <p className="text-sm font-bold text-success">{(document.completeness * 100).toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-neutral-text-muted dark:text-neutral-500">Verification Score</p>
                        <p className="text-sm font-bold text-success">{(document.verificationScore * 100).toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Flagged/Rejected Reason */}
          {(document.status === 'flagged' || document.status === 'rejected') && document.rejectionReason && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm text-warning mb-2">Issue Identified</h4>
                  <p className="text-sm text-neutral-text-secondary dark:text-neutral-400">
                    {document.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* AI Insights */}
          {document.aiInsights && document.aiInsights.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-neutral-text-primary dark:text-neutral-100">
                AI Analysis Insights
              </h4>
              <ul className="space-y-2">
                {document.aiInsights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-neutral-text-secondary dark:text-neutral-400">
                    <span className="text-info mt-0.5">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Document Preview */}
          <div className="border border-neutral-border dark:border-neutral-700 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 dark:bg-neutral-800 p-3 border-b border-neutral-border dark:border-neutral-700">
              <p className="text-sm font-medium text-neutral-text-primary dark:text-neutral-100">
                Document Preview
              </p>
            </div>
            <iframe
              src={document.url || `/documents/${document.name.replace('.pdf', '.html')}`}
              className="w-full h-[600px] border-0 bg-white dark:bg-neutral-900"
              title="Document Preview"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-border dark:border-neutral-700">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
