import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/financial-projections
 * Create a new financial projection for an idea
 * Body: { ideaId, userId, expectedUsers, pricing, monthlyCosts, revenueProjection, breakEvenEstimate, runwaySimulation }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ideaId, userId, expectedUsers, pricing, monthlyCosts, revenueProjection, breakEvenEstimate, runwaySimulation } = body

    // Validate required fields
    if (!ideaId || !userId) {
      return NextResponse.json(
        { error: 'Idea ID and User ID are required' },
        { status: 400 }
      )
    }

    // Create financial projection
    const projection = await prisma.financialProjection.create({
      data: {
        userId,
        startupIdeaId: ideaId,
        expectedUsers: expectedUsers ? parseInt(expectedUsers) : null,
        pricing: pricing ? parseFloat(pricing) : null,
        monthlyCosts: monthlyCosts ? parseFloat(monthlyCosts) : null,
        revenueProjection: revenueProjection || null,
        breakEvenEstimate: breakEvenEstimate || null,
        runwaySimulation: runwaySimulation || null,
      },
    })

    return NextResponse.json(projection, { status: 201 })
  } catch (error) {
    console.error('Financial projection creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create financial projection' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/financial-projections
 * Get all financial projections
 */
export async function GET() {
  try {
    const projections = await prisma.financialProjection.findMany()
    return NextResponse.json(projections)
  } catch (error) {
    console.error('Financial projection fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch financial projections' },
      { status: 500 }
    )
  }
}
