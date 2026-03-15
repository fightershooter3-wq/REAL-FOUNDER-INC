import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/ideas - Fetch user's startup ideas
 * Query params:
 *   - userId: Filter ideas by user ID
 *   - status: Filter by idea status (draft, validating, validated, building)
 * 
 * Returns: Array of startup ideas with metadata
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // Build query filter based on parameters
    const where: any = { userId }
    if (status) {
      where.status = status
    }

    // Fetch ideas from database
    const ideas = await prisma.startupIdea.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        progressPercentage: true,
        executionStreak: true,
        createdAt: true,
      },
    })

    return NextResponse.json(ideas)
  } catch (error) {
    console.error('Error fetching ideas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/ideas - Create a new startup idea
 * Body:
 *   - userId: User ID (required)
 *   - title: Idea title (required)
 *   - description: Idea description (required)
 *   - status: Initial status (default: 'draft')
 * 
 * Returns: Created idea object with ID
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, title, description, status = 'draft' } = body

    // Validate required fields
    if (!userId || !title || !description) {
      return NextResponse.json(
        { error: 'userId, title, and description are required' },
        { status: 400 }
      )
    }

    // Create new idea in database
    const idea = await prisma.startupIdea.create({
      data: {
        userId,
        title,
        description,
        status,
        progressPercentage: 0,
        executionStreak: 0,
      },
    })

    return NextResponse.json(idea, { status: 201 })
  } catch (error) {
    console.error('Error creating idea:', error)
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    )
  }
}
