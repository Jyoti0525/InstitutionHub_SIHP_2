/**
 * Institution Data Generator
 * Generates realistic data for all 475 institutions across 5 states
 * Uses real DSI calculation based on document metrics
 */

import { institutionNames } from './institutionNames'
import type { Institution } from '@/types'

// Helper to generate random value within range
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

// Helper to select random item from array
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// Realistic submission statuses with distribution
const getRealisticStatus = (): Institution['submissionStatus'] => {
  const rand = Math.random()
  if (rand < 0.45) return 'approved'
  if (rand < 0.65) return 'pending_review'
  if (rand < 0.80) return 'in_progress'
  if (rand < 0.90) return 'revision_required'
  return 'not_started'
}

// Generate realistic dates
const generateRealisticDates = (established: number) => {
  const now = new Date()
  const currentYear = now.getFullYear()

  // Last updated: random within last 3 months
  const lastUpdated = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)

  // Deadline: 30-90 days from now
  const deadline = new Date(now.getTime() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000)

  return {
    lastUpdated: lastUpdated.toISOString(),
    deadline: deadline.toISOString()
  }
}

// Calculate document metrics that will be used for DSI
const calculateDocumentMetrics = (status: Institution['submissionStatus'], type: string) => {
  let documentCount: number
  let verifiedCount: number
  let pendingCount: number
  let rejectedCount: number

  const totalRequired = type.includes('University') ? 25 : type.includes('College') ? 20 : 18

  switch (status) {
    case 'approved':
      documentCount = totalRequired
      verifiedCount = totalRequired
      pendingCount = 0
      rejectedCount = 0
      break
    case 'pending_review':
      documentCount = totalRequired
      verifiedCount = Math.floor(totalRequired * randomInRange(0.6, 0.85))
      pendingCount = documentCount - verifiedCount
      rejectedCount = 0
      break
    case 'revision_required':
      documentCount = totalRequired - Math.floor(randomInRange(1, 4))
      verifiedCount = Math.floor(documentCount * randomInRange(0.4, 0.7))
      rejectedCount = Math.floor(randomInRange(1, 3))
      pendingCount = documentCount - verifiedCount - rejectedCount
      break
    case 'in_progress':
      documentCount = Math.floor(totalRequired * randomInRange(0.5, 0.85))
      verifiedCount = Math.floor(documentCount * randomInRange(0.3, 0.6))
      pendingCount = documentCount - verifiedCount
      rejectedCount = 0
      break
    case 'not_started':
      documentCount = Math.floor(randomInRange(0, 5))
      verifiedCount = 0
      pendingCount = documentCount
      rejected Count = 0
      break
  }

  return {
    totalRequired,
    documentCount,
    verifiedCount,
    pendingCount,
    rejectedCount,
    missingCount: totalRequired - documentCount - rejectedCount
  }
}

// Calculate realistic DSI based on document metrics
const calculateRealisticDSI = (metrics: ReturnType<typeof calculateDocumentMetrics>) => {
  const { totalRequired, verifiedCount, documentCount, rejectedCount } = metrics

  // Presence score (documents uploaded / total required)
  const presenceScore = (documentCount - rejectedCount) / totalRequired

  // Completeness score (verified / uploaded)
  const completenessScore = documentCount > 0 ? verifiedCount / documentCount : 0

  // Verification score (higher if more docs verified)
  const verificationScore = verifiedCount / totalRequired

  // Weighted DSI calculation
  const dsi = (presenceScore * 0.4 + completenessScore * 0.3 + verificationScore * 0.3) * 100

  return Math.round(dsi * 10) / 10
}

// Calculate composite score (DSI + other factors)
const calculateCompositeScore = (dsi: number, accreditation: string, established: number) => {
  let baseScore = dsi * 0.7 // DSI is 70% of composite

  // Accreditation bonus
  const accreditationBonus = accreditation.includes('A++') ? 15 :
                            accreditation.includes('A+') ? 12 :
                            accreditation.includes('A') ? 10 :
                            accreditation.includes('B++') ? 7 :
                            accreditation.includes('B+') ? 5 : 3

  // Legacy bonus (older institutions get slight bonus)
  const currentYear = new Date().getFullYear()
  const age = currentYear - established
  const legacyBonus = Math.min(age / 100 * 5, 5) // Max 5 points

  const composite = baseScore + accreditationBonus + legacyBonus

  return Math.min(Math.round(composite * 10) / 10, 100)
}

// Generate full institution data
export const generateInstitutionData = (): Institution[] => {
  const institutions: Institution[] = []
  let institutionCounter = 1

  for (const state of institutionNames.states) {
    for (const inst of state.institutions) {
      const status = getRealisticStatus()
      const dates = generateRealisticDates(inst.established)
      const docMetrics = calculateDocumentMetrics(status, inst.type)
      const currentDSI = calculateRealisticDSI(docMetrics)
      const compositeScore = calculateCompositeScore(currentDSI, inst.accreditation, inst.established)

      const institution: Institution = {
        id: inst.id,
        name: inst.name,
        type: inst.type,
        state: state.state,
        city: inst.city,
        district: inst.district,
        established: inst.established,
        affiliation: inst.affiliation,
        address: inst.address,
        pincode: inst.pincode,
        email: inst.email,
        phone: inst.phone,
        website: inst.website,
        accreditation: inst.accreditation,
        currentDSI,
        compositeScore,
        submissionStatus: status,
        lastUpdated: dates.lastUpdated,
        deadline: dates.deadline,
        totalStudents: inst.totalStudents,
        totalFaculty: inst.totalFaculty,
        programs: inst.programs,
        // Document metrics for DSI calculation
        documentsRequired: docMetrics.totalRequired,
        documentsSubmitted: docMetrics.documentCount,
        documentsVerified: docMetrics.verifiedCount,
        documentsPending: docMetrics.pendingCount,
        documentsRejected: docMetrics.rejectedCount,
        documentsMissing: docMetrics.missingCount
      }

      institutions.push(institution)
      institutionCounter++
    }
  }

  return institutions
}

// Export generated data
export const generatedInstitutions = generateInstitutionData()
