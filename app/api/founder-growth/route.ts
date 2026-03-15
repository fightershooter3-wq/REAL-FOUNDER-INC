import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/founder-growth
 * Create a new growth metric
 * Body: { userId, category, metric, value, unit, date, notes? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, category, metric, value, unit, date, notes } = body

    // Validate required fields
    if (!userId || !category || !metric || value === undefined || !unit) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, category, metric, value, unit' },
        { status: 400 }
      )
    }

    // Create growth metric
    const growthMetric = await prisma.founderGrowthMetric.create({
      data: {
        userId,
        category,
        metric,
        value: parseFloat(value.toString()),
        unit,
        date: date || new Date().toISOString().split('T')[0],
        notes: notes || null,
      },
    })

    return NextResponse.json(growthMetric, { status: 201 })
  } catch (error) {
    console.error('Growth metric creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create growth metric' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/founder-growth
 * Get all growth metrics for a user
 * Query: userId, category? (optional filter)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const category = searchParams.get('category')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Build query filter
    const where: any = { userId }
    if (category) {
      where.category = category
    }

    // Fetch metrics for user, ordered by most recent first
    const metrics = await prisma.founderGrowthMetric.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Growth metric fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch growth metrics' },
      { status: 500 }
    )
  }
}
