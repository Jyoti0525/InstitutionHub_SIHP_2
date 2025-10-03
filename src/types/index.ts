// Institution Types
export interface Institution {
  id: string
  name: string
  type: 'Engineering' | 'Medical' | 'Management' | 'Arts & Science' | 'Pharmacy' | 'Agriculture' | 'Law' | 'Architecture' | 'Other'
  state: string
  city: string
  establishedYear: number
  naacGrade?: 'A++' | 'A+' | 'A' | 'B++' | 'B+' | 'B' | 'C' | 'D'
  naacCGPA?: number
  nirfRank?: number
  currentDSI: number
  compositeScore: number
  submissionStatus: 'not_started' | 'in_progress' | 'pending_review' | 'approved' | 'rejected' | 'revision_required'
  lastUpdated: string
  deadline: string
  contactEmail: string
  contactPhone: string
}

// Category Types (11 Categories based on NAAC/NIRF framework)
export interface Category {
  id: string
  name: string
  weight: number  // Percentage weight in composite score
  score: number   // Current calculated score (0-100)
  submetricIds: string[]
  description: string
  icon?: string
}

// Submetric Types
export interface Submetric {
  id: string
  categoryId: string
  name: string
  weight: number  // Weight within category
  rawValue?: number
  normalizedScore: number  // 0-100
  peerPercentile?: number
  evidenceDocIds: string[]
  confidenceLevel: 'high' | 'medium' | 'low'
  formula: string  // Human-readable formula
  dataType: 'percentage' | 'number' | 'ratio' | 'boolean' | 'grade'
  threshold?: {
    excellent: number
    good: number
    average: number
    poor: number
  }
}

// Document Types
export interface Document {
  id: string
  institutionId: string
  name: string
  type: DocumentType
  category: string
  status: 'verified' | 'pending' | 'missing' | 'rejected' | 'flagged'
  uploadDate?: string
  verificationDate?: string
  size?: string
  url?: string
  dsiContribution: number  // How much this doc contributes to DSI (0-100)
  completeness: number  // 0-1 scale
  verificationScore: number  // 0-1 scale
  verificationSource?: string
  aiInsights?: string[]
  rejectionReason?: string
  requiredBy?: string  // Deadline for this specific document
}

export type DocumentType =
  | 'Enrollment & Graduation Data'
  | 'Placement Records'
  | 'Faculty Details'
  | 'Research Publications'
  | 'Patents & IPR'
  | 'Infrastructure Details'
  | 'Financial Statements'
  | 'Accreditation Certificates'
  | 'Student Feedback Reports'
  | 'Audit Reports'
  | 'Scheme Participation Proof'
  | 'Ranking Certificates'
  | 'Governance Documents'
  | 'Other'

// Document Requirement
export interface DocumentRequirement {
  type: DocumentType
  category: string
  weight: number  // Weight in DSI calculation
  mandatory: boolean
  description: string
  acceptedFormats: string[]
  maxSize: string
  sampleUrl?: string
}

// Historical Score
export interface ScoreHistory {
  institutionId: string
  year: number
  compositeScore: number
  dsi: number
  categoryScores: {
    categoryId: string
    score: number
  }[]
  rank?: number
  percentile?: number
}

// Peer Comparison
export interface PeerGroup {
  institutionId: string
  peerGroup: string  // e.g., "Engineering-Tier2-West"
  peerIds: string[]
  peerMedianScore: number
  institutionRankInGroup: number
  totalInGroup: number
}

export interface PeerComparison {
  institutionId: string
  peerId: string
  peerName: string
  categoryComparison: {
    categoryId: string
    institutionScore: number
    peerScore: number
    difference: number
  }[]
  overallDifference: number
}

// User Types
export interface User {
  id: string
  email: string
  role: 'institution' | 'admin' | 'reviewer'
  institutionId?: string
  name: string
  lastLogin?: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'deadline' | 'approval' | 'rejection' | 'reminder' | 'update'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

// Activity Log
export interface ActivityLog {
  id: string
  institutionId: string
  userId: string
  action: 'document_upload' | 'document_verification' | 'score_update' | 'status_change' | 'comment_added'
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

// Admin Review Types
export interface ReviewItem {
  institutionId: string
  institutionName: string
  submissionDate: string
  dsi: number
  compositeScore: number
  documentsCount: {
    total: number
    verified: number
    pending: number
    flagged: number
  }
  priority: 'high' | 'medium' | 'low'
  assignedReviewer?: string
  estimatedReviewTime: number  // in minutes
}

// Analytics Types
export interface AnalyticsData {
  totalInstitutions: number
  averageDSI: number
  averageCompositeScore: number
  submissionRate: number
  stateWiseDistribution: {
    state: string
    count: number
    averageScore: number
  }[]
  typeWiseDistribution: {
    type: string
    count: number
    averageScore: number
  }[]
  scoreDistribution: {
    range: string
    count: number
  }[]
  trendData: {
    year: number
    averageScore: number
    participationRate: number
  }[]
}

// DSI Calculation Types
export interface DSICalculation {
  institutionId: string
  totalScore: number  // 0-100
  breakdown: {
    category: string
    requiredDocs: number
    submittedDocs: number
    verifiedDocs: number
    categoryScore: number
    contribution: number
  }[]
  missingCriticalDocs: string[]
  recommendations: string[]
  lastCalculated: string
}

// Chart Data Types
export interface ChartDataPoint {
  name: string
  value: number
  label?: string
  color?: string
}

export interface RadarChartData {
  category: string
  score: number
  peerScore?: number
  maxScore: number
}

export interface TrendData {
  period: string
  value: number
  benchmark?: number
}

// Filter Types
export interface InstitutionFilter {
  type?: string[]
  state?: string[]
  naacGrade?: string[]
  dsiRange?: [number, number]
  scoreRange?: [number, number]
  status?: string[]
  searchQuery?: string
}

// Sort Types
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  key: string
  direction: SortDirection
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system'

// Toast/Alert Types
export interface Alert {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
}
