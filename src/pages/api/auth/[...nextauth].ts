import NextAuth, { Session, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '../../../server/db/client'

export const authOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    redirect: async (params: { url: string; baseUrl: string }) => {
      const { baseUrl } = params
      return Promise.resolve(baseUrl)
    },
    session: async ({ session, user }: { session: Session; user: User }) => {
      session.user.id = user.id
      return Promise.resolve(session)
    },
  },
}

export default NextAuth(authOptions)
