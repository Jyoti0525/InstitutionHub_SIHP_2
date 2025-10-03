/**
 * Document Generator Service
 * Generates realistic HTML documents for each institution with authentic signatures and seals
 */

import { loadAllInstitutions } from './institutionDataService'
import type { Institution } from '@/types'

interface DocumentTemplate {
  type: string
  category: string
  title: string
  generateContent: (institution: Institution, year?: number) => string
}

/**
 * Generate unique faculty/official names based on institution
 */
function generateOfficialName(institution: Institution, role: string): string {
  const firstNames = {
    male: ['Rajesh', 'Amit', 'Suresh', 'Vikram', 'Arun', 'Deepak', 'Ramesh', 'Prakash', 'Sanjay', 'Mahesh',
           'Ravi', 'Kiran', 'Anand', 'Mohan', 'Ashok', 'Vinod', 'Manoj', 'Ajay', 'Nitin', 'Sachin'],
    female: ['Priya', 'Anjali', 'Kavita', 'Meera', 'Sunita', 'Rekha', 'Pooja', 'Neha', 'Shalini', 'Divya',
             'Lakshmi', 'Radha', 'Savita', 'Nisha', 'Asha', 'Seema', 'Ritu', 'Geeta', 'Usha', 'Veena']
  }

  const lastNames = ['Kumar', 'Singh', 'Sharma', 'Verma', 'Patel', 'Reddy', 'Rao', 'Nair', 'Iyer', 'Menon',
                     'Gupta', 'Joshi', 'Desai', 'Mehta', 'Shah', 'Agarwal', 'Sinha', 'Mishra', 'Pandey', 'Trivedi',
                     'Chandra', 'Bose', 'Das', 'Mukherjee', 'Banerjee', 'Chatterjee', 'Ghosh', 'Sen', 'Dutta', 'Roy']

  const titles = {
    'Director': 'Prof.',
    'Principal': 'Prof.',
    'Dean': 'Dr.',
    'Registrar': 'Dr.',
    'Dean (Academics)': 'Dr.',
    'Training & Placement Officer': 'Prof.',
    'Dean, Research & Development': 'Dr.',
    'Vice Chancellor': 'Prof.',
    'HOD': 'Dr.',
    'Controller': 'Dr.'
  }

  // Use institution ID and role to generate consistent but unique name
  const seed = institution.id.charCodeAt(0) + institution.id.charCodeAt(institution.id.length - 1) + role.length
  const isMale = seed % 2 === 0
  const firstNameList = isMale ? firstNames.male : firstNames.female
  const firstName = firstNameList[seed % firstNameList.length]
  const lastName = lastNames[(seed * 7) % lastNames.length]
  const title = titles[role as keyof typeof titles] || 'Dr.'

  return `${title} ${firstName} ${lastName}`
}

/**
 * Generate realistic handwritten signature using professional signature images
 */
function generateSignatureSVG(name: string): string {
  // Collection of realistic professional signature images
  // Using data URIs for professional handwritten signatures
  const signatureStyles = [
    // Style 1: Elegant flowing signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMCwzNSBRMjAsMTUgMzUsMjggUTUwLDQyIDY1LDMwIFE4MCwyNSA5NSwzNSBRMTEwLDQ1IDEyNSwzMiBRMTQwLDI4IDE1NSwzOCBRMTcwLDQ4IDE4NSw0MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIuNSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTM1LDQwIFE1MCwzOCA2NSw0MSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuOCIgZmlsbD0ibm9uZSIvPjxsaW5lIHgxPSIxMCIgeTE9IjQ4IiB4Mj0iMTMwIiB5Mj0iNTAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjIiIG9wYWNpdHk9IjAuNSIvPjwvc3ZnPg==',

    // Style 2: Bold professional signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNSwzMCBMMzAsMjUgTDQwLDM1IEw1NSwyMiBRNzAsMzAgODUsMzUgUTEwMCwyOCAxMTUsMzUgUTEzMCw0MiAxNDUsMzUgTDE2NSwzOCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMjgiIHI9IjMiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyIi8+PGNpcmNsZSBjeD0iMTcwIiBjeT0iMzgiIHI9IjIuNSIgZmlsbD0iIzAwMCIvPjwvc3ZnPg==',

    // Style 3: Compact modern signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMCwzMiBRMzUsMjIgNDgsMzIgUTYwLDQyIDc1LDMyIFE5MCwyNSAxMDUsMzUgUTEyMCw0NSAxMzUsMzIgUTE1MCwyOCAxNjUsMzggTDE4MCwzNSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTI1LDM4IEw0MCw0MCBMNTUsMzgiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjUiIGZpbGw9Im5vbmUiLz48L3N2Zz4=',

    // Style 4: Artistic flowing signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xNSwzNSBRMjUsMTggMzgsMzAgUTUyLDQ1IDY4LDMwIFE4NSwyMiAxMDAsMzYgUTExNSw1MCAxMzAsMzAgUTE0NSwyMCAxNjAsMzUgUTE3NSw0OCAxODUsMzgiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyLjIiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxlbGxpcHNlIGN4PSIzNSIgY3k9IjI4IiByeD0iOCIgcnk9IjEyIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS41IiBvcGFjaXR5PSIwLjQiLz48cGF0aCBkPSJNMTMwLDQyIFExNDAsNDUgMTUwLDQyIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS42IiBmaWxsPSJub25lIi8+PC9zdmc+',

    // Style 5: Traditional calligraphic signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMCwzMCBRMzAsMTggNDIsMzIgUTU1LDQ2IDcwLDMwIFE4NSwyMiAxMDAsMzUgUTExNSw0OCAxMzAsMzAgUTE0NSwyMCAxNjAsMzMgUTE3Myw0NSAxODUsMzUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyLjQiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yOCwyNSBRMzgsMjIgNDUsMjYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjkiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNjUiLz48bGluZSB4MT0iMjAiIHkxPSI0NCIgeDI9IjEyMCIgeTI9IjQ2IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS40IiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=',

    // Style 6: Quick executive signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yNSwzMiBRMzUsMjUgNDUsMzUgTDU1LDM4IFE2OCwzMCA4MiwzNiBMOTUsMzIgUTExMCwyOCAxMjUsMzUgTDE0MCwzOCBRMTU1LDMyIDE3MCwzNyBMMTgwLDM1IiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMi43IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNNDgsNDAgUTU4LDQyIDY4LDQwIFE3OCwzOCA4OCw0MCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC42Ii8+PC9zdmc+',

    // Style 7: Elaborate decorative signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xOCwzMyBRMjgsMjAgMzgsMzMgUTUwLDQ2IDY1LDMwIFE4MCwyMyA5NSwzNiBRMTEwLDQ5IDEyNiwzMSBRMTQyLDIyIDE1OCwzNSBRMTczLDQ3IDE4NSwzNCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIuMSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGNpcmNsZSBjeD0iMzAiIGN5PSIyOCIgcj0iNiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNiIgb3BhY2l0eT0iMC41Ii8+PHBhdGggZD0iTTc1LDQyIFE5MCwzOCAxMDAsNDMgUTExMCw0NyAxMjAsNDIiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjQiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuNiIvPjxsaW5lIHgxPSIxNDAiIHkxPSI0MCIgeDI9IjE3MCIgeTI9IjQyIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS4zIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=',

    // Style 8: Minimalist sharp signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yOCwzMiBMNDIsMjggUTU1LDMyIDY4LDMwIEw4MiwzNCBROTgsMzggMTE0LDMyIEwxMzIsMzAgUTE1MCwzNCAxNjgsMzEgTDE4NCwzNCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIuNSIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PGxpbmUgeDE9IjM1IiB5MT0iNDAiIHgyPSI3NSIgeTI9IjQxIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMS42IiBvcGFjaXR5PSIwLjU1Ii8+PGNpcmNsZSBjeD0iMTc1IiBjeT0iMzMiIHI9IjIiIGZpbGw9IiMwMDAiLz48L3N2Zz4=',

    // Style 9: Rounded soft signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yMiwzMiBRMzIsMjAgNDUsMzAgUTU4LDQyIDcyLDI4IFE4OCwzNSAxMDIsMzAgUTExNiwyNSAxMzAsMzMgUTE0NCw0MCAxNTgsMzIgUTE3MiwyNSAxODQsMzUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIyLjAiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNSw0NSBRNTYSNDJMOTA0NSBRMTI4LDQ4IDE2MCw0NCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNSIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC42Ii8+PC9zdmc+',

    // Style 10: Dynamic slanted signature
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjYwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0yNCwzNCBMMzYsMjYgUTQ4LDMyIDYwLDI4IEw3NCwzNiBRODgsNDIgMTAyLDM0IEwxMTgsMzAgUTEzNCwzNiAxNTAsMzIgTDE2NiwzNiBRMTc4LDMwIDE4OCwzOCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIuNiIgZmlsbD0ibm9uZSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTMyLDQwIEw0Miw0MiBMNTIsNDAiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxLjciIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIxNjAiIGN5PSIzNCIgcj0iMi41IiBmaWxsPSIjMDAwIiBvcGFjaXR5PSIwLjgiLz48L3N2Zz4='
  ]

  // Create hash from name for consistent signature assignment
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const signatureStyle = signatureStyles[hash % signatureStyles.length]

  // Return the signature as an embedded image
  return `<svg width="220" height="70" viewBox="0 0 220 70" xmlns="http://www.w3.org/2000/svg">
    <image href="${signatureStyle}" x="10" y="5" width="200" height="60" style="filter: contrast(1.1) brightness(0.95);"/>
  </svg>`
}

