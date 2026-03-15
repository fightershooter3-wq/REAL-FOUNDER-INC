'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Zap, Copy, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/**
 * Idea Generator Page
 * AI-powered startup idea generation tool
 * Helps founders brainstorm and discover new business opportunities
 */

interface GeneratedIdea {
  id: string
  title: string
  description: string
  problem: string
  targetMarket: string
  potentialRevenue: string
}

const SAMPLE_IDEAS: GeneratedIdea[] = [
  {
    id: '1',
    title: 'AI-Powered Resume Optimizer',
    description: 'An AI tool that analyzes resumes and optimizes them for ATS systems and recruiter preferences',
    problem: 'Job seekers struggle to get past ATS systems and their resumes often get rejected before human review',
    targetMarket: 'Job seekers aged 22-45, especially in tech and professional services',
    potentialRevenue: '$5-10M ARR (freemium model with premium features)',
  },
  {
    id: '2',
    title: 'Micro-Learning Platform for Developers',
    description: 'Short, bite-sized coding tutorials (5-10 minutes) focused on specific problems developers face daily',
    problem: 'Developers need quick solutions to specific coding problems but existing platforms require long-form learning',
    targetMarket: 'Junior and mid-level developers worldwide',
    potentialRevenue: '$2-5M ARR (subscription model)',
  },
  {
    id: '3',
    title: 'AI Meeting Summarizer for Teams',
    description: 'Automatically transcribe, summarize, and extract action items from team meetings',
    problem: 'Teams waste time in meetings and struggle to track action items and decisions made',
    targetMarket: 'Remote-first companies and distributed teams',
    potentialRevenue: '$10-20M ARR (per-seat pricing)',
  },
  {
    id: '4',
    title: 'Sustainable Packaging Marketplace',
    description: 'B2B marketplace connecting e-commerce businesses with eco-friendly packaging suppliers',
    problem: 'E-commerce businesses want sustainable packaging but struggle to find reliable suppliers',
    targetMarket: 'E-commerce businesses with 100+ monthly orders',
    potentialRevenue: '$3-8M ARR (commission-based)',
  },
  {
    id: '5',
    title: 'Personal Finance AI Coach',
    description: 'AI-powered financial advisor that provides personalized investment and savings recommendations',
    problem: 'Most people lack access to affordable financial advice and struggle with investment decisions',
    targetMarket: 'Millennials and Gen Z with $10k-$500k in savings',
    potentialRevenue: '$5-15M ARR (subscription + AUM fees)',
  },
]

export default function GeneratorPage() {
  const { user, loading: authLoading, requireAuth } = useAuth()
  const [selectedIdea, setSelectedIdea] = useState<GeneratedIdea | null>(null)
  const [copied, setCopied] = useState(false)

  requireAuth()

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading generator...</p>
        </div>
      </div>
    )
  }

  const handleCopyIdea = (idea: GeneratedIdea) => {
    const text = `${idea.title}\n\n${idea.description}\n\nProblem: ${idea.problem}\nTarget Market: ${idea.targetMarket}\nPotential Revenue: ${idea.potentialRevenue}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCreateIdea = async (idea: GeneratedIdea) => {
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          problem: idea.problem,
          targetMarket: idea.targetMarket,
        }),
      })

      if (response.ok) {
        const newIdea = await response.json()
        window.location.href = `/ideas/${newIdea.id}`
      }
    } catch (error) {
      console.error('Error creating idea:', error)
    }
  }

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
            <Zap className="w-8 h-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-white">Idea Generator</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Discover AI-generated startup ideas tailored to current market trends and opportunities
          </p>
        </div>

        {/* Ideas Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {SAMPLE_IDEAS.map(idea => (
            <Card
              key={idea.id}
              className={`bg-slate-800 border-slate-700 p-6 cursor-pointer transition-all ${
                selectedIdea?.id === idea.id ? 'border-blue-500 ring-2 ring-blue-500/20' : 'hover:border-blue-500'
              }`}
              onClick={() => setSelectedIdea(idea)}
            >
              <h3 className="text-lg font-semibold text-white mb-2">{idea.title}</h3>
              <p className="text-slate-400 text-sm mb-4">{idea.description}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyIdea(idea)
                  }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCreateIdea(idea)
                  }}
                >
                  Create
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Idea Details */}
        {selectedIdea && (
          <Card className="bg-slate-800 border-slate-700 p-8 mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">{selectedIdea.title}</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Overview</h3>
                <p className="text-slate-300">{selectedIdea.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Problem</h3>
                <p className="text-slate-300">{selectedIdea.problem}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Target Market</h3>
                <p className="text-slate-300">{selectedIdea.targetMarket}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Potential Revenue</h3>
                <p className="text-slate-300">{selectedIdea.potentialRevenue}</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  className="bg-blue-600 hover:bg-blue-700 flex-1"
                  onClick={() => handleCreateIdea(selectedIdea)}
                >
                  Create This Idea
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-600 flex-1"
                  onClick={() => handleCopyIdea(selectedIdea)}
                >
                  {copied ? 'Copied!' : 'Copy Details'}
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Info Box */}
        <Card className="bg-blue-900/20 border-blue-700 p-6 mt-8">
          <h3 className="text-sm font-bold text-blue-400 mb-2">💡 About Idea Generator</h3>
          <p className="text-blue-300 text-sm">
            These ideas are generated based on current market trends, emerging technologies, and identified pain points. Each idea includes a problem statement, target market, and revenue potential. Use these as inspiration or starting points for your own unique variations.
          </p>
        </Card>
      </main>
    </div>
  )
}
