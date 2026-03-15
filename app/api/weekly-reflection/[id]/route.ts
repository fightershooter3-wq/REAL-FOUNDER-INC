import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/weekly-reflection/[id]
 * Get a specific weekly reflection by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch reflection by ID
    const reflection = await prisma.weeklyReflection.findUnique({
      where: { id },
    })

    if (!reflection) {
      return NextResponse.json(
        { error: 'Weekly reflection not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(reflection)
  } catch (error) {
    console.error('Weekly reflection fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch weekly reflection' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/weekly-reflection/[id]
 * Update a weekly reflection
 * Body: { weekStartDate, weekEndDate, wins, challenges, learnings, nextWeekGoals, mood }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { weekStartDate, weekEndDate, wins, challenges, learnings, nextWeekGoals, mood } = body

    // Check if reflection exists
    const existingReflection = await prisma.weeklyReflection.findUnique({
      where: { id },
    })

    if (!existingReflection) {
      return NextResponse.json(
        { error: 'Weekly reflection not found' },
        { status: 404 }
      )
    }

    // Update reflection with provided fields
    const updatedReflection = await prisma.weeklyReflection.update({
      where: { id },
      data: {
        ...(weekStartDate && { weekStartDate }),
        ...(weekEndDate && { weekEndDate }),
        ...(wins !== undefined && { wins }),
        ...(challenges !== undefined && { challenges }),
        ...(learnings !== undefined && { learnings }),
        ...(nextWeekGoals !== undefined && { nextWeekGoals }),
        ...(mood && { mood }),
      },
    })

    return NextResponse.json(updatedReflection)
  } catch (error) {
    console.error('Weekly reflection update error:', error)
    return NextResponse.json(
      { error: 'Failed to update weekly reflection' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/weekly-reflection/[id]
 * Delete a weekly reflection
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if reflection exists
    const existingReflection = await prisma.weeklyReflection.findUnique({
      where: { id },
    })

    if (!existingReflection) {
      return NextResponse.json(
        { error: 'Weekly reflection not found' },
        { status: 404 }
      )
    }

    // Delete reflection
    await prisma.weeklyReflection.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Weekly reflection deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Weekly reflection deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete weekly reflection' },
      { status: 500 }
    )
  }
}
