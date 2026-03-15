'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Save, Download } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/**
 * Lean Canvas Page
 * Interactive Lean Canvas builder for startup planning
 * Helps founders structure their business model and strategy
 */

interface LeanCanvasData {
  problem: string
  customerSegments: string
  uniqueValueProposition: string
  solution: string
  channels: string
  revenueStreams: string
  costStructure: string
  keyMetrics: string
  unfairAdvantage: string
}

const CANVAS_SECTIONS = [
  {
    id: 'problem',
    title: 'Problem',
    description: 'Top 3 problems your customers face',
    position: 'top-left',
  },
  {
    id: 'customerSegments',
    title: 'Customer Segments',
    description: 'Target customer groups',
    position: 'top-center',
  },
  {
    id: 'uniqueValueProposition',
    title: 'Unique Value Proposition',
    description: 'Why customers should choose you',
    position: 'top-right',
  },
  {
    id: 'solution',
    title: 'Solution',
    description: 'How you solve the problem',
    position: 'middle-left',
  },
  {
    id: 'channels',
    title: 'Channels',
    description: 'How you reach customers',
    position: 'middle-right',
  },
  {
    id: 'revenueStreams',
    title: 'Revenue Streams',
    description: 'How you make money',
    position: 'bottom-right',
  },
  {
    id: 'costStructure',
    title: 'Cost Structure',
    description: 'Key costs to operate',
    position: 'bottom-left',
  },
  {
    id: 'keyMetrics',
    title: 'Key Metrics',
    description: 'How you measure success',
    position: 'bottom-center',
  },
  {
    id: 'unfairAdvantage',
    title: 'Unfair Advantage',
    description: 'What competitors can\'t easily copy',
    position: 'center',
  },
]

