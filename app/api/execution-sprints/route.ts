import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/execution-sprints
 * Create a new execution sprint
 * Body: { userId, name, startDate, endDate, goal, status }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, name, startDate, endDate, goal, status } = body

    // Validate required fields
    if (!userId || !name || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, name, startDate, endDate' },
        { status: 400 }
      )
    }

    // Create sprint
    const sprint = await prisma.executionSprint.create({
      data: {
        userId,
        name,
        startDate,
        endDate,
        goal: goal || '',
        status: status || 'planning',
      },
      include: {
        tasks: true,
      },
    })

    return NextResponse.json(sprint, { status: 201 })
  } catch (error) {
    console.error('Sprint creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create sprint' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/execution-sprints
 * Get all sprints for a user
 * Query: userId
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Fetch sprints for user, ordered by most recent first
    const sprints = await prisma.executionSprint.findMany({
      where: { userId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(sprints)
  } catch (error) {
    console.error('Sprint fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sprints' },
      { status: 500 }
    )
  }
}
