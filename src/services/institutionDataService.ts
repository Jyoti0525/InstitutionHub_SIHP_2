/**
 * Institution Data Service
 * Loads institution data from JSON files and generates realistic DSI scores
 * using the actual DSI calculation algorithm
 */

import odishaData from '@/data/institutions/odisha.json'
import maharashtraData from '@/data/institutions/maharashtra.json'
import tamilnaduData from '@/data/institutions/tamilnadu.json'
import uttarpradeshData from '@/data/institutions/uttarpradesh.json'
import karnatakaData from '@/data/institutions/karnataka.json'
import type { Institution } from '@/types'

interface InstitutionBasicData {
  id: string
  name: string
  city: string
  district: string
  type: string
  affiliation: string
  established: number
  address: string
  pincode: string
  email: string
  phone: string
  website: string
  accreditation: string
  totalStudents: number
  totalFaculty: number
  programs: string[]
}

interface StateData {
  state: string
  institutions: InstitutionBasicData[]
}

/**
 * Generate realistic submission status based on institution tier
 */
function generateSubmissionStatus(accreditation: string, established: number): Institution['submissionStatus'] {
  const currentYear = new Date().getFullYear()
  const age = currentYear - established

  // Older, well-accredited institutions are more likely to have approved status
  if (accreditation.includes('A++') && age > 50) {
    const rand = Math.random()
    if (rand < 0.7) return 'approved'
    if (rand < 0.9) return 'pending_review'
    return 'in_progress'
  }

  if (accreditation.includes('A+') || accreditation.includes('A')) {
    const rand = Math.random()
    if (rand < 0.5) return 'approved'
    if (rand < 0.75) return 'pending_review'
    if (rand < 0.90) return 'in_progress'
    return 'revision_required'
  }

  // Newer or lower-tier institutions
  const rand = Math.random()
  if (rand < 0.3) return 'approved'
  if (rand < 0.5) return 'pending_review'
  if (rand < 0.75) return 'in_progress'
  if (rand < 0.90) return 'revision_required'
  return 'not_started'
}

/**
 * Calculate document metrics based on submission status
 */
function calculateDocumentMetrics(status: Institution['submissionStatus'], type: string) {
  const totalRequired = type.includes('University') ? 25 :
                       type.includes('Medical') || type.includes('Engineering') ? 22 :
                       type.includes('Law') || type.includes('Management') ? 18 : 20

  let documentsSubmitted: number
  let documentsVerified: number
  let documentsPending: number
  let documentsRejected: number

  switch (status) {
    case 'approved':
      documentsSubmitted = totalRequired
      documentsVerified = totalRequired
      documentsPending = 0
      documentsRejected = 0
      break

    case 'pending_review':
      documentsSubmitted = totalRequired
      documentsVerified = Math.floor(totalRequired * (0.6 + Math.random() * 0.25))
      documentsPending = documentsSubmitted - documentsVerified
      documentsRejected = 0
      break

    case 'revision_required':
      documentsSubmitted = totalRequired - Math.floor(1 + Math.random() * 3)
      documentsVerified = Math.floor(documentsSubmitted * (0.4 + Math.random() * 0.3))
      documentsRejected = Math.floor(1 + Math.random() * 2)
      documentsPending = documentsSubmitted - documentsVerified - documentsRejected
      break

    case 'in_progress':
      documentsSubmitted = Math.floor(totalRequired * (0.5 + Math.random() * 0.35))
      documentsVerified = Math.floor(documentsSubmitted * (0.3 + Math.random() * 0.3))
      documentsPending = documentsSubmitted - documentsVerified
      documentsRejected = 0
      break

    case 'not_started':
      documentsSubmitted = Math.floor(Math.random() * 5)
      documentsVerified = 0
      documentsPending = documentsSubmitted
      documentsRejected = 0
      break
  }

  return {
    totalRequired,
    documentsSubmitted,
    documentsVerified,
    documentsPending,
    documentsRejected,
    documentsMissing: totalRequired - documentsSubmitted - documentsRejected
  }
}

/**
 * Calculate realistic DSI score based on document metrics
 * This mimics the real DSI calculation algorithm
 */
function calculateRealisticDSI(metrics: ReturnType<typeof calculateDocumentMetrics>): number {
  const { totalRequired, documentsVerified, documentsSubmitted, documentsRejected } = metrics

  // Presence: documents submitted (excluding rejected) / total required
  const presenceScore = (documentsSubmitted - documentsRejected) / totalRequired

  // Completeness: verified documents / submitted documents
  const completenessScore = documentsSubmitted > 0 ? documentsVerified / documentsSubmitted : 0

  // Verification: verified / total required
  const verificationScore = documentsVerified / totalRequired

  // Weighted DSI (same weights as real algorithm)
  const dsi = (presenceScore * 0.4 + completenessScore * 0.3 + verificationScore * 0.3) * 100

  return Math.round(dsi * 10) / 10
}

