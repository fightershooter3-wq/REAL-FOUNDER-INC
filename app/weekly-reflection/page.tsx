'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Edit2, Save, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react'

interface WeeklyReflection {
  id: string
  userId: string
  weekStartDate: string
  weekEndDate: string
  wins: string
  challenges: string
  learnings: string
  nextWeekGoals: string
  mood: string
  createdAt: string
  updatedAt: string
}

export default function WeeklyReflectionPage() {
  const router = useRouter()
  const [user, setUser] = useState<unknown>(null)
  const [reflections, setReflections] = useState<WeeklyReflection[]>([])
  const [selectedReflection, setSelectedReflection] = useState<WeeklyReflection | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    weekStartDate: '',
    weekEndDate: '',
    wins: '',
    challenges: '',
    learnings: '',
    nextWeekGoals: '',
    mood: 'neutral',
  })

  // Check authentication and fetch reflections
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

        // Fetch user's reflections
        const response = await fetch(`/api/weekly-reflection?userId=${userData.id}`)
        if (response.ok) {
          const reflectionsData = await response.json()
          setReflections(reflectionsData)
          if (reflectionsData.length > 0) {
            setSelectedReflection(reflectionsData[0])
            populateForm(reflectionsData[0])
          }
        }
      } catch (err) {
        setError('Failed to load reflections')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Populate form with selected reflection
  const populateForm = (reflection: WeeklyReflection) => {
    setFormData({
      weekStartDate: reflection.weekStartDate || '',
      weekEndDate: reflection.weekEndDate || '',
      wins: reflection.wins || '',
      challenges: reflection.challenges || '',
      learnings: reflection.learnings || '',
      nextWeekGoals: reflection.nextWeekGoals || '',
      mood: reflection.mood || 'neutral',
    })
  }

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle save
  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError('')

    try {
      const method = selectedReflection ? 'PUT' : 'POST'
      const url = selectedReflection ? `/api/weekly-reflection/${selectedReflection.id}` : '/api/weekly-reflection'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        setError('Failed to save reflection')
        setSaving(false)
        return
      }

      const updatedReflection = await response.json()
      
      if (selectedReflection) {
        // Update existing reflection in list
        setReflections(reflections.map(r => r.id === updatedReflection.id ? updatedReflection : r))
      } else {
        // Add new reflection to list
        setReflections([updatedReflection, ...reflections])
      }
      
      setSelectedReflection(updatedReflection)
      setIsEditing(false)
    } catch (err) {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  // Handle new reflection
  const handleNewReflection = () => {
    setSelectedReflection(null)
    setFormData({
      weekStartDate: new Date().toISOString().split('T')[0],
      weekEndDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      wins: '',
      challenges: '',
      learnings: '',
      nextWeekGoals: '',
      mood: 'neutral',
    })
    setIsEditing(true)
  }

  // Get mood emoji
  const getMoodEmoji = (mood: string) => {
    const moods: Record<string, string> = {
      excited: '🚀',
      happy: '😊',
      neutral: '😐',
      stressed: '😰',
      overwhelmed: '😵',
    }
    return moods[mood] || '😐'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading reflections...</p>
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
          <h1 className="text-3xl font-bold text-white">📝 Weekly Reflection</h1>
          <p className="text-slate-400 mt-2">Track your progress, wins, and learnings each week</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Reflections List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-white mb-4">Reflections ({reflections.length})</h3>
              <Button
                onClick={handleNewReflection}
                className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
              >
                + New Reflection
              </Button>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {reflections.map((reflection) => (
                  <button
                    key={reflection.id}
                    onClick={() => {
                      setSelectedReflection(reflection)
                      populateForm(reflection)
                      setIsEditing(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedReflection?.id === reflection.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {getMoodEmoji(reflection.mood)} {reflection.weekStartDate}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      {reflection.weekStartDate} to {reflection.weekEndDate}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Reflection Editor/Viewer */}
          <div className="lg:col-span-3">
            {isEditing ? (
              // Edit Mode
              <Card className="bg-slate-800 border-slate-700 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  {selectedReflection ? 'Edit Reflection' : 'New Weekly Reflection'}
                </h2>
                <div className="space-y-6">
                  {/* Week Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Week Start Date
                      </label>
                      <input
                        type="date"
                        name="weekStartDate"
                        value={formData.weekStartDate}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Week End Date
                      </label>
                      <input
                        type="date"
                        name="weekEndDate"
                        value={formData.weekEndDate}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    </div>
                  </div>

                  {/* Mood */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      How are you feeling?
                    </label>
                    <select
                      name="mood"
                      value={formData.mood}
                      onChange={handleChange}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={saving}
                    >
                      <option value="excited">🚀 Excited</option>
                      <option value="happy">😊 Happy</option>
                      <option value="neutral">😐 Neutral</option>
                      <option value="stressed">😰 Stressed</option>
                      <option value="overwhelmed">😵 Overwhelmed</option>
                    </select>
                  </div>

                  {/* Wins */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      ✅ Wins & Achievements
                    </label>
                    <textarea
                      name="wins"
                      value={formData.wins}
                      onChange={handleChange}
                      placeholder="What went well this week? What did you accomplish?"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                      disabled={saving}
                    />
                  </div>

                  {/* Challenges */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      ⚠️ Challenges & Obstacles
                    </label>
                    <textarea
                      name="challenges"
                      value={formData.challenges}
                      onChange={handleChange}
                      placeholder="What challenges did you face? What didn't go as planned?"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                      disabled={saving}
                    />
                  </div>

                  {/* Learnings */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      💡 Key Learnings
                    </label>
                    <textarea
                      name="learnings"
                      value={formData.learnings}
                      onChange={handleChange}
                      placeholder="What did you learn this week? What insights did you gain?"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                      disabled={saving}
                    />
                  </div>

                  {/* Next Week Goals */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      🎯 Next Week's Goals
                    </label>
                    <textarea
                      name="nextWeekGoals"
                      value={formData.nextWeekGoals}
                      onChange={handleChange}
                      placeholder="What are your goals for next week? What will you focus on?"
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
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
                      {saving ? 'Saving...' : 'Save Reflection'}
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
            ) : selectedReflection ? (
              // View Mode
              <>
                <Card className="bg-slate-800 border-slate-700 p-8 mb-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {getMoodEmoji(selectedReflection.mood)} Week of {selectedReflection.weekStartDate}
                      </h2>
                      <p className="text-slate-400">
                        {selectedReflection.weekStartDate} to {selectedReflection.weekEndDate}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedReflection.wins && (
                      <div>
                        <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                          <CheckCircle2 className="w-5 h-5 mr-2" />
                          Wins & Achievements
                        </h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {selectedReflection.wins}
                        </p>
                      </div>
                    )}

                    {selectedReflection.challenges && (
                      <div>
                        <h3 className="text-lg font-semibold text-orange-400 mb-3 flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2" />
                          Challenges & Obstacles
                        </h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {selectedReflection.challenges}
                        </p>
                      </div>
                    )}

                    {selectedReflection.learnings && (
                      <div>
                        <h3 className="text-lg font-semibold text-blue-400 mb-3">
                          💡 Key Learnings
                        </h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {selectedReflection.learnings}
                        </p>
                      </div>
                    )}

                    {selectedReflection.nextWeekGoals && (
                      <div>
                        <h3 className="text-lg font-semibold text-purple-400 mb-3">
                          🎯 Next Week's Goals
                        </h3>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {selectedReflection.nextWeekGoals}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Reflection
                  </Button>
                  <Link href="/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              // No reflection selected
              <Card className="bg-slate-800 border-slate-700 p-12 text-center">
                <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No reflections yet. Start your first weekly reflection!</p>
                <Button
                  onClick={handleNewReflection}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create First Reflection
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
