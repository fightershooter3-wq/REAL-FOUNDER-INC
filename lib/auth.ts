import bcrypt from 'bcryptjs'
import { prisma } from './db'

/**
 * Hash a password using bcrypt
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password
 * @param hash - Hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Register a new user
 * @param email - User email
 * @param username - User username
 * @param password - Plain text password
 * @param name - User full name
 * @returns Created user object or error
 */
export async function registerUser(
  email: string,
  username: string,
  password: string,
  name?: string
) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      return {
        error: 'Email or username already exists',
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        name,
      },
    })

    // Create founder growth tracker for new user
    await prisma.founderGrowth.create({
      data: {
        userId: user.id,
      },
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    }
  } catch (error) {
    return {
      error: 'Failed to register user',
    }
  }
}

/**
 * Authenticate user with email and password
 * @param email - User email
 * @param password - Plain text password
 * @returns User object if authentication successful, error otherwise
 */
export async function authenticateUser(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return {
        error: 'Invalid email or password',
      }
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash)

    if (!isPasswordValid) {
      return {
        error: 'Invalid email or password',
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
      },
    }
  } catch (error) {
    return {
      error: 'Authentication failed',
    }
  }
}
