/**
 * Authentication Service
 * Handles login credential generation and validation for institutions
 */

import { loadAllInstitutions } from './institutionDataService'

/**
 * Generate email username from institution name
 * Example: "Indian Institute of Technology Madras" -> "iitm"
 */
function generateEmailUsername(institutionName: string): string {
  // Remove common words and get initials or short form
  const name = institutionName.toLowerCase()

  // Handle IITs, NITs, IIITs specially
  if (name.includes('indian institute of technology')) {
    const location = name.split('indian institute of technology')[1].trim().split(' ')[0]
    return `iit${location.substring(0, 1)}`
  }

  if (name.includes('national institute of technology')) {
    const location = name.split('national institute of technology')[1].trim().split(' ')[0]
    return `nit${location.substring(0, 1)}`
  }

  if (name.includes('indian institute of information technology')) {
    const location = name.split('indian institute of information technology')[1].trim().split(' ')[0]
    return `iiit${location.substring(0, 1)}`
  }

  if (name.includes('indian institute of management')) {
    const location = name.split('indian institute of management')[1].trim().split(' ')[0]
    return `iim${location.substring(0, 1)}`
  }

  if (name.includes('aiims')) {
    const location = name.split('aiims')[1]?.trim().split(' ')[0] || 'delhi'
    return `aiims${location.substring(0, 1)}`
  }

  // For other institutions, create acronym from significant words
  const words = name
    .replace(/[()]/g, '') // Remove parentheses
    .split(' ')
    .filter(word =>
      word.length > 2 && // Ignore short words
      !['of', 'and', 'the', 'for', 'in', 'to'].includes(word) // Ignore common words
    )

  if (words.length === 1) {
    // Single word name, use first 4-6 characters
    return words[0].substring(0, Math.min(6, words[0].length))
  }

  if (words.length === 2) {
    // Two words, use first 3 chars of each
    return words.map(w => w.substring(0, 3)).join('')
  }

  // Multiple words, use initials
  return words.map(w => w[0]).join('').substring(0, 6)
}

/**
 * Generate password from institution name
 * Example: "Indian Institute of Technology Madras" -> "iitm123"
 */
function generatePassword(institutionName: string): string {
  const username = generateEmailUsername(institutionName)
  return `${username}123`
}

/**
 * Generate email for institution
 * Example: "Indian Institute of Technology Madras" -> "iitm@iitm.ac.in"
 */
export function generateInstitutionEmail(institutionName: string, website?: string): string {
  const username = generateEmailUsername(institutionName)

  // Try to extract domain from website
  if (website) {
    try {
      const url = new URL(website)
      const hostname = url.hostname.replace('www.', '')
      return `admin@${hostname}`
    } catch {
      // If URL parsing fails, use default pattern
    }
  }

  // Default pattern
  return `${username}@${username}.ac.in`
}

/**
 * Get login credentials for an institution
 */
export function getInstitutionCredentials(institutionId: string) {
  const institutions = loadAllInstitutions()
  const institution = institutions.find(i => i.id === institutionId)

  if (!institution) {
    return null
  }

  return {
    institutionId: institution.id,
    institutionName: institution.name,
    email: generateInstitutionEmail(institution.name),
    password: generatePassword(institution.name),
    username: generateEmailUsername(institution.name)
  }
}

/**
 * Validate institution login credentials
 */
export function validateInstitutionLogin(email: string, password: string) {
  const institutions = loadAllInstitutions()

  for (const institution of institutions) {
    const expectedEmail = generateInstitutionEmail(institution.name)
    const expectedPassword = generatePassword(institution.name)

    if (email.toLowerCase() === expectedEmail.toLowerCase() && password === expectedPassword) {
      return {
        success: true,
        institution: {
          id: institution.id,
          name: institution.name,
          email: expectedEmail,
          type: institution.type,
          state: institution.state
        }
      }
    }
  }

  return {
    success: false,
    error: 'Invalid email or password'
  }
}

/**
 * Validate admin login credentials
 */
export function validateAdminLogin(email: string, password: string) {
  const validAdmins = [
    { email: 'admin@ugc.gov.in', password: 'admin123', name: 'UGC Admin' },
    { email: 'admin@mhrd.gov.in', password: 'admin123', name: 'MHRD Admin' },
    { email: 'superadmin@dsi.gov.in', password: 'super123', name: 'Super Admin' }
  ]

  for (const admin of validAdmins) {
    if (email.toLowerCase() === admin.email.toLowerCase() && password === admin.password) {
      return {
        success: true,
        admin: {
          email: admin.email,
          name: admin.name,
          role: 'admin'
        }
      }
    }
  }

  return {
    success: false,
    error: 'Invalid admin credentials'
  }
}

/**
 * Get all institution credentials (for reference/documentation)
 */
export function getAllInstitutionCredentials() {
  const institutions = loadAllInstitutions()

  return institutions.map(inst => ({
    id: inst.id,
    name: inst.name,
    state: inst.state,
    email: generateInstitutionEmail(inst.name),
    password: generatePassword(inst.name),
    username: generateEmailUsername(inst.name)
  }))
}
