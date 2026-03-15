import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/weekly-reflection
 * Create a new weekly reflection
 * Body: { userId, weekStartDate, weekEndDate, wins, challenges, learnings, nextWeekGoals, mood }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, weekStartDate, weekEndDate, wins, challenges, learnings, nextWeekGoals, mood } = body

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Create weekly reflection
    const reflection = await prisma.weeklyReflection.create({
      data: {
        userId,
        weekStartDate: weekStartDate || new Date().toISOString().split('T')[0],
        weekEndDate: weekEndDate || new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        wins: wins || '',
        challenges: challenges || '',
        learnings: learnings || '',
        nextWeekGoals: nextWeekGoals || '',
        mood: mood || 'neutral',
      },
    })

    return NextResponse.json(reflection, { status: 201 })
  } catch (error) {
    console.error('Weekly reflection creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create weekly reflection' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/weekly-reflection
 * Get all weekly reflections for a user
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

    // Fetch reflections for user, ordered by most recent first
    const reflections = await prisma.weeklyReflection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(reflections)
  } catch (error) {
    console.error('Weekly reflection fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly reflections' },
      { status: 500 }
    )
  }
}
