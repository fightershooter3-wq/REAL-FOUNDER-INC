import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/validation
 * Fetch validation logs for a startup idea
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

    // Fetch validation logs
    const logs = await prisma.validationLog.findMany({
      where: { startupIdeaId: ideaId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(logs, { status: 200 })
  } catch (error) {
    console.error('Error fetching validation logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch validation logs' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/validation
 * Create a new validation log entry
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      userId,
      startupIdeaId,
      conversationSummary,
      feedback,
      iterationsMade,
      validationScore,
      learningLog,
    } = body

    // Validate required fields
    if (!userId || !startupIdeaId || !conversationSummary) {
      return NextResponse.json(
        { error: 'userId, startupIdeaId, and conversationSummary are required' },
        { status: 400 }
      )
    }

    // Create validation log
    const log = await prisma.validationLog.create({
      data: {
        userId,
        startupIdeaId,
        conversationSummary,
        feedback,
        iterationsMade: iterationsMade || 0,
        validationScore,
        learningLog,
      },
    })

    return NextResponse.json(
      {
        message: 'Validation log created successfully',
        log,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating validation log:', error)
    return NextResponse.json(
      { error: 'Failed to create validation log' },
      { status: 500 }
    )
  }
}
