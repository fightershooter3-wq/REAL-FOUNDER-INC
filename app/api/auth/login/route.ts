import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth'

/**
 * POST /api/auth/login
 * Authenticate user with email and password
 * Returns user data if authentication successful
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Authenticate user
    const result = await authenticateUser(email, password)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      )
    }

    // Return success with user data
    return NextResponse.json(
      {
        message: 'Login successful',
        user: result.user,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
