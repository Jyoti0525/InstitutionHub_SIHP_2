import { useState } from 'react'
import { useStore } from '@/store/useStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ExplainableInsight from '@/components/ai/ExplainableInsight'
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Users,
  BookOpen,
  Building2,
  GraduationCap,
  Sparkles,
  RefreshCw
} from 'lucide-react'

// Mock data for explainable AI insights
const generateExplainableInsights = (institutionId: string) => {
  return [
    {
      title: 'Faculty Quality Enhancement',
      recommendation: 'Increase faculty with PhD qualifications by 15% to match top performers in your sector',
      impact: 'High impact - Could improve DSI score by up to 5.2 points',
      priority: 'high' as const,
      factors: [
        {
          name: 'PhD Faculty Ratio',
          contribution: -35,
          description: 'Currently 58% of faculty have PhD degrees, benchmark is 82%',
          value: '58% (Target: 82%)'
        },
        {
          name: 'Faculty Experience',
          contribution: -25,
          description: 'Average faculty experience is 8.3 years, top performers average 12.5 years',
          value: '8.3 years avg'
        },
        {
          name: 'Student-Faculty Ratio',
          contribution: 15,
          description: 'Your ratio of 18:1 is better than sector average of 22:1',
          value: '18:1 (Good)'
        },
        {
          name: 'Faculty Publications',
          contribution: -20,
          description: 'Average 2.1 publications per faculty vs benchmark of 3.8',
          value: '2.1 per faculty'
        }
      ],
      comparisonData: {
        yourValue: 72,
        benchmark: 85,
        metric: 'Faculty Quality Score'
      }
    },
    {
      title: 'Research Output Improvement',
      recommendation: 'Establish research collaboration with industry partners and allocate dedicated research hours',
      impact: 'Medium-High impact - Potential gain of 4.5 points',
      priority: 'high' as const,
      factors: [
        {
          name: 'Research Publications',
          contribution: -40,
          description: 'Only 45 publications last year vs benchmark of 95',
          value: '45 publications'
        },
        {
          name: 'Research Funding',
          contribution: -30,
          description: 'Research grants totaling ₹2.3Cr vs benchmark ₹5.8Cr',
          value: '₹2.3 Crores'
        },
        {
          name: 'Industry Collaborations',
          contribution: -25,
          description: 'Limited industry partnerships (only 8 active projects)',
          value: '8 projects'
        },
        {
          name: 'Research Infrastructure',
          contribution: 25,
          description: 'Well-equipped labs and research facilities above average',
          value: 'Score: 88/100'
        }
      ],
      comparisonData: {
        yourValue: 65,
        benchmark: 78,
        metric: 'Research Output Score'
      }
    },
    {
      title: 'Student Placement Enhancement',
      recommendation: 'Strengthen industry partnerships and enhance skill development programs in high-demand areas',
      impact: 'High impact - Could improve score by 6.1 points',
      priority: 'high' as const,
      factors: [
        {
          name: 'Placement Rate',
          contribution: -20,
          description: 'Current placement rate 76% vs benchmark 89%',
          value: '76%'
        },
        {
          name: 'Average Package',
          contribution: -15,
          description: 'Average CTC ₹6.2 LPA vs benchmark ₹8.5 LPA',
          value: '₹6.2 LPA'
        },
        {
          name: 'Skill Training Programs',
          contribution: -25,
          description: 'Limited industry-relevant certification programs',
          value: '12 programs'
        },
        {
          name: 'Corporate Tie-ups',
          contribution: 30,
          description: 'Strong relationships with 45+ companies',
          value: '45 partners'
        },
        {
          name: 'Alumni Network',
          contribution: 20,
          description: 'Active alumni mentorship and placement support',
          value: 'Active network'
        }
      ],
      comparisonData: {
        yourValue: 76,
        benchmark: 82,
        metric: 'Student Outcomes Score'
      }
    },
    {
      title: 'Infrastructure Maintenance',
      recommendation: 'Your infrastructure exceeds benchmarks - maintain current standards and focus on digital upgrades',
      impact: 'Low priority - Already performing well',
      priority: 'low' as const,
      factors: [
        {
          name: 'Physical Infrastructure',
          contribution: 40,
          description: 'Modern buildings and facilities above sector standards',
          value: 'Excellent'
        },
        {
          name: 'Library Resources',
          contribution: 35,
          description: 'Well-stocked library with digital access',
          value: '95,000+ books'
        },
        {
          name: 'Lab Equipment',
          contribution: 30,
          description: 'State-of-art laboratories and equipment',
          value: 'Score: 92/100'
        },
        {
          name: 'Digital Infrastructure',
          contribution: -15,
          description: 'Could enhance with cloud labs and VR facilities',
          value: 'Basic setup'
        }
      ],
      comparisonData: {
        yourValue: 88,
        benchmark: 82,
        metric: 'Infrastructure Score'
      }
    }
  ]
}

export default function ExplainableAI() {
  const { selectedInstitution } = useStore()
  const [refreshing, setRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  if (!selectedInstitution) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-neutral-text-secondary">No institution selected</p>
      </div>
    )
  }

  const insights = generateExplainableInsights(selectedInstitution.id)
  const highPriorityCount = insights.filter(i => i.priority === 'high').length

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      setLastRefresh(new Date())
      alert('✅ Analysis refreshed successfully!\n\nInsights have been updated with the latest data.')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100">
              Explainable AI Insights
            </h1>
          </div>
          <p className="text-neutral-text-secondary dark:text-neutral-400 mt-1">
            Transparent AI recommendations with clear explanations of how insights are generated
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
          {refreshing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Refresh Analysis
            </>
          )}
        </Button>
      </div>

      {/* Info Banner */}
      <Card className="border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-neutral-text-primary dark:text-neutral-100 mb-2">
                How Our AI Works
              </h3>
              <p className="text-neutral-text-secondary dark:text-neutral-400 mb-4">
                Our AI analyzes your institution's data using machine learning models trained on historical performance patterns.
                Each recommendation shows the exact factors contributing to it, making the AI's decision-making process transparent and trustworthy.
              </p>
              <div className="flex gap-3">
                <Badge variant="default" className="bg-info/10 text-info border-info/20">
                  <Brain className="w-3 h-3 mr-1" />
                  ML-Powered Analysis
                </Badge>
                <Badge variant="default" className="bg-success/10 text-success border-success/20">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Data-Driven Insights
                </Badge>
                <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                  <Lightbulb className="w-3 h-3 mr-1" />
                  Transparent Reasoning
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-secondary">Total Insights</p>
                <p className="text-3xl font-bold text-neutral-text-primary dark:text-neutral-100 mt-2">
                  {insights.length}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-secondary">High Priority</p>
                <p className="text-3xl font-bold text-error mt-2">
                  {highPriorityCount}
                </p>
              </div>
              <div className="p-3 bg-error/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-error" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-text-secondary">Potential Gain</p>
                <p className="text-3xl font-bold text-success mt-2">
                  +15.8
                </p>
                <p className="text-xs text-neutral-text-muted mt-1">DSI points</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Explainable Insights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-neutral-text-primary dark:text-neutral-100">
            Detailed AI Recommendations
          </h2>
          <p className="text-sm text-neutral-text-muted">
            Click "Why this suggestion?" to see AI reasoning
          </p>
        </div>

        {insights.map((insight, index) => (
          <ExplainableInsight
            key={index}
            title={insight.title}
            recommendation={insight.recommendation}
            impact={insight.impact}
            priority={insight.priority}
            factors={insight.factors}
            comparisonData={insight.comparisonData}
          />
        ))}
      </div>
    </div>
  )
}
