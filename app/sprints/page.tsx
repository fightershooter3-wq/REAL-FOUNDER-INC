'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Plus, CheckCircle2, Clock } from 'lucide-react'

interface Idea {
  id: string
  title: string
  description: string
}

interface Sprint {
  id: string
  ideaId: string
  title: string
  description: string
  startDate: string
  endDate: string
  status: string
  createdAt: string
}

interface Task {
  id: string
  sprintId: string
  title: string
  description: string
  completed: boolean
  week: number
  createdAt: string
}

export default function SprintsPage() {
  const router = useRouter()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [selectedIdea, setSelectedIdea] = useState<string>('')
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNewSprintForm, setShowNewSprintForm] = useState(false)
  const [showNewTaskForm, setShowNewTaskForm] = useState(false)
  const [newSprintData, setNewSprintData] = useState({
    title: '',
    description: '',
  })
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    week: 1,
  })
  const [saving, setSaving] = useState(false)

  // Fetch ideas on mount
  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const response = await fetch('/api/ideas')
        if (response.ok) {
          const data = await response.json()
          setIdeas(data)
          if (data.length > 0) {
            setSelectedIdea(data[0].id)
          }
        }
      } catch (err) {
        setError('Failed to load ideas')
      } finally {
        setLoading(false)
      }
    }

    fetchIdeas()
  }, [])

  // Fetch sprints when idea changes
  useEffect(() => {
    if (!selectedIdea) return

    const fetchSprints = async () => {
      try {
        const response = await fetch(`/api/sprints?ideaId=${selectedIdea}`)
        if (response.ok) {
          const data = await response.json()
          setSprints(data)
          if (data.length > 0) {
            setSelectedSprint(data[0])
          } else {
            setSelectedSprint(null)
          }
        }
      } catch (err) {
        console.error('Failed to load sprints')
      }
    }

    fetchSprints()
  }, [selectedIdea])

  // Fetch tasks when sprint changes
  useEffect(() => {
    if (!selectedSprint) {
      setTasks([])
      return
    }

    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/sprints/${selectedSprint.id}/tasks`)
        if (response.ok) {
          const data = await response.json()
          setTasks(data)
        }
      } catch (err) {
        console.error('Failed to load tasks')
      }
    }

    fetchTasks()
  }, [selectedSprint])

  // Handle new sprint creation
  const handleCreateSprint = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedIdea || !newSprintData.title) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError('')

    try {
      // Calculate dates (4 weeks from today)
      const startDate = new Date()
      const endDate = new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000)

      const response = await fetch('/api/sprints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ideaId: selectedIdea,
          title: newSprintData.title,
          description: newSprintData.description,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          status: 'active',
        }),
      })

      if (!response.ok) {
        setError('Failed to create sprint')
        setSaving(false)
        return
      }

      const newSprint = await response.json()
      setSprints([...sprints, newSprint])
      setSelectedSprint(newSprint)
      setNewSprintData({ title: '', description: '' })
      setShowNewSprintForm(false)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Handle new task creation
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSprint || !newTaskData.title) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError('')

    try {
      const response = await fetch(`/api/sprints/${selectedSprint.id}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTaskData,
          completed: false,
        }),
      })

      if (!response.ok) {
        setError('Failed to create task')
        setSaving(false)
        return
      }

      const newTask = await response.json()
      setTasks([...tasks, newTask])
      setNewTaskData({ title: '', description: '', week: 1 })
      setShowNewTaskForm(false)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Handle task completion toggle
  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/sprints/${selectedSprint?.id}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      })

      if (response.ok) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !completed } : t))
      }
    } catch (err) {
      console.error('Failed to update task')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading sprints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/dashboard" className="flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white">🎯 Execution Sprints</h1>
          <p className="text-slate-400 mt-2">Build a 4-week execution plan to launch your idea</p>
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

        {ideas.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <p className="text-slate-400 mb-4">No ideas yet. Create an idea first to build a sprint.</p>
            <Link href="/ideas/new">
              <Button className="bg-blue-600 hover:bg-blue-700">Create Your First Idea</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Idea & Sprint Selection */}
            <div className="lg:col-span-1 space-y-6">
              {/* Idea Selector */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Select Idea</h2>
                <select
                  value={selectedIdea}
                  onChange={(e) => setSelectedIdea(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ideas.map(idea => (
                    <option key={idea.id} value={idea.id}>
                      {idea.title}
                    </option>
                  ))}
                </select>
              </Card>

              {/* Sprints List */}
              <Card className="bg-slate-800 border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Sprints</h2>
                  <Button
                    onClick={() => setShowNewSprintForm(!showNewSprintForm)}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {showNewSprintForm && (
                  <form onSubmit={handleCreateSprint} className="mb-4 space-y-3 pb-4 border-b border-slate-700">
                    <input
                      type="text"
                      placeholder="Sprint title"
                      value={newSprintData.title}
                      onChange={(e) => setNewSprintData({ ...newSprintData, title: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={saving}
                    />
                    <textarea
                      placeholder="Description"
                      value={newSprintData.description}
                      onChange={(e) => setNewSprintData({ ...newSprintData, description: e.target.value })}
                      className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-16"
                      disabled={saving}
                    />
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        disabled={saving}
                      >
                        {saving ? 'Creating...' : 'Create'}
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        onClick={() => setShowNewSprintForm(false)}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="space-y-2">
                  {sprints.length === 0 ? (
                    <p className="text-slate-400 text-sm">No sprints yet</p>
                  ) : (
                    sprints.map(sprint => (
                      <button
                        key={sprint.id}
                        onClick={() => setSelectedSprint(sprint)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                          selectedSprint?.id === sprint.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        <p className="font-medium text-sm">{sprint.title}</p>
                        <p className="text-xs opacity-75">
                          {new Date(sprint.startDate).toLocaleDateString()}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </Card>

              {/* Sprint Stats */}
              {selectedSprint && (
                <Card className="bg-slate-800 border-slate-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Sprint Stats</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-slate-400 text-sm">Total Tasks</p>
                      <p className="text-2xl font-bold text-blue-400">{tasks.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Completed</p>
                      <p className="text-2xl font-bold text-green-400">
                        {tasks.filter(t => t.completed).length}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-sm">Progress</p>
                      <div className="w-full bg-slate-700 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{
                            width: tasks.length > 0
                              ? `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`
                              : '0%'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Content - Tasks */}
            <div className="lg:col-span-3">
              {!selectedSprint ? (
                <Card className="bg-slate-800 border-slate-700 p-12 text-center">
                  <p className="text-slate-400 mb-4">Create a sprint to get started</p>
                  <Button
                    onClick={() => setShowNewSprintForm(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Sprint
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Sprint Header */}
                  <Card className="bg-slate-800 border-slate-700 p-6">
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedSprint.title}</h2>
                    <p className="text-slate-400 mb-4">{selectedSprint.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {new Date(selectedSprint.startDate).toLocaleDateString()} - {new Date(selectedSprint.endDate).toLocaleDateString()}
                      </div>
                      <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-xs font-medium">
                        {selectedSprint.status}
                      </span>
                    </div>
                  </Card>

                  {/* Add Task Button */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-white">Tasks</h3>
                    <Button
                      onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Task
                    </Button>
                  </div>

                  {/* New Task Form */}
                  {showNewTaskForm && (
                    <Card className="bg-slate-800 border-slate-700 p-6">
                      <form onSubmit={handleCreateTask} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Task Title
                          </label>
                          <input
                            type="text"
                            placeholder="e.g., Build landing page"
                            value={newTaskData.title}
                            onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                            className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={saving}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Description
                          </label>
                          <textarea
                            placeholder="Task details"
                            value={newTaskData.description}
                            onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                            className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                            disabled={saving}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">
                            Week
                          </label>
                          <select
                            value={newTaskData.week}
                            onChange={(e) => setNewTaskData({ ...newTaskData, week: parseInt(e.target.value) })}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={saving}
                          >
                            <option value={1}>Week 1</option>
                            <option value={2}>Week 2</option>
                            <option value={3}>Week 3</option>
                            <option value={4}>Week 4</option>
                          </select>
                        </div>

                        <div className="flex gap-4">
                          <Button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={saving}
                          >
                            {saving ? 'Creating...' : 'Create Task'}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                            onClick={() => setShowNewTaskForm(false)}
                            disabled={saving}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Card>
                  )}

                  {/* Tasks by Week */}
                  {[1, 2, 3, 4].map(week => {
                    const weekTasks = tasks.filter(t => t.week === week)
                    return (
                      <Card key={week} className="bg-slate-800 border-slate-700 p-6">
                        <h4 className="text-lg font-semibold text-white mb-4">Week {week}</h4>
                        {weekTasks.length === 0 ? (
                          <p className="text-slate-400 text-sm">No tasks for this week</p>
                        ) : (
                          <div className="space-y-3">
                            {weekTasks.map(task => (
                              <div
                                key={task.id}
                                className="flex items-start gap-3 p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors"
                              >
                                <button
                                  onClick={() => handleToggleTask(task.id, task.completed)}
                                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                    task.completed
                                      ? 'bg-green-500 border-green-500'
                                      : 'border-slate-500 hover:border-green-500'
                                  }`}
                                >
                                  {task.completed && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                  )}
                                </button>
                                <div className="flex-1">
                                  <p className={`font-medium ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className="text-sm text-slate-400 mt-1">{task.description}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
