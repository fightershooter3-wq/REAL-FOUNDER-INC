import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/competitors/[id]
 * Get a specific competitor analysis
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const competitor = await prisma.competitorAnalysis.findUnique({
      where: { id: params.id },
    })

    if (!competitor) {
      return NextResponse.json(
        { error: 'Competitor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(competitor)
  } catch (error) {
    console.error('Competitor fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitor' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/competitors/[id]
 * Update a competitor analysis
 * Body: { competitorName, strengths, weaknesses, differentiationMap }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { competitorName, strengths, weaknesses, differentiationMap } = body

    // Update competitor
    const competitor = await prisma.competitorAnalysis.update({
      where: { id: params.id },
      data: {
        competitorName: competitorName || undefined,
        strengths: strengths || undefined,
        weaknesses: weaknesses || undefined,
        differentiationMap: differentiationMap || undefined,
      },
    })

    return NextResponse.json(competitor)
  } catch (error) {
    console.error('Competitor update error:', error)
    return NextResponse.json(
      { error: 'Failed to update competitor' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/competitors/[id]
 * Delete a competitor analysis
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.competitorAnalysis.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Competitor deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete competitor' },
      { status: 500 }
    )
  }
}
