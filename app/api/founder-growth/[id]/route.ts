import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/founder-growth/[id]
 * Get a specific growth metric by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch metric by ID
    const metric = await prisma.founderGrowthMetric.findUnique({
      where: { id },
    })

    if (!metric) {
      return NextResponse.json(
        { error: 'Growth metric not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(metric)
  } catch (error) {
    console.error('Growth metric fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch growth metric' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/founder-growth/[id]
 * Update a growth metric
 * Body: { category?, metric?, value?, unit?, date?, notes? }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { category, metric, value, unit, date, notes } = body

    // Check if metric exists
    const existingMetric = await prisma.founderGrowthMetric.findUnique({
      where: { id },
    })

    if (!existingMetric) {
      return NextResponse.json(
        { error: 'Growth metric not found' },
        { status: 404 }
      )
    }

    // Update metric with provided fields
    const updatedMetric = await prisma.founderGrowthMetric.update({
      where: { id },
      data: {
        ...(category && { category }),
        ...(metric && { metric }),
        ...(value !== undefined && { value: parseFloat(value.toString()) }),
        ...(unit && { unit }),
        ...(date && { date }),
        ...(notes !== undefined && { notes }),
      },
    })

    return NextResponse.json(updatedMetric)
  } catch (error) {
    console.error('Growth metric update error:', error)
    return NextResponse.json(
      { error: 'Failed to update growth metric' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/founder-growth/[id]
 * Delete a growth metric
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if metric exists
    const existingMetric = await prisma.founderGrowthMetric.findUnique({
      where: { id },
    })

    if (!existingMetric) {
      return NextResponse.json(
        { error: 'Growth metric not found' },
        { status: 404 }
      )
    }

    // Delete metric
    await prisma.founderGrowthMetric.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Growth metric deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Growth metric deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete growth metric' },
      { status: 500 }
    )
  }
}
