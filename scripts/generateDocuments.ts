/**
 * Script to generate HTML documents for all institutions
 * Run with: npx tsx scripts/generateDocuments.ts
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateAllDocuments } from '../src/services/documentGenerator.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create documents directory
const docsDir = path.join(__dirname, '../public/documents')
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true })
}

console.log('🚀 Starting document generation for all institutions...\n')

const allInstitutionDocuments = generateAllDocuments()

let totalDocuments = 0

allInstitutionDocuments.forEach(({ institution, documents }) => {
  console.log(`📄 Generating documents for: ${institution.name}`)

  documents.forEach(({ filename, content }) => {
    const filePath = path.join(docsDir, filename)
    fs.writeFileSync(filePath, content, 'utf-8')
    totalDocuments++
  })

  console.log(`  ✅ Generated ${documents.length} documents`)
})

console.log(`\n✨ Successfully generated ${totalDocuments} documents for ${allInstitutionDocuments.length} institutions!`)
console.log(`📁 Documents saved to: ${docsDir}`)
