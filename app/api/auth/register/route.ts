import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth'

/**
 * POST /api/auth/register
 * Register a new user with email, username, password, and optional name
 * Validates input and creates user in database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, confirmPassword, name } = body

    // Validate required fields
    if (!email || !username || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Validate username length
    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      )
    }

    // Register user
    const result = await registerUser(email, username, password, name)

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Return success with user data
    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: result.user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
