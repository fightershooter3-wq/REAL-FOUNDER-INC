import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/landing-page/[id]
 * Get a specific landing page config by idea ID
 * @param id - The startup idea ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Find landing page config by startup idea ID
    const landingPage = await prisma.landingPageConfig.findFirst({
      where: {
        startupIdeaId: id,
      },
    })

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(landingPage)
  } catch (error) {
    console.error('Landing page fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch landing page' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/landing-page/[id]
 * Update a landing page config
 * @param id - The landing page config ID
 * Body: { headline, subheadline, ctaText, ctaLink, features, heroImageUrl, colorScheme }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { headline, subheadline, ctaText, ctaLink, features, heroImageUrl, colorScheme } = body

    // Update landing page config
    const landingPage = await prisma.landingPageConfig.update({
      where: { id },
      data: {
        headline: headline || '',
        subheadline: subheadline || '',
        ctaText: ctaText || '',
        ctaLink: ctaLink || '',
        features: features || [],
        heroImageUrl: heroImageUrl || '',
        colorScheme: colorScheme || 'blue',
      },
    })

    return NextResponse.json(landingPage)
  } catch (error) {
    console.error('Landing page update error:', error)
    return NextResponse.json(
      { error: 'Failed to update landing page' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/landing-page/[id]
 * Delete a landing page config
 * @param id - The landing page config ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Delete landing page config
    await prisma.landingPageConfig.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Landing page deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete landing page' },
      { status: 500 }
    )
  }
}