/**
 * Calculate composite score based on DSI and other factors
 */
function calculateCompositeScore(
  dsi: number,
  accreditation: string,
  established: number
): number {
  let baseScore = dsi * 0.7 // DSI is 70% of composite

  // Accreditation bonus
  const accreditationBonus = accreditation.includes('A++') ? 15 :
                            accreditation.includes('A+') ? 12 :
                            accreditation.includes('A') ? 10 :
                            accreditation.includes('B++') ? 7 :
                            accreditation.includes('B+') ? 5 : 3

  // Legacy bonus (older institutions)
  const currentYear = new Date().getFullYear()
  const age = currentYear - established
  const legacyBonus = Math.min(age / 100 * 5, 5)

  const composite = baseScore + accreditationBonus + legacyBonus

  return Math.min(Math.round(composite * 10) / 10, 100)
}

/**
 * Generate realistic dates
 */
function generateDates() {
  const now = new Date()

  // Last updated: within last 3 months
  const lastUpdated = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000)

  // Deadline: 30-90 days from now
  const deadline = new Date(now.getTime() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000)

  return {
    lastUpdated: lastUpdated.toISOString().split('T')[0],
    deadline: deadline.toISOString().split('T')[0]
  }
}

/**
 * Transform basic institution data into full Institution type with DSI
 */
function transformInstitution(basic: InstitutionBasicData, state: string): Institution {
  const submissionStatus = generateSubmissionStatus(basic.accreditation, basic.established)
  const docMetrics = calculateDocumentMetrics(submissionStatus, basic.type)
  const currentDSI = calculateRealisticDSI(docMetrics)
  const compositeScore = calculateCompositeScore(currentDSI, basic.accreditation, basic.established)
  const dates = generateDates()

  return {
    id: basic.id,
    name: basic.name,
    type: basic.type,
    state: state,
    city: basic.city,
    district: basic.district,
    establishedYear: basic.established,
    naacGrade: basic.accreditation.replace('NAAC ', ''),
    currentDSI,
    compositeScore,
    submissionStatus,
    lastUpdated: dates.lastUpdated,
    deadline: dates.deadline,
    contactEmail: basic.email,
    contactPhone: basic.phone
  }
}

/**
 * Load all institution data
 */
export function loadAllInstitutions(): Institution[] {
  const allInstitutions: Institution[] = []

  // Load Odisha (75 institutions)
  const odisha = odishaData as StateData
  odisha.institutions.forEach(inst => {
    allInstitutions.push(transformInstitution(inst, odisha.state))
  })

  // Load Maharashtra (65 institutions)
  const maharashtra = maharashtraData as StateData
  maharashtra.institutions.forEach(inst => {
    allInstitutions.push(transformInstitution(inst, maharashtra.state))
  })

  // Load Tamil Nadu (65 institutions)
  const tamilnadu = tamilnaduData as StateData
  tamilnadu.institutions.forEach(inst => {
    allInstitutions.push(transformInstitution(inst, tamilnadu.state))
  })

  // Load Uttar Pradesh (65 institutions)
  const uttarpradesh = uttarpradeshData as StateData
  uttarpradesh.institutions.forEach(inst => {
    allInstitutions.push(transformInstitution(inst, uttarpradesh.state))
  })

  // Load Karnataka (65 institutions)
  const karnataka = karnatakaData as StateData
  karnataka.institutions.forEach(inst => {
    allInstitutions.push(transformInstitution(inst, karnataka.state))
  })

  return allInstitutions
}

/**
 * Get institutions by state
 */
export function getInstitutionsByState(state: string): Institution[] {
  const all = loadAllInstitutions()
  return all.filter(inst => inst.state === state)
}

/**
 * Get institution by ID
 */
export function getInstitutionById(id: string): Institution | undefined {
  const all = loadAllInstitutions()
  return all.find(inst => inst.id === id)
}

/**
 * Get summary statistics
 */
export function getStatistics() {
  const all = loadAllInstitutions()

  return {
    total: all.length,
    byState: {
      'Odisha': all.filter(i => i.state === 'Odisha').length,
      'Maharashtra': all.filter(i => i.state === 'Maharashtra').length,
      'Tamil Nadu': all.filter(i => i.state === 'Tamil Nadu').length,
      'Uttar Pradesh': all.filter(i => i.state === 'Uttar Pradesh').length,
      'Karnataka': all.filter(i => i.state === 'Karnataka').length
    },
    byStatus: {
      approved: all.filter(i => i.submissionStatus === 'approved').length,
      pending_review: all.filter(i => i.submissionStatus === 'pending_review').length,
      in_progress: all.filter(i => i.submissionStatus === 'in_progress').length,
      revision_required: all.filter(i => i.submissionStatus === 'revision_required').length,
      not_started: all.filter(i => i.submissionStatus === 'not_started').length
    },
    averageDSI: all.reduce((sum, i) => sum + i.currentDSI, 0) / all.length
  }
}
