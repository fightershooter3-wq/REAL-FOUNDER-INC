import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/sprints
 * Fetch execution sprints for a startup idea
 */
export async function GET(request: NextRequest) {
  try {
    const ideaId = request.nextUrl.searchParams.get('ideaId')

    if (!ideaId) {
      return NextResponse.json(
        { error: 'ideaId is required' },
        { status: 400 }
      )
    }

    // Fetch sprints with tasks
    const sprints = await prisma.executionSprint.findMany({
      where: { startupIdeaId: ideaId },
      include: { tasks: true },
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json(sprints, { status: 200 })
  } catch (error) {
    console.error('Error fetching sprints:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sprints' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/sprints
 * Create a new execution sprint
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      startupIdeaId,
      sprintNumber,
      title,
      startDate,
      endDate,
      weeklyDeliverables,
      measurableOutcomes,
    } = body

    // Validate required fields
    if (!startupIdeaId || !sprintNumber || !title || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create sprint
    const sprint = await prisma.executionSprint.create({
      data: {
        startupIdeaId,
        sprintNumber,
        title,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        weeklyDeliverables,
        measurableOutcomes,
      },
    })

    return NextResponse.json(
      {
        message: 'Sprint created successfully',
        sprint,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating sprint:', error)
    return NextResponse.json(
      { error: 'Failed to create sprint' },
      { status: 500 }
    )
  }
}
