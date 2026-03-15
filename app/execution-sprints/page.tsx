'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, ArrowLeft, Plus, CheckCircle2, Circle, Trash2, Edit2, Calendar, Flag, Users } from 'lucide-react'

interface Task {
  id: string
  sprintId: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assignee?: string
  dueDate?: string
  createdAt: string
}

interface Sprint {
  id: string
  userId: string
  name: string
  startDate: string
  endDate: string
  goal: string
  status: 'planning' | 'active' | 'completed'
  tasks: Task[]
  createdAt: string
}

export default function ExecutionSprintsPage() {
  const router = useRouter()
  const [user, setUser] = useState<unknown>(null)
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')

  // Check authentication and fetch sprints
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

        // Fetch user's sprints
        const response = await fetch(`/api/execution-sprints?userId=${userData.id}`)
        if (response.ok) {
          const sprintsData = await response.json()
          setSprints(sprintsData)
          if (sprintsData.length > 0) {
            setSelectedSprint(sprintsData[0])
          }
        }
      } catch (err) {
        setError('Failed to load sprints')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Handle add task
  const handleAddTask = async () => {
    if (!selectedSprint || !newTaskTitle.trim()) return

    try {
      const response = await fetch('/api/execution-sprints/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sprintId: selectedSprint.id,
          title: newTaskTitle,
          description: newTaskDescription,
          priority: newTaskPriority,
          status: 'todo',
        }),
      })

      if (response.ok) {
        const newTask = await response.json()
        setSelectedSprint(prev => prev ? {
          ...prev,
          tasks: [newTask, ...prev.tasks],
        } : null)
        setNewTaskTitle('')
        setNewTaskDescription('')
        setNewTaskPriority('medium')
        setIsCreatingTask(false)
      }
    } catch (err) {
      setError('Failed to add task')
    }
  }

  // Handle toggle task status
  const handleToggleTask = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    
    try {
      const response = await fetch(`/api/execution-sprints/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setSelectedSprint(prev => prev ? {
          ...prev,
          tasks: prev.tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t),
        } : null)
      }
    } catch (err) {
      setError('Failed to update task')
    }
  }

  // Handle delete task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`/api/execution-sprints/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSelectedSprint(prev => prev ? {
          ...prev,
          tasks: prev.tasks.filter(t => t.id !== taskId),
        } : null)
      }
    } catch (err) {
      setError('Failed to delete task')
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
  }

  // Get status stats
  const getSprintStats = (sprint: Sprint) => {
    const total = sprint.tasks.length
    const completed = sprint.tasks.filter(t => t.status === 'completed').length
    const inProgress = sprint.tasks.filter(t => t.status === 'in-progress').length
    const todo = sprint.tasks.filter(t => t.status === 'todo').length
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0

    return { total, completed, inProgress, todo, progress }
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

  if (!user) {
    return null
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
          <h1 className="text-3xl font-bold text-white">⚡ Execution Sprints</h1>
          <p className="text-slate-400 mt-2">Plan and track your weekly execution goals</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sprints List */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700 p-4 sticky top-4">
              <h3 className="text-lg font-semibold text-white mb-4">Sprints ({sprints.length})</h3>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-4">
                <Plus className="w-4 h-4 mr-2" />
                New Sprint
              </Button>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {sprints.map((sprint) => {
                  const stats = getSprintStats(sprint)
                  const isSelected = selectedSprint?.id === sprint.id

                  return (
                    <button
                      key={sprint.id}
                      onClick={() => setSelectedSprint(sprint)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      <div className="text-sm font-medium">{sprint.name}</div>
                      <div className="text-xs text-slate-400 mt-1">
                        {stats.completed}/{stats.total} tasks
                      </div>
                      <div className="w-full bg-slate-600 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-green-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${stats.progress}%` }}
                        ></div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Sprint Details */}
          <div className="lg:col-span-3">
            {selectedSprint ? (
              <>
                {/* Sprint Header */}
                <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedSprint.name}</h2>
                      <p className="text-slate-400 mb-4">{selectedSprint.goal}</p>
                      <div className="flex gap-4 text-sm text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {selectedSprint.startDate} to {selectedSprint.endDate}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedSprint.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : selectedSprint.status === 'completed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {selectedSprint.status.charAt(0).toUpperCase() + selectedSprint.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-300">Progress</span>
                      <span className="text-sm font-semibold text-white">
                        {getSprintStats(selectedSprint).progress}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                        style={{ width: `${getSprintStats(selectedSprint).progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                      <p className="text-2xl font-bold text-white">
                        {getSprintStats(selectedSprint).total}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Total Tasks</p>
                    </div>
                    <div className="bg-green-500/20 rounded-lg p-3 text-center border border-green-500/30">
                      <p className="text-2xl font-bold text-green-400">
                        {getSprintStats(selectedSprint).completed}
                      </p>
                      <p className="text-xs text-green-400 mt-1">Completed</p>
                    </div>
                    <div className="bg-blue-500/20 rounded-lg p-3 text-center border border-blue-500/30">
                      <p className="text-2xl font-bold text-blue-400">
                        {getSprintStats(selectedSprint).inProgress}
                      </p>
                      <p className="text-xs text-blue-400 mt-1">In Progress</p>
                    </div>
                    <div className="bg-yellow-500/20 rounded-lg p-3 text-center border border-yellow-500/30">
                      <p className="text-2xl font-bold text-yellow-400">
                        {getSprintStats(selectedSprint).todo}
                      </p>
                      <p className="text-xs text-yellow-400 mt-1">To Do</p>
                    </div>
                  </div>
                </Card>

                {/* Add Task Form */}
                {isCreatingTask ? (
                  <Card className="bg-slate-800 border-slate-700 p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Add New Task</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Task Title
                        </label>
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="e.g., Complete user interviews"
                          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Description (optional)
                        </label>
                        <textarea
                          value={newTaskDescription}
                          onChange={(e) => setNewTaskDescription(e.target.value)}
                          placeholder="Add more details about this task..."
                          className="w-full bg-slate-700 border border-slate-600 text-white placeholder-slate-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-20"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Priority
                        </label>
                        <select
                          value={newTaskPriority}
                          onChange={(e) => setNewTaskPriority(e.target.value as any)}
                          className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleAddTask}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Add Task
                        </Button>
                        <Button
                          onClick={() => setIsCreatingTask(false)}
                          variant="outline"
                          className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Button
                    onClick={() => setIsCreatingTask(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 mb-6"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                )}

                {/* Tasks List */}
                <div className="space-y-3">
                  {selectedSprint.tasks.length > 0 ? (
                    selectedSprint.tasks.map((task) => (
                      <Card
                        key={task.id}
                        className={`bg-slate-800 border-slate-700 p-4 cursor-pointer transition-all hover:bg-slate-750 ${
                          task.status === 'completed' ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => handleToggleTask(task)}
                            className="mt-1 flex-shrink-0"
                          >
                            {task.status === 'completed' ? (
                              <CheckCircle2 className="w-6 h-6 text-green-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-slate-500 hover:text-slate-400" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-semibold ${
                              task.status === 'completed'
                                ? 'text-slate-400 line-through'
                                : 'text-white'
                            }`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-slate-400 mt-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex gap-2 mt-3 flex-wrap">
                              <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(task.priority)}`}>
                                <Flag className="w-3 h-3 inline mr-1" />
                                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                              </span>
                              {task.dueDate && (
                                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                                  <Calendar className="w-3 h-3 inline mr-1" />
                                  {task.dueDate}
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="flex-shrink-0 text-slate-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="bg-slate-800 border-slate-700 p-8 text-center">
                      <p className="text-slate-400 mb-4">No tasks yet. Create your first task!</p>
                      <Button
                        onClick={() => setIsCreatingTask(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Task
                      </Button>
                    </Card>
                  )}
                </div>
              </>
            ) : (
              <Card className="bg-slate-800 border-slate-700 p-12 text-center">
                <p className="text-slate-400 mb-4">No sprints yet. Create your first sprint!</p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Sprint
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
