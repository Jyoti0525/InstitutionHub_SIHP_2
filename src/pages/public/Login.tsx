import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, ShieldCheck } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { validateInstitutionLogin, validateAdminLogin } from '@/services/authService'

export default function Login() {
  const navigate = useNavigate()
  const { setCurrentUser, setSelectedInstitution, getInstitutionById } = useStore()
  const [loginType, setLoginType] = useState<'institution' | 'admin'>('institution')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validate credentials using authService
    if (loginType === 'institution') {
      const result = validateInstitutionLogin(email, password)

      if (!result.success) {
        setError(result.error || 'Invalid email or password. Please check your credentials.')
        return
      }

      // Login successful - set institution user and selected institution
      const institution = getInstitutionById(result.institution!.id)

      setCurrentUser({
        id: result.institution!.id,
        email: result.institution!.email,
        role: 'institution',
        institutionId: result.institution!.id,
        name: `${result.institution!.name} Admin`,
        lastLogin: new Date().toISOString(),
      })

      if (institution) {
        setSelectedInstitution(institution)
      }

      navigate('/institution/dashboard')
    } else {
      const result = validateAdminLogin(email, password)

      if (!result.success) {
        setError(result.error || 'Invalid admin credentials. Please check your credentials.')
        return
      }

      // Login successful - set admin user
      setCurrentUser({
        id: 'ADMIN001',
        email: result.admin!.email,
        role: 'admin',
        name: result.admin!.name,
        lastLogin: new Date().toISOString(),
      })
      navigate('/admin/review-queue')
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login to Portal</CardTitle>
          <CardDescription>
            Select your login type and enter credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Login Type Selector */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button
              type="button"
              variant={loginType === 'institution' ? 'default' : 'outline'}
              className="w-full"
              onClick={() => {
                setLoginType('institution')
                setEmail('')
                setPassword('')
                setError('')
              }}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Institution
            </Button>
            <Button
              type="button"
              variant={loginType === 'admin' ? 'default' : 'outline'}
              className="w-full"
              onClick={() => {
                setLoginType('admin')
                setEmail('')
                setPassword('')
                setError('')
              }}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              Admin
            </Button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded-md">
                <p className="text-sm text-error">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={
                  loginType === 'institution'
                    ? 'e.g., iitm@iitm.ac.in'
                    : 'admin@ugc.gov.in'
                }
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-info/10 rounded-lg">
            <p className="text-sm text-info-dark dark:text-info-light font-medium mb-2">
              Example Credentials:
            </p>
            <p className="text-xs text-neutral-text-secondary dark:text-neutral-400">
              <strong>Institution:</strong> iitm@iitm.ac.in / iitm123<br />
              <strong>Institution:</strong> iitk@iitk.ac.in / iitk123<br />
              <strong>Admin:</strong> admin@ugc.gov.in / admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