/**
 * Get real college logo URL or generate fallback
 */
function generateCollegeLogo(institution: Institution): string {
  // Map of well-known institutions to their real logo URLs (Wikipedia Commons)
  const logoMap: Record<string, string> = {
    // IITs
    'IIT Madras': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/150px-IIT_Madras_Logo.svg.png',
    'IIT Bombay': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/150px-Indian_Institute_of_Technology_Bombay_Logo.svg.png',
    'Indian Institute of Technology Bombay (IITB)': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/150px-Indian_Institute_of_Technology_Bombay_Logo.svg.png',
    'IIT Delhi': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Indian_Institute_of_Technology_Delhi_Logo.svg/150px-Indian_Institute_of_Technology_Delhi_Logo.svg.png',
    'IIT Kanpur': 'https://upload.wikimedia.org/wikipedia/en/thumb/7/7b/Indian_Institute_of_Technology_Kanpur_Logo.svg/150px-Indian_Institute_of_Technology_Kanpur_Logo.svg.png',
    'IIT Kharagpur': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/IIT_Kharagpur_Logo.svg/150px-IIT_Kharagpur_Logo.svg.png',
    'IIT Roorkee': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Indian_Institute_of_Technology_Roorkee_logo.png/150px-Indian_Institute_of_Technology_Roorkee_logo.png',
    'IIT Guwahati': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4d/Indian_Institute_of_Technology_Guwahati_Logo.svg/150px-Indian_Institute_of_Technology_Guwahati_Logo.svg.png',

    // NITs
    'NIT Trichy': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/NIT_Trichy_Logo.png/150px-NIT_Trichy_Logo.png',
    'NIT Surathkal': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/27/NITK_Emblem.png/150px-NITK_Emblem.png',
    'NIT Warangal': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/df/NITW_Logo.png/150px-NITW_Logo.png',

    // IIITs
    'IIIT Hyderabad': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/89/IIIT_Hyderabad_Logo.svg/150px-IIIT_Hyderabad_Logo.svg.png',
    'IIIT Bangalore': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/27/IIITB_Official_Logo.png/150px-IIITB_Official_Logo.png',

    // Universities
    'University of Delhi': 'https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/University_of_Delhi.svg/150px-University_of_Delhi.svg.png',
    'University of Mumbai': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Bombay_University_Seal.svg/150px-Bombay_University_Seal.svg.png',
    'Anna University': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Anna_University_Logo.svg/150px-Anna_University_Logo.svg.png',
    'Savitribai Phule Pune University': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Savitribai_Phule_Pune_University_Logo.png/150px-Savitribai_Phule_Pune_University_Logo.png',
    'Jadavpur University': 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Jadavpur_University_Logo.svg/150px-Jadavpur_University_Logo.svg.png',
    'Bangalore University': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/24/Bangalore_University_emblem.png/150px-Bangalore_University_emblem.png',
    'Osmania University': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Osmania_University_emblem.svg/150px-Osmania_University_emblem.svg.png',

    // Maharashtra colleges
    'Veermata Jijabai Technological Institute (VJTI)': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/VJTI_logo.png/150px-VJTI_logo.png',
    'College of Engineering Pune (COEP)': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f8/COEP_Crest.png/150px-COEP_Crest.png',
    'Institute of Chemical Technology (ICT Mumbai)': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e5/Institute_of_Chemical_Technology_logo.png/150px-Institute_of_Chemical_Technology_logo.png',
    'Symbiosis International University': 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Symbiosis_International_University_Logo.png/150px-Symbiosis_International_University_Logo.png',
    'Fergusson College': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/Fergusson_College_Logo.png/150px-Fergusson_College_Logo.png',
    'SP Pune University': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Savitribai_Phule_Pune_University_Logo.png/150px-Savitribai_Phule_Pune_University_Logo.png',

    // Notable colleges
    'St. Xavier\'s College Mumbai': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/99/St._Xavier%27s_College%2C_Mumbai_-_Crest.png/150px-St._Xavier%27s_College%2C_Mumbai_-_Crest.png',
    'Loyola College Chennai': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Loyola_College_Chennai_logo.png/150px-Loyola_College_Chennai_logo.png',
    'Christ University': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Christ_University_Logo.svg/150px-Christ_University_Logo.svg.png',
    'Presidency University': 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Presidency_University%2C_Kolkata_logo.png/150px-Presidency_University%2C_Kolkata_logo.png',
    'St. Stephen\'s College Delhi': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/St._Stephen%27s_College%2C_Delhi_coat_of_arms.png/150px-St._Stephen%27s_College%2C_Delhi_coat_of_arms.png',
    'Lady Shri Ram College': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Lady_Shri_Ram_College_for_Women_logo.png/150px-Lady_Shri_Ram_College_for_Women_logo.png',
    'Hindu College Delhi': 'https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Hindu_College_logo.png/150px-Hindu_College_logo.png',

    // Tamil Nadu colleges
    'Madras Christian College': 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Madras_Christian_College_logo.png/150px-Madras_Christian_College_logo.png',
    'PSG College of Technology': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/PSG_College_of_Technology_logo.png/150px-PSG_College_of_Technology_logo.png',

    // Karnataka colleges
    'National Institute of Technology Karnataka (NITK)': 'https://upload.wikimedia.org/wikipedia/en/thumb/2/27/NITK_Emblem.png/150px-NITK_Emblem.png',
    'RVCE Bangalore': 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/R._V._College_of_Engineering_logo.png/150px-R._V._College_of_Engineering_logo.png',
    'BMS College of Engineering': 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/BMS_College_of_Engineering_logo.png/150px-BMS_College_of_Engineering_logo.png',
    'PES University': 'https://upload.wikimedia.org/wikipedia/en/thumb/d/da/PES_University_logo.png/150px-PES_University_logo.png',

    // Odisha
    'KIIT University': 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/KIIT_University_Logo.svg/150px-KIIT_University_Logo.svg.png',
  }

  // Check if we have a real logo for this institution
  const logoUrl = logoMap[institution.name]

  if (logoUrl) {
    // Return img tag wrapped in foreignObject for SVG
    return `<svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <foreignObject x="0" y="0" width="140" height="140">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 140px; height: 140px; display: flex; align-items: center; justify-content: center; background: white; border-radius: 70px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <img src="${logoUrl}" alt="${institution.name}" style="max-width: 120px; max-height: 120px; object-fit: contain;" onerror="this.style.display='none'"/>
        </div>
      </foreignObject>
    </svg>`
  }

  // Fallback to generated logo
  const hash = institution.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const colors = [
    { primary: '#1e40af', secondary: '#3b82f6', accent: '#dbeafe' },
    { primary: '#7c2d12', secondary: '#ea580c', accent: '#fed7aa' },
    { primary: '#134e4a', secondary: '#14b8a6', accent: '#ccfbf1' },
    { primary: '#581c87', secondary: '#a855f7', accent: '#f3e8ff' },
    { primary: '#831843', secondary: '#e11d48', accent: '#fecdd3' },
    { primary: '#713f12', secondary: '#f59e0b', accent: '#fef3c7' },
    { primary: '#1e3a8a', secondary: '#2563eb', accent: '#dbeafe' },
    { primary: '#064e3b', secondary: '#059669', accent: '#d1fae5' }
  ]

  const colorScheme = colors[hash % colors.length]

  // Get initials from institution name
  const words = institution.name.split(' ').filter(w => w.length > 2 && !['of', 'and', 'the', 'for'].includes(w.toLowerCase()))
  const initials = words.slice(0, 3).map(w => w[0]).join('')

  // Create logo with institution branding
  return `<svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer circle -->
    <circle cx="70" cy="70" r="68" fill="${colorScheme.accent}" stroke="${colorScheme.primary}" stroke-width="3"/>
    <circle cx="70" cy="70" r="64" fill="white" stroke="${colorScheme.secondary}" stroke-width="2"/>

    <!-- Inner shield/emblem -->
    <path d="M 70,25 L 95,35 L 95,60 Q 95,80 70,95 Q 45,80 45,60 L 45,35 Z"
          fill="${colorScheme.primary}" opacity="0.1" stroke="${colorScheme.primary}" stroke-width="2"/>

    <!-- Book symbol -->
    <rect x="55" y="55" width="30" height="20" fill="${colorScheme.secondary}" rx="2"/>
    <line x1="70" y1="55" x2="70" y2="75" stroke="white" stroke-width="1.5"/>
    <line x1="55" y1="65" x2="85" y2="65" stroke="white" stroke-width="1"/>

    <!-- Initials -->
    <text x="70" y="95" text-anchor="middle" fill="${colorScheme.primary}"
          font-size="16" font-weight="bold" font-family="serif">${initials}</text>

    <!-- Decorative elements -->
    <circle cx="35" cy="45" r="3" fill="${colorScheme.secondary}" opacity="0.6"/>
    <circle cx="105" cy="45" r="3" fill="${colorScheme.secondary}" opacity="0.6"/>
    <circle cx="35" cy="95" r="3" fill="${colorScheme.secondary}" opacity="0.6"/>
    <circle cx="105" cy="95" r="3" fill="${colorScheme.secondary}" opacity="0.6"/>

    <!-- Bottom arc text path -->
    <path id="bottomArc${hash}" d="M 30,70 A 40,40 0 0,0 110,70" fill="none"/>
    <text font-size="9" fill="${colorScheme.primary}" font-weight="600" font-family="sans-serif">
      <textPath href="#bottomArc${hash}" startOffset="50%" text-anchor="middle">
        ${institution.establishedYear || 'ESTD'}
      </textPath>
    </text>

    <!-- Top arc -->
    <path id="topArc${hash}" d="M 110,70 A 40,40 0 0,0 30,70" fill="none"/>
    <text font-size="8" fill="${colorScheme.primary}" font-weight="600" font-family="sans-serif">
      <textPath href="#topArc${hash}" startOffset="50%" text-anchor="middle">
        ${institution.state.toUpperCase()}
      </textPath>
    </text>
  </svg>`
}

