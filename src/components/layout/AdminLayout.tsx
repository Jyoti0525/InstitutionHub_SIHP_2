import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import {
  ShieldCheck,
  Building2,
  ClipboardList,
  FileCheck,
  BarChart3,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  FileText
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { useStore } from '@/store/useStore'
import { useState } from 'react'

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { currentUser, setCurrentUser } = useStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const handleLogout = () => {
    setCurrentUser(null)
    navigate('/login')
  }

  const navigation = [
    { name: 'Review Queue', href: '/admin/review-queue', icon: ClipboardList },
    { name: 'Institutions', href: '/admin/institutions', icon: Building2 },
    { name: 'All Documents', href: '/admin/documents', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
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
              <Link to="/admin/review-queue" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:flex flex-col">
                  <span className="font-bold text-sm text-neutral-text-primary dark:text-neutral-100 leading-none">
                    InstitutionHub
                  </span>
                  <span className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                    Admin Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Admin Info & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-neutral-text-primary dark:text-neutral-100">
                  {currentUser?.name}
                </div>
                <div className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                  {currentUser?.email}
                </div>
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
