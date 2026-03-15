import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/profile
 * Create a new founder profile for a user
 * Body: { userId, bio, skills, experience, achievements, goals, mentors }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, bio, skills, experience, achievements, goals, mentors } = body

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Create profile
    const profile = await prisma.founderProfile.create({
      data: {
        userId,
        bio: bio || '',
        skills: skills || '',
        experience: experience || '',
        achievements: achievements || '',
        goals: goals || '',
        mentors: mentors || '',
      },
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Profile creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/profile
 * Get all profiles (admin only - optional)
 */
export async function GET() {
  try {
    const profiles = await prisma.founderProfile.findMany()
    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profiles' },
      { status: 500 }
    )
  }
}
