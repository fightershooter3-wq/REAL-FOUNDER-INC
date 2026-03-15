'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, ArrowRight, Trash2, Edit2, AlertCircle, Lightbulb } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/**
 * Ideas Management Page
 * Displays all user's startup ideas with filtering, sorting, and management options
 * Allows users to create, edit, delete, and view details of their ideas
 */

interface StartupIdea {
  id: string
  title: string
  description: string
  status: string
  progressPercentage: number
  executionStreak: number
  createdAt: string
}

export default function IdeasPage() {
  const { user, loading: authLoading, requireAuth } = useAuth()
  const [ideas, setIdeas] = useState<StartupIdea[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  /**
   * Load user's ideas from API
   * Fetches all startup ideas for the authenticated user
   */
  useEffect(() => {
    const loadIdeas = async () => {
      requireAuth()

      if (!user) return

      try {
        setLoading(true)
        setError('')

        // Fetch ideas from API
        const response = await fetch(`/api/ideas?userId=${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setIdeas(data)
        } else {
          setError('Failed to load ideas')
        }
      } catch (err) {
        console.error('Error loading ideas:', err)
        setError('An error occurred while loading your ideas')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      loadIdeas()
    }
  }, [user, authLoading, requireAuth])

  /**
   * Delete an idea with confirmation
   * Removes the idea from the database and updates the UI
   * @param ideaId - The ID of the idea to delete
   */
  const handleDeleteIdea = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove idea from local state
        setIdeas(ideas.filter(idea => idea.id !== ideaId))
        setDeleteConfirm(null)
      } else {
        setError('Failed to delete idea')
      }
    } catch (err) {
      console.error('Error deleting idea:', err)
      setError('An error occurred while deleting the idea')
    }
  }

  /**
   * Filter ideas based on selected status
   * Returns filtered array of ideas
   */
  const filteredIdeas = filter === 'all' 
    ? ideas 
    : ideas.filter(idea => idea.status === filter)

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your ideas...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Your Ideas</h1>
              <p className="text-slate-400 text-sm">Manage and track all your startup ideas</p>
            </div>
            <Link href="/ideas/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Idea
              </Button>
            </Link>
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

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'draft', 'validating', 'validated', 'building'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                filter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Ideas Grid or Empty State */}
        {filteredIdeas.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <Lightbulb className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {filter === 'all' ? 'No ideas yet' : `No ${filter} ideas`}
            </h3>
            <p className="text-slate-400 mb-6">
              {filter === 'all'
                ? 'Start your entrepreneurial journey by creating your first startup idea'
                : `You don't have any ideas in the ${filter} status`}
            </p>
            <Link href="/ideas/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Idea
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map(idea => (
              <Card
                key={idea.id}
                className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500 transition-colors flex flex-col"
              >
                {/* Header with Status and Actions */}
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-semibold rounded-full">
                    {idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/ideas/${idea.id}`}>
                      <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4 text-slate-400 hover:text-blue-400" />
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteConfirm(idea.id)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                    </button>
                  </div>
                </div>

                {/* Title and Description */}
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {idea.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3 flex-grow">
                  {idea.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Progress</span>
                    <span className="text-xs font-semibold text-white">
                      {idea.progressPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${idea.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                  <span>Created {new Date(idea.createdAt).toLocaleDateString()}</span>
                  <span>{idea.executionStreak} day streak</span>
                </div>

                {/* View Details Link */}
                <Link href={`/ideas/${idea.id}`}>
                  <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white">
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                {/* Delete Confirmation */}
                {deleteConfirm === idea.id && (
                  <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                    <p className="text-sm text-red-400 mb-3">
                      Are you sure you want to delete this idea? This action cannot be undone.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteIdea(idea.id)}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
