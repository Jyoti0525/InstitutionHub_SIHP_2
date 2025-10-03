import { Document, DocumentRequirement, DSICalculation } from '@/types'

/**
 * Core DSI Calculation Algorithm
 * DSI (Document Sufficiency Index) = Weighted sum of:
 * - Document Presence (uploaded or not)
 * - Document Completeness (quality of data)
 * - Document Verifiability (authenticity score)
 */

export function calculateDSI(
  documents: Document[],
  requirements: DocumentRequirement[]
): number {
  let totalScore = 0
  let totalWeight = 0

  requirements.forEach(req => {
    const doc = documents.find(d => d.type === req.type && d.status !== 'rejected')

    // Document Presence (0 or 1)
    const presence = doc ? 1 : 0

    // Document Completeness (0-1 scale)
    const completeness = doc?.completeness ?? 0

    // Document Verifiability (0-1 scale)
    const verifiability = doc?.verificationScore ?? 0

    // Calculate weighted score for this document
    const docScore = req.weight * presence * completeness * verifiability

    totalScore += docScore
    totalWeight += req.weight
  })

  // Normalize to 0-100 scale
  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0
}

/**
 * Calculate DSI contribution of a single document
 */
export function calculateDocumentContribution(
  document: Document,
  requirement: DocumentRequirement,
  totalWeight: number
): number {
  const presence = 1 // Document exists
  const completeness = document.completeness
  const verifiability = document.verificationScore

  const contribution = (requirement.weight * presence * completeness * verifiability) / totalWeight * 100

  return Math.round(contribution * 10) / 10 // Round to 1 decimal
}

/**
 * Get detailed DSI breakdown by category
 */
export function getDSIBreakdown(
  documents: Document[],
  requirements: DocumentRequirement[]
): DSICalculation['breakdown'] {
  const categories = [...new Set(requirements.map(r => r.category))]

  return categories.map(category => {
    const categoryReqs = requirements.filter(r => r.category === category)

    const requiredDocs = categoryReqs.length

    // Count documents that match this category's requirements
    let submittedDocs = 0
    let verifiedDocs = 0

    categoryReqs.forEach(req => {
      const matchingDoc = documents.find(d => d.type === req.type && d.status !== 'rejected')
      if (matchingDoc && matchingDoc.status !== 'missing') {
        submittedDocs++
        if (matchingDoc.status === 'verified') {
          verifiedDocs++
        }
      }
    })

    // Calculate category score
    let categoryScore = 0
    let categoryWeight = 0

    categoryReqs.forEach(req => {
      const doc = documents.find(d => d.type === req.type && d.status !== 'rejected')
      const presence = doc ? 1 : 0
      const completeness = doc?.completeness ?? 0
      const verifiability = doc?.verificationScore ?? 0

      categoryScore += req.weight * presence * completeness * verifiability
      categoryWeight += req.weight
    })

    const normalizedScore = categoryWeight > 0 ? (categoryScore / categoryWeight) * 100 : 0
    const contribution = categoryWeight

    return {
      category,
      requiredDocs,
      submittedDocs,
      verifiedDocs,
      categoryScore: Math.round(normalizedScore),
      contribution: Math.round(contribution * 10) / 10,
    }
  })
}

/**
 * Get list of missing critical documents
 */
export function getMissingCriticalDocuments(
  documents: Document[],
  requirements: DocumentRequirement[]
): string[] {
  return requirements
    .filter(req => req.mandatory)
    .filter(req => {
      const doc = documents.find(d => d.type === req.type)
      return !doc || doc.status === 'missing' || doc.status === 'rejected'
    })
    .map(req => req.type)
}

/**
 * Generate recommendations based on DSI analysis
 */
