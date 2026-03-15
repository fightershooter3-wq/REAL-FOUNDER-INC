import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/ideas/[id] - Fetch a specific startup idea
 * Params:
 *   - id: Idea ID (required)
 * 
 * Returns: Complete idea object with all details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Fetch idea from database
    const idea = await prisma.startupIdea.findUnique({
      where: { id },
      include: {
        leanCanvas: true,
        executionSprints: {
          include: {
            tasks: true,
          },
        },
      },
    })

    // Return 404 if idea not found
    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Error fetching idea:', error)
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/ideas/[id] - Update a startup idea
 * Params:
 *   - id: Idea ID (required)
 * Body:
 *   - title: Updated title (optional)
 *   - description: Updated description (optional)
 *   - status: Updated status (optional)
 *   - progressPercentage: Updated progress (optional)
 * 
 * Returns: Updated idea object
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Update idea in database with provided fields
    const idea = await prisma.startupIdea.update({
      where: { id },
      data: body,
    })

    return NextResponse.json(idea)
  } catch (error) {
    console.error('Error updating idea:', error)
    return NextResponse.json(
      { error: 'Failed to update idea' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/ideas/[id] - Delete a startup idea
 * Params:
 *   - id: Idea ID (required)
 * 
 * Returns: Success message
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete idea and all related data (cascading delete)
    await prisma.startupIdea.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting idea:', error)
    return NextResponse.json(
      { error: 'Failed to delete idea' },
      { status: 500 }
    )
  }
}
