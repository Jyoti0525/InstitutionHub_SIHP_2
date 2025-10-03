/**
 * Document Service
 * Provides document data for institutions with on-demand generation
 */

import { getInstitutionDocuments, documentTemplates } from './documentGenerator'
import type { Institution } from '@/types'

export interface Document {
  id: string
  institutionId: string
  name: string
  type: string
  category: string
  status: 'verified' | 'pending' | 'rejected' | 'submitted'
  uploadDate: string
  size: string
  url: string
  filename: string
}

/**
 * Get documents for a specific institution
 */
export function getDocumentsForInstitution(institutionId: string): Document[] {
  const institutionDocs = getInstitutionDocuments(institutionId)
  const year = new Date().getFullYear()

  return institutionDocs.map(doc => ({
    id: doc.id,
    institutionId: doc.institutionId,
    name: doc.name,
    type: doc.type,
    category: doc.category,
    status: doc.status,
    uploadDate: doc.uploadDate,
    size: doc.size,
    url: `/api/documents/${doc.filename}`,
    filename: doc.filename
  }))
}

/**
 * Get document content (generates HTML on-demand)
 */
export function getDocumentContent(institutionId: string, documentType: string): string | null {
  const template = documentTemplates.find(t => t.type === documentType)
  if (!template) {
    return null
  }

  // This would load the institution and generate content
  // For now, return a placeholder
  return `Document content for ${institutionId} - ${documentType}`
}

/**
 * Get all document categories
 */
export function getDocumentCategories(): string[] {
  return [
    'Accreditation',
    'Academic Records',
    'HR Records',
    'Training & Placement',
    'Research',
    'Infrastructure',
    'Financial Records'
  ]
}

/**
 * Get document statistics for an institution
 */
export function getDocumentStats(institutionId: string) {
  const docs = getDocumentsForInstitution(institutionId)

  return {
    total: docs.length,
    verified: docs.filter(d => d.status === 'verified').length,
    pending: docs.filter(d => d.status === 'pending').length,
    rejected: docs.filter(d => d.status === 'rejected').length,
    byCategory: getDocumentCategories().reduce((acc, cat) => {
      acc[cat] = docs.filter(d => d.category === cat).length
      return acc
    }, {} as Record<string, number>)
  }
}
