import { Link } from 'react-router-dom'
import { useStore } from '@/store/useStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FileCheck,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Award,
  Building2,
  Clock
} from 'lucide-react'

export default function Landing() {
  const { institutions, getDocumentsByInstitutionId } = useStore()

  // Calculate actual statistics
  const totalInstitutions = institutions.length
  const allDocuments = institutions.flatMap(inst => getDocumentsByInstitutionId(inst.id))
  const totalDocuments = allDocuments.length
  const avgDSI = institutions.length > 0
    ? (institutions.reduce((sum, inst) => sum + inst.currentDSI, 0) / institutions.length).toFixed(1)
    : '0'

  return (
    <div className="min-h-screen bg-neutral-bg dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative bg-primary dark:bg-primary-dark overflow-hidden">
        {/* Subtle Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>

        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              <span className="font-medium text-sm">AI-Powered Institutional Excellence</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Institutional
              <span className="block mt-2">Performance & Compliance</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed max-w-4xl mx-auto">
              Streamline regulatory approval with intelligent automation, real-time analytics,
              and AI-driven insights for institutional excellence
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 flex-wrap mb-12">
              <Link to="/login">
                <Button
                  size="lg"
                  className="text-lg px-10 py-6 bg-white text-primary hover:bg-white/90 shadow-xl group"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-10 py-6 bg-white/5 backdrop-blur text-white border-white/30 hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 text-white/70 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>Secure & Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>AI-Powered Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-20 mb-24 relative z-10">
          {[
            { label: 'Active Institutions', value: totalInstitutions, icon: Building2, color: 'primary' },
            { label: 'Documents Processed', value: totalDocuments.toLocaleString(), icon: FileCheck, color: 'success' },
            { label: 'Average DSI Score', value: avgDSI, icon: Award, color: 'info' },
            { label: 'Time Saved', value: '65%', icon: Clock, color: 'warning' }
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <Card key={i} className="bg-white dark:bg-gray-900 border-0 shadow-2xl hover:shadow-3xl transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`inline-flex p-3 rounded-xl bg-${stat.color}/10 mb-4`}>
                    <Icon className={`w-7 h-7 text-${stat.color}`} />
                  </div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{stat.label}</div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Features Section */}
        <div className="mb-24">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-6">
              POWERFUL FEATURES
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need for Excellence
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Comprehensive tools designed for institutional compliance and performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileCheck,
                title: 'Smart Document Management',
                desc: 'AI-powered verification with real-time sufficiency scoring and automated quality checks',
                color: 'primary'
              },
              {
                icon: Brain,
                title: 'AI-Powered Insights',
                desc: 'Machine learning delivers personalized recommendations for institutional improvement',
                color: 'primary'
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                desc: 'Real-time performance tracking across 11+ KPIs with peer benchmarking',
                color: 'info'
              },
              {
                icon: Target,
                title: 'Performance Benchmarking',
                desc: 'Compare against sector leaders and identify improvement opportunities',
                color: 'success'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                desc: 'Bank-grade encryption with comprehensive audit trails and compliance',
                color: 'error'
              },
              {
                icon: Zap,
                title: 'Workflow Automation',
                desc: 'Reduce manual review cycles from weeks to hours with intelligent automation',
                color: 'warning'
              }
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <Card key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary dark:hover:border-primary transition-all group">
                  <CardHeader className="pb-6">
                    <div className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 text-${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-success/10 text-success rounded-full text-sm font-semibold mb-6">
              SIMPLE PROCESS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Get Started in Four Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Upload Documents', desc: 'Securely upload your institutional documents', icon: FileCheck, color: 'primary' },
              { num: '02', title: 'AI Verification', desc: 'Our AI analyzes and verifies quality', icon: Brain, color: 'info' },
              { num: '03', title: 'Get Insights', desc: 'Receive personalized recommendations', icon: Target, color: 'success' },
              { num: '04', title: 'Track Progress', desc: 'Monitor improvements in real-time', icon: TrendingUp, color: 'warning' }
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <Card key={i} className="bg-white dark:bg-gray-900 border-0 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-${step.color}`}></div>
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex w-12 h-12 rounded-full bg-${step.color} text-white items-center justify-center font-bold text-lg mb-4`}>
                      {step.num}
                    </div>
                    <div className={`inline-flex w-14 h-14 rounded-xl bg-${step.color}/10 items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 text-${step.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {step.desc}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Final CTA */}
        <Card className="bg-primary dark:bg-primary-dark border-0 mb-20">
          <CardContent className="py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Compliance Process?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join hundreds of leading institutions using our platform to achieve excellence
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap mb-12">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="text-lg px-12 py-7 bg-white text-primary hover:bg-white/90 shadow-xl group"
                  >
                    Start Free Trial
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-lg px-12 py-7 bg-white/10 text-white border-white/30 hover:bg-white/20"
                  >
                    Schedule Demo
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-12 text-white/70 flex-wrap">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span>Enterprise-Grade Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>99.9% Uptime Guarantee</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
