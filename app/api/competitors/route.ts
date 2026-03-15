import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/competitors
 * Create a new competitor analysis entry
 * Body: { ideaId, competitorName, strengths, weaknesses, differentiationMap }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ideaId, userId, competitorName, strengths, weaknesses, differentiationMap } = body

    // Validate required fields
    if (!ideaId || !competitorName) {
      return NextResponse.json(
        { error: 'Idea ID and competitor name are required' },
        { status: 400 }
      )
    }

    // Create competitor analysis
    const competitor = await prisma.competitorAnalysis.create({
      data: {
        userId: userId || '',
        startupIdeaId: ideaId,
        competitorName,
        strengths: strengths || '',
        weaknesses: weaknesses || '',
        differentiationMap: differentiationMap || '',
      },
    })

    return NextResponse.json(competitor, { status: 201 })
  } catch (error) {
    console.error('Competitor creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create competitor analysis' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/competitors
 * Get competitors for a specific idea
 * Query: ideaId
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ideaId = searchParams.get('ideaId')

    if (!ideaId) {
      return NextResponse.json(
        { error: 'Idea ID is required' },
        { status: 400 }
      )
    }

    const competitors = await prisma.competitorAnalysis.findMany({
      where: { startupIdeaId: ideaId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(competitors)
  } catch (error) {
    console.error('Competitor fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitors' },
      { status: 500 }
    )
  }
}
