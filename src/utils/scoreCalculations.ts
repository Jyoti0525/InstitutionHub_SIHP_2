import { Category, Submetric } from '@/types'
import { clamp } from '@/lib/utils'

/**
 * Normalize raw value to 0-100 score based on formula
 */
export function normalizeScore(
  rawValue: number,
  dataType: Submetric['dataType'],
  threshold?: Submetric['threshold']
): number {
  switch (dataType) {
    case 'percentage':
      // Already in 0-100 range
      return clamp(rawValue, 0, 100)

    case 'ratio':
      // Convert ratio to percentage (e.g., 0.75 -> 75)
      return clamp(rawValue * 100, 0, 100)

    case 'boolean':
      // Yes/No to 100/0
      return rawValue ? 100 : 0

    case 'grade':
      // Grade conversion (e.g., A+ = 95, A = 85, etc.)
      return convertGradeToScore(rawValue)

    case 'number':
      // Use thresholds for normalization
      if (threshold) {
        return normalizeWithThreshold(rawValue, threshold)
      }
      return clamp(rawValue, 0, 100)

    default:
      return clamp(rawValue, 0, 100)
  }
}

/**
 * Convert letter grade to numeric score
 */
function convertGradeToScore(grade: number): number {
  // Assuming grade is passed as numeric equivalent
  // A+ = 10, A = 9, B+ = 8, etc.
  const gradeMap: Record<number, number> = {
    10: 95,  // A+
    9: 85,   // A
    8: 75,   // B+
    7: 65,   // B
    6: 55,   // C+
    5: 45,   // C
    4: 35,   // D
    3: 25,   // E
  }
  return gradeMap[grade] || 0
}

/**
 * Normalize value using thresholds
 */
function normalizeWithThreshold(
  value: number,
  threshold: NonNullable<Submetric['threshold']>
): number {
  if (value >= threshold.excellent) return 95
  if (value >= threshold.good) return 80
  if (value >= threshold.average) return 60
  if (value >= threshold.poor) return 40
  return 20
}

/**
 * Calculate category score from submetrics
 */
export function calculateCategoryScore(
  submetrics: Submetric[]
): number {
  if (submetrics.length === 0) return 0

  let totalWeightedScore = 0
  let totalWeight = 0

  submetrics.forEach(sub => {
    totalWeightedScore += sub.normalizedScore * sub.weight
    totalWeight += sub.weight
  })

  return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0
}

/**
 * Calculate composite institutional score from all categories
 */
export function calculateCompositeScore(
  categories: Category[]
): number {
  if (categories.length === 0) return 0

  let totalWeightedScore = 0
  let totalWeight = 0

  categories.forEach(cat => {
    totalWeightedScore += cat.score * cat.weight
    totalWeight += cat.weight
  })

  return totalWeight > 0 ? Math.round(totalWeightedScore / totalWeight) : 0
}

/**
 * Calculate percentile ranking
 */
export function calculatePercentile(
  value: number,
  allValues: number[]
): number {
  if (allValues.length === 0) return 0

  const sorted = [...allValues].sort((a, b) => a - b)
  const rank = sorted.filter(v => v < value).length
  return Math.round((rank / sorted.length) * 100)
}

/**
 * Get performance level based on score
 */
export function getPerformanceLevel(score: number): {
  level: string
  color: string
  description: string
} {
  if (score >= 90) {
    return {
      level: 'Excellent',
      color: '#16a34a',
      description: 'Outstanding performance, among the top institutions',
    }
  } else if (score >= 75) {
    return {
      level: 'Good',
      color: '#0284c7',
      description: 'Above average performance with room for improvement',
    }
  } else if (score >= 60) {
    return {
      level: 'Average',
      color: '#eab308',
      description: 'Meeting basic standards, needs significant improvement',
    }
  } else {
    return {
      level: 'Needs Improvement',
      color: '#dc2626',
      description: 'Below standards, immediate action required',
    }
  }
}

/**
 * Calculate year-over-year growth
 */
