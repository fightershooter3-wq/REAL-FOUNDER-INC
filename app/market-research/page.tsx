'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Plus, Trash2, Edit2, TrendingUp, Users, Target, DollarSign } from 'lucide-react'

interface MarketResearch {
  id: string
  ideaId: string
  tam: string
  sam: string
  som: string
  demandIndicators: string
  marketTrends: string
  entryStrategies: string
  createdAt: string
  updatedAt: string
}

interface Idea {
  id: string
  title: string
}

export default function MarketResearchPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('')
  const [research, setResearch] = useState<MarketResearch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    tam: '',
    sam: '',
    som: '',
    demandIndicators: '',
    marketTrends: '',
    entryStrategies: '',
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

  // Fetch market research when idea is selected
  useEffect(() => {
    if (!selectedIdeaId) return

    const fetchResearch = async () => {
      try {
        const response = await fetch(`/api/market-research/${selectedIdeaId}`)
        if (response.ok) {
          const data = await response.json()
          setResearch(data)
          setFormData({
            tam: data.tam || '',
            sam: data.sam || '',
            som: data.som || '',
            demandIndicators: data.demandIndicators || '',
            marketTrends: data.marketTrends || '',
            entryStrategies: data.entryStrategies || '',
          })
        } else {
          setResearch(null)
          setFormData({
            tam: '',
            sam: '',
            som: '',
            demandIndicators: '',
            marketTrends: '',
            entryStrategies: '',
          })
        }
      } catch (err) {
        setError('Failed to load market research')
      }
    }

    fetchResearch()
  }, [selectedIdeaId])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      const method = research ? 'PUT' : 'POST'
      const url = research ? `/api/market-research/${research.id}` : '/api/market-research'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: selectedIdeaId,
          ...formData,
        }),
      })

      if (!response.ok) {
        setError('Failed to save market research')
        setSaving(false)
        return
      }

      const updatedResearch = await response.json()
      setResearch(updatedResearch)
      setIsEditing(false)
    } catch (err) {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  // Handle delete
  const handleDelete = async () => {
    if (!research || !confirm('Are you sure you want to delete this market research?')) return

    try {
      const response = await fetch(`/api/market-research/${research.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setResearch(null)
        setFormData({
          tam: '',
          sam: '',
          som: '',
          demandIndicators: '',
          marketTrends: '',
          entryStrategies: '',
        })
        setIsEditing(false)
      } else {
        setError('Failed to delete market research')
      }
    } catch (err) {
      setError('An error occurred while deleting')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading market research...</p>
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
          <h1 className="text-3xl font-bold text-white">📊 Market Research</h1>
          <p className="text-slate-400 mt-2">Analyze TAM, SAM, SOM and market trends for your ideas</p>
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
            <p className="text-slate-400 mb-4">No ideas found. Create an idea first to conduct market research.</p>
            <Link href="/ideas/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Idea
              </Button>
            </Link>
          </Card>
        )}

        {selectedIdeaId && (
          <>
            {/* Market Size Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-medium text-slate-300">TAM</h3>
                </div>
                <p className="text-2xl font-bold text-blue-400">Total Addressable Market</p>
                <p className="text-xs text-slate-500 mt-2">Total market size if you captured 100%</p>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-green-400" />
                  <h3 className="text-sm font-medium text-slate-300">SAM</h3>
                </div>
                <p className="text-2xl font-bold text-green-400">Serviceable Market</p>
                <p className="text-xs text-slate-500 mt-2">Market you can realistically reach</p>
              </Card>

              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <DollarSign className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-medium text-slate-300">SOM</h3>
                </div>
                <p className="text-2xl font-bold text-purple-400">Serviceable Obtainable</p>
                <p className="text-xs text-slate-500 mt-2">Market you can capture in 3-5 years</p>
              </Card>
            </div>

            {isEditing ? (
              // Edit Mode
              <Card className="bg-slate-800 border-slate-700 p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">Edit Market Research</h2>
                <div className="space-y-6">
                  {/* TAM */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      TAM (Total Addressable Market)
                    </label>
                    <textarea
                      name="tam"
                      value={formData.tam}
                      onChange={handleChange}
                      placeholder="What is the total market size if you captured 100%? Include numbers and sources."
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* SAM */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      SAM (Serviceable Addressable Market)
                    </label>
                    <textarea
                      name="sam"
                      value={formData.sam}
                      onChange={handleChange}
                      placeholder="What market can you realistically reach with your resources and strategy?"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* SOM */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      SOM (Serviceable Obtainable Market)
                    </label>
                    <textarea
                      name="som"
                      value={formData.som}
                      onChange={handleChange}
                      placeholder="What market can you realistically capture in 3-5 years?"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* Demand Indicators */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Demand Indicators
                    </label>
                    <textarea
                      name="demandIndicators"
                      value={formData.demandIndicators}
                      onChange={handleChange}
                      placeholder="What signals indicate strong demand? (e.g., search volume, social media mentions, competitor funding)"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* Market Trends */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Market Trends
                    </label>
                    <textarea
                      name="marketTrends"
                      value={formData.marketTrends}
                      onChange={handleChange}
                      placeholder="What are the current and emerging trends in your market? (e.g., AI adoption, remote work, sustainability)"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                      disabled={saving}
                    />
                  </div>

                  {/* Entry Strategies */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Entry Strategies
                    </label>
                    <textarea
                      name="entryStrategies"
                      value={formData.entryStrategies}
                      onChange={handleChange}
                      placeholder="How will you enter the market? (e.g., niche targeting, partnerships, freemium model)"
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
                      {saving ? 'Saving...' : 'Save Research'}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    {research && (
                      <Button
                        onClick={handleDelete}
                        variant="destructive"
                        className="flex-1"
                        disabled={saving}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              // View Mode
              <>
                {research ? (
                  <div className="space-y-6 mb-8">
                    {research.tam && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">📈 TAM (Total Addressable Market)</h3>
                        <p className="text-slate-300 leading-relaxed">{research.tam}</p>
                      </Card>
                    )}

                    {research.sam && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">👥 SAM (Serviceable Addressable Market)</h3>
                        <p className="text-slate-300 leading-relaxed">{research.sam}</p>
                      </Card>
                    )}

                    {research.som && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">💰 SOM (Serviceable Obtainable Market)</h3>
                        <p className="text-slate-300 leading-relaxed">{research.som}</p>
                      </Card>
                    )}

                    {research.demandIndicators && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">📊 Demand Indicators</h3>
                        <p className="text-slate-300 leading-relaxed">{research.demandIndicators}</p>
                      </Card>
                    )}

                    {research.marketTrends && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">🔮 Market Trends</h3>
                        <p className="text-slate-300 leading-relaxed">{research.marketTrends}</p>
                      </Card>
                    )}

                    {research.entryStrategies && (
                      <Card className="bg-slate-800 border-slate-700 p-6">
                        <h3 className="text-xl font-semibold text-white mb-3">🚀 Entry Strategies</h3>
                        <p className="text-slate-300 leading-relaxed">{research.entryStrategies}</p>
                      </Card>
                    )}
                  </div>
                ) : (
                  <Card className="bg-slate-800 border-slate-700 p-12 text-center mb-8">
                    <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-slate-400 mb-4">No market research yet. Start by analyzing your market!</p>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {research ? 'Edit Research' : 'Start Research'}
                  </Button>
                  <Link href="/competitor-analysis" className="flex-1">
                    <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                      🏆 Competitor Analysis
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
