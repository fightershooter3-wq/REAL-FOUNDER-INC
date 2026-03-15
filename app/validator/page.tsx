'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
// import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

/**
 * Idea Validator Page
 * Helps founders validate their startup ideas through structured questions
 * Provides validation framework and scoring system
 */

interface ValidationQuestion {
  id: string
  category: string
  question: string
  description: string
}

const VALIDATION_QUESTIONS: ValidationQuestion[] = [
  {
    id: '1',
    category: 'Problem',
    question: 'Is there a clear, specific problem?',
    description: 'Can you articulate the exact problem your idea solves?',
  },
  {
    id: '2',
    category: 'Problem',
    question: 'Do people care about this problem?',
    description: 'Have you talked to potential customers about this problem?',
  },
  {
    id: '3',
    category: 'Market',
    question: 'Is there a large enough market?',
    description: 'How many people have this problem?',
  },
  {
    id: '4',
    category: 'Market',
    question: 'Are there existing solutions?',
    description: 'What alternatives exist? Why is yours better?',
  },
  {
    id: '5',
    category: 'Solution',
    question: 'Is your solution unique?',
    description: 'What makes your approach different?',
  },
  {
    id: '6',
    category: 'Solution',
    question: 'Can you build it?',
    description: 'Do you have the skills or can you acquire them?',
  },
  {
    id: '7',
    category: 'Business',
    question: 'Is there a business model?',
    description: 'How will you make money?',
  },
  {
    id: '8',
    category: 'Business',
    question: 'Can you reach customers?',
    description: 'How will you acquire your first customers?',
  },
]

export default function ValidatorPage() {
  const { user, loading: authLoading, requireAuth } = useAuth()
  const [responses, setResponses] = useState<Record<string, boolean>>({})
  const [_showResults, _setShowResults] = useState(false)

  requireAuth()

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading validator...</p>
        </div>
      </div>
    )
  }

  const handleResponse = (questionId: string, response: boolean) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response,
    }))
  }

  const validationScore = Object.values(responses).filter(Boolean).length
  const totalQuestions = VALIDATION_QUESTIONS.length
  const scorePercentage = Math.round((validationScore / totalQuestions) * 100)

  const categories = ['Problem', 'Market', 'Solution', 'Business']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
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
            <h1 className="text-4xl font-bold text-white">Idea Validator</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Validate your startup idea by answering key questions about your problem, market, solution, and business model
          </p>
        </div>

        {/* Validation Framework */}
        <div className="space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-white mb-4">{category}</h2>
              <div className="space-y-4">
                {VALIDATION_QUESTIONS.filter(q => q.category === category).map(question => (
                  <Card key={question.id} className="bg-slate-800 border-slate-700 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {question.question}
                        </h3>
                        <p className="text-slate-400 text-sm">
                          {question.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResponse(question.id, true)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            responses[question.id] === true
                              ? 'bg-green-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => handleResponse(question.id, false)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            responses[question.id] === false
                              ? 'bg-red-600 text-white'
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results Section */}
        {Object.keys(responses).length > 0 && (
          <div className="mt-12 space-y-6">
            <Card className="bg-slate-800 border-slate-700 p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-4">Validation Score</h3>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-6xl font-bold text-blue-500">{scorePercentage}%</div>
                  <div className="text-left">
                    <p className="text-slate-400">{validationScore} of {totalQuestions} questions answered positively</p>
                  </div>
                </div>
              </div>

              {/* Score Interpretation */}
              <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
                {scorePercentage >= 75 && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-green-400 font-semibold">Strong Validation</p>
                      <p className="text-slate-300 text-sm mt-1">
                        Your idea shows strong potential. Consider moving forward with building and customer interviews.
                      </p>
                    </div>
                  </div>
                )}
                {scorePercentage >= 50 && scorePercentage < 75 && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-yellow-400 font-semibold">Moderate Validation</p>
                      <p className="text-slate-300 text-sm mt-1">
                        Your idea has potential but needs more validation. Focus on the areas where you answered &quot;No&quot;.
                      </p>
                    </div>
                  </div>
                )}
                {scorePercentage < 50 && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-red-400 font-semibold">Needs More Work</p>
                      <p className="text-slate-300 text-sm mt-1">
                        Consider refining your idea or exploring different problems. Focus on customer interviews.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Next Steps</h3>
              <ol className="space-y-3 text-slate-300">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">1.</span>
                  <span>Conduct customer interviews to validate your assumptions</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">2.</span>
                  <span>Create a Lean Canvas to map out your business model</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">3.</span>
                  <span>Build an MVP (Minimum Viable Product) to test with users</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">4.</span>
                  <span>Iterate based on feedback and continue validating</span>
                </li>
              </ol>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
