import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/pitch-deck/[id]
 * Get a specific pitch deck by idea ID
 * @param id - The startup idea ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Find pitch deck by startup idea ID
    const pitchDeck = await prisma.pitchDeck.findFirst({
      where: {
        startupIdeaId: id,
      },
    })

    if (!pitchDeck) {
      return NextResponse.json(
        { error: 'Pitch deck not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(pitchDeck)
  } catch (error) {
    console.error('Pitch deck fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pitch deck' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/pitch-deck/[id]
 * Update a pitch deck
 * @param id - The pitch deck ID
 * Body: { slides }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { slides } = body

    // Update pitch deck
    const pitchDeck = await prisma.pitchDeck.update({
      where: { id },
      data: {
        slides: slides || [],
      },
    })

    return NextResponse.json(pitchDeck)
  } catch (error) {
    console.error('Pitch deck update error:', error)
    return NextResponse.json(
      { error: 'Failed to update pitch deck' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/pitch-deck/[id]
 * Delete a pitch deck
 * @param id - The pitch deck ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete pitch deck
    await prisma.pitchDeck.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Pitch deck deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete pitch deck' },
      { status: 500 }
    )
  }
}