/**
 * Generate official seal SVG
 */
function generateOfficialSeal(orgName: string, type: 'government' | 'university' | 'naac' = 'government'): string {
  if (type === 'naac') {
    return `<svg width="150" height="150" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer circle with decorative border -->
      <circle cx="75" cy="75" r="72" fill="none" stroke="#8B0000" stroke-width="3"/>
      <circle cx="75" cy="75" r="68" fill="none" stroke="#FFD700" stroke-width="1"/>
      <circle cx="75" cy="75" r="65" fill="none" stroke="#8B0000" stroke-width="2"/>

      <!-- Inner background -->
      <circle cx="75" cy="75" r="60" fill="#FFF8DC" opacity="0.9"/>

      <!-- NAAC Logo in center -->
      <circle cx="75" cy="75" r="35" fill="#8B0000"/>
      <text x="75" y="85" text-anchor="middle" fill="#FFD700" font-size="32" font-weight="bold" font-family="serif">N</text>

      <!-- Top text -->
      <path id="topCurve" d="M 30,75 A 45,45 0 0,1 120,75" fill="none"/>
      <text font-size="10" font-weight="bold" fill="#8B0000" font-family="serif">
        <textPath href="#topCurve" startOffset="50%" text-anchor="middle">NAAC ACCREDITATION</textPath>
      </text>

      <!-- Bottom text -->
      <path id="bottomCurve" d="M 120,75 A 45,45 0 0,1 30,75" fill="none"/>
      <text font-size="9" fill="#8B0000" font-family="serif">
        <textPath href="#bottomCurve" startOffset="50%" text-anchor="middle">GOVERNMENT OF INDIA</textPath>
      </text>

      <!-- Star decorations -->
      <polygon points="75,20 77,26 83,26 78,30 80,36 75,32 70,36 72,30 67,26 73,26" fill="#FFD700"/>
      <polygon points="20,75 22,78 26,78 23,81 24,85 20,82 16,85 17,81 14,78 18,78" fill="#FFD700"/>
      <polygon points="130,75 132,78 136,78 133,81 134,85 130,82 126,85 127,81 124,78 128,78" fill="#FFD700"/>
    </svg>`
  }

  if (type === 'university') {
    return `<svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer circles -->
      <circle cx="70" cy="70" r="68" fill="none" stroke="#0047AB" stroke-width="2.5"/>
      <circle cx="70" cy="70" r="64" fill="none" stroke="#0047AB" stroke-width="1"/>

      <!-- Background -->
      <circle cx="70" cy="70" r="60" fill="#F0F8FF" opacity="0.95"/>

      <!-- University symbol -->
      <path d="M 40,80 L 70,55 L 100,80 L 100,95 L 40,95 Z" fill="#0047AB" opacity="0.2"/>
      <rect x="42" y="80" width="56" height="15" fill="none" stroke="#0047AB" stroke-width="2"/>
      <path d="M 70,55 L 70,45" stroke="#0047AB" stroke-width="2"/>
      <circle cx="70" cy="42" r="3" fill="#FFD700"/>

      <!-- Book symbol -->
      <rect x="60" y="85" width="20" height="8" fill="#0047AB"/>
      <line x1="70" y1="85" x2="70" y2="93" stroke="#F0F8FF" stroke-width="1"/>

      <!-- Laurel wreath -->
      <path d="M 30,50 Q 25,60 30,70" stroke="#228B22" stroke-width="2" fill="none"/>
      <path d="M 110,50 Q 115,60 110,70" stroke="#228B22" stroke-width="2" fill="none"/>
    </svg>`
  }

  // Government seal
  return `<svg width="140" height="140" viewBox="0 0 140 140" xmlns="http://www.w3.org/2000/svg">
    <!-- Outer circle -->
    <circle cx="70" cy="70" r="68" fill="none" stroke="#FF9933" stroke-width="2"/>
    <circle cx="70" cy="70" r="65" fill="none" stroke="#138808" stroke-width="1"/>
    <circle cx="70" cy="70" r="62" fill="none" stroke="#000080" stroke-width="2"/>

    <!-- Background -->
    <circle cx="70" cy="70" r="58" fill="#FFFEF0" opacity="0.95"/>

    <!-- Ashok Chakra in center -->
    <circle cx="70" cy="70" r="28" fill="none" stroke="#000080" stroke-width="2"/>
    <circle cx="70" cy="70" r="24" fill="none" stroke="#000080" stroke-width="1"/>
    ${Array.from({length: 24}, (_, i) => {
      const angle = (i * 15 - 90) * Math.PI / 180
      const x1 = 70 + 24 * Math.cos(angle)
      const y1 = 70 + 24 * Math.sin(angle)
      const x2 = 70 + 18 * Math.cos(angle)
      const y2 = 70 + 18 * Math.sin(angle)
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#000080" stroke-width="1.5"/>`
    }).join('')}

    <!-- Tri-color rings -->
    <circle cx="70" cy="70" r="53" fill="none" stroke="#FF9933" stroke-width="3" opacity="0.3"/>
    <circle cx="70" cy="70" r="48" fill="none" stroke="#FFFFFF" stroke-width="3" opacity="0.3"/>
    <circle cx="70" cy="70" r="43" fill="none" stroke="#138808" stroke-width="3" opacity="0.3"/>
  </svg>`
}

/**
 * Generate watermark
 */
function generateWatermark(text: string): string {
  return `<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
                      font-size: 120px; color: rgba(0,0,0,0.03); font-weight: bold; z-index: 0; pointer-events: none;
                      white-space: nowrap; user-select: none;">
            ${text}
          </div>`
}

/**
 * Generate NAAC Certificate
 */
function generateNAACCertificate(institution: Institution): string {
  const year = new Date().getFullYear()
  const certNumber = `NAAC/${institution.state.substring(0,2).toUpperCase()}/${year - 2}/${institution.id}`

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NAAC Accreditation Certificate - ${institution.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lora:wght@400;600&display=swap');

        body {
            font-family: 'Lora', 'Times New Roman', serif;
            margin: 0;
            padding: 40px;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            position: relative;
        }

        .certificate {
            background: linear-gradient(to bottom, #ffffff 0%, #fefefe 100%);
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 80px;
            border: 20px solid;
            border-image: linear-gradient(45deg, #8B4513, #CD853F, #8B4513) 1;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3), inset 0 0 100px rgba(139,69,19,0.05);
            position: relative;
            background-image:
                radial-gradient(circle at 20% 30%, rgba(139,69,19,0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(139,69,19,0.03) 0%, transparent 50%);
        }

        .certificate::before {
            content: '';
            position: absolute;
            top: 30px;
            left: 30px;
            right: 30px;
            bottom: 30px;
            border: 2px solid rgba(139,69,19,0.2);
            pointer-events: none;
        }

        .header {
            text-align: center;
            margin-bottom: 50px;
            position: relative;
            z-index: 1;
        }

        .emblem {
            width: 140px;
            height: 140px;
            margin: 0 auto 25px;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }

        h1 {
            color: #1a365d;
            font-size: 38px;
            margin: 25px 0 15px;
            text-transform: uppercase;
            letter-spacing: 3px;
            font-family: 'Playfair Display', serif;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }

        .subtitle {
            color: #2d3748;
            font-size: 16px;
            margin: 8px 0;
            font-weight: 600;
        }

        .cert-title {
            text-align: center;
            font-size: 28px;
            color: #8B4513;
            margin: 40px 0 30px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 4px;
            border-top: 3px double #8B4513;
            border-bottom: 3px double #8B4513;
            padding: 15px 0;
        }

        .body {
            margin: 40px 0;
            line-height: 2.2;
            font-size: 17px;
            position: relative;
            z-index: 1;
        }

        .institution-name {
            text-align: center;
            font-size: 26px;
            margin: 30px 0;
            font-weight: 700;
            color: #1a365d;
            text-decoration: underline;
            text-decoration-color: #8B4513;
            text-decoration-thickness: 2px;
            text-underline-offset: 8px;
        }

        .highlight {
            display: inline-block;
            background: linear-gradient(135deg, #c53030 0%, #8B0000 100%);
            color: white;
            font-weight: bold;
            font-size: 32px;
            padding: 15px 40px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(197,48,48,0.3);
            letter-spacing: 2px;
        }

        .details {
            margin: 50px 0;
            background: rgba(139,69,19,0.03);
            padding: 30px;
            border-radius: 10px;
            border: 2px solid rgba(139,69,19,0.1);
        }

        .details table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0 12px;
        }

        .details td {
            padding: 12px 20px;
            background: white;
            border-radius: 5px;
        }

        .details td:first-child {
            font-weight: 700;
            width: 45%;
            color: #1a365d;
        }

        .footer {
            margin-top: 80px;
            position: relative;
            z-index: 1;
        }

        .signatures {
            margin-top: 60px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
        }

        .sign-block {
            text-align: center;
            flex: 1;
        }

        .signature-image {
            margin-bottom: 5px;
            height: 60px;
        }

        .sign-line {
            border-top: 2px solid #000;
            width: 220px;
            margin: 10px auto;
        }

        .sign-name {
            font-weight: 700;
            font-size: 16px;
            color: #1a365d;
            margin-top: 8px;
        }

        .sign-designation {
            font-size: 14px;
            color: #4a5568;
            margin-top: 4px;
            font-style: italic;
        }

        .official-seal {
            position: absolute;
            right: 80px;
            bottom: 100px;
            width: 150px;
            height: 150px;
            opacity: 0.9;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
            z-index: 2;
        }

        .cert-number {
            position: absolute;
            top: 40px;
            right: 60px;
            font-size: 12px;
            color: #8B4513;
            font-weight: 600;
            background: rgba(255,255,255,0.9);
            padding: 8px 15px;
            border: 2px solid #8B4513;
            border-radius: 5px;
        }

        .issue-date {
            margin-top: 30px;
            font-weight: 600;
            color: #2d3748;
        }

        @media print {
            body { padding: 0; background: white; }
            .certificate { box-shadow: none; border-image: none; border-color: #8B4513; }
        }
    </style>
</head>
<body>
    ${generateWatermark('NAAC CERTIFIED')}

    <div class="certificate">
        <div class="cert-number">Cert. No: ${certNumber}</div>

        <div class="header">
            <div class="emblem">
                ${generateOfficialSeal('NAAC', 'naac')}
            </div>
            <h1>National Assessment and Accreditation Council</h1>
            <div class="subtitle">An Autonomous Institution of the University Grants Commission</div>
            <div class="subtitle">Ministry of Education, Government of India</div>
            <div class="subtitle" style="margin-top: 15px; color: #8B4513;">Bangalore - 560072</div>
        </div>

        <div class="cert-title">CERTIFICATE OF ACCREDITATION</div>

        <div class="body">
            <p style="text-align: center; font-size: 18px;">This is to certify that</p>

            <p class="institution-name">${institution.name}</p>

            <p style="text-align: center; margin-bottom: 35px; font-size: 16px;">
                ${institution.city}, ${institution.state} - ${institution.district}
            </p>

            <p style="text-align: center;">has been assessed and accredited by the National Assessment and Accreditation Council (NAAC) with</p>

            <p style="text-align: center; margin: 35px 0;">
                <span class="highlight">${institution.naacGrade} Grade</span>
            </p>

            <div class="details">
                <table>
                    <tr>
                        <td>Institution Type:</td>
                        <td>${institution.type}</td>
                    </tr>
                    <tr>
                        <td>Established Year:</td>
                        <td>${institution.establishedYear}</td>
                    </tr>
                    <tr>
                        <td>CGPA Score:</td>
                        <td>${(3.51 + Math.random() * 0.48).toFixed(2)} out of 4.00</td>
                    </tr>
                    <tr>
                        <td>Accreditation Valid From:</td>
                        <td>January ${year - 2}</td>
                    </tr>
                    <tr>
                        <td>Accreditation Valid Until:</td>
                        <td>January ${year + 3}</td>
                    </tr>
                    <tr>
                        <td>Assessment Period:</td>
                        <td>October ${year - 3} - December ${year - 3}</td>
                    </tr>
                </table>
            </div>

            <div class="footer">
                <p class="issue-date">Issued on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <p style="font-size: 14px; margin-top: 15px; color: #4a5568; font-style: italic;">
                    This certificate is issued based on the comprehensive assessment of the institution as per NAAC guidelines and procedures.
                </p>

                <div class="signatures">
                    <div class="sign-block">
                        <div class="signature-image">${generateSignatureSVG('Director NAAC')}</div>
                        <div class="sign-line"></div>
                        <div class="sign-name">Dr. Bhushan Patwardhan</div>
                        <div class="sign-designation">Director, NAAC</div>
                        <div style="font-size: 12px; margin-top: 4px; color: #718096;">Bangalore</div>
                    </div>
                    <div class="sign-block">
                        <div class="signature-image">${generateSignatureSVG('Secretary UGC')}</div>
                        <div class="sign-line"></div>
                        <div class="sign-name">Dr. Rajnish Jain</div>
                        <div class="sign-designation">Secretary, UGC</div>
                        <div style="font-size: 12px; margin-top: 4px; color: #718096;">New Delhi</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="official-seal">
            ${generateOfficialSeal('NAAC', 'naac')}
        </div>
    </div>
</body>
</html>`
}

