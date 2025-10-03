import { Outlet, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { GraduationCap, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

export default function PublicLayout() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg dark:bg-[#0f172a]">
      {/* Header */}
      <header className="border-b border-neutral-border dark:border-neutral-700 bg-white dark:bg-[#1e293b] sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-neutral-text-primary dark:text-neutral-100 leading-none">
                  InstitutionHub
                </span>
                <span className="text-xs text-neutral-text-secondary dark:text-neutral-400">
                  Compliance Management
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'text-primary'
                    : 'text-neutral-text-secondary hover:text-primary'
                }`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/about'
                    ? 'text-primary'
                    : 'text-neutral-text-secondary hover:text-primary'
                }`}
              >
                About
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="w-9 h-9"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <Link to="/login">
                <Button>Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-border dark:border-neutral-700 bg-white dark:bg-[#1e293b] mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-neutral-text-primary dark:text-neutral-100 mb-3">
                InstitutionHub
              </h3>
              <p className="text-sm text-neutral-text-secondary dark:text-neutral-400">
                Comprehensive compliance management and performance tracking system for higher education institutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-text-primary dark:text-neutral-100 mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-neutral-text-secondary dark:text-neutral-400 hover:text-primary">
                    About the System
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-neutral-text-secondary dark:text-neutral-400 hover:text-primary">
                    Institution Login
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-sm text-neutral-text-secondary dark:text-neutral-400 hover:text-primary">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-text-primary dark:text-neutral-100 mb-3">
                Support
              </h3>
              <ul className="space-y-2">
                <li className="text-sm text-neutral-text-secondary dark:text-neutral-400">
                  Email: support@institutionhub.gov.in
                </li>
                <li className="text-sm text-neutral-text-secondary dark:text-neutral-400">
                  Helpline: 1800-11-5522
                </li>
                <li className="text-sm text-neutral-text-secondary dark:text-neutral-400">
                  Mon-Fri: 9:00 AM - 6:00 PM IST
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-neutral-border dark:border-neutral-700 text-center">
            <p className="text-sm text-neutral-text-muted dark:text-neutral-500">
              © 2025 InstitutionHub. All rights reserved. | Ministry of Education, Government of India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
