'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Edit2, Save, Award, TrendingUp, Users, Zap } from 'lucide-react'

interface User {
  id: string
  email: string
  username: string
  name?: string
}

interface FounderProfile {
  id: string
  userId: string
  bio: string
  skills: string
  experience: string
  achievements: string
  goals: string
  mentors: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<FounderProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    bio: '',
    skills: '',
    experience: '',
    achievements: '',
    goals: '',
    mentors: '',
  })

  // Check authentication and fetch profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get user from localStorage
        const storedUser = localStorage.getItem('user')
        if (!storedUser) {
          router.push('/login')
          return
        }

        const userData = JSON.parse(storedUser)
        setUser(userData)

        // Fetch founder profile
        const response = await fetch(`/api/profile/${userData.id}`)
        if (response.ok) {
          const profileData = await response.json()
          setProfile(profileData)
          setFormData({
            bio: profileData.bio || '',
            skills: profileData.skills || '',
            experience: profileData.experience || '',
            achievements: profileData.achievements || '',
            goals: profileData.goals || '',
            mentors: profileData.mentors || '',
          })
        } else {
          // Profile doesn't exist yet, create empty one
          setProfile(null)
        }
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle save
  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setError('')

    try {
      const method = profile ? 'PUT' : 'POST'
      const url = profile ? `/api/profile/${profile.id}` : '/api/profile'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      })

      if (!response.ok) {
        setError('Failed to save profile')
        setSaving(false)
        return
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
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
          <p className="text-slate-300">Loading profile...</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">👤 Founder Profile</h1>
          <p className="text-slate-400 mt-2">Build your personal brand and track your growth</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {error && (
          <Alert className="mb-6 bg-red-900/20 border-red-700">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        {/* Profile Header Card */}
        <Card className="bg-slate-800 border-slate-700 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white">{user.name || user.username}</h2>
              <p className="text-slate-400 mt-1">{user.email}</p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <p className="text-slate-400 text-sm">Founder Level</p>
              </div>
              <p className="text-2xl font-bold text-yellow-400">Beginner</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-slate-400 text-sm">Ideas Launched</p>
              </div>
              <p className="text-2xl font-bold text-green-400">0</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-blue-400" />
                <p className="text-slate-400 text-sm">Mentors</p>
              </div>
              <p className="text-2xl font-bold text-blue-400">0</p>
            </div>

            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-purple-400" />
                <p className="text-slate-400 text-sm">Achievements</p>
              </div>
              <p className="text-2xl font-bold text-purple-400">0</p>
            </div>
          </div>
        </Card>

        {isEditing ? (
          // Edit Mode
          <Card className="bg-slate-800 border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself. What's your story as a founder?"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                  disabled={saving}
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Skills
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="List your key skills (e.g., Product Design, Marketing, Full-stack Development)"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                  disabled={saving}
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Describe your professional background and relevant experience"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                  disabled={saving}
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Achievements
                </label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleChange}
                  placeholder="List your notable achievements, awards, or milestones"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                  disabled={saving}
                />
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Goals
                </label>
                <textarea
                  name="goals"
                  value={formData.goals}
                  onChange={handleChange}
                  placeholder="What are your goals as a founder? What do you want to achieve?"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                  disabled={saving}
                />
              </div>

              {/* Mentors */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Mentors & Advisors
                </label>
                <textarea
                  name="mentors"
                  value={formData.mentors}
                  onChange={handleChange}
                  placeholder="List your mentors, advisors, or people who inspire you"
                  className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
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
                  {saving ? 'Saving...' : 'Save Profile'}
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
          <div className="space-y-6">
            {/* Bio Section */}
            {profile?.bio && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">About Me</h3>
                <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
              </Card>
            )}

            {/* Skills Section */}
            {profile?.skills && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">🎯 Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.split(',').map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Experience Section */}
            {profile?.experience && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">💼 Experience</h3>
                <p className="text-slate-300 leading-relaxed">{profile.experience}</p>
              </Card>
            )}

            {/* Achievements Section */}
            {profile?.achievements && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">🏆 Achievements</h3>
                <p className="text-slate-300 leading-relaxed">{profile.achievements}</p>
              </Card>
            )}

            {/* Goals Section */}
            {profile?.goals && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">🚀 Goals</h3>
                <p className="text-slate-300 leading-relaxed">{profile.goals}</p>
              </Card>
            )}

            {/* Mentors Section */}
            {profile?.mentors && (
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h3 className="text-xl font-semibold text-white mb-3">👥 Mentors & Advisors</h3>
                <p className="text-slate-300 leading-relaxed">{profile.mentors}</p>
              </Card>
            )}

            {/* Empty State */}
            {!profile && (
              <Card className="bg-slate-800 border-slate-700 p-12 text-center">
                <p className="text-slate-400 mb-4">Your profile is empty. Start by adding your bio and skills!</p>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Create Profile
                </Button>
              </Card>
            )}

            {/* Resources Section */}
            <Card className="bg-slate-800 border-slate-700 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">📚 Founder Resources</h3>
              <div className="space-y-3">
                <Link href="/validator">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-start">
                    📊 Validate Your Ideas
                  </Button>
                </Link>
                <Link href="/lean-canvas">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-start">
                    📋 Build Lean Canvas
                  </Button>
                </Link>
                <Link href="/sprints">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 justify-start">
                    🎯 Create Execution Sprint
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
