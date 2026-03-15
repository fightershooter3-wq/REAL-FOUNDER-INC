'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Send, Loader2, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'mentor'
  content: string
  timestamp: Date
}

interface MentorProfile {
  name: string
  title: string
  expertise: string[]
  bio: string
  avatar: string
}

export default function MentorChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock mentor profiles
  const mentors: Record<string, MentorProfile> = {
    alex: {
      name: 'Alex Chen',
      title: 'Serial Entrepreneur & Investor',
      expertise: ['Product Strategy', 'Fundraising', 'Growth', 'Team Building'],
      bio: 'Founded 3 successful startups, invested in 50+ early-stage companies. Passionate about helping young founders succeed.',
      avatar: '👨‍💼',
    },
    sarah: {
      name: 'Sarah Williams',
      title: 'Product & Design Expert',
      expertise: ['Product Design', 'User Research', 'MVP Development', 'Market Fit'],
      bio: 'Led product teams at major tech companies. Specializes in helping founders validate ideas and build products users love.',
      avatar: '👩‍💻',
    },
    james: {
      name: 'James Rodriguez',
      title: 'Business & Finance Advisor',
      expertise: ['Financial Planning', 'Unit Economics', 'Pricing Strategy', 'Metrics'],
      bio: 'CFO experience at multiple startups. Helps founders understand their numbers and make data-driven decisions.',
      avatar: '👨‍🏫',
    },
  }

  const currentMentor = mentors.alex // Default mentor

  // Mock AI responses from mentor
  const getMentorResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Simple pattern matching for mock responses
    if (lowerMessage.includes('idea') || lowerMessage.includes('startup')) {
      return `That's a great question! When evaluating startup ideas, I always focus on three key things:

1. **Problem Validation**: Is this a real problem that people will pay to solve? Talk to at least 20 potential customers.

2. **Market Size**: Is the addressable market large enough? You need at least a $1B TAM to build a venture-scale company.

3. **Unfair Advantage**: What's your unique edge? Why are you the right person to solve this?

What specific problem are you trying to solve? I'd love to help you validate it further.`
    }

    if (lowerMessage.includes('fundrais') || lowerMessage.includes('funding') || lowerMessage.includes('investor')) {
      return `Fundraising is a critical skill for founders. Here's my advice:

**Before approaching investors:**
- Have clear metrics showing traction (users, revenue, growth rate)
- Know your story and why you're the right team
- Have a 1-page summary of your business model
- Practice your pitch until it's natural

**When pitching:**
- Lead with the problem and why it matters
- Show how your solution is different
- Be honest about challenges and what you don't know
- Ask for advice, not just money

What stage are you at? Pre-seed, seed, or Series A? That changes the strategy significantly.`
    }

    if (lowerMessage.includes('product') || lowerMessage.includes('build') || lowerMessage.includes('feature')) {
      return `Building the right product is crucial. Here's my framework:

**MVP First**: Don't build everything. Start with the core feature that solves the main problem.

**User Feedback Loop**: 
- Build → Release → Get feedback → Iterate
- This cycle should take 1-2 weeks, not months

**Metrics That Matter**:
- Daily/Weekly Active Users
- Retention (are people coming back?)
- Engagement (are they using the core feature?)

**Common Mistakes**:
- Building too many features before validating the core
- Not talking to users enough
- Optimizing before you have product-market fit

What's your current product roadmap? Happy to help you prioritize.`
    }

    if (lowerMessage.includes('team') || lowerMessage.includes('hire') || lowerMessage.includes('cofounder')) {
      return `Team is everything. I've seen great ideas fail with bad teams and mediocre ideas succeed with great teams.

**Finding a Co-founder:**
- Look for complementary skills (if you're technical, find a business person)
- Make sure you can work together under stress
- Align on vision and values
- Get a co-founder agreement in writing

**Building Your Team:**
- Hire slowly, fire fast
- Look for people who are passionate about the problem
- Early employees should wear multiple hats
- Culture matters more than you think

**Equity & Compensation:**
- Be generous with early employees (they're taking a risk)
- Use vesting schedules (4 years with 1-year cliff)
- Be transparent about finances

Are you looking for a co-founder or building a team? What's your biggest challenge right now?`
    }

    if (lowerMessage.includes('market') || lowerMessage.includes('customer') || lowerMessage.includes('user')) {
      return `Understanding your market and customers is fundamental.

**Customer Discovery:**
- Talk to 20-30 potential customers before building
- Ask about their current solution and pain points
- Don't pitch, just listen
- Look for patterns in what you hear

**Market Sizing:**
- TAM (Total Addressable Market): How big is the whole market?
- SAM (Serviceable Addressable Market): How much can you realistically capture?
- SOM (Serviceable Obtainable Market): Your realistic first-year target

**Go-to-Market Strategy:**
- Who's your first customer segment?
- How will you reach them cost-effectively?
- What's your unit economics?

What's your target customer? Let's talk about how to reach them.`
    }

    // Default response
    return `That's a thoughtful question! In my experience, the most successful founders focus on solving real problems for real customers.

A few things to consider:
- **Validation**: Have you talked to potential customers about this?
- **Differentiation**: What makes your approach unique?
- **Execution**: Do you have the skills and resources to build this?

Tell me more about what you're working on. What's the biggest challenge you're facing right now?`
  }

  // Check authentication and load initial message
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

        // Add welcome message from mentor
        const welcomeMessage: Message = {
          id: '1',
          role: 'mentor',
          content: `Hi ${userData.name}! 👋 I'm ${currentMentor.name}, and I'm here to help you on your founder journey. I specialize in ${currentMentor.expertise.join(', ')}. Feel free to ask me anything about building your startup!`,
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      } catch (err) {
        setError('Failed to load chat')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !user) return

    setSending(true)
    setError('')

    try {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: inputValue,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, userMessage])
      setInputValue('')

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Get mentor response (mocked)
      const mentorResponse = getMentorResponse(inputValue)
      const mentorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'mentor',
        content: mentorResponse,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, mentorMessage])
    } catch (err) {
      setError('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading mentor chat...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{currentMentor.avatar}</div>
            <div>
              <h1 className="text-2xl font-bold text-white">{currentMentor.name}</h1>
              <p className="text-slate-400">{currentMentor.title}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {currentMentor.expertise.map((skill) => (
                  <span key={skill} className="text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Messages */}
        <div className="flex-1 space-y-4 mb-6 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl px-4 py-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-slate-700 text-slate-100 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-slate-100 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Mentor is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <Card className="bg-slate-800 border-slate-700 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your mentor anything about building your startup..."
              className="flex-1 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={sending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={sending || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            💡 Tip: Ask about ideas, fundraising, product strategy, team building, or anything else!
          </p>
        </Card>

        {/* Mentor Bio */}
        <Card className="bg-slate-800 border-slate-700 p-4 mt-6">
          <h3 className="text-sm font-semibold text-white mb-2">About Your Mentor</h3>
          <p className="text-sm text-slate-300">{currentMentor.bio}</p>
        </Card>
      </main>
    </div>
  )
}
