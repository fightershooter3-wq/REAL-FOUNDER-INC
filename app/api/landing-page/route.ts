import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/landing-page
 * Create a new landing page config for an idea
 * Body: { ideaId, userId, headline, subheadline, ctaText, ctaLink, features, heroImageUrl, colorScheme }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ideaId, userId, headline, subheadline, ctaText, ctaLink, features, heroImageUrl, colorScheme } = body

    // Validate required fields
    if (!ideaId || !userId) {
      return NextResponse.json(
        { error: 'Idea ID and User ID are required' },
        { status: 400 }
      )
    }

    // Create landing page config
    const landingPage = await prisma.landingPageConfig.create({
      data: {
        userId,
        startupIdeaId: ideaId,
        headline: headline || '',
        subheadline: subheadline || '',
        ctaText: ctaText || '',
        ctaLink: ctaLink || '',
        features: features || [],
        heroImageUrl: heroImageUrl || '',
        colorScheme: colorScheme || 'blue',
      },
    })

    return NextResponse.json(landingPage, { status: 201 })
  } catch (error) {
    console.error('Landing page creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create landing page' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/landing-page
 * Get all landing page configs
 */
export async function GET() {
  try {
    const landingPages = await prisma.landingPageConfig.findMany()
    return NextResponse.json(landingPages)
  } catch (error) {
    console.error('Landing page fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch landing pages' },
      { status: 500 }
    )
  }
}
