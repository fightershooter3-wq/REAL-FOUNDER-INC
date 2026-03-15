'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, TrendingUp, Users, BookOpen, Award, Target, Zap } from 'lucide-react'

interface GrowthMetric {
  id: string
  userId: string
  category: string
  metric: string
  value: number
  unit: string
  date: string
  notes?: string
  createdAt: string
}

interface GrowthCategory {
  name: string
  icon: React.ReactNode
  color: string
  description: string
  metrics: GrowthMetric[]
}

export default function FounderGrowthPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [metrics, setMetrics] = useState<GrowthMetric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Check authentication and fetch metrics
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          router.push('/login')
          return
        }

        const userData = JSON.parse(storedUser)
        setUser(userData)

        // Fetch user's growth metrics
        const response = await fetch(`/api/founder-growth?userId=${userData.id}`)
        if (response.ok) {
          const metricsData = await response.json()
          setMetrics(metricsData)
          if (metricsData.length > 0) {
            setSelectedCategory(metricsData[0].category)
          }
        }
      } catch (err) {
        setError('Failed to load growth metrics')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Group metrics by category
  const groupedMetrics = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = []
    }
    acc[metric.category].push(metric)
    return acc
  }, {} as Record<string, GrowthMetric[]>)

  // Define growth categories
  const growthCategories: Record<string, GrowthCategory> = {
    'Customer Acquisition': {
      name: 'Customer Acquisition',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Track customer growth and acquisition metrics',
      metrics: groupedMetrics['Customer Acquisition'] || [],
    },
    'Product Development': {
      name: 'Product Development',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-purple-500',
      description: 'Monitor product features and development progress',
      metrics: groupedMetrics['Product Development'] || [],
    },
    'Learning & Skills': {
      name: 'Learning & Skills',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Track skills acquired and learning progress',
      metrics: groupedMetrics['Learning & Skills'] || [],
    },
    'Revenue & Metrics': {
      name: 'Revenue & Metrics',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-emerald-500',
      description: 'Monitor revenue, MRR, and key business metrics',
      metrics: groupedMetrics['Revenue & Metrics'] || [],
    },
    'Network & Partnerships': {
      name: 'Network & Partnerships',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-orange-500',
      description: 'Track partnerships, mentors, and network growth',
      metrics: groupedMetrics['Network & Partnerships'] || [],
    },
    'Personal Development': {
      name: 'Personal Development',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-pink-500',
      description: 'Monitor personal growth and founder development',
      metrics: groupedMetrics['Personal Development'] || [],
    },
  }

  // Calculate category stats
  const getCategoryStats = (category: GrowthCategory) => {
    if (category.metrics.length === 0) return null
    
    const values = category.metrics
      .map(m => m.value)
      .filter(v => typeof v === 'number')
    
    if (values.length === 0) return null

    const latest = category.metrics[0]?.value || 0
    const previous = category.metrics[1]?.value || latest
    const change = latest - previous
    const percentChange = previous !== 0 ? ((change / previous) * 100).toFixed(1) : '0'

    return {
      latest,
      change,
      percentChange,
      total: values.reduce((a, b) => a + b, 0),
      average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading growth metrics...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">📈 Founder Growth Tracker</h1>
          <p className="text-slate-400 mt-2">Monitor your progress across key founder metrics</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Growth Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {Object.entries(growthCategories).map(([key, category]) => {
            const stats = getCategoryStats(category)
            const isSelected = selectedCategory === key

            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`text-left transition-all ${
                  isSelected
                    ? 'ring-2 ring-blue-500 scale-105'
                    : 'hover:scale-102'
                }`}
              >
                <Card className={`p-6 border-slate-700 cursor-pointer h-full ${
                  isSelected ? 'bg-slate-700' : 'bg-slate-800 hover:bg-slate-750'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${category.color} p-3 rounded-lg text-white`}>
                      {category.icon}
                    </div>
                    {stats && (
                      <div className={`text-sm font-semibold ${
                        stats.change >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {stats.change >= 0 ? '+' : ''}{stats.percentChange}%
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">
                    {category.description}
                  </p>
                  <div className="text-2xl font-bold text-white">
                    {stats ? stats.latest : '—'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {category.metrics.length} metric{category.metrics.length !== 1 ? 's' : ''}
                  </p>
                </Card>
              </button>
            )
          })}
        </div>

        {/* Selected Category Details */}
        {selectedCategory && growthCategories[selectedCategory] && (
          <Card className="bg-slate-800 border-slate-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`${growthCategories[selectedCategory].color} p-4 rounded-lg text-white`}>
                  {growthCategories[selectedCategory].icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {growthCategories[selectedCategory].name}
                  </h2>
                  <p className="text-slate-400">
                    {growthCategories[selectedCategory].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics List */}
            {growthCategories[selectedCategory].metrics.length > 0 ? (
              <div className="space-y-4">
                {growthCategories[selectedCategory].metrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">
                        {metric.metric}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {new Date(metric.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {metric.notes && (
                        <p className="text-sm text-slate-300 mt-2 italic">
                          "{metric.notes}"
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">
                        {metric.value}
                      </div>
                      <p className="text-sm text-slate-400">
                        {metric.unit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 mb-4">
                  No metrics recorded for this category yet.
                </p>
                <Link href="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Add First Metric
                  </Button>
                </Link>
              </div>
            )}

            {/* Category Stats Summary */}
            {growthCategories[selectedCategory].metrics.length > 0 && getCategoryStats(growthCategories[selectedCategory]) && (
              <div className="mt-8 pt-8 border-t border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Category Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Latest Value</p>
                    <p className="text-2xl font-bold text-white">
                      {getCategoryStats(growthCategories[selectedCategory])?.latest}
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Change</p>
                    <p className={`text-2xl font-bold ${
                      getCategoryStats(growthCategories[selectedCategory])!.change >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {getCategoryStats(growthCategories[selectedCategory])!.change >= 0 ? '+' : ''}
                      {getCategoryStats(growthCategories[selectedCategory])?.change}
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Average</p>
                    <p className="text-2xl font-bold text-white">
                      {getCategoryStats(growthCategories[selectedCategory])?.average}
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-sm text-slate-400 mb-1">Total</p>
                    <p className="text-2xl font-bold text-white">
                      {getCategoryStats(growthCategories[selectedCategory])?.total}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mt-12 flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/weekly-reflection">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              View Weekly Reflections
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
