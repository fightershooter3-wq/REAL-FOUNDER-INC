'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, BookOpen, Video, FileText, Users, Zap, Target } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/**
 * Resources Page
 * Curated learning materials and tools for startup founders
 * Includes guides, templates, and best practices
 */

interface Resource {
  id: string
  title: string
  description: string
  category: string
  icon: React.ReactNode
  link?: string
  type: 'guide' | 'template' | 'tool' | 'article'
}

const RESOURCES: Resource[] = [
  {
    id: '1',
    title: 'Startup Idea Validation Checklist',
    description: 'Step-by-step guide to validate your startup idea before building',
    category: 'Validation',
    icon: <Target className="w-6 h-6" />,
    type: 'guide',
  },
  {
    id: '2',
    title: 'Lean Canvas Template',
    description: 'One-page business model template for rapid iteration',
    category: 'Planning',
    icon: <FileText className="w-6 h-6" />,
    type: 'template',
  },
  {
    id: '3',
    title: 'Customer Interview Guide',
    description: 'How to conduct effective customer interviews to validate assumptions',
    category: 'Research',
    icon: <Users className="w-6 h-6" />,
    type: 'guide',
  },
  {
    id: '4',
    title: 'MVP Development Roadmap',
    description: 'Build your minimum viable product in 4 weeks',
    category: 'Development',
    icon: <Zap className="w-6 h-6" />,
    type: 'guide',
  },
  {
    id: '5',
    title: 'Pitch Deck Template',
    description: 'Professional pitch deck template for investors',
    category: 'Fundraising',
    icon: <FileText className="w-6 h-6" />,
    type: 'template',
  },
  {
    id: '6',
    title: 'Founder Resources Library',
    description: 'Curated collection of tools, articles, and communities for founders',
    category: 'Learning',
    icon: <BookOpen className="w-6 h-6" />,
    type: 'article',
  },
  {
    id: '7',
    title: 'Growth Hacking Strategies',
    description: 'Proven tactics to acquire your first 100 customers',
    category: 'Growth',
    icon: <Zap className="w-6 h-6" />,
    type: 'guide',
  },
  {
    id: '8',
    title: 'Financial Projections Template',
    description: 'Create realistic financial forecasts for your startup',
    category: 'Finance',
    icon: <FileText className="w-6 h-6" />,
    type: 'template',
  },
]

export default function ResourcesPage() {
  const { user, loading: authLoading, requireAuth } = useAuth()

  requireAuth()

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading resources...</p>
        </div>
      </div>
    )
  }

  const categories = ['Validation', 'Planning', 'Research', 'Development', 'Fundraising', 'Learning', 'Growth', 'Finance']
  const resourcesByCategory = categories.reduce((acc, cat) => {
    acc[cat] = RESOURCES.filter(r => r.category === cat)
    return acc
  }, {} as Record<string, Resource[]>)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">Founder Resources</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Curated guides, templates, and tools to help you build your startup
          </p>
        </div>

        {/* Resources by Category */}
        <div className="space-y-12">
          {categories.map(category => {
            const categoryResources = resourcesByCategory[category]
            if (categoryResources.length === 0) return null

            return (
              <div key={category}>
                <h2 className="text-2xl font-bold text-white mb-6">{category}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {categoryResources.map(resource => (
                    <Card key={resource.id} className="bg-slate-800 border-slate-700 p-6 hover:border-blue-500 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="text-blue-500 flex-shrink-0">
                          {resource.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {resource.title}
                          </h3>
                          <p className="text-slate-400 text-sm mb-4">
                            {resource.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="inline-block px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-semibold rounded-full">
                              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                            </span>
                            <Button size="sm" variant="outline" className="border-slate-600">
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50 p-8 mt-12">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to start building?</h3>
          <p className="text-slate-300 mb-6">
            Use our AI-powered tools to generate ideas, validate your concept, and create a business plan.
          </p>
          <div className="flex gap-4">
            <Link href="/ideas/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create New Idea
              </Button>
            </Link>
            <Link href="/validator">
              <Button variant="outline" className="border-blue-500 text-blue-400">
                Validate Your Idea
              </Button>
            </Link>
          </div>
        </Card>
      </main>
    </div>
  )
}
