/**
 * Prisma Client Singleton
 * Ensures only one instance of Prisma Client is created across the application
 * This prevents connection pool exhaustion in development
 */

import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
