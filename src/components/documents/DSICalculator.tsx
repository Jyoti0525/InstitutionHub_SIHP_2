import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Document, DocumentRequirement } from '@/types'
import { calculateDSI, getDSIBreakdown, getMissingCriticalDocuments } from '@/utils/dsiCalculations'
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getDSIColor } from '@/lib/utils'

interface DSICalculatorProps {
  documents: Document[]
  requirements: DocumentRequirement[]
  showBreakdown?: boolean
}

export default function DSICalculator({
  documents,
  requirements,
  showBreakdown = true
}: DSICalculatorProps) {
  const dsi = useMemo(() => calculateDSI(documents, requirements), [documents, requirements])

  const breakdown = useMemo(
    () => getDSIBreakdown(documents, requirements),
    [documents, requirements]
  )

  const missingCritical = useMemo(
    () => getMissingCriticalDocuments(documents, requirements),
    [documents, requirements]
  )

  const totalDocs = requirements.length
  const submittedDocs = documents.filter(d => d.status !== 'missing').length
  const verifiedDocs = documents.filter(d => d.status === 'verified').length

  const dsiColor = getDSIColor(dsi)

  return (
    <div className="space-y-4">
      {/* Main DSI Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Document Sufficiency Index</span>
            <div
              className="text-4xl font-bold"
              style={{ color: dsiColor }}
            >
              {dsi.toFixed(1)}%
            </div>
          </CardTitle>
          <CardDescription>
            Real-time calculation based on uploaded and verified documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-text-secondary dark:text-neutral-400">
                Overall Progress
              </span>
              <span className="text-sm font-medium" style={{ color: dsiColor }}>
                {verifiedDocs}/{totalDocs} verified
              </span>
            </div>
            <Progress value={dsi} className="h-3" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-neutral-bg dark:bg-neutral-800 rounded-lg">
              <div className="text-2xl font-bold text-neutral-text-primary dark:text-neutral-100">
                {totalDocs}
              </div>
              <div className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
                Required
              </div>
            </div>
            <div className="text-center p-3 bg-info/10 rounded-lg">
              <div className="text-2xl font-bold text-info">
                {submittedDocs}
              </div>
              <div className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
                Submitted
              </div>
            </div>
            <div className="text-center p-3 bg-success/10 rounded-lg">
              <div className="text-2xl font-bold text-success">
                {verifiedDocs}
              </div>
              <div className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
                Verified
              </div>
            </div>
          </div>

          {/* Critical Missing Documents Alert */}
          {missingCritical.length > 0 && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-error mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-error">
                    {missingCritical.length} Critical Document{missingCritical.length > 1 ? 's' : ''} Missing
                  </p>
                  <p className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
                    {missingCritical.slice(0, 3).join(', ')}
                    {missingCritical.length > 3 && ` and ${missingCritical.length - 3} more`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {dsi >= 90 && (
            <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-success">
                    Excellent Documentation!
                  </p>
                  <p className="text-xs text-neutral-text-secondary dark:text-neutral-400 mt-1">
                    Your DSI score exceeds the recommended threshold of 90%
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {showBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Breakdown</CardTitle>
            <CardDescription>
              Document sufficiency by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {breakdown.map((cat) => {
                const categoryDSI = cat.categoryScore
                const categoryColor = getDSIColor(categoryDSI)

                return (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-text-primary dark:text-neutral-100">
                            {cat.category}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {cat.verifiedDocs}/{cat.requiredDocs}
                          </Badge>
                        </div>
                      </div>
                      <span
                        className="text-sm font-bold"
                        style={{ color: categoryColor }}
                      >
                        {categoryDSI.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={categoryDSI} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
