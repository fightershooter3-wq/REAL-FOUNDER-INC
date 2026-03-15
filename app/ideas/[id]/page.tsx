'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Edit2, Trash2, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/**
 * Idea Detail Page
 * Displays comprehensive information about a specific startup idea
 * Allows users to view, edit, and manage their idea
 * Shows lean canvas, execution sprints, and progress tracking
 */

interface StartupIdea {
  id: string
  title: string
  description: string
  status: string
  progressPercentage: number
  executionStreak: number
  createdAt: string
  updatedAt: string
}

export default function IdeaDetailPage() {
  const router = useRouter()
  const params = useParams()
  const ideaId = params.id as string
  const { user, loading: authLoading, requireAuth } = useAuth()
  
  const [idea, setIdea] = useState<StartupIdea | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<StartupIdea>>({})
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  /**
   * Load idea details from API
   * Fetches the specific idea with all related data
   */
  useEffect(() => {
    const loadIdea = async () => {
      requireAuth()

      if (!user || !ideaId) return

      try {
        setLoading(true)
        setError('')

        // Fetch idea from API
        const response = await fetch(`/api/ideas/${ideaId}`)
        if (response.ok) {
          const data = await response.json()
          setIdea(data)
          setEditData(data)
        } else if (response.status === 404) {
          setError('Idea not found')
        } else {
          setError('Failed to load idea')
        }
      } catch (err) {
        console.error('Error loading idea:', err)
        setError('An error occurred while loading the idea')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadIdea()
    }
  }, [user, authLoading, ideaId, requireAuth])

  /**
   * Save changes to the idea
   * Updates the idea in the database with edited fields
   */
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      if (response.ok) {
        const updatedIdea = await response.json()
        setIdea(updatedIdea)
        setIsEditing(false)
      } else {
        setError('Failed to save changes')
      }
    } catch (err) {
      console.error('Error saving changes:', err)
      setError('An error occurred while saving changes')
    }
  }

  /**
   * Delete the idea
   * Removes the idea from the database and redirects to ideas list
   */
  const handleDeleteIdea = async () => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Redirect to ideas list after deletion
        router.push('/ideas')
      } else {
        setError('Failed to delete idea')
      }
    } catch (err) {
      console.error('Error deleting idea:', err)
      setError('An error occurred while deleting the idea')
    }
  }

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading idea details...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  // Show error if idea not found
  if (!idea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <header className="bg-slate-800/50 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/ideas">
              <Button variant="outline" className="border-slate-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Ideas
              </Button>
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert className="bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error || 'Idea not found'}
            </AlertDescription>
          </Alert>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/ideas">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Ideas
              </Button>
            </Link>
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirm(true)}
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
              {isEditing && (
                <>
                  <Button
                    onClick={handleSaveChanges}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false)
                      setEditData(idea)
                    }}
                    variant="outline"
                    className="border-slate-600"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Delete Confirmation */}
        {deleteConfirm && (
          <Alert className="mb-6 bg-red-900/20 border-red-700 p-6">
            <AlertCircle className="h-4 w-4 text-red-400 inline mr-2" />
            <AlertDescription className="text-red-400 inline">
              Are you sure you want to delete this idea? This action cannot be undone.
            </AlertDescription>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleDeleteIdea}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Permanently
              </Button>
              <Button
                onClick={() => setDeleteConfirm(false)}
                variant="outline"
                className="border-slate-600"
              >
                Cancel
              </Button>
            </div>
          </Alert>
        )}

        {/* Idea Details Card */}
        <Card className="bg-slate-800 border-slate-700 p-8 mb-8">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-400 text-sm font-semibold rounded-lg">
              {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
            </span>
            <span className="text-sm text-slate-400">
              Created {new Date(idea.createdAt).toLocaleDateString()}
            </span>
          </div>

          {/* Title */}
          {isEditing ? (
            <input
              type="text"
              value={editData.title || ''}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="w-full text-3xl font-bold text-white bg-slate-700 border border-slate-600 rounded-lg p-3 mb-4"
            />
          ) : (
            <h1 className="text-3xl font-bold text-white mb-4">{idea.title}</h1>
          )}

          {/* Description */}
          {isEditing ? (
            <textarea
              value={editData.description || ''}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              className="w-full text-slate-300 bg-slate-700 border border-slate-600 rounded-lg p-3 mb-6 min-h-32"
            />
          ) : (
            <p className="text-slate-300 text-lg mb-6">{idea.description}</p>
          )}

          {/* Progress Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-400 font-semibold">Overall Progress</label>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editData.progressPercentage || 0}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        progressPercentage: parseInt(e.target.value),
                      })
                    }
                    className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-right"
                  />
                ) : (
                  <span className="text-white font-bold">{idea.progressPercentage}%</span>
                )}
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all"
                  style={{ width: `${idea.progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Execution Streak */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-400 font-semibold">Execution Streak</label>
                <span className="text-white font-bold">{idea.executionStreak} days</span>
              </div>
              <div className="bg-slate-700 rounded-lg p-4 text-center">
                <p className="text-slate-300">Keep building consistently!</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href={`/ideas/${ideaId}/lean-canvas`}>
            <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-6">
              View Lean Canvas
            </Button>
          </Link>
          <Link href={`/ideas/${ideaId}/execution`}>
            <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-6">
              Execution Sprints
            </Button>
          </Link>
          <Link href={`/ideas/${ideaId}/validator`}>
            <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-6">
              Validate Idea
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