/**
 * Generate Faculty List
 */
function generateFacultyList(institution: Institution): string {
  const year = new Date().getFullYear()
  const facultyCount = Math.floor((institution.totalStudents || 5000) / 15)

  let facultyRows = ''
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Mathematics', 'Physics', 'Chemistry', 'English', 'Management', 'Law']
  const qualifications = ['Ph.D.', 'M.Tech', 'M.Sc.', 'MBA', 'LLM']
  const firstNames = ['Rajesh', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Anjali', 'Suresh', 'Kavita', 'Ramesh', 'Pooja']
  const lastNames = ['Kumar', 'Sharma', 'Patel', 'Singh', 'Reddy', 'Gupta', 'Mehta', 'Joshi', 'Rao', 'Nair']

  for (let i = 1; i <= Math.min(50, facultyCount); i++) {
    const dept = departments[Math.floor(Math.random() * departments.length)]
    const qual = qualifications[Math.floor(Math.random() * qualifications.length)]
    const experience = Math.floor(5 + Math.random() * 20)
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]

    facultyRows += `
                <tr>
                    <td>${i}</td>
                    <td>Dr. ${firstName} ${lastName}</td>
                    <td>${dept}</td>
                    <td>${qual}</td>
                    <td>${experience} years</td>
                    <td>${Math.floor(5 + Math.random() * 25)}</td>
                </tr>`
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faculty List ${year} - ${institution.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        body {
            font-family: 'Inter', Arial, sans-serif;
            margin: 0;
            padding: 30px;
            background: #f7fafc;
            color: #2d3748;
        }

        .document {
            background: white;
            max-width: 1200px;
            margin: 0 auto;
            padding: 50px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            border-radius: 12px;
            position: relative;
        }

        .letterhead {
            text-align: center;
            border-bottom: 4px solid #2c5282;
            padding-bottom: 25px;
            margin-bottom: 40px;
            position: relative;
        }

        .logo-container {
            margin-bottom: 20px;
        }

        .letterhead h1 {
            color: #1a365d;
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
        }

        .letterhead .address {
            color: #4a5568;
            font-size: 13px;
            margin: 4px 0;
        }

        .doc-title {
            background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
            color: white;
            padding: 20px;
            margin: 30px -50px;
            font-size: 22px;
            font-weight: 700;
            text-align: center;
            box-shadow: 0 4px 10px rgba(44,82,130,0.3);
        }

        .summary {
            background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%);
            padding: 30px;
            margin: 30px 0;
            border-radius: 10px;
            border-left: 5px solid #2c5282;
        }

        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
        }

        .summary-item {
            text-align: center;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .summary-item .number {
            font-size: 36px;
            font-weight: 700;
            color: #2c5282;
            margin-bottom: 8px;
        }

        .summary-item .label {
            font-size: 13px;
            color: #4a5568;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            font-size: 14px;
        }

        thead {
            background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
            color: white;
        }

        th, td {
            padding: 14px 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        th {
            font-weight: 700;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
        }

        tr:hover {
            background: #f7fafc;
        }

        tbody tr:nth-child(even) {
            background: #fafafa;
        }

        .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 3px solid #e2e8f0;
        }

        .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }

        .signature-box {
            text-align: center;
            flex: 1;
        }

        .signature-img {
            height: 60px;
            margin-bottom: 10px;
        }

        .signature-line {
            width: 200px;
            border-top: 2px solid #2d3748;
            margin: 15px auto 10px;
        }

        .signature-name {
            font-weight: 700;
            color: #1a365d;
            font-size: 15px;
        }

        .signature-title {
            font-size: 13px;
            color: #4a5568;
            font-style: italic;
            margin-top: 4px;
        }

        .stamp {
            position: absolute;
            right: 80px;
            bottom: 100px;
            opacity: 0.85;
        }

        @media print {
            body { background: white; padding: 0; }
            .document { box-shadow: none; }
        }
    </style>
</head>
<body>
    ${generateWatermark('CONFIDENTIAL')}

    <div class="document">
        <div class="letterhead">
            <div class="logo-container">
                ${generateCollegeLogo(institution)}
            </div>
            <h1>${institution.name}</h1>
            <div class="address">${institution.city}, ${institution.state}</div>
            <div class="address">Email: info@${institution.city.toLowerCase()}.edu.in | Phone: +91-XXXXXXXXXX</div>
        </div>

        <div class="doc-title">FACULTY LIST - ACADEMIC YEAR ${year}-${year + 1}</div>

        <div class="summary">
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="number">${facultyCount}</div>
                    <div class="label">Total Faculty</div>
                </div>
                <div class="summary-item">
                    <div class="number">${Math.floor(facultyCount * 0.65)}</div>
                    <div class="label">Ph.D. Holders</div>
                </div>
                <div class="summary-item">
                    <div class="number">${Math.floor(15 + Math.random() * 10)}</div>
                    <div class="label">Avg. Experience</div>
                </div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 50px;">S.No</th>
                    <th>Name</th>
                    <th>Department</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Publications</th>
                </tr>
            </thead>
            <tbody>
                ${facultyRows}
            </tbody>
        </table>

        <div class="footer">
            <p style="font-size: 13px; color: #4a5568; margin-bottom: 25px;">
                <strong>Note:</strong> This list includes all faculty members as on ${new Date().toLocaleDateString('en-IN')}.
                For any queries, please contact the HR Department.
            </p>

            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-img">${generateSignatureSVG(generateOfficialName(institution, 'Registrar'))}</div>
                    <div class="signature-line"></div>
                    <div class="signature-name">${generateOfficialName(institution, 'Registrar')}</div>
                    <div class="signature-title">Registrar</div>
                </div>
                <div class="signature-box">
                    <div class="signature-img">${generateSignatureSVG(generateOfficialName(institution, 'Principal'))}</div>
                    <div class="signature-line"></div>
                    <div class="signature-name">${generateOfficialName(institution, 'Principal')}</div>
                    <div class="signature-title">Principal/Director</div>
                </div>
            </div>

            <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #718096;">
                Generated on: ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
        </div>

        <div class="stamp">
            ${generateCollegeLogo(institution)}
        </div>
    </div>
</body>
</html>`
}

/**
 * Generate Student Enrollment Report
 */
function generateEnrollmentReport(institution: Institution, year: number = new Date().getFullYear()): string {
  const docNumber = `ENR/${institution.state.substring(0,2).toUpperCase()}/${year}/${institution.id}`

  // Generate realistic enrollment data
  const totalEnrollment = Math.floor(2000 + Math.random() * 8000)
  const undergrad = Math.floor(totalEnrollment * 0.65)
  const postgrad = Math.floor(totalEnrollment * 0.25)
  const doctoral = totalEnrollment - undergrad - postgrad

  const departments = [
    { name: 'Computer Science & Engineering', students: Math.floor(totalEnrollment * 0.22) },
    { name: 'Electronics & Communication', students: Math.floor(totalEnrollment * 0.18) },
    { name: 'Mechanical Engineering', students: Math.floor(totalEnrollment * 0.15) },
    { name: 'Civil Engineering', students: Math.floor(totalEnrollment * 0.12) },
    { name: 'Business Administration', students: Math.floor(totalEnrollment * 0.10) },
    { name: 'Commerce & Economics', students: Math.floor(totalEnrollment * 0.08) },
    { name: 'Sciences', students: Math.floor(totalEnrollment * 0.08) },
    { name: 'Other Departments', students: Math.floor(totalEnrollment * 0.07) }
  ]

  const deptRows = departments.map((dept, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="text-align: left;">${dept.name}</td>
      <td>${dept.students}</td>
      <td>${Math.floor(dept.students * 0.65)}</td>
      <td>${Math.floor(dept.students * 0.25)}</td>
      <td>${dept.students - Math.floor(dept.students * 0.65) - Math.floor(dept.students * 0.25)}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Enrollment Report - ${institution.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Slab:wght@600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f5f7fa;
            padding: 40px 20px;
        }

        .report-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border: 2px solid #e2e8f0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            position: relative;
        }

        .doc-number {
            position: absolute;
            top: 20px;
            right: 30px;
            font-size: 11px;
            color: #718096;
            font-weight: 600;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 3px solid #3182ce;
        }

        .header-logo {
            margin-bottom: 15px;
        }

        .header h1 {
            font-family: 'Roboto Slab', serif;
            font-size: 26px;
            color: #1a202c;
            margin-bottom: 8px;
        }

        .header .subtitle {
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 4px;
        }

        .header .academic-year {
            font-size: 18px;
            color: #3182ce;
            font-weight: 700;
            margin-top: 15px;
            letter-spacing: 0.5px;
        }

        .report-title {
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            color: #2d3748;
            margin: 30px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 40px 0;
        }

        .card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 25px;
            border-radius: 12px;
            color: white;
            text-align: center;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .card:nth-child(2) {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .card:nth-child(3) {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        .card:nth-child(4) {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        }

        .card-number {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .card-label {
            font-size: 13px;
            opacity: 0.95;
            font-weight: 500;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            font-size: 14px;
        }

        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        th, td {
            padding: 15px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }

        th {
            font-weight: 600;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        tbody tr:nth-child(even) {
            background: #f7fafc;
        }

        tbody tr:hover {
            background: #edf2f7;
        }

        .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 2px solid #e2e8f0;
        }

        .signatures {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
        }

        .sign-block {
            text-align: center;
        }

        .signature-image {
            height: 60px;
            margin-bottom: 5px;
        }

        .sign-line {
            width: 200px;
            height: 1px;
            background: #4a5568;
            margin: 0 auto 10px;
        }

        .sign-name {
            font-weight: 600;
            color: #2d3748;
            font-size: 14px;
        }

        .sign-designation {
            font-size: 12px;
            color: #718096;
            margin-top: 4px;
        }

        .stamp {
            position: absolute;
            bottom: 100px;
            right: 80px;
            opacity: 0.85;
            filter: drop-shadow(0 4px 10px rgba(0,0,0,0.25));
        }

        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: rgba(0,0,0,0.03);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
            white-space: nowrap;
            user-select: none;
        }

        .disclaimer {
            margin-top: 30px;
            padding: 20px;
            background: #fff5f5;
            border-left: 4px solid #fc8181;
            font-size: 12px;
            color: #742a2a;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="watermark">OFFICIAL RECORD</div>

    <div class="report-container">
        <div class="doc-number">Doc. No: ${docNumber}</div>

        <div class="header">
            <div class="header-logo">
                ${generateCollegeLogo(institution)}
            </div>
            <h1>${institution.name}</h1>
            <div class="subtitle">${institution.city}, ${institution.state} - Estd. ${institution.establishedYear}</div>
            <div class="subtitle">NAAC Accredited ${institution.naacGrade} | UGC Approved</div>
            <div class="academic-year">ACADEMIC YEAR ${year}-${year + 1}</div>
        </div>

        <div class="report-title">Student Enrollment Report</div>

        <div class="summary-cards">
            <div class="card">
                <div class="card-number">${totalEnrollment.toLocaleString()}</div>
                <div class="card-label">Total Enrollment</div>
            </div>
            <div class="card">
                <div class="card-number">${undergrad.toLocaleString()}</div>
                <div class="card-label">Undergraduate</div>
            </div>
            <div class="card">
                <div class="card-number">${postgrad.toLocaleString()}</div>
                <div class="card-label">Postgraduate</div>
            </div>
            <div class="card">
                <div class="card-number">${doctoral.toLocaleString()}</div>
                <div class="card-label">Doctoral</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 60px;">S.No</th>
                    <th style="width: 300px;">Department/Program</th>
                    <th>Total</th>
                    <th>UG</th>
                    <th>PG</th>
                    <th>Ph.D</th>
                </tr>
            </thead>
            <tbody>
                ${deptRows}
                <tr style="background: #edf2f7; font-weight: 700;">
                    <td colspan="2" style="text-align: right; padding-right: 20px;">TOTAL</td>
                    <td>${totalEnrollment.toLocaleString()}</td>
                    <td>${undergrad.toLocaleString()}</td>
                    <td>${postgrad.toLocaleString()}</td>
                    <td>${doctoral}</td>
                </tr>
            </tbody>
        </table>

        <div class="disclaimer">
            <strong>Disclaimer:</strong> This enrollment report is accurate as on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
            The data includes all registered students across all programs and departments. For detailed student records, please contact the Academic Section.
        </div>

        <div class="footer">
            <div class="signatures">
                <div class="sign-block">
                    <div class="signature-image">${generateSignatureSVG(generateOfficialName(institution, 'Dean (Academics)'))}</div>
                    <div class="sign-line"></div>
                    <div class="sign-name">${generateOfficialName(institution, 'Dean (Academics)')}</div>
                    <div class="sign-designation">Dean (Academics)</div>
                    <div class="sign-designation" style="margin-top: 2px; font-size: 11px;">
                        ${new Date().toLocaleDateString('en-IN')}
                    </div>
                </div>
                <div class="sign-block">
                    <div class="signature-image">${generateSignatureSVG(generateOfficialName(institution, 'Registrar'))}</div>
                    <div class="sign-line"></div>
                    <div class="sign-name">${generateOfficialName(institution, 'Registrar')}</div>
                    <div class="sign-designation">Registrar</div>
                    <div class="sign-designation" style="margin-top: 2px; font-size: 11px;">
                        ${new Date().toLocaleDateString('en-IN')}
                    </div>
                </div>
            </div>
        </div>

        <div class="stamp">
            ${generateCollegeLogo(institution)}
        </div>
    </div>
</body>
</html>`
}

