import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Institution, Document, Category, User, Notification } from '@/types'

// Import data services
import { loadAllInstitutions } from '@/services/institutionDataService'
import { getInstitutionDocuments } from '@/services/documentGenerator'
import categoriesData from '@/data/categories.json'

interface AppState {
  // User
  currentUser: User | null
  setCurrentUser: (user: User | null) => void

  // Selected Institution (for both institution and admin views)
  selectedInstitution: Institution | null
  setSelectedInstitution: (institution: Institution | null) => void

  // Data
  institutions: Institution[]
  documents: Document[]
  categories: Category[]
  notifications: Notification[]

  // Actions
  getInstitutionById: (id: string) => Institution | undefined
  getDocumentsByInstitutionId: (institutionId: string) => Document[]
  updateDocument: (id: string, updates: Partial<Document>) => void
  addDocument: (document: Document) => void
  deleteDocument: (id: string) => void
  updateInstitution: (id: string, updates: Partial<Institution>) => void

  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  // Filters
  institutionFilter: {
    searchQuery: string
    type: string[]
    state: string[]
    status: string[]
  }
  setInstitutionFilter: (filter: Partial<AppState['institutionFilter']>) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: {
        id: 'USER001',
        email: 'admin@abctech.edu.in',
        role: 'institution',
        institutionId: 'INST001',
        name: 'ABC Institute Admin',
        lastLogin: '2025-09-15T10:30:00Z',
      },

      selectedInstitution: loadAllInstitutions()[0] || null,

      institutions: loadAllInstitutions(),
      documents: [], // Documents are generated dynamically
      categories: categoriesData as Category[],
      notifications: [],

      sidebarOpen: true,

      institutionFilter: {
        searchQuery: '',
        type: [],
        state: [],
        status: [],
      },

      // Actions
      setCurrentUser: (user) => {
        set({ currentUser: user })
        // When user is set, also set their institution
        if (user && user.institutionId) {
          const institution = get().institutions.find(inst => inst.id === user.institutionId)
          if (institution) {
            set({ selectedInstitution: institution })
          }
        }
      },

      setSelectedInstitution: (institution) => set({ selectedInstitution: institution }),

  getInstitutionById: (id) => {
    return get().institutions.find(inst => inst.id === id)
  },

  getDocumentsByInstitutionId: (institutionId) => {
    // Get uploaded documents from store
    const uploadedDocs = get().documents.filter(doc => doc.institutionId === institutionId)

    // Generate system documents dynamically for the institution
    const systemDocs = getInstitutionDocuments(institutionId)
    const convertedSystemDocs = systemDocs.map(doc => ({
      id: doc.id,
      institutionId: doc.institutionId,
      name: doc.name,
      type: doc.type,
      category: doc.category,
      status: doc.status,
      uploadDate: doc.uploadDate,
      size: doc.size,
      url: `/documents/${doc.filename}`,
      dsiContribution: 5 + Math.random() * 5,
      completeness: 0.95 + Math.random() * 0.05,
      verificationScore: 1.0,
      verificationSource: 'System Generated',
      aiInsights: [
        'Document verified and complete',
        'All required information present',
        'Meets DSI standards'
      ]
    })) as Document[]

    // Merge uploaded and system documents (uploaded first, then system)
    return [...uploadedDocs, ...convertedSystemDocs]
  },

  updateDocument: (id, updates) => set((state) => ({
    documents: state.documents.map(doc =>
      doc.id === id ? { ...doc, ...updates } : doc
    ),
  })),

  addDocument: (document) => set((state) => ({
    documents: [...state.documents, document],
  })),

  deleteDocument: (id) => set((state) => ({
    documents: state.documents.filter(doc => doc.id !== id),
  })),

  updateInstitution: (id, updates) => set((state) => ({
    institutions: state.institutions.map(inst =>
      inst.id === id ? { ...inst, ...updates } : inst
    ),
    selectedInstitution:
      state.selectedInstitution?.id === id
        ? { ...state.selectedInstitution, ...updates }
        : state.selectedInstitution,
  })),

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      setInstitutionFilter: (filter) => set((state) => ({
        institutionFilter: { ...state.institutionFilter, ...filter },
      })),
    }),
    {
      name: 'sih-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        selectedInstitution: state.selectedInstitution,
        documents: state.documents,
      }),
    }
  )
)
