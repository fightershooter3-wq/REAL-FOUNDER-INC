import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/profile/[id]
 * Get a specific founder profile by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await prisma.founderProfile.findUnique({
      where: { id: params.id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/profile/[id]
 * Update a founder profile
 * Body: { bio, skills, experience, achievements, goals, mentors }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { bio, skills, experience, achievements, goals, mentors } = body

    // Update profile
    const profile = await prisma.founderProfile.update({
      where: { id: params.id },
      data: {
        bio: bio || undefined,
        skills: skills || undefined,
        experience: experience || undefined,
        achievements: achievements || undefined,
        goals: goals || undefined,
        mentors: mentors || undefined,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/profile/[id]
 * Delete a founder profile
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.founderProfile.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete profile' },
      { status: 500 }
    )
  }
}
