'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Edit2, Save, Presentation, Plus, Trash2 } from 'lucide-react'

interface PitchDeck {
  id: string
  ideaId: string
  slides: PitchSlide[]
  createdAt: string
  updatedAt: string
}

interface PitchSlide {
  id: string
  slideNumber: number
  title: string
  content: string
  notes: string
}

interface Idea {
  id: string
  title: string
}

export default function PitchDeckPage() {
  const router = useRouter()
  const [user, setUser] = useState<PitchDeck | null>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('')
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [slides, setSlides] = useState<PitchSlide[]>([])

  // Default pitch deck slides template
  const defaultSlides: PitchSlide[] = [
    {
      id: '1',
      slideNumber: 1,
      title: 'Title Slide',
      content: 'Your Company Name\nYour Tagline Here',
      notes: 'Start with a compelling title and tagline that captures attention',
    },
    {
      id: '2',
      slideNumber: 2,
      title: 'The Problem',
      content: 'What problem are you solving?\nWhy does it matter?',
      notes: 'Clearly articulate the pain point your target audience faces',
    },
    {
      id: '3',
      slideNumber: 3,
      title: 'Your Solution',
      content: 'How does your product solve this problem?\nWhat makes it unique?',
      notes: 'Explain your solution and its key differentiators',
    },
    {
      id: '4',
      slideNumber: 4,
      title: 'Market Opportunity',
      content: 'TAM: Total Addressable Market\nSAM: Serviceable Available Market\nSOM: Serviceable Obtainable Market',
      notes: 'Show the size and growth potential of your market',
    },
    {
      id: '5',
      slideNumber: 5,
      title: 'Business Model',
      content: 'How will you make money?\nRevenue streams and pricing strategy',
      notes: 'Explain your monetization approach clearly',
    },
    {
      id: '6',
      slideNumber: 6,
      title: 'Traction & Metrics',
      content: 'Key metrics and achievements to date\nUser growth, revenue, partnerships',
      notes: 'Show proof of concept and early validation',
    },
    {
      id: '7',
      slideNumber: 7,
      title: 'The Team',
      content: 'Who are the founders?\nWhat relevant experience do they have?',
      notes: 'Highlight team expertise and why you\'re the right team to execute',
    },
    {
      id: '8',
      slideNumber: 8,
      title: 'Funding Ask',
      content: 'How much are you raising?\nHow will you use the funds?',
      notes: 'Be specific about your funding needs and allocation',
    },
    {
      id: '9',
      slideNumber: 9,
      title: 'Roadmap',
      content: 'What\'s next for your company?\nKey milestones for the next 12-24 months',
      notes: 'Show your vision and execution plan',
    },
    {
      id: '10',
      slideNumber: 10,
      title: 'Contact & Call to Action',
      content: 'Your contact information\nNext steps for interested investors',
      notes: 'Make it easy for people to reach out and engage',
    },
  ]

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

  // Fetch pitch deck when idea is selected
  useEffect(() => {
    if (!selectedIdeaId) return

    const fetchPitchDeck = async () => {
      try {
        const response = await fetch(`/api/pitch-deck/${selectedIdeaId}`)
        if (response.ok) {
          const data = await response.json()
          setPitchDeck(data)
          setSlides(data.slides || defaultSlides)
        } else {
          setPitchDeck(null)
          setSlides(defaultSlides)
        }
        setCurrentSlideIndex(0)
      } catch (err) {
        setError('Failed to load pitch deck')
        setSlides(defaultSlides)
      }
    }

    fetchPitchDeck()
  }, [selectedIdeaId])

  // Handle slide content change
  const handleSlideChange = (field: keyof PitchSlide, value: string) => {
    const updatedSlides = [...slides]
    updatedSlides[currentSlideIndex] = {
      ...updatedSlides[currentSlideIndex],
      [field]: value,
    }
    setSlides(updatedSlides)
  }

  // Handle add slide
  const handleAddSlide = () => {
    const newSlide: PitchSlide = {
      id: Date.now().toString(),
      slideNumber: slides.length + 1,
      title: `Slide ${slides.length + 1}`,
      content: '',
      notes: '',
    }
    setSlides([...slides, newSlide])
    setCurrentSlideIndex(slides.length)
  }

  // Handle delete slide
  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) {
      setError('You must have at least one slide')
      return
    }
    const updatedSlides = slides.filter((_, i) => i !== index)
    setSlides(updatedSlides)
    if (currentSlideIndex >= updatedSlides.length) {
      setCurrentSlideIndex(updatedSlides.length - 1)
    }
  }

  // Handle save
  const handleSave = async () => {
    if (!selectedIdeaId) return
    setSaving(true)
    setError('')

    try {
      const method = pitchDeck ? 'PUT' : 'POST'
      const url = pitchDeck ? `/api/pitch-deck/${pitchDeck.id}` : '/api/pitch-deck'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: selectedIdeaId,
          slides: slides,
        }),
      })

      if (!response.ok) {
        setError('Failed to save pitch deck')
        setSaving(false)
        return
      }

      const updatedDeck = await response.json()
      setPitchDeck(updatedDeck)
      setIsEditing(false)
    } catch (err) {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading pitch deck...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const currentSlide = slides[currentSlideIndex]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">🎤 Pitch Deck Builder</h1>
          <p className="text-slate-400 mt-2">Create a compelling pitch deck for investors</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <p className="text-slate-400 mb-4">No ideas found. Create an idea first to build a pitch deck.</p>
            <Link href="/ideas/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Idea
              </Button>
            </Link>
          </Card>
        )}

        {selectedIdeaId && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Slide Navigation */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 border-slate-700 p-4 sticky top-4">
                <h3 className="text-lg font-semibold text-white mb-4">Slides ({slides.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlideIndex(index)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        currentSlideIndex === index
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <div className="text-sm font-medium">{slide.slideNumber}. {slide.title}</div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleAddSlide}
                  className="w-full bg-green-600 hover:bg-green-700 mb-2"
                  disabled={isEditing && saving}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slide
                </Button>
                {slides.length > 1 && (
                  <Button
                    onClick={() => handleDeleteSlide(currentSlideIndex)}
                    variant="outline"
                    className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
                    disabled={isEditing && saving}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Slide
                  </Button>
                )}
              </Card>
            </div>

            {/* Slide Editor */}
            <div className="lg:col-span-3">
              {currentSlide && (
                <>
                  {isEditing ? (
                    // Edit Mode
                    <Card className="bg-slate-800 border-slate-700 p-8 mb-6">
                      <h2 className="text-2xl font-bold text-white mb-6">Edit Slide {currentSlide.slideNumber}</h2>
                      <div className="space-y-6">
                        {/* Slide Title */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Slide Title
                          </label>
                          <input
                            type="text"
                            value={currentSlide.title}
                            onChange={(e) => handleSlideChange('title', e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={saving}
                          />
                        </div>

                        {/* Slide Content */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Slide Content
                          </label>
                          <textarea
                            value={currentSlide.content}
                            onChange={(e) => handleSlideChange('content', e.target.value)}
                            placeholder="Enter your slide content here. Use line breaks for multiple points."
                            className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
                            disabled={saving}
                          />
                        </div>

                        {/* Speaker Notes */}
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Speaker Notes
                          </label>
                          <textarea
                            value={currentSlide.notes}
                            onChange={(e) => handleSlideChange('notes', e.target.value)}
                            placeholder="Add speaker notes for this slide"
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
                            {saving ? 'Saving...' : 'Save Pitch Deck'}
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
                  ) : (
                    // View Mode
                    <>
                      {/* Slide Preview */}
                      <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-700 p-12 mb-6 min-h-96 flex flex-col justify-between">
                        <div>
                          <div className="text-sm text-slate-400 mb-4">Slide {currentSlide.slideNumber} of {slides.length}</div>
                          <h2 className="text-4xl font-bold text-white mb-6">{currentSlide.title}</h2>
                          <p className="text-xl text-slate-200 whitespace-pre-wrap leading-relaxed">
                            {currentSlide.content}
                          </p>
                        </div>
                        <div className="text-sm text-slate-400 mt-8 pt-8 border-t border-slate-600">
                          <p className="font-semibold mb-2">Speaker Notes:</p>
                          <p className="whitespace-pre-wrap">{currentSlide.notes}</p>
                        </div>
                      </Card>

                      {/* Navigation and Edit Button */}
                      <div className="flex gap-4">
                        <Button
                          onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          disabled={currentSlideIndex === 0}
                        >
                          ← Previous
                        </Button>
                        <Button
                          onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          disabled={currentSlideIndex === slides.length - 1}
                        >
                          Next →
                        </Button>
                        <Button
                          onClick={() => setIsEditing(true)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit Slide
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
