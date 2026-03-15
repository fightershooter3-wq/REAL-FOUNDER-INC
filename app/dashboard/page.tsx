'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Plus, 
  Lightbulb, 
  CheckCircle, 
  BookOpen, 
  TrendingUp,
  ArrowRight,
  Zap,
  Target,
  FileText
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'

/**
 * Dashboard Page
 * Main hub for founders to manage ideas, access tools, and track progress
 * Displays user stats, active ideas, and quick access to key features
 */

interface UserStats {
  totalIdeas: number
  validatedIdeas: number
  activeProjects: number
}

export default function DashboardPage() {
  const { user, loading: authLoading, requireAuth } = useAuth()
  const [stats, setStats] = useState<UserStats>({
    totalIdeas: 0,
    validatedIdeas: 0,
    activeProjects: 0,
  })
  const [ideas, setIdeas] = useState<any[]>([])
  const [loadingIdeas, setLoadingIdeas] = useState(true)

  requireAuth()

  // Fetch user stats and ideas
  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const response = await fetch('/api/ideas')
        if (response.ok) {
          const data = await response.json()
          setIdeas(data)
          setStats({
            totalIdeas: data.length,
            validatedIdeas: data.filter((idea: unknown) => idea.validated).length,
            activeProjects: data.filter((idea: unknown) => idea.status === 'active').length,
          })
        }
      } catch (error) {
        console.error('Error fetching ideas:', error)
      } finally {
        setLoadingIdeas(false)
      }
    }

    fetchData()
  }, [user])

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back, {user.username}!</h1>
              <p className="text-slate-400 text-sm mt-1">Your startup execution dashboard</p>
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
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Total Ideas</p>
                <p className="text-4xl font-bold text-white mt-2">{stats.totalIdeas}</p>
              </div>
              <Lightbulb className="w-12 h-12 text-yellow-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Validated Ideas</p>
                <p className="text-4xl font-bold text-white mt-2">{stats.validatedIdeas}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500 opacity-20" />
            </div>
          </Card>

          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Active Projects</p>
                <p className="text-4xl font-bold text-white mt-2">{stats.activeProjects}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-500 opacity-20" />
            </div>
          </Card>
        </div>

        {/* Quick Access Tools */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Access Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Idea Generator */}
            <Link href="/generator">
              <Card className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500 transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <Zap className="w-8 h-8 text-yellow-500" />
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Idea Generator</h3>
                <p className="text-slate-400 text-sm">Generate startup ideas using AI</p>
              </Card>
            </Link>

            {/* Validator */}
            <Link href="/validator">
              <Card className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500 transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <Target className="w-8 h-8 text-green-500" />
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Idea Validator</h3>
                <p className="text-slate-400 text-sm">Validate your startup concept</p>
              </Card>
            </Link>

            {/* Lean Canvas */}
            <Link href="/lean-canvas">
              <Card className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500 transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <FileText className="w-8 h-8 text-purple-500" />
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Lean Canvas</h3>
                <p className="text-slate-400 text-sm">Build your business model</p>
              </Card>
            </Link>

            {/* Resources */}
            <Link href="/resources">
              <Card className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500 transition-colors cursor-pointer h-full">
                <div className="flex items-start justify-between mb-4">
                  <BookOpen className="w-8 h-8 text-blue-500" />
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Resources</h3>
                <p className="text-slate-400 text-sm">Guides, templates & tools</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Ideas */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Your Ideas</h2>
            <Link href="/ideas">
              <Button variant="outline" className="border-slate-600">
                View All
              </Button>
            </Link>
          </div>

          {loadingIdeas ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-slate-300">Loading your ideas...</p>
            </div>
          ) : ideas.length === 0 ? (
            <Card className="bg-slate-800 border-slate-700 p-12 text-center">
              <Lightbulb className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No ideas yet</h3>
              <p className="text-slate-400 mb-6">Start by creating your first startup idea or generating one with AI</p>
              <div className="flex gap-4 justify-center">
                <Link href="/ideas/new">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Idea
                  </Button>
                </Link>
                <Link href="/generator">
                  <Button variant="outline" className="border-slate-600">
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Ideas
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {ideas.slice(0, 5).map(idea => (
                <Link key={idea.id} href={`/ideas/${idea.id}`}>
                  <Card className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{idea.title}</h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{idea.description}</p>
                        <div className="flex gap-2">
                          {idea.validated && (
                            <span className="inline-block px-2 py-1 bg-green-600/20 text-green-400 text-xs font-semibold rounded">
                              ✓ Validated
                            </span>
                          )}
                          <span className="inline-block px-2 py-1 bg-blue-600/20 text-blue-400 text-xs font-semibold rounded">
                            {idea.status || 'Draft'}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