export function generateDSIRecommendations(
  dsi: number,
  breakdown: DSICalculation['breakdown'],
  missingCriticalDocs: string[]
): string[] {
  const recommendations: string[] = []

  // Critical documents missing
  if (missingCriticalDocs.length > 0) {
    recommendations.push(
      `Upload ${missingCriticalDocs.length} missing critical document${missingCriticalDocs.length > 1 ? 's' : ''} immediately to improve DSI`
    )
  }

  // DSI too low
  if (dsi < 70) {
    recommendations.push('Your DSI is below the acceptable threshold of 70%. Focus on uploading mandatory documents first.')
  } else if (dsi < 90) {
    recommendations.push('Your DSI is good but can be improved. Review incomplete documents and provide additional information.')
  }

  // Category-specific recommendations
  const weakCategories = breakdown
    .filter(cat => cat.categoryScore < 70)
    .sort((a, b) => a.categoryScore - b.categoryScore)
    .slice(0, 3)

  weakCategories.forEach(cat => {
    const missingCount = cat.requiredDocs - cat.submittedDocs
    if (missingCount > 0) {
      recommendations.push(
        `Upload ${missingCount} missing document${missingCount > 1 ? 's' : ''} in "${cat.category}" category`
      )
    } else {
      recommendations.push(
        `Improve document quality in "${cat.category}" category - ensure all required fields are complete`
      )
    }
  })

  // Pending verifications
  const pendingCategories = breakdown.filter(
    cat => cat.submittedDocs > cat.verifiedDocs
  )

  if (pendingCategories.length > 0) {
    const totalPending = pendingCategories.reduce(
      (sum, cat) => sum + (cat.submittedDocs - cat.verifiedDocs),
      0
    )
    recommendations.push(
      `${totalPending} document${totalPending > 1 ? 's' : ''} pending verification - check for any flagged issues`
    )
  }

  // Excellent DSI
  if (dsi >= 95) {
    recommendations.push('Excellent! Your documentation is comprehensive. Maintain regular updates.')
  }

  return recommendations.slice(0, 5) // Limit to top 5 recommendations
}

/**
 * Calculate what DSI would be if a document was added/verified
 */
export function projectDSIWithDocument(
  currentDocuments: Document[],
  newDocument: Partial<Document>,
  requirements: DocumentRequirement[]
): { currentDSI: number; projectedDSI: number; improvement: number } {
  const currentDSI = calculateDSI(currentDocuments, requirements)

  const projectedDocuments = [
    ...currentDocuments,
    {
      ...newDocument,
      completeness: newDocument.completeness ?? 1,
      verificationScore: newDocument.verificationScore ?? 0.8,
    } as Document,
  ]

  const projectedDSI = calculateDSI(projectedDocuments, requirements)
  const improvement = projectedDSI - currentDSI

  return {
    currentDSI,
    projectedDSI,
    improvement: Math.round(improvement * 10) / 10,
  }
}

/**
 * Get priority order for uploading documents based on impact
 */
export function getPriorityDocuments(
  currentDocuments: Document[],
  requirements: DocumentRequirement[]
): Array<{ type: string; category: string; impact: number; mandatory: boolean }> {
  const missingReqs = requirements.filter(req => {
    const doc = currentDocuments.find(d => d.type === req.type)
    return !doc || doc.status === 'missing' || doc.status === 'rejected'
  })

  return missingReqs
    .map(req => ({
      type: req.type,
      category: req.category,
      impact: req.weight,
      mandatory: req.mandatory,
    }))
    .sort((a, b) => {
      // Mandatory first
      if (a.mandatory && !b.mandatory) return -1
      if (!a.mandatory && b.mandatory) return 1
      // Then by impact
      return b.impact - a.impact
    })
}

/**
 * Full DSI calculation with all details
 */
export function calculateFullDSI(
  institutionId: string,
  documents: Document[],
  requirements: DocumentRequirement[]
): DSICalculation {
  const totalScore = calculateDSI(documents, requirements)
  const breakdown = getDSIBreakdown(documents, requirements)
  const missingCriticalDocs = getMissingCriticalDocuments(documents, requirements)
  const recommendations = generateDSIRecommendations(totalScore, breakdown, missingCriticalDocs)

  return {
    institutionId,
    totalScore,
    breakdown,
    missingCriticalDocs,
    recommendations,
    lastCalculated: new Date().toISOString(),
  }
}