export function calculateGrowth(
  currentScore: number,
  previousScore: number
): {
  value: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
} {
  const value = currentScore - previousScore
  const percentage = previousScore > 0 ? (value / previousScore) * 100 : 0

  let trend: 'up' | 'down' | 'stable'
  if (Math.abs(value) < 1) {
    trend = 'stable'
  } else if (value > 0) {
    trend = 'up'
  } else {
    trend = 'down'
  }

  return {
    value: Math.round(value * 10) / 10,
    percentage: Math.round(percentage * 10) / 10,
    trend,
  }
}

/**
 * Generate score insights and recommendations
 */
export function generateScoreInsights(
  categories: Category[],
  submetrics: Submetric[],
  compositeScore: number
): string[] {
  const insights: string[] = []

  // Overall performance
  const performanceLevel = getPerformanceLevel(compositeScore)
  insights.push(`Overall Performance: ${performanceLevel.level} (${compositeScore}/100)`)

  // Top performing categories
  const topCategories = [...categories]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  if (topCategories.length > 0 && topCategories[0].score >= 80) {
    insights.push(
      `Strong areas: ${topCategories.map(c => c.name).join(', ')}`
    )
  }

  // Weak categories needing attention
  const weakCategories = categories
    .filter(c => c.score < 60)
    .sort((a, b) => a.score - b.score)

  if (weakCategories.length > 0) {
    insights.push(
      `Priority improvements needed in: ${weakCategories.slice(0, 3).map(c => c.name).join(', ')}`
    )
  }

  // High-impact low-performing submetrics
  const criticalSubmetrics = submetrics
    .filter(s => s.normalizedScore < 50 && s.weight > 5)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)

  if (criticalSubmetrics.length > 0) {
    insights.push(
      `High-impact areas below 50%: ${criticalSubmetrics.map(s => s.name).join(', ')}`
    )
  }

  // Confidence warnings
  const lowConfidence = submetrics.filter(s => s.confidenceLevel === 'low')
  if (lowConfidence.length > 0) {
    insights.push(
      `${lowConfidence.length} metric${lowConfidence.length > 1 ? 's' : ''} have low confidence - verify supporting documents`
    )
  }

  return insights
}

/**
 * Calculate gap analysis between institution and peer
 */
export function calculateGapAnalysis(
  institutionCategories: Category[],
  peerMedianScores: Map<string, number>
): Array<{
  categoryId: string
  categoryName: string
  institutionScore: number
  peerScore: number
  gap: number
  gapPercentage: number
  status: 'ahead' | 'behind' | 'equal'
}> {
  return institutionCategories.map(cat => {
    const peerScore = peerMedianScores.get(cat.id) || 0
    const gap = cat.score - peerScore
    const gapPercentage = peerScore > 0 ? (gap / peerScore) * 100 : 0

    let status: 'ahead' | 'behind' | 'equal'
    if (Math.abs(gap) < 2) {
      status = 'equal'
    } else if (gap > 0) {
      status = 'ahead'
    } else {
      status = 'behind'
    }

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      institutionScore: cat.score,
      peerScore,
      gap: Math.round(gap * 10) / 10,
      gapPercentage: Math.round(gapPercentage * 10) / 10,
      status,
    }
  })
}

/**
 * Predict future score based on trend
 */
export function predictFutureScore(
  historicalScores: Array<{ year: number; score: number }>
): number {
  if (historicalScores.length < 2) return historicalScores[0]?.score || 0

  // Simple linear regression
  const n = historicalScores.length
  const sumX = historicalScores.reduce((sum, item) => sum + item.year, 0)
  const sumY = historicalScores.reduce((sum, item) => sum + item.score, 0)
  const sumXY = historicalScores.reduce((sum, item) => sum + item.year * item.score, 0)
  const sumX2 = historicalScores.reduce((sum, item) => sum + item.year * item.year, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  const latestYear = Math.max(...historicalScores.map(h => h.year))
  const nextYear = latestYear + 1

  const prediction = slope * nextYear + intercept

  return Math.round(clamp(prediction, 0, 100))
}
