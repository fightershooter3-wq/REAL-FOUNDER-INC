import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/market-research/[id]
 * Get market research for a specific idea
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const research = await prisma.startupIdea.findUnique({
      where: { id: params.id },
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

    if (!research) {
      return NextResponse.json(
        { error: 'Market research not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(research)
  } catch (error) {
    console.error('Market research fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market research' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/market-research/[id]
 * Update market research for an idea
 * Body: { tam, sam, som, demandIndicators, marketTrends, entryStrategies }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { tam, sam, som, demandIndicators, marketTrends, entryStrategies } = body

    // Update market research
    const research = await prisma.startupIdea.update({
      where: { id: params.id },
      data: {
        tam: tam || undefined,
        sam: sam || undefined,
        som: som || undefined,
        demandIndicators: demandIndicators || undefined,
        marketTrends: marketTrends || undefined,
        entryStrategies: entryStrategies || undefined,
      },
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
    console.error('Market research update error:', error)
    return NextResponse.json(
      { error: 'Failed to update market research' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/market-research/[id]
 * Delete market research for an idea
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.startupIdea.update({
      where: { id: params.id },
      data: {
        tam: '',
        sam: '',
        som: '',
        demandIndicators: '',
        marketTrends: '',
        entryStrategies: '',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Market research deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete market research' },
      { status: 500 }
    )
  }
}
