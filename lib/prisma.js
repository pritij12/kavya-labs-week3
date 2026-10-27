import { PrismaClient } from '@prisma/client';

// One database connection, reused (important on Vercel and while developing)
export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;
