import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/execution-sprints/tasks/[id]
 * Get a specific task by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch task by ID
    const task = await prisma.sprintTask.findUnique({
      where: { id },
    })

    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Task fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/execution-sprints/tasks/[id]
 * Update a task
 * Body: { title?, description?, status?, priority?, dueDate? }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, description, status, priority, dueDate } = body

    // Check if task exists
    const existingTask = await prisma.sprintTask.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Update task with provided fields
    const updatedTask = await prisma.sprintTask.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(dueDate && { dueDate }),
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Task update error:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/execution-sprints/tasks/[id]
 * Delete a task
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if task exists
    const existingTask = await prisma.sprintTask.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      )
    }

    // Delete task
    await prisma.sprintTask.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Task deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Task deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
