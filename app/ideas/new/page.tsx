'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, Lightbulb, AlertCircle, Loader } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/**
 * New Idea Creation Page
 * Allows users to create a new startup idea
 * Collects basic information: title and description
 * Saves to database and redirects to idea detail page
 */

export default function NewIdeaPage() {
  const router = useRouter()
  const { user, loading: authLoading, requireAuth } = useAuth()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  /**
   * Handle form submission
   * Creates a new idea in the database
   * Redirects to the new idea's detail page on success
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields')
      return
    }

    if (title.length < 3) {
      setError('Title must be at least 3 characters')
      return
    }

    if (description.length < 10) {
      setError('Description must be at least 10 characters')
      return
    }

    try {
      setLoading(true)
      setError('')

      // Create new idea via API
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          title: title.trim(),
          description: description.trim(),
          status: 'draft',
        }),
      })

      if (response.ok) {
        const newIdea = await response.json()
        // Redirect to the new idea's detail page
        router.push(`/ideas/${newIdea.id}`)
      } else {
        setError('Failed to create idea. Please try again.')
      }
    } catch (err) {
      console.error('Error creating idea:', err)
      setError('An error occurred while creating your idea')
    } finally {
      setLoading(false)
    }
  }

  // Check authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Require authentication
  requireAuth()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/ideas">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Ideas
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">Create a New Idea</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Start your entrepreneurial journey by describing your startup idea
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Form Card */}
        <Card className="bg-slate-800 border-slate-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-white mb-2">
                Idea Title *
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AI-powered fitness coach"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
              <p className="text-xs text-slate-400 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            {/* Description Field */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-white mb-2">
                Idea Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your startup idea in detail. What problem does it solve? Who is your target audience? What makes it unique?"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors min-h-40"
                disabled={loading}
              />
              <p className="text-xs text-slate-400 mt-1">
                {description.length}/2000 characters
              </p>
            </div>

            {/* Tips Section */}
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-400 mb-2">💡 Tips for a great idea description:</h3>
              <ul className="text-sm text-blue-300 space-y-1">
                <li>• Clearly state the problem you're solving</li>
                <li>• Describe your target audience</li>
                <li>• Explain your unique value proposition</li>
                <li>• Mention any initial market research or validation</li>
              </ul>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 font-semibold"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Create Idea
                  </>
                )}
              </Button>
              <Link href="/ideas" className="flex-1">
                <Button
                  type="button"
                  disabled={loading}
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-slate-800/50 border border-slate-700 rounded-lg">
          <h3 className="text-sm font-semibold text-white mb-3">What happens next?</h3>
          <ol className="text-sm text-slate-300 space-y-2">
            <li><strong>1. Create:</strong> Your idea will be saved as a draft</li>
            <li><strong>2. Validate:</strong> Use our validation tools to test your assumptions</li>
            <li><strong>3. Build:</strong> Create execution sprints and track your progress</li>
            <li><strong>4. Execute:</strong> Follow your lean canvas and daily tasks</li>
          </ol>
        </div>
      </main>
    </div>
  )
}
