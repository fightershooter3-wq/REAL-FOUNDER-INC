import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/market-research
 * Create a new market research entry for an idea
 * Body: { ideaId, tam, sam, som, demandIndicators, marketTrends, entryStrategies }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ideaId, tam, sam, som, demandIndicators, marketTrends, entryStrategies } = body

    // Validate required fields
    if (!ideaId) {
      return NextResponse.json(
        { error: 'Idea ID is required' },
        { status: 400 }
      )
    }

    // Create market research entry
    const research = await prisma.startupIdea.update({
      where: { id: ideaId },
      data: {
        tam: tam || '',
        sam: sam || '',
        som: som || '',
        demandIndicators: demandIndicators || '',
        marketTrends: marketTrends || '',
        entryStrategies: entryStrategies || '',
      },
    })

    return NextResponse.json(research, { status: 201 })
  } catch (error) {
    console.error('Market research creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create market research' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/market-research
 * Get all market research entries
 */
export async function GET() {
  try {
    const research = await prisma.startupIdea.findMany({
      select: {
        id: true,
        title: true,
        tam: true,
        sam: true,
        som: true,
        demandIndicators: true,
        marketTrends: true,
        entryStrategies: true,
      },
    })
    return NextResponse.json(research)
  } catch (error) {
    console.error('Market research fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market research' },
      { status: 500 }
    )
  }
}