export default function LeanCanvasPage() {
  const { user, loading: authLoading, requireAuth } = useAuth()
  const [canvasData, setCanvasData] = useState<LeanCanvasData>({
    problem: '',
    customerSegments: '',
    uniqueValueProposition: '',
    solution: '',
    channels: '',
    revenueStreams: '',
    costStructure: '',
    keyMetrics: '',
    unfairAdvantage: '',
  })
  const [saved, setSaved] = useState(false)

  requireAuth()

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading Lean Canvas...</p>
        </div>
      </div>
    )
  }

  const handleUpdate = (field: keyof LeanCanvasData, value: string) => {
    setCanvasData(prev => ({
      ...prev,
      [field]: value,
    }))
    setSaved(false)
  }

  const handleSave = async () => {
    try {
      // Save to localStorage for now
      localStorage.setItem(`leanCanvas_${user.id}`, JSON.stringify(canvasData))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving canvas:', error)
    }
  }

  const handleDownload = () => {
    const content = `
LEAN CANVAS - ${new Date().toLocaleDateString()}

PROBLEM
${canvasData.problem}

CUSTOMER SEGMENTS
${canvasData.customerSegments}

UNIQUE VALUE PROPOSITION
${canvasData.uniqueValueProposition}

SOLUTION
${canvasData.solution}

CHANNELS
${canvasData.channels}

REVENUE STREAMS
${canvasData.revenueStreams}

COST STRUCTURE
${canvasData.costStructure}

KEY METRICS
${canvasData.keyMetrics}

UNFAIR ADVANTAGE
${canvasData.unfairAdvantage}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lean-canvas-${new Date().toISOString().split('T')[0]}.txt`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Lean Canvas</h1>
              <p className="text-slate-400 text-sm">Build your business model</p>
            </div>
            <div className="flex gap-2">
              {saved && (
                <div className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm font-semibold">
                  ✓ Saved
                </div>
              )}
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleDownload} variant="outline" className="border-slate-600">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="border-slate-600">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Canvas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Problem */}
          <Card className="bg-slate-800 border-slate-700 p-4 md:col-span-1">
            <h3 className="text-sm font-bold text-white mb-2 uppercase">Problem</h3>
            <textarea
              value={canvasData.problem}
              onChange={(e) => handleUpdate('problem', e.target.value)}
              placeholder="Top 3 problems your customers face"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </Card>

          {/* Customer Segments */}
          <Card className="bg-slate-800 border-slate-700 p-4 md:col-span-1">
            <h3 className="text-sm font-bold text-white mb-2 uppercase">Customer Segments</h3>
            <textarea
              value={canvasData.customerSegments}
              onChange={(e) => handleUpdate('customerSegments', e.target.value)}
              placeholder="Target customer groups"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </Card>

          {/* Unique Value Proposition */}
          <Card className="bg-slate-800 border-slate-700 p-4 md:col-span-1">
            <h3 className="text-sm font-bold text-white mb-2 uppercase">Unique Value Proposition</h3>
            <textarea
              value={canvasData.uniqueValueProposition}
              onChange={(e) => handleUpdate('uniqueValueProposition', e.target.value)}
              placeholder="Why customers should choose you"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </Card>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Solution */}
          <Card className="bg-slate-800 border-slate-700 p-4 md:col-span-1">
            <h3 className="text-sm font-bold text-white mb-2 uppercase">Solution</h3>
            <textarea
              value={canvasData.solution}
              onChange={(e) => handleUpdate('solution', e.target.value)}
              placeholder="How you solve the problem"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </Card>

          {/* Unfair Advantage */}
          <Card className="bg-slate-800 border-slate-700 p-4 md:col-span-1 border-blue-500">
            <h3 className="text-sm font-bold text-blue-400 mb-2 uppercase">Unfair Advantage</h3>
            <textarea
              value={canvasData.unfairAdvantage}
              onChange={(e) => handleUpdate('unfairAdvantage', e.target.value)}
              placeholder="What competitors can't easily copy"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </Card>

          {/* Channels */}
          <Card className="bg-slate-800 border-slate-700 p-4 md:col-span-1">
            <h3 className="text-sm font-bold text-white mb-2 uppercase">Channels</h3>
            <textarea
              value={canvasData.channels}
              onChange={(e) => handleUpdate('channels', e.target.value)}
              placeholder="How you reach customers"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cost Structure */}
          <Card className="bg-slate-800 border-slate-700 p-4 md:col-span-1">
            <h3 className="text-sm font-bold text-white mb-2 uppercase">Cost Structure</h3>
            <textarea
              value={canvasData.costStructure}
              onChange={(e) => handleUpdate('costStructure', e.target.value)}
              placeholder="Key costs to operate"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </Card>

          {/* Key Metrics */}
          <Card className="bg-slate-800 border-slate-700 p-4 md:col-span-1">
            <h3 className="text-sm font-bold text-white mb-2 uppercase">Key Metrics</h3>
            <textarea
              value={canvasData.keyMetrics}
              onChange={(e) => handleUpdate('keyMetrics', e.target.value)}
              placeholder="How you measure success"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </Card>

          {/* Revenue Streams */}
          <Card className="bg-slate-800 border-slate-700 p-4 md:col-span-1">
            <h3 className="text-sm font-bold text-white mb-2 uppercase">Revenue Streams</h3>
            <textarea
              value={canvasData.revenueStreams}
              onChange={(e) => handleUpdate('revenueStreams', e.target.value)}
              placeholder="How you make money"
              className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-slate-300 text-sm focus:outline-none focus:border-blue-500"
            />
          </Card>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-900/20 border-blue-700 p-6 mt-8">
          <h3 className="text-sm font-bold text-blue-400 mb-2">💡 About Lean Canvas</h3>
          <p className="text-blue-300 text-sm">
            The Lean Canvas is a one-page business model designed for startups. It helps you think through your business model systematically and communicate it clearly to others. Fill in each section with your current thinking, then iterate as you learn more from customers.
          </p>
        </Card>
      </main>
    </div>
  )
}
