import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/pitch-deck
 * Create a new pitch deck for an idea
 * Body: { ideaId, userId, slides }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ideaId, userId, slides } = body

    // Validate required fields
    if (!ideaId || !userId) {
      return NextResponse.json(
        { error: 'Idea ID and User ID are required' },
        { status: 400 }
      )
    }

    // Create pitch deck
    const pitchDeck = await prisma.pitchDeck.create({
      data: {
        userId,
        startupIdeaId: ideaId,
        slides: slides || [],
      },
    })

    return NextResponse.json(pitchDeck, { status: 201 })
  } catch (error) {
    console.error('Pitch deck creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create pitch deck' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/pitch-deck
 * Get all pitch decks
 */
export async function GET() {
  try {
    const pitchDecks = await prisma.pitchDeck.findMany()
    return NextResponse.json(pitchDecks)
  } catch (error) {
    console.error('Pitch deck fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pitch decks' },
      { status: 500 }
    )
  }
}
