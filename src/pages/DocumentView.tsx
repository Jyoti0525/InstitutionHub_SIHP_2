/**
 * Document View Page
 * Dynamically generates and displays institution documents
 */

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { loadAllInstitutions } from '@/services/institutionDataService'
import { documentTemplates } from '@/services/documentGenerator'

export default function DocumentView() {
  const { filename } = useParams<{ filename: string }>()
  const [htmlContent, setHtmlContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!filename) {
      setLoading(false)
      return
    }

    // Parse filename: {institutionId}_{documentType}_{year}.html
    const parts = filename.replace('.html', '').split('_')
    const institutionId = parts[0]
    const documentType = parts.slice(1, -1).join(' ').replace(/_/g, ' ')

    // Find institution
    const institutions = loadAllInstitutions()
    const institution = institutions.find(i => i.id === institutionId)

    if (!institution) {
      setHtmlContent('<h1>Institution not found</h1>')
      setLoading(false)
      return
    }

    // Find template
    const template = documentTemplates.find(t =>
      t.title.replace(/_/g, ' ').toLowerCase() === documentType.toLowerCase()
    )

    if (!template) {
      setHtmlContent('<h1>Document template not found</h1>')
      setLoading(false)
      return
    }

    // Generate document
    const content = template.generateContent(institution)
    setHtmlContent(content)
    setLoading(false)
  }, [filename])

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>Loading document...</div>
      </div>
    )
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{ margin: 0, padding: 0 }}
    />
  )
}
