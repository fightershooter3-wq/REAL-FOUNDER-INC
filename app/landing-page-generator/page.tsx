'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Edit2, Save, Globe, Copy, Download } from 'lucide-react'

interface LandingPageConfig {
  id: string
  ideaId: string
  headline: string
  subheadline: string
  ctaText: string
  ctaLink: string
  features: string[]
  heroImageUrl: string
  colorScheme: string
  createdAt: string
  updatedAt: string
}

interface Idea {
  id: string
  title: string
  description: string
}

export default function LandingPageGeneratorPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('')
  const [config, setConfig] = useState<LandingPageConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    headline: '',
    subheadline: '',
    ctaText: '',
    ctaLink: '',
    features: '',
    heroImageUrl: '',
    colorScheme: 'blue',
  })

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

  // Fetch landing page config when idea is selected
  useEffect(() => {
    if (!selectedIdeaId) return

    const fetchConfig = async () => {
      try {
        const response = await fetch(`/api/landing-page/${selectedIdeaId}`)
        if (response.ok) {
          const data = await response.json()
          setConfig(data)
          setFormData({
            headline: data.headline || '',
            subheadline: data.subheadline || '',
            ctaText: data.ctaText || '',
            ctaLink: data.ctaLink || '',
            features: data.features?.join('\n') || '',
            heroImageUrl: data.heroImageUrl || '',
            colorScheme: data.colorScheme || 'blue',
          })
        } else {
          setConfig(null)
          const idea = ideas.find(i => i.id === selectedIdeaId)
          setFormData({
            headline: idea?.title || '',
            subheadline: idea?.description || '',
            ctaText: 'Get Started',
            ctaLink: '#',
            features: '',
            heroImageUrl: '',
            colorScheme: 'blue',
          })
        }
      } catch (err) {
        setError('Failed to load landing page config')
      }
    }

    fetchConfig()
  }, [selectedIdeaId, ideas])

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
    if (!selectedIdeaId) return
    setSaving(true)
    setError('')

    try {
      const method = config ? 'PUT' : 'POST'
      const url = config ? `/api/landing-page/${config.id}` : '/api/landing-page'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: selectedIdeaId,
          headline: formData.headline,
          subheadline: formData.subheadline,
          ctaText: formData.ctaText,
          ctaLink: formData.ctaLink,
          features: formData.features.split('\n').filter(f => f.trim()),
          heroImageUrl: formData.heroImageUrl,
          colorScheme: formData.colorScheme,
        }),
      })

      if (!response.ok) {
        setError('Failed to save landing page config')
        setSaving(false)
        return
      }

      const updatedConfig = await response.json()
      setConfig(updatedConfig)
      setIsEditing(false)
    } catch (err) {
      setError('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  // Handle copy HTML
  const handleCopyHTML = () => {
    const html = generateHTML()
    navigator.clipboard.writeText(html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate HTML
  const generateHTML = () => {
    const colorMap: Record<string, { primary: string; secondary: string }> = {
      blue: { primary: '#3b82f6', secondary: '#dbeafe' },
      purple: { primary: '#a855f7', secondary: '#f3e8ff' },
      green: { primary: '#10b981', secondary: '#d1fae5' },
      red: { primary: '#ef4444', secondary: '#fee2e2' },
    }

    const colors = colorMap[formData.colorScheme] || colorMap.blue

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formData.headline}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #1f2937;
    }
    
    header {
      background: white;
      padding: 1rem 2rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    nav {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: ${colors.primary};
    }
    
    .nav-links {
      display: flex;
      gap: 2rem;
      list-style: none;
    }
    
    .nav-links a {
      text-decoration: none;
      color: #4b5563;
      transition: color 0.3s;
    }
    
    .nav-links a:hover {
      color: ${colors.primary};
    }
    
    .hero {
      background: linear-gradient(135deg, ${colors.secondary} 0%, white 100%);
      padding: 6rem 2rem;
      text-align: center;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }
    
    h1 {
      font-size: 3rem;
      margin-bottom: 1rem;
      color: #111827;
    }
    
    .subheadline {
      font-size: 1.25rem;
      color: #6b7280;
      margin-bottom: 2rem;
    }
    
    .cta-button {
      display: inline-block;
      background: ${colors.primary};
      color: white;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.3s, box-shadow 0.3s;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    .features {
      max-width: 1200px;
      margin: 4rem auto;
      padding: 0 2rem;
    }
    
    .features h2 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 3rem;
      color: #111827;
    }
    
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      padding: 2rem;
      background: white;
      border-radius: 0.5rem;
      border-left: 4px solid ${colors.primary};
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    .feature-card h3 {
      color: ${colors.primary};
      margin-bottom: 0.5rem;
    }
    
    .feature-card p {
      color: #6b7280;
    }
    
    footer {
      background: #1f2937;
      color: white;
      text-align: center;
      padding: 2rem;
      margin-top: 4rem;
    }
    
    @media (max-width: 768px) {
      h1 {
        font-size: 2rem;
      }
      
      .nav-links {
        gap: 1rem;
      }
      
      .features-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <header>
    <nav>
      <div class="logo">${formData.headline}</div>
      <ul class="nav-links">
        <li><a href="#features">Features</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  </header>
  
  <section class="hero">
    <div class="hero-content">
      <h1>${formData.headline}</h1>
      <p class="subheadline">${formData.subheadline}</p>
      <a href="${formData.ctaLink}" class="cta-button">${formData.ctaText}</a>
    </div>
  </section>
  
  ${formData.features ? `
  <section class="features" id="features">
    <h2>Key Features</h2>
    <div class="features-grid">
      ${formData.features.split('\n').filter(f => f.trim()).map(feature => `
      <div class="feature-card">
        <h3>✨ ${feature.trim()}</h3>
        <p>Discover how this feature can transform your experience.</p>
      </div>
      `).join('')}
    </div>
  </section>
  ` : ''}
  
  <footer id="contact">
    <p>&copy; 2024 ${formData.headline}. All rights reserved.</p>
  </footer>
</body>
</html>`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading landing page generator...</p>
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
          <h1 className="text-3xl font-bold text-white">🌐 Landing Page Generator</h1>
          <p className="text-slate-400 mt-2">Create a professional landing page for your idea</p>
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
            <p className="text-slate-400 mb-4">No ideas found. Create an idea first to generate a landing page.</p>
            <Link href="/ideas/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Your First Idea
              </Button>
            </Link>
          </Card>
        )}

        {selectedIdeaId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor */}
            <div>
              {isEditing ? (
                // Edit Mode
                <Card className="bg-slate-800 border-slate-700 p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Edit Landing Page</h2>
                  <div className="space-y-6">
                    {/* Headline */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Headline
                      </label>
                      <input
                        type="text"
                        name="headline"
                        value={formData.headline}
                        onChange={handleChange}
                        placeholder="e.g., Build Your Startup in Days"
                        className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    </div>

                    {/* Subheadline */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Subheadline
                      </label>
                      <textarea
                        name="subheadline"
                        value={formData.subheadline}
                        onChange={handleChange}
                        placeholder="e.g., Everything you need to validate, build, and launch your idea"
                        className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                        disabled={saving}
                      />
                    </div>

                    {/* CTA Text */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Call-to-Action Text
                      </label>
                      <input
                        type="text"
                        name="ctaText"
                        value={formData.ctaText}
                        onChange={handleChange}
                        placeholder="e.g., Get Started Free"
                        className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    </div>

                    {/* CTA Link */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Call-to-Action Link
                      </label>
                      <input
                        type="text"
                        name="ctaLink"
                        value={formData.ctaLink}
                        onChange={handleChange}
                        placeholder="e.g., https://example.com/signup"
                        className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    </div>

                    {/* Features */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Features (one per line)
                      </label>
                      <textarea
                        name="features"
                        value={formData.features}
                        onChange={handleChange}
                        placeholder="Fast Setup&#10;Powerful Analytics&#10;24/7 Support"
                        className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                        disabled={saving}
                      />
                    </div>

                    {/* Color Scheme */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Color Scheme
                      </label>
                      <select
                        name="colorScheme"
                        value={formData.colorScheme}
                        onChange={handleChange}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      >
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="green">Green</option>
                        <option value="red">Red</option>
                      </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={saving}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Landing Page'}
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
                  <Card className="bg-slate-800 border-slate-700 p-8 mb-6">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">{formData.headline}</h2>
                      <p className="text-slate-300 mb-4">{formData.subheadline}</p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        {formData.ctaText}
                      </Button>
                    </div>

                    {formData.features && (
                      <div className="mt-8 pt-8 border-t border-slate-700">
                        <h3 className="text-lg font-semibold text-white mb-4">Key Features</h3>
                        <ul className="space-y-2">
                          {formData.features.split('\n').filter(f => f.trim()).map((feature, idx) => (
                            <li key={idx} className="text-slate-300 flex items-center">
                              <span className="text-blue-400 mr-3">✨</span>
                              {feature.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Landing Page
                    </Button>
                    <Button
                      onClick={handleCopyHTML}
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copied ? 'Copied!' : 'Copy HTML'}
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Preview */}
            <div>
              <Card className="bg-slate-800 border-slate-700 p-0 overflow-hidden sticky top-4">
                <div className="bg-slate-700 px-4 py-3 border-b border-slate-600">
                  <h3 className="text-sm font-semibold text-white">Preview</h3>
                </div>
                <div className="bg-white h-96 overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{formData.headline}</h2>
                    <p className="text-gray-600 mb-4 text-sm">{formData.subheadline}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">
                      {formData.ctaText}
                    </button>

                    {formData.features && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Features</h3>
                        <div className="space-y-2">
                          {formData.features.split('\n').filter(f => f.trim()).map((feature, idx) => (
                            <div key={idx} className="text-sm text-gray-700 flex items-start">
                              <span className="mr-2">✨</span>
                              <span>{feature.trim()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
