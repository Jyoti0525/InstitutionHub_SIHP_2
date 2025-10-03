import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider'

// Layouts
import PublicLayout from './components/layout/PublicLayout'
import InstitutionLayout from './components/layout/InstitutionLayout'
import AdminLayout from './components/layout/AdminLayout'

// Public Pages
import Landing from './pages/public/Landing'
import Login from './pages/public/Login'
import About from './pages/public/About'

// Institution Pages
import InstitutionDashboard from './pages/institution/Dashboard'
import DocumentManager from './pages/institution/DocumentManager'
import PerformanceScorecard from './pages/institution/PerformanceScorecard'
import PeerComparison from './pages/institution/PeerComparison'
import Profile from './pages/institution/Profile'
import AIInsights from './pages/institution/AIInsights'
import Benchmarking from './pages/institution/Benchmarking'
import ExplainableAI from './pages/institution/ExplainableAI'
import Reports from './pages/institution/Reports'

// Admin Pages
import InstitutionList from './pages/admin/InstitutionList'
import ReviewQueue from './pages/admin/ReviewQueue'
import InstitutionDetail from './pages/admin/InstitutionDetail'
import Analytics from './pages/admin/Analytics'
import AllDocuments from './pages/admin/AllDocuments'

// Jury Pages
import JuryDashboard from './pages/jury/JuryDashboard'

// Document View
import DocumentView from './pages/DocumentView'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="sih-ui-theme">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Institution Routes */}
          <Route path="/institution" element={<InstitutionLayout />}>
            <Route index element={<InstitutionDashboard />} />
            <Route path="dashboard" element={<InstitutionDashboard />} />
            <Route path="documents" element={<DocumentManager />} />
            <Route path="scorecard" element={<PerformanceScorecard />} />
            <Route path="comparison" element={<PeerComparison />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ai-insights" element={<AIInsights />} />
            <Route path="benchmarking" element={<Benchmarking />} />
            <Route path="explainable-ai" element={<ExplainableAI />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ReviewQueue />} />
            <Route path="institutions" element={<InstitutionList />} />
            <Route path="review-queue" element={<ReviewQueue />} />
            <Route path="institution/:id" element={<InstitutionDetail />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="documents" element={<AllDocuments />} />
          </Route>

          {/* Jury Routes */}
          <Route path="/jury" element={<AdminLayout />}>
            <Route index element={<JuryDashboard />} />
            <Route path="dashboard" element={<JuryDashboard />} />
          </Route>

          {/* Document Routes - standalone without layout */}
          <Route path="/documents/:filename" element={<DocumentView />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