/**
 * Generate Placement Report
 */
function generatePlacementReport(institution: Institution, year: number = new Date().getFullYear()): string {
  const docNumber = `PLC/${institution.state.substring(0,2).toUpperCase()}/${year}/${institution.id}`

  // Generate realistic placement data
  const totalEligible = Math.floor(800 + Math.random() * 1200)
  const placed = Math.floor(totalEligible * (0.70 + Math.random() * 0.25))
  const placementRate = ((placed / totalEligible) * 100).toFixed(1)
  const avgPackage = (4.5 + Math.random() * 3.5).toFixed(2)
  const highestPackage = (18 + Math.random() * 27).toFixed(2)
  const medianPackage = (3.8 + Math.random() * 2.5).toFixed(2)

  const companies = [
    { name: 'TCS', students: Math.floor(placed * 0.12), package: '3.6' },
    { name: 'Infosys', students: Math.floor(placed * 0.10), package: '4.2' },
    { name: 'Wipro', students: Math.floor(placed * 0.09), package: '3.8' },
    { name: 'Accenture', students: Math.floor(placed * 0.08), package: '4.5' },
    { name: 'Cognizant', students: Math.floor(placed * 0.07), package: '4.0' },
    { name: 'Amazon', students: Math.floor(placed * 0.05), package: '28.5' },
    { name: 'Microsoft', students: Math.floor(placed * 0.03), package: '42.0' },
    { name: 'Google', students: Math.floor(placed * 0.02), package: highestPackage },
    { name: 'Deloitte', students: Math.floor(placed * 0.06), package: '6.5' },
    { name: 'Capgemini', students: Math.floor(placed * 0.07), package: '4.8' },
    { name: 'Tech Mahindra', students: Math.floor(placed * 0.06), package: '3.5' },
    { name: 'Others', students: placed - Math.floor(placed * 0.75), package: avgPackage }
  ]

  const companyRows = companies.map((company, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="text-align: left; font-weight: 500;">${company.name}</td>
      <td>${company.students}</td>
      <td style="font-weight: 600; color: #38a169;">₹${company.package} LPA</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Placement Report - ${institution.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
        }

        .report-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            position: relative;
        }

        .doc-number {
            position: absolute;
            top: 25px;
            right: 35px;
            font-size: 11px;
            color: #718096;
            font-weight: 600;
            background: #f7fafc;
            padding: 6px 12px;
            border-radius: 4px;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 4px solid;
            border-image: linear-gradient(90deg, #667eea 0%, #764ba2 100%) 1;
        }

        .header-logo {
            margin-bottom: 20px;
        }

        .header h1 {
            font-family: 'Poppins', sans-serif;
            font-size: 28px;
            color: #1a202c;
            margin-bottom: 10px;
            font-weight: 700;
        }

        .header .subtitle {
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 5px;
        }

        .header .academic-year {
            font-size: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            font-weight: 800;
            margin-top: 15px;
            letter-spacing: 1px;
        }

        .report-title {
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 30px 0;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 40px 0;
        }

        .stat-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            padding: 30px;
            border-radius: 15px;
            color: white;
            text-align: center;
            box-shadow: 0 8px 25px rgba(245, 87, 108, 0.3);
            transition: transform 0.3s;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-card:nth-child(2) {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            box-shadow: 0 8px 25px rgba(0, 242, 254, 0.3);
        }

        .stat-card:nth-child(3) {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            box-shadow: 0 8px 25px rgba(56, 249, 215, 0.3);
        }

        .stat-number {
            font-size: 42px;
            font-weight: 800;
            margin-bottom: 10px;
        }

        .stat-label {
            font-size: 14px;
            opacity: 0.95;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .highlight-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 30px 0;
        }

        .highlight-box {
            background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            border: 2px solid #f39c12;
        }

        .highlight-box:nth-child(2) {
            background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
            border-color: #6c5ce7;
            color: white;
        }

        .highlight-box:nth-child(3) {
            background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
            border-color: #e84393;
            color: white;
        }

        .highlight-label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            margin-bottom: 8px;
            opacity: 0.9;
        }

        .highlight-value {
            font-size: 28px;
            font-weight: 800;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 40px 0;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            border-radius: 10px;
            overflow: hidden;
        }

        thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        th, td {
            padding: 16px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }

        th {
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        tbody tr:nth-child(even) {
            background: #f7fafc;
        }

        tbody tr:hover {
            background: #edf2f7;
        }

        .footer {
            margin-top: 60px;
            padding-top: 30px;
            border-top: 3px solid #e2e8f0;
        }

        .signatures {
            display: flex;
            justify-content: space-around;
            margin-top: 50px;
        }

        .sign-block {
            text-align: center;
        }

        .signature-image {
            height: 60px;
            margin-bottom: 5px;
        }

        .sign-line {
            width: 200px;
            height: 2px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            margin: 0 auto 10px;
        }

        .sign-name {
            font-weight: 700;
            color: #2d3748;
            font-size: 14px;
        }

        .sign-designation {
            font-size: 12px;
            color: #718096;
            margin-top: 5px;
        }

        .stamp {
            position: absolute;
            bottom: 90px;
            left: 80px;
            opacity: 0.8;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }

        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 150px;
            color: rgba(102, 126, 234, 0.04);
            font-weight: bold;
            z-index: 0;
            pointer-events: none;
            white-space: nowrap;
            user-select: none;
        }

        .note-box {
            margin-top: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
            border-left: 5px solid #0284c7;
            font-size: 13px;
            color: #0c4a6e;
            line-height: 1.7;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="watermark">PLACEMENT ${year}</div>

    <div class="report-container">
        <div class="doc-number">Doc. No: ${docNumber}</div>

        <div class="header">
            <div class="header-logo">
                ${generateCollegeLogo(institution)}
            </div>
            <h1>${institution.name}</h1>
            <div class="subtitle">${institution.city}, ${institution.state}</div>
            <div class="subtitle">Training & Placement Office</div>
            <div class="academic-year">PLACEMENT SEASON ${year - 1}-${year}</div>
        </div>

        <div class="report-title">Annual Placement Report</div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number">${totalEligible}</div>
                <div class="stat-label">Students Registered</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${placed}</div>
                <div class="stat-label">Students Placed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${placementRate}%</div>
                <div class="stat-label">Placement Rate</div>
            </div>
        </div>

        <div class="highlight-stats">
            <div class="highlight-box">
                <div class="highlight-label">Highest Package</div>
                <div class="highlight-value">₹${highestPackage} LPA</div>
            </div>
            <div class="highlight-box">
                <div class="highlight-label">Average Package</div>
                <div class="highlight-value">₹${avgPackage} LPA</div>
            </div>
            <div class="highlight-box">
                <div class="highlight-label">Median Package</div>
                <div class="highlight-value">₹${medianPackage} LPA</div>
            </div>
        </div>

        <h3 style="margin-top: 50px; margin-bottom: 20px; color: #2d3748; font-size: 18px; font-weight: 700;">
            Top Recruiting Companies
        </h3>

        <table>
            <thead>
                <tr>
                    <th style="width: 60px;">S.No</th>
                    <th style="width: 400px;">Company Name</th>
                    <th>Students Placed</th>
                    <th>Package Offered</th>
                </tr>
            </thead>
            <tbody>
                ${companyRows}
            </tbody>
        </table>

        <div class="note-box">
            <strong>Note:</strong> This placement report covers the placement season ${year - 1}-${year}.
            The data represents final placements as on ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}.
            Multiple offers to a single student are counted individually. For detailed company-wise and branch-wise statistics,
            please contact the Training & Placement Office.
        </div>

        <div class="footer">
            <div class="signatures">
                <div class="sign-block">
                    <div class="signature-image">${generateSignatureSVG(generateOfficialName(institution, 'Training & Placement Officer'))}</div>
                    <div class="sign-line"></div>
                    <div class="sign-name">${generateOfficialName(institution, 'Training & Placement Officer')}</div>
                    <div class="sign-designation">Training & Placement Officer</div>
                    <div class="sign-designation" style="margin-top: 3px; font-size: 11px;">
                        ${new Date().toLocaleDateString('en-IN')}
                    </div>
                </div>
                <div class="sign-block">
                    <div class="signature-image">${generateSignatureSVG(generateOfficialName(institution, 'Director'))}</div>
                    <div class="sign-line"></div>
                    <div class="sign-name">${generateOfficialName(institution, 'Director')}</div>
                    <div class="sign-designation">Director</div>
                    <div class="sign-designation" style="margin-top: 3px; font-size: 11px;">
                        ${new Date().toLocaleDateString('en-IN')}
                    </div>
                </div>
            </div>
        </div>

        <div class="stamp">
            ${generateCollegeLogo(institution)}
        </div>
    </div>
</body>
</html>`
}

/**
 * Generate Research Publications Report
 */
function generateResearchReport(institution: Institution, year: number = new Date().getFullYear()): string {
  const docNumber = `RES/${institution.state.substring(0,2).toUpperCase()}/${year}/${institution.id}`

  // Generate realistic research data
  const totalPublications = Math.floor(50 + Math.random() * 200)
  const journals = Math.floor(totalPublications * 0.45)
  const conferences = Math.floor(totalPublications * 0.35)
  const books = Math.floor(totalPublications * 0.10)
  const patents = totalPublications - journals - conferences - books

  const categories = [
    { name: 'SCI/SCIE Indexed Journals', count: Math.floor(journals * 0.40), impact: 'High' },
    { name: 'Scopus Indexed Journals', count: Math.floor(journals * 0.35), impact: 'High' },
    { name: 'UGC Care Listed Journals', count: Math.floor(journals * 0.25), impact: 'Medium' },
    { name: 'IEEE/ACM Conferences', count: Math.floor(conferences * 0.50), impact: 'High' },
    { name: 'Springer/Elsevier Conferences', count: Math.floor(conferences * 0.30), impact: 'Medium' },
    { name: 'National Conferences', count: Math.floor(conferences * 0.20), impact: 'Medium' },
    { name: 'Book Chapters', count: Math.floor(books * 0.70), impact: 'Medium' },
    { name: 'Books Published', count: Math.floor(books * 0.30), impact: 'High' },
    { name: 'Patents Filed', count: Math.floor(patents * 0.60), impact: 'High' },
    { name: 'Patents Granted', count: Math.floor(patents * 0.40), impact: 'Very High' }
  ]

  const categoryRows = categories.map((cat, i) => {
    const impactColors = {
      'Very High': '#059669',
      'High': '#0891b2',
      'Medium': '#ca8a04'
    }
    return `
    <tr>
      <td>${i + 1}</td>
      <td style="text-align: left; font-weight: 500;">${cat.name}</td>
      <td style="font-weight: 700; font-size: 16px;">${cat.count}</td>
      <td>
        <span style="background: ${impactColors[cat.impact as keyof typeof impactColors]};
                     color: white;
                     padding: 4px 12px;
                     border-radius: 12px;
                     font-size: 11px;
                     font-weight: 600;">
          ${cat.impact}
        </span>
      </td>
    </tr>
  `}).join('')

  const hIndex = Math.floor(15 + Math.random() * 35)
  const citations = Math.floor(800 + Math.random() * 2200)
  const researchGrants = (50 + Math.random() * 150).toFixed(2)

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Research Publications Report - ${institution.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Merriweather:wght@700;900&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
            padding: 40px 20px;
        }

        .report-container {
            max-width: 1100px;
            margin: 0 auto;
            background: white;
            padding: 60px;
            border-radius: 20px;
            box-shadow: 0 25px 70px rgba(0,0,0,0.4);
            position: relative;
        }

        .doc-number {
            position: absolute;
            top: 25px;
            right: 35px;
            font-size: 11px;
            color: #718096;
            font-weight: 700;
            background: #f7fafc;
            padding: 8px 14px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }

        .header {
            text-align: center;
            margin-bottom: 45px;
            padding-bottom: 35px;
            border-bottom: 5px solid;
            border-image: linear-gradient(90deg, #0f2027 0%, #2c5364 100%) 1;
        }

        .header-logo {
            margin-bottom: 20px;
        }

        .header h1 {
            font-family: 'Merriweather', serif;
            font-size: 30px;
            color: #1a202c;
            margin-bottom: 12px;
            font-weight: 900;
            line-height: 1.3;
        }

        .header .subtitle {
            font-size: 14px;
            color: #4a5568;
            margin-bottom: 6px;
            font-weight: 500;
        }

        .header .academic-year {
            font-size: 22px;
            color: #2c5364;
            font-weight: 800;
            margin-top: 18px;
            letter-spacing: 1.2px;
        }

        .report-title {
            text-align: center;
            font-size: 26px;
            font-weight: 800;
            color: #2c5364;
            margin: 35px 0;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.05);
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 40px 0;
        }

        .metric-card {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
            padding: 28px;
            border-radius: 15px;
            color: white;
            text-align: center;
            box-shadow: 0 10px 30px rgba(30, 60, 114, 0.3);
            border: 2px solid rgba(255,255,255,0.1);
        }

        .metric-card:nth-child(2) {
            background: linear-gradient(135deg, #134e5e 0%, #71b280 100%);
        }

        .metric-card:nth-child(3) {
            background: linear-gradient(135deg, #ad5389 0%, #3c1053 100%);
        }

        .metric-card:nth-child(4) {
            background: linear-gradient(135deg, #c94b4b 0%, #4b134f 100%);
        }

        .metric-number {
            font-size: 40px;
            font-weight: 900;
            margin-bottom: 12px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .metric-label {
            font-size: 13px;
            opacity: 0.95;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.8px;
        }

        .impact-metrics {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
            margin: 40px 0;
            padding: 30px;
            background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%);
            border-radius: 15px;
            box-shadow: 0 8px 25px rgba(253, 203, 110, 0.3);
        }

        .impact-item {
            text-align: center;
            padding: 15px;
            background: rgba(255,255,255,0.6);
            border-radius: 10px;
        }

        .impact-label {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            color: #744210;
            margin-bottom: 10px;
        }

        .impact-value {
            font-size: 32px;
            font-weight: 900;
            color: #744210;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 40px 0;
            font-size: 14px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
            border-radius: 12px;
            overflow: hidden;
        }

        thead {
            background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%);
            color: white;
        }

        th, td {
            padding: 18px;
            text-align: center;
            border: 1px solid #e2e8f0;
        }

        th {
            font-weight: 800;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        tbody tr:nth-child(even) {
            background: #f7fafc;
        }

        tbody tr:hover {
            background: #edf2f7;
        }

        .footer {
            margin-top: 70px;
            padding-top: 35px;
            border-top: 3px solid #e2e8f0;
        }

        .signatures {
            display: flex;
            justify-content: space-around;
            margin-top: 55px;
        }

        .sign-block {
            text-align: center;
        }

        .signature-image {
            height: 65px;
            margin-bottom: 8px;
        }

        .sign-line {
            width: 220px;
            height: 2px;
            background: linear-gradient(90deg, #0f2027 0%, #2c5364 100%);
            margin: 0 auto 12px;
        }

        .sign-name {
            font-weight: 800;
            color: #2d3748;
            font-size: 15px;
        }

        .sign-designation {
            font-size: 13px;
            color: #718096;
            margin-top: 6px;
            font-weight: 500;
        }

        .seal-left {
            position: absolute;
            bottom: 100px;
            left: 70px;
            opacity: 0.75;
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.3));
        }

        .seal-right {
            position: absolute;
            bottom: 100px;
            right: 70px;
            opacity: 0.75;
            filter: drop-shadow(0 5px 15px rgba(0,0,0,0.3));
        }

        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 140px;
            color: rgba(15, 32, 39, 0.03);
            font-weight: 900;
            z-index: 0;
            pointer-events: none;
            white-space: nowrap;
            user-select: none;
        }

        .info-box {
            margin-top: 35px;
            padding: 25px;
            background: linear-gradient(135deg, #dfe9f3 0%, #ffffff 100%);
            border-left: 6px solid #2c5364;
            font-size: 13px;
            color: #1a365d;
            line-height: 1.8;
            border-radius: 8px;
        }
    </style>
</head>
<body>
    <div class="watermark">RESEARCH</div>

    <div class="report-container">
        <div class="doc-number">Doc. No: ${docNumber}</div>

        <div class="header">
            <div class="header-logo">
                ${generateCollegeLogo(institution)}
            </div>
            <h1>${institution.name}</h1>
            <div class="subtitle">${institution.city}, ${institution.state}</div>
            <div class="subtitle">Research & Development Cell</div>
            <div class="academic-year">CALENDAR YEAR ${year}</div>
        </div>

        <div class="report-title">Research Publications Report</div>

        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-number">${totalPublications}</div>
                <div class="metric-label">Total Publications</div>
            </div>
            <div class="metric-card">
                <div class="metric-number">${journals}</div>
                <div class="metric-label">Journal Papers</div>
            </div>
            <div class="metric-card">
                <div class="metric-number">${conferences}</div>
                <div class="metric-label">Conference Papers</div>
            </div>
            <div class="metric-card">
                <div class="metric-number">${patents}</div>
                <div class="metric-label">Patents</div>
            </div>
        </div>

        <div class="impact-metrics">
            <div class="impact-item">
                <div class="impact-label">H-Index</div>
                <div class="impact-value">${hIndex}</div>
            </div>
            <div class="impact-item">
                <div class="impact-label">Total Citations</div>
                <div class="impact-value">${citations.toLocaleString()}</div>
            </div>
            <div class="impact-item">
                <div class="impact-label">Research Grants</div>
                <div class="impact-value">₹${researchGrants}Cr</div>
            </div>
        </div>

        <h3 style="margin-top: 50px; margin-bottom: 25px; color: #2d3748; font-size: 19px; font-weight: 800;">
            Publications by Category
        </h3>

        <table>
            <thead>
                <tr>
                    <th style="width: 60px;">S.No</th>
                    <th style="width: 450px;">Publication Category</th>
                    <th>Count</th>
                    <th>Impact</th>
                </tr>
            </thead>
            <tbody>
                ${categoryRows}
                <tr style="background: linear-gradient(135deg, #edf2f7 0%, #e2e8f0 100%); font-weight: 800;">
                    <td colspan="2" style="text-align: right; padding-right: 25px; font-size: 15px;">TOTAL PUBLICATIONS</td>
                    <td style="font-size: 18px; color: #2c5364;">${totalPublications}</td>
                    <td>-</td>
                </tr>
            </tbody>
        </table>

        <div class="info-box">
            <strong>Report Summary:</strong> This research publications report provides a comprehensive overview of all scholarly
            publications produced by the faculty and researchers of ${institution.name} during the calendar year ${year}.
            The data has been compiled from various indexing databases including Web of Science, Scopus, Google Scholar,
            and the Indian Patent Office. Publications are categorized based on their impact factor and indexing status.
            For detailed author-wise or department-wise publication lists, please contact the Research & Development Cell.
        </div>

        <div class="footer">
            <div class="signatures">
                <div class="sign-block">
                    <div class="signature-image">${generateSignatureSVG(generateOfficialName(institution, 'Dean, Research & Development'))}</div>
                    <div class="sign-line"></div>
                    <div class="sign-name">${generateOfficialName(institution, 'Dean, Research & Development')}</div>
                    <div class="sign-designation">Dean, Research & Development</div>
                    <div class="sign-designation" style="margin-top: 4px; font-size: 11px;">
                        ${new Date().toLocaleDateString('en-IN')}
                    </div>
                </div>
                <div class="sign-block">
                    <div class="signature-image">${generateSignatureSVG(generateOfficialName(institution, 'Vice Chancellor'))}</div>
                    <div class="sign-line"></div>
                    <div class="sign-name">${generateOfficialName(institution, 'Vice Chancellor')}</div>
                    <div class="sign-designation">Vice Chancellor</div>
                    <div class="sign-designation" style="margin-top: 4px; font-size: 11px;">
                        ${new Date().toLocaleDateString('en-IN')}
                    </div>
                </div>
            </div>
        </div>

        <div class="seal-left">
            ${generateCollegeLogo(institution)}
        </div>

        <div class="seal-right">
            ${generateOfficialSeal('UGC', 'government')}
        </div>
    </div>
</body>
</html>`
}

// Export all document templates
export const documentTemplates: DocumentTemplate[] = [
  {
    type: 'NAAC Certificate',
    category: 'Accreditation',
    title: 'NAAC_Certificate',
    generateContent: generateNAACCertificate
  },
  {
    type: 'Faculty List',
    category: 'HR Records',
    title: 'Faculty_List',
    generateContent: (inst) => generateFacultyList(inst)
  },
  {
    type: 'Student Enrollment',
    category: 'Academic Records',
    title: 'Student_Enrollment',
    generateContent: generateEnrollmentReport
  },
  {
    type: 'Placement Report',
    category: 'Career Services',
    title: 'Placement_Report',
    generateContent: generatePlacementReport
  },
  {
    type: 'Research Publications',
    category: 'Research Records',
    title: 'Research_Publications',
    generateContent: generateResearchReport
  }
]

/**
 * Get documents for a specific institution
 */
export function getInstitutionDocuments(institutionId: string) {
  const institutions = loadAllInstitutions()
  const institution = institutions.find(i => i.id === institutionId)

  if (!institution) {
    return []
  }

  const year = new Date().getFullYear()

  return documentTemplates.map(template => ({
    id: `${institutionId}_${template.type.replace(/\s+/g, '_')}`,
    name: `${template.title.replace(/_/g, ' ')} ${year}`,
    category: template.category,
    type: template.type,
    filename: `${institution.id}_${template.title}_${year}.html`,
    uploadDate: new Date().toISOString().split('T')[0],
    status: 'verified' as const,
    size: '350 KB',
    institutionId: institution.id
  }))
}

/**
 * Generate all documents for all institutions
 */
export function generateAllDocuments(): { institution: Institution, documents: Array<{ filename: string, content: string }> }[] {
  const institutions = loadAllInstitutions()
  const year = new Date().getFullYear()

  return institutions.map(institution => {
    const documents = documentTemplates.map(template => ({
      filename: `${institution.id}_${template.title}_${year}.html`,
      content: template.generateContent(institution, year)
    }))

    return { institution, documents }
  })
}
