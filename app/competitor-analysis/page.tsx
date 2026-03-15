'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Plus, Trash2, Edit2, TrendingUp } from 'lucide-react'

interface Competitor {
  id: string
  competitorName: string
  strengths: string
  weaknesses: string
  differentiationMap: string
  createdAt: string
  updatedAt: string
}

interface Idea {
  id: string
  title: string
}

export default function CompetitorAnalysisPage() {
  const router = useRouter()
  const [user, setUser] = useState<unknown>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('')
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    competitorName: '',
    strengths: '',
    weaknesses: '',
    differentiationMap: '',
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

  // Fetch competitors when idea is selected
  useEffect(() => {
    if (!selectedIdeaId) return

    const fetchCompetitors = async () => {
      try {
        const response = await fetch(`/api/competitors?ideaId=${selectedIdeaId}`)
        if (response.ok) {
          const data = await response.json()
          setCompetitors(data)
        } else {
          setCompetitors([])
        }
      } catch (err) {
        setError('Failed to load competitors')
      }
    }

    fetchCompetitors()
  }, [selectedIdeaId])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle add/edit
  const handleSave = async () => {
    if (!selectedIdeaId || !formData.competitorName.trim()) {
      setError('Competitor name is required')
      return
    }

    setSaving(true)
    setError('')

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/competitors/${editingId}` : '/api/competitors'

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
        setError('Failed to save competitor')
        setSaving(false)
        return
      }

      const savedCompetitor = await response.json()

      if (editingId) {
        setCompetitors(competitors.map(c => c.id === editingId ? savedCompetitor : c))
      } else {
        setCompetitors([...competitors, savedCompetitor])
      }

      // Reset form
      setFormData({
        competitorName: '',
        strengths: '',
        weaknesses: '',
        differentiationMap: '',
      })
      setEditingId(null)
    } catch (err) {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  // Handle edit
  const handleEdit = (competitor: Competitor) => {
    setFormData({
      competitorName: competitor.competitorName,
      strengths: competitor.strengths || '',
      weaknesses: competitor.weaknesses || '',
      differentiationMap: competitor.differentiationMap || '',
    })
    setEditingId(competitor.id)
  }

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this competitor?')) return

    try {
      const response = await fetch(`/api/competitors/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCompetitors(competitors.filter(c => c.id !== id))
      } else {
        setError('Failed to delete competitor')
      }
    } catch (err) {
      setError('An error occurred while deleting')
    }
  }

  // Handle cancel
  const handleCancel = () => {
    setEditingId(null)
    setFormData({
      competitorName: '',
      strengths: '',
      weaknesses: '',
      differentiationMap: '',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading competitor analysis...</p>
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
          <h1 className="text-3xl font-bold text-white">🏆 Competitor Analysis</h1>
          <p className="text-slate-400 mt-2">Analyze your competitors and find your competitive advantage</p>
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
            <p className="text-slate-400 mb-4">No ideas found. Create an idea first to analyze competitors.</p>
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
            {/* Add/Edit Form */}
            <Card className="bg-slate-800 border-slate-700 p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                {editingId ? 'Edit Competitor' : 'Add Competitor'}
              </h2>
              <div className="space-y-6">
                {/* Competitor Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Competitor Name *
                  </label>
                  <input
                    type="text"
                    name="competitorName"
                    value={formData.competitorName}
                    onChange={handleChange}
                    placeholder="e.g., Notion, Asana, Monday.com"
                    className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={saving}
                  />
                </div>

                {/* Strengths */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Strengths
                  </label>
                  <textarea
                    name="strengths"
                    value={formData.strengths}
                    onChange={handleChange}
                    placeholder="What are their key strengths? (e.g., large user base, strong brand, advanced features)"
                    className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                    disabled={saving}
                  />
                </div>

                {/* Weaknesses */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Weaknesses
                  </label>
                  <textarea
                    name="weaknesses"
                    value={formData.weaknesses}
                    onChange={handleChange}
                    placeholder="What are their weaknesses? (e.g., high pricing, poor UX, limited integrations)"
                    className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                    disabled={saving}
                  />
                </div>

                {/* Differentiation Map */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    How You'll Differentiate
                  </label>
                  <textarea
                    name="differentiationMap"
                    value={formData.differentiationMap}
                    onChange={handleChange}
                    placeholder="How will you compete against them? (e.g., better pricing, simpler UX, niche focus)"
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
                    {saving ? 'Saving...' : editingId ? 'Update Competitor' : 'Add Competitor'}
                  </Button>
                  {editingId && (
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>

            {/* Competitors List */}
            {competitors.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Competitors ({competitors.length})</h2>
                {competitors.map(competitor => (
                  <Card key={competitor.id} className="bg-slate-800 border-slate-700 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">{competitor.competitorName}</h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(competitor)}
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(competitor.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {competitor.strengths && (
                        <div>
                          <h4 className="text-sm font-medium text-green-400 mb-2">💪 Strengths</h4>
                          <p className="text-slate-300">{competitor.strengths}</p>
                        </div>
                      )}

                      {competitor.weaknesses && (
                        <div>
                          <h4 className="text-sm font-medium text-red-400 mb-2">⚠️ Weaknesses</h4>
                          <p className="text-slate-300">{competitor.weaknesses}</p>
                        </div>
                      )}

                      {competitor.differentiationMap && (
                        <div>
                          <h4 className="text-sm font-medium text-blue-400 mb-2">🎯 Your Differentiation</h4>
                          <p className="text-slate-300">{competitor.differentiationMap}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800 border-slate-700 p-12 text-center">
                <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No competitors added yet. Start by analyzing your main competitors!</p>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex gap-4 mt-8">
              <Link href="/market-research" className="flex-1">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  ← Back to Market Research
                </Button>
              </Link>
              <Link href="/financial-projections" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Financial Projections →
                </Button>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
