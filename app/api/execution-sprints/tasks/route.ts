import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/execution-sprints/tasks
 * Create a new task in a sprint
 * Body: { sprintId, title, description, status, priority }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sprintId, title, description, status, priority } = body

    // Validate required fields
    if (!sprintId || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: sprintId, title' },
        { status: 400 }
      )
    }

    // Create task
    const task = await prisma.sprintTask.create({
      data: {
        sprintId,
        title,
        description: description || '',
        status: status || 'todo',
        priority: priority || 'medium',
      },
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Task creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/execution-sprints/tasks
 * Get all tasks for a sprint
 * Query: sprintId
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sprintId = searchParams.get('sprintId')

    if (!sprintId) {
      return NextResponse.json(
        { error: 'Sprint ID is required' },
        { status: 400 }
      )
    }

    // Fetch tasks for sprint
    const tasks = await prisma.sprintTask.findMany({
      where: { sprintId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Task fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}
