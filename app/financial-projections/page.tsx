'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Edit2, Save, DollarSign, TrendingUp, Calendar } from 'lucide-react'

interface FinancialProjection {
  id: string
  ideaId: string
  expectedUsers: number | null
  pricing: string
  monthlyCosts: string
  revenueProjection: string
  breakEvenEstimate: string
  runwaySimulation: string
  createdAt: string
  updatedAt: string
}

interface Idea {
  id: string
  title: string
}

export default function FinancialProjectionsPage() {
  const router = useRouter()
  const [user, setUser] = useState<unknown>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('')
  const [projection, setProjection] = useState<FinancialProjection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    expectedUsers: '',
    pricing: '',
    monthlyCosts: '',
    revenueProjection: '',
    breakEvenEstimate: '',
    runwaySimulation: '',
  })

  // Check authentication and fetch ideas
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

        // Fetch user's ideas
        const response = await fetch(`/api/ideas?userId=${userData.id}`)
        if (response.ok) {
          const ideasData = await response.json()
          setIdeas(ideasData)
          if (ideasData.length > 0) {
            setSelectedIdeaId(ideasData[0].id)
          }
        }
      } catch (err) {
        setError('Failed to load ideas')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Fetch projection when idea is selected
  useEffect(() => {
    if (!selectedIdeaId) return

    const fetchProjection = async () => {
      try {
        const response = await fetch(`/api/financial-projections/${selectedIdeaId}`)
        if (response.ok) {
          const data = await response.json()
          setProjection(data)
          setFormData({
            expectedUsers: data.expectedUsers?.toString() || '',
            pricing: data.pricing || '',
            monthlyCosts: data.monthlyCosts || '',
            revenueProjection: data.revenueProjection || '',
            breakEvenEstimate: data.breakEvenEstimate || '',
            runwaySimulation: data.runwaySimulation || '',
          })
        } else {
          setProjection(null)
          setFormData({
            expectedUsers: '',
            pricing: '',
            monthlyCosts: '',
            revenueProjection: '',
            breakEvenEstimate: '',
            runwaySimulation: '',
          })
        }
      } catch (err) {
        setError('Failed to load financial projections')
      }
    }

    fetchProjection()
  }, [selectedIdeaId])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle save
  const handleSave = async () => {
    if (!selectedIdeaId) return
    setSaving(true)
    setError('')

    try {
      const method = projection ? 'PUT' : 'POST'
      const url = projection ? `/api/financial-projections/${projection.id}` : '/api/financial-projections'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: selectedIdeaId,
          expectedUsers: formData.expectedUsers ? parseInt(formData.expectedUsers) : null,
          pricing: formData.pricing,
          monthlyCosts: formData.monthlyCosts,
          revenueProjection: formData.revenueProjection,
          breakEvenEstimate: formData.breakEvenEstimate,
          runwaySimulation: formData.runwaySimulation,
        }),
      })

      if (!response.ok) {
        setError('Failed to save financial projections')
        setSaving(false)
        return
      }

      const updatedProjection = await response.json()
      setProjection(updatedProjection)
      setIsEditing(false)
    } catch (err) {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading financial projections...</p>
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">💰 Financial Projections</h1>
          <p className="text-slate-400 mt-2">Model your revenue, costs, and runway</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Idea Selector */}
        {ideas.length > 0 ? (
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select an Idea
            </label>
            <select
              value={selectedIdeaId}
              onChange={(e) => setSelectedIdeaId(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ideas.map(idea => (
                <option key={idea.id} value={idea.id}>
                  {idea.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center mb-8">
            <p className="text-slate-400 mb-4">No ideas found. Create an idea first to build financial projections.</p>
            <Link href="/ideas/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Idea
              </Button>
            </Link>
          </Card>
        )}

        {selectedIdeaId && (
          <>
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <h3 className="text-sm font-medium text-slate-300">Pricing Model</h3>
                </div>
                <p className="text-2xl font-bold text-green-400">
                  {projection?.pricing ? projection.pricing.split('\n')[0] : 'Not set'}
                </p>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-medium text-slate-300">Expected Users</h3>
                </div>
                <p className="text-2xl font-bold text-blue-400">
                  {projection?.expectedUsers ? projection.expectedUsers.toLocaleString() : '0'}
                </p>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-medium text-slate-300">Break-Even</h3>
                </div>
                <p className="text-2xl font-bold text-purple-400">
                  {projection?.breakEvenEstimate ? projection.breakEvenEstimate.split('\n')[0] : 'TBD'}
                </p>
              </Card>
            </div>

            {isEditing ? (
              // Edit Mode
              <Card className="bg-slate-800 border-slate-700 p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Financial Projections</h2>
                <div className="space-y-6">
                  {/* Expected Users */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Expected Users (Year 1)
                    </label>
                    <input
                      type="number"
                      name="expectedUsers"
                      value={formData.expectedUsers}
                      onChange={handleChange}
                      placeholder="e.g., 1000"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={saving}
                    />
                  </div>

                  {/* Pricing */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Pricing Model
                    </label>
                    <textarea
                      name="pricing"
                      value={formData.pricing}
                      onChange={handleChange}
                      placeholder="e.g., $9.99/month subscription, freemium with premium tier at $29.99/month"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* Monthly Costs */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Monthly Operating Costs
                    </label>
                    <textarea
                      name="monthlyCosts"
                      value={formData.monthlyCosts}
                      onChange={handleChange}
                      placeholder="e.g., Server costs: $500, Team salaries: $5000, Marketing: $1000, Total: $6500"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* Revenue Projection */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Revenue Projection (12 months)
                    </label>
                    <textarea
                      name="revenueProjection"
                      value={formData.revenueProjection}
                      onChange={handleChange}
                      placeholder="Month 1: $1000, Month 3: $5000, Month 6: $15000, Month 12: $50000"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* Break-Even Estimate */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Break-Even Estimate
                    </label>
                    <textarea
                      name="breakEvenEstimate"
                      value={formData.breakEvenEstimate}
                      onChange={handleChange}
                      placeholder="e.g., Month 8 - assuming 500 paying users at $29.99/month"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* Runway Simulation */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Runway Simulation
                    </label>
                    <textarea
                      name="runwaySimulation"
                      value={formData.runwaySimulation}
                      onChange={handleChange}
                      placeholder="With $50k funding: 7.7 months runway. With $100k: 15.4 months. Breakeven at month 8."
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      onClick={handleSave}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={saving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Projections'}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              // View Mode
              <>
                {projection ? (
                  <div className="space-y-6 mb-8">
                    {projection.pricing && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">💳 Pricing Model</h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{projection.pricing}</p>
                      </Card>
                    )}

                    {projection.monthlyCosts && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">📊 Monthly Operating Costs</h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{projection.monthlyCosts}</p>
                      </Card>
                    )}

                    {projection.revenueProjection && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">📈 Revenue Projection</h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{projection.revenueProjection}</p>
                      </Card>
                    )}

                    {projection.breakEvenEstimate && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">🎯 Break-Even Estimate</h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{projection.breakEvenEstimate}</p>
                      </Card>
                    )}

                    {projection.runwaySimulation && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">⏱️ Runway Simulation</h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{projection.runwaySimulation}</p>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card className="bg-slate-800 border-slate-700 p-12 text-center mb-8">
                    <DollarSign className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No financial projections yet. Start by modeling your business!</p>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {projection ? 'Edit Projections' : 'Create Projections'}
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
