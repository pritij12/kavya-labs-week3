import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from './prisma';

// WEEK 3: Google login + users saved in the database + roles (USER / ADMIN)
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login', error: '/login' },
  callbacks: {
    // Suspended users cannot sign in
    async signIn({ user }) {
      if (!user?.email) return false;
      try {
        const saved = await prisma.user.findUnique({ where: { email: user.email } });
        return saved?.status !== 'SUSPENDED';
      } catch {
        return true;
      }
    },
    // Read the latest role and status from the database
    async jwt({ token }) {
      if (token.sub) {
        try {
          const saved = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { role: true, status: true },
          });
          token.role = saved?.role || 'USER';
          token.status = saved?.status || 'ACTIVE';
        } catch {
          token.role = token.role || 'USER';
          token.status = token.status || 'ACTIVE';
        }
      }
      return token;
    },
    // Make id, role and status available in the session
    session({ session, token }) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.status = token.status;
      return session;
    },
  },
  events: {
    // The person whose email is ADMIN_EMAIL becomes the first admin
    async createUser({ user }) {
      const adminEmail = (process.env.ADMIN_EMAIL || '').toLowerCase();
      if (adminEmail && user.email?.toLowerCase() === adminEmail) {
        await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
      }
    },
    // Remember when each user last logged in (used for analytics)
    async signIn({ user }) {
      try {
        await prisma.user.updateMany({ where: { email: user.email }, data: { lastLoginAt: new Date() } });
      } catch {}
    },
  },
};
