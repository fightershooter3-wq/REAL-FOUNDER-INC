import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/financial-projections/[id]
 * Get a specific financial projection by idea ID
 * @param id - The startup idea ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Find projection by startup idea ID
    const projection = await prisma.financialProjection.findFirst({
      where: {
        startupIdeaId: id,
      },
    })

    if (!projection) {
      return NextResponse.json(
        { error: 'Financial projection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(projection)
  } catch (error) {
    console.error('Financial projection fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch financial projection' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/financial-projections/[id]
 * Update a financial projection
 * @param id - The financial projection ID
 * Body: { expectedUsers, pricing, monthlyCosts, revenueProjection, breakEvenEstimate, runwaySimulation }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { expectedUsers, pricing, monthlyCosts, revenueProjection, breakEvenEstimate, runwaySimulation } = body

    // Update financial projection
    const projection = await prisma.financialProjection.update({
      where: { id },
      data: {
        expectedUsers: expectedUsers ? parseInt(expectedUsers) : null,
        pricing: pricing ? parseFloat(pricing) : null,
        monthlyCosts: monthlyCosts ? parseFloat(monthlyCosts) : null,
        revenueProjection: revenueProjection || null,
        breakEvenEstimate: breakEvenEstimate || null,
        runwaySimulation: runwaySimulation || null,
      },
    })

    return NextResponse.json(projection)
  } catch (error) {
    console.error('Financial projection update error:', error)
    return NextResponse.json(
      { error: 'Failed to update financial projection' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/financial-projections/[id]
 * Delete a financial projection
 * @param id - The financial projection ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete financial projection
    await prisma.financialProjection.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Financial projection deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete financial projection' },
      { status: 500 }
    )
  }
}
