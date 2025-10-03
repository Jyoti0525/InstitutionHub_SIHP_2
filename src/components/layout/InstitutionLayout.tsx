import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  BarChart3,
  GitCompare,
  User,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Brain,
  Target,
  Sparkles,
  FileBarChart,
  Bell
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { useStore } from '@/store/useStore'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'

export default function InstitutionLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { currentUser, selectedInstitution, setCurrentUser } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/institution/dashboard', icon: LayoutDashboard },
    { name: 'Documents', href: '/institution/documents', icon: FileText },
    { name: 'Scorecard', href: '/institution/scorecard', icon: BarChart3 },
    { name: 'AI Insights', href: '/institution/ai-insights', icon: Brain },
    { name: 'Benchmarking', href: '/institution/benchmarking', icon: Target },
    { name: 'Explainable AI', href: '/institution/explainable-ai', icon: Sparkles },
    { name: 'Reports', href: '/institution/reports', icon: FileBarChart },
    { name: 'Peer Comparison', href: '/institution/comparison', icon: GitCompare },
    { name: 'Profile', href: '/institution/profile', icon: User },
  ]

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-[#0f172a]">
      {/* Header */}
      <header className="border-b border-neutral-border dark:border-neutral-700 bg-white dark:bg-[#1e293b] sticky top-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Menu Toggle */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-9 h-9"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Link to="/institution/dashboard" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="font-bold text-sm text-neutral-text-primary dark:text-neutral-100 leading-none">
                    InstitutionHub
                  </span>
                  <span className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                    Institution Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Institution Info & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-neutral-text-primary dark:text-neutral-100">
                  {selectedInstitution?.name}
                </div>
                <div className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                  {currentUser?.email}
                </div>
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9 relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-9 h-9"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="w-9 h-9"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 border-r border-neutral-border dark:border-neutral-700 bg-white dark:bg-[#1e293b] h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-neutral-text-secondary hover:bg-neutral-bg dark:hover:bg-neutral-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* DSI Quick View */}
            <div className="p-4 mt-6">
              <div className="bg-neutral-bg dark:bg-neutral-800 rounded-lg p-4">
                <div className="text-xs font-medium text-neutral-text-secondary dark:text-neutral-400 mb-2">
                  Document Sufficiency
                </div>
                <div className="text-2xl font-bold text-primary mb-1">
                  {selectedInstitution?.currentDSI.toFixed(1)}%
                </div>
                <Badge
                  variant={
                    (selectedInstitution?.currentDSI || 0) >= 90
                      ? 'success'
                      : (selectedInstitution?.currentDSI || 0) >= 70
                      ? 'warning'
                      : 'destructive'
                  }
                  className="text-xs"
                >
                  {(selectedInstitution?.currentDSI || 0) >= 90
                    ? 'Excellent'
                    : (selectedInstitution?.currentDSI || 0) >= 70
                    ? 'Good'
                    : 'Needs Improvement'}
                </Badge>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
